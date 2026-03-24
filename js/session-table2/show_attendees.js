import { session_state } from "./state.js";
import { attendee_table_renderer } from "./attendee_table_renderer.js";
import { attendee_rid_manager } from "./attendee_rid_manager.js";
import { attendee_filter_manager } from "./attendee_filter_manager.js";

export class show_attendees {
    constructor(db = null, host = null) {
        this.db = db;
        this.host = host;
        this.tableRenderer = new attendee_table_renderer();
        this.attendeeRIDManager = new attendee_rid_manager(db, host);
        this.attendeeFilterManager = new attendee_filter_manager();
        this.mainPage = null;
        this.commentManager = null;
        this.commentFields = null;
        this.modalRefs = null;
        this.attendeeStatuses = {};
        this.attendeeModalState = this.getDefaultAttendeeModalState();
    }

    async init(mainPage, commentManager = null, commentFields = null) {
        this.mainPage = mainPage;
        this.commentManager = commentManager;
        this.commentFields = commentFields;
        this.modalRefs = {
            wrapper: $("#pdt-shadow-attendees"),
            modal: $("#pdt-shadow-attendees .pdt-session-attendees"),
            sessionName: $("#pdt-shadow-attendees .session-name"),
            attendeeSearch: $("#pdt-shadow-attendees #attendee-search"),
            tableHead: $("#pdt-shadow-attendees .table-wrapper table thead"),
            tableBody: $("#pdt-shadow-attendees .table-wrapper table tbody"),
            cancel: $("#pdt-shadow-attendees #closeAttendeesModal"),
            submit: $("#pdt-shadow-attendees #saveAttendeesModal")
        };

        this.clearTableHead();
        this.clearAttendeeRows();
        this.bindModalEvents();
        this.bindCommentTriggers();
        this.bindRIDFieldEvents();
        this.attendeeFilterManager.init({
            searchField: this.modalRefs.attendeeSearch,
            tableBody: this.modalRefs.tableBody,
            getVisibleColumnCount: () => this.getVisibleColumnCount()
        });
        this.updateSubmitButtonState();
    }

    getDefaultAttendeeModalState() {
        return {
            activeSessionID: null,
            showRIDColumn: false,
            showSelfPacedDateRangeColumn: false
        };
    }

    bindModalEvents() {
        if (!this.modalRefs) {
            return;
        }

        this.modalRefs.cancel.off("click.pdtShowAttendees").on("click.pdtShowAttendees", async () => {
            await this.closeModal();
        });

        this.modalRefs.wrapper.off("click.pdtShowAttendees").on("click.pdtShowAttendees", async (event) => {
            if (event.target !== this.modalRefs.wrapper[0]) {
                return;
            }

            await this.closeModal();
        });

        this.modalRefs.submit.off("click.pdtShowAttendees").on("click.pdtShowAttendees", async () => {
            await this.saveRIDChanges();
        });
    }

    bindCommentTriggers() {
        if (!this.modalRefs) {
            return;
        }

        this.modalRefs.tableBody.off("click.pdtAttendeeComment", ".pdt-attendee-comment-button").on("click.pdtAttendeeComment", ".pdt-attendee-comment-button", async (event) => {
            await this.openCommentModal($(event.currentTarget));
        });
    }

    bindRIDFieldEvents() {
        if (!this.modalRefs) {
            return;
        }

        this.modalRefs.tableBody.off("change.pdtRIDCertified", ".pdt-rid-certified-checkbox").on("change.pdtRIDCertified", ".pdt-rid-certified-checkbox", (event) => {
            this.attendeeRIDManager.handleCheckboxChange($(event.currentTarget));
            this.updateSubmitButtonState();
        });

        this.modalRefs.tableBody.off("change.pdtRIDTimestamp", ".pdt-rid-certified-at").on("change.pdtRIDTimestamp", ".pdt-rid-certified-at", (event) => {
            this.attendeeRIDManager.handleDateTimeChange($(event.currentTarget));
            this.updateSubmitButtonState();
        });
    }

    async openForSession(sessionID) {
        if (!this.modalRefs) {
            return;
        }

        const [sessionData, attendees, attendeeStatuses] = await Promise.all([
            this.db.get("session", { sessionID }),
            this.db.get("attendees", { sessionID }),
            this.db.get("attendeeStatuses")
        ]);

        if (!sessionData) {
            alert("That session could not be found. Please refresh the page and try again.");
            return;
        }

        this.attendeeStatuses = attendeeStatuses ?? {};
        this.attendeeModalState = {
            activeSessionID: sessionID,
            showRIDColumn: this.shouldShowRIDColumn(sessionData),
            showSelfPacedDateRangeColumn: this.shouldShowSelfPacedDateRangeColumn(sessionData)
        };
        this.attendeeRIDManager.load(attendees);
        this.modalRefs.sessionName.text(String(sessionData.SessionTitle ?? ""));
        this.attendeeFilterManager.reset();
        this.renderAttendeeRows();
        this.getAttendeeRowSearchField().val("");
        this.updateSubmitButtonState();
        this.modalRefs.wrapper.prop("hidden", false);
        session_state.state = "showAttendees";
    }

