import { session_state } from "./state.js";
import { attendee_table_renderer } from "./attendee_table_renderer.js";
import { attendee_rid_manager } from "./attendee_rid_manager.js";
import { attendee_filter_manager } from "./attendee_filter_manager.js";
import { attendee_add_manager } from "./attendee_add_manager.js";
import { getSpeechBubbleIconURL } from "./assets.js";

export class show_attendees {
    constructor(db = null, host = null) {
        this.db = db;
        this.host = host;
        this.tableRenderer = new attendee_table_renderer();
        this.attendeeRIDManager = new attendee_rid_manager(db, host);
        this.attendeeFilterManager = new attendee_filter_manager();
        this.attendeeAddManager = new attendee_add_manager(db);
        this.mainPage = null;
        this.commentManager = null;
        this.commentFields = null;
        this.modalRefs = null;
        this.attendeeStatuses = {};
        this.commentIconURL = null;
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
        this.bindAttendeeFieldEvents();
        await this.attendeeAddManager.init();
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
            await this.saveAttendeeChanges();
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

    bindAttendeeFieldEvents() {
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

        this.modalRefs.tableBody.off("change.pdtAttendeeCertStatus", ".pdt-attendee-cert-status").on("change.pdtAttendeeCertStatus", ".pdt-attendee-cert-status", (event) => {
            const certificationStatusField = $(event.currentTarget);
            const attendeeRow = certificationStatusField.closest(".pdt-attendees-row");
            const personID = Number(attendeeRow.attr("data-person-id"));
            if (!Number.isFinite(personID)) {
                return;
            }

            const statusID = Number(certificationStatusField.val());
            this.attendeeRIDManager.updateAttendeeCertificationStatus(
                personID,
                statusID,
                this.getAttendeeStatusLabel(statusID)
            );
            this.updateSubmitButtonState();
        });

        this.modalRefs.tableBody.off("change.pdtAttendeeDateStart", ".pdt-attendee-date-start").on("change.pdtAttendeeDateStart", ".pdt-attendee-date-start", (event) => {
            this.handleAttendeeDateRangeChange($(event.currentTarget));
        });

        this.modalRefs.tableBody.off("change.pdtAttendeeDateEnd", ".pdt-attendee-date-end").on("change.pdtAttendeeDateEnd", ".pdt-attendee-date-end", (event) => {
            this.handleAttendeeDateRangeChange($(event.currentTarget));
        });

        this.modalRefs.tableBody.off("click.pdtDeleteAttendee", ".pdt-attendee-delete-button").on("click.pdtDeleteAttendee", ".pdt-attendee-delete-button", (event) => {
            const attendeeRow = $(event.currentTarget).closest(".pdt-attendees-row");
            const personID = Number(attendeeRow.attr("data-person-id"));
            if (!Number.isFinite(personID)) {
                return;
            }

            const didRemoveAttendee = this.attendeeRIDManager.removeAttendee(personID);
            if (!didRemoveAttendee) {
                return;
            }

            this.renderAttendeeRows();
            this.updateSubmitButtonState();
        });
    }

    handleAttendeeDateRangeChange(dateField) {
        const attendeeRow = dateField.closest(".pdt-attendees-row");
        const personID = Number(attendeeRow.attr("data-person-id"));
        if (!Number.isFinite(personID)) {
            return;
        }

        const startDateField = attendeeRow.find(".pdt-attendee-date-start").first();
        const endDateField = attendeeRow.find(".pdt-attendee-date-end").first();
        const updatedAttendee = this.attendeeRIDManager.updateAttendeeDateRange(personID, {
            dateRangeStart: startDateField.val(),
            dateRangeEnd: endDateField.val()
        });
        if (!updatedAttendee) {
            return;
        }

        startDateField.val(updatedAttendee.dateRangeStart ?? "");
        endDateField.val(updatedAttendee.dateRangeEnd ?? "");
        this.updateSubmitButtonState();
    }

    async openForSession(sessionID) {
        if (!this.modalRefs) {
            return;
        }

        const [sessionData, attendees, attendeeStatuses, attendeeDirectory] = await Promise.all([
            this.db.get("session", { sessionID }),
            this.db.get("attendees", { sessionID }),
            this.db.get("attendeeStatuses"),
            this.db.get("attendees")
        ]);

        if (!sessionData) {
            alert("That session could not be found. Please refresh the page and try again.");
            return;
        }

        this.attendeeStatuses = attendeeStatuses ?? {};
        this.commentIconURL = await this.getCommentIconURL();
        this.attendeeAddManager.setDirectory(attendeeDirectory);
        this.attendeeModalState = {
            activeSessionID: sessionID,
            showRIDColumn: this.shouldShowRIDColumn(sessionData),
            showSelfPacedDateRangeColumn: this.shouldShowSelfPacedDateRangeColumn(sessionData)
        };
        this.attendeeRIDManager.load(attendees);
        this.modalRefs.sessionName.text(String(sessionData.SessionTitle ?? ""));
        this.attendeeFilterManager.reset();
        this.renderAttendeeRows();
        this.getAddAttendeeField().val("");
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

    async saveAttendeeChanges() {
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

        await this.mainPage?.loadTable();
        this.renderAttendeeRows();
    }

    async closeModal() {
        if (!this.modalRefs) {
            return;
        }

        this.modalRefs.wrapper.prop("hidden", true);
        this.attendeeFilterManager.reset();
        this.attendeeAddManager.destroy();
        this.getAddAttendeeField().val("");
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

    getAddAttendeeField() {
        return $("#pdt-shadow-attendees #add-attendee");
    }

    async addAttendeeToDraft(attendeeDirectoryEntry) {
        const sessionID = Number(this.attendeeModalState.activeSessionID);
        const personID = Number(attendeeDirectoryEntry?.personID);
        if (!Number.isFinite(sessionID) || !Number.isFinite(personID)) {
            return;
        }

        const attendeeCandidate = await this.db.get("attendee", { sessionID, personID });
        if (!attendeeCandidate) {
            alert("That attendee could not be loaded. Please refresh the page and try again.");
            return;
        }

        const addedAttendee = this.attendeeRIDManager.addAttendee(attendeeCandidate);
        if (!addedAttendee) {
            return;
        }

        this.renderAttendeeRows();
        this.updateSubmitButtonState();
    }

    renderAttendeeRows() {
        if (!this.modalRefs || this.modalRefs.tableHead.length === 0 || this.modalRefs.tableBody.length === 0) {
            return;
        }

        this.tableRenderer.render(this.modalRefs.tableHead, this.modalRefs.tableBody, {
            attendees: this.attendeeRIDManager.getDraftAttendees(),
            attendeeStatuses: this.attendeeStatuses,
            commentIconURL: this.commentIconURL,
            dateRangeRenderMode: "edit",
            showRIDColumn: this.attendeeModalState.showRIDColumn,
            showSelfPacedDateRangeColumn: this.attendeeModalState.showSelfPacedDateRangeColumn,
            buildAttendeeSearchText: (attendee) => this.attendeeFilterManager.buildAttendeeSearchText(attendee)
        });
        this.attendeeFilterManager.applyFilter();
        this.attendeeAddManager.syncSearch(this.getAddAttendeeField(), {
            excludedPersonIDs: this.attendeeRIDManager.getDraftPersonIDs(),
            onAttendeeSelected: async (attendeeDirectoryEntry) => {
                await this.addAttendeeToDraft(attendeeDirectoryEntry);
            }
        });
    }

    getVisibleColumnCount() {
        return this.tableRenderer.getVisibleColumnCount({
            showRIDColumn: this.attendeeModalState.showRIDColumn,
            showSelfPacedDateRangeColumn: this.attendeeModalState.showSelfPacedDateRangeColumn
        });
    }

    getAttendeeStatusLabel(statusID) {
        const numericStatusID = Number(statusID);
        if (Number.isFinite(numericStatusID) && this.attendeeStatuses[numericStatusID]) {
            return this.attendeeStatuses[numericStatusID];
        }

        return this.attendeeStatuses[4] ?? "Not Assigned";
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

    async getCommentIconURL() {
        if (typeof this.commentIconURL === "string" && this.commentIconURL.trim() !== "") {
            return this.commentIconURL;
        }

        const hostCommentIconURL = typeof this.host?.getComment === "function"
            ? await this.host.getComment()
            : getSpeechBubbleIconURL();
        this.commentIconURL = String(hostCommentIconURL ?? "").trim() || getSpeechBubbleIconURL();
        return this.commentIconURL;
    }
}