    async openCommentModal(commentButton) {
        if (!this.commentManager || !this.commentFields) {
            return;
        }

        const sessionID = Number(this.attendeeModalState.activeSessionID);
        const attendeeRow = commentButton.closest(".pdt-attendees-row");
        const personID = Number(attendeeRow.attr("data-person-id"));
        const personName = String(attendeeRow.find("td").first().find("p").first().text() ?? "").trim();

        if (!Number.isFinite(sessionID) || !Number.isFinite(personID) || personName === "") {
            return;
        }

        await this.commentManager.open(this.commentFields, {
            sessionID,
            personID,
            personName,
            onSave: async () => {
                await this.refreshAttendees();
            }
        });
    }

    async saveRIDChanges() {
        if (!this.modalRefs) {
            return;
        }

        const sessionID = Number(this.attendeeModalState.activeSessionID);
        if (!Number.isFinite(sessionID)) {
            return;
        }

        const savePromise = this.attendeeRIDManager.saveChanges(sessionID);
        this.updateSubmitButtonState();
        const attendees = await savePromise;
        this.updateSubmitButtonState();

        if (!Array.isArray(attendees)) {
            return;
        }

        this.renderAttendeeRows();
    }

    async closeModal() {
        if (!this.modalRefs) {
            return;
        }

        this.modalRefs.wrapper.prop("hidden", true);
        this.attendeeFilterManager.reset();
        this.getAttendeeRowSearchField().val("");
        this.clearTableHead();
        this.clearAttendeeRows();
        this.attendeeRIDManager.reset();
        this.attendeeModalState = this.getDefaultAttendeeModalState();
        this.updateSubmitButtonState();
        session_state.state = "mainPage";
    }

    clearTableHead() {
        if (!this.modalRefs || this.modalRefs.tableHead.length === 0) {
            return;
        }

        this.modalRefs.tableHead.empty();
    }

    clearAttendeeRows() {
        if (!this.modalRefs || this.modalRefs.tableBody.length === 0) {
            return;
        }

        this.modalRefs.tableBody.empty();
    }

    async refreshAttendees() {
        const sessionID = Number(this.attendeeModalState.activeSessionID);
        if (!Number.isFinite(sessionID)) {
            return;
        }

        const attendees = await this.db.get("attendees", { sessionID });
        this.attendeeRIDManager.mergeIncomingAttendeeData(attendees);
        this.renderAttendeeRows();
        this.updateSubmitButtonState();
    }

    getAttendeeRowSearchField() {
        return $("#pdt-shadow-attendees #search-attendee");
    }

    renderAttendeeRows() {
        if (!this.modalRefs || this.modalRefs.tableHead.length === 0 || this.modalRefs.tableBody.length === 0) {
            return;
        }

        this.tableRenderer.render(this.modalRefs.tableHead, this.modalRefs.tableBody, {
            attendees: this.attendeeRIDManager.getDraftAttendees(),
            attendeeStatuses: this.attendeeStatuses,
            showRIDColumn: this.attendeeModalState.showRIDColumn,
            showSelfPacedDateRangeColumn: this.attendeeModalState.showSelfPacedDateRangeColumn,
            buildAttendeeSearchText: (attendee) => this.attendeeFilterManager.buildAttendeeSearchText(attendee)
        });
        this.attendeeFilterManager.applyFilter();
    }

    getVisibleColumnCount() {
        return this.tableRenderer.getVisibleColumnCount({
            showRIDColumn: this.attendeeModalState.showRIDColumn,
            showSelfPacedDateRangeColumn: this.attendeeModalState.showSelfPacedDateRangeColumn
        });
    }

    shouldShowRIDColumn(sessionData) {
        if (typeof sessionData?.IsRIDQualifiedSession === "boolean") {
            return sessionData.IsRIDQualifiedSession;
        }

        return String(sessionData?.RIDQualify ?? "").trim().toLowerCase() === "yes";
    }

    shouldShowSelfPacedDateRangeColumn(sessionData) {
        if (typeof sessionData?.IsSelfPacedSession === "boolean") {
            return sessionData.IsSelfPacedSession;
        }

        return String(sessionData?.Date ?? "").trim() === "Self Paced";
    }

    updateSubmitButtonState() {
        if (!this.modalRefs || this.modalRefs.submit.length === 0) {
            return;
        }

        const isSaving = this.attendeeRIDManager.isSaving();
        this.modalRefs.submit.text(isSaving ? "Saving..." : "Save Attendees");
        this.modalRefs.submit.prop("disabled", isSaving || !this.attendeeRIDManager.hasPendingChanges());
    }
}
