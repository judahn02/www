import { session_state } from "./state.js";
export class show_attendees {
    constructor(db = null, host = null) {
        this.db = db;
        this.host = host;
        this.mainPage = null;
        this.commentManager = null;
        this.commentFields = null;
        this.modalRefs = null;
        this.attendeeStatuses = {};
        this.attendeeModalState = {
            activeSessionID: null
        };
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
            attendeeRowSearch: $("#pdt-shadow-attendees #search-attendee"),
            tableBody: $("#pdt-shadow-attendees .table-wrapper table tbody"),
            cancel: $("#pdt-shadow-attendees #closeAttendeesModal"),
            submit: $("#pdt-shadow-attendees #saveAttendeesModal")
        };

        this.clearAttendeeRows();
        this.bindModalEvents();
        this.bindCommentTriggers();
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
    }

    bindCommentTriggers() {
        if (!this.modalRefs) {
            return;
        }

        this.modalRefs.tableBody.off("click.pdtAttendeeComment", ".pdt-attendee-comment-button").on("click.pdtAttendeeComment", ".pdt-attendee-comment-button", async (event) => {
            await this.openCommentModal($(event.currentTarget));
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
        this.attendeeModalState.activeSessionID = sessionID;
        this.modalRefs.sessionName.text(String(sessionData.SessionTitle ?? ""));
        this.modalRefs.attendeeSearch.val("");
        this.modalRefs.attendeeRowSearch.val("");
        this.renderAttendeeRows(attendees);
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

    async closeModal() {
        if (!this.modalRefs) {
            return;
        }

        this.modalRefs.wrapper.prop("hidden", true);
        this.modalRefs.attendeeSearch.val("");
        this.modalRefs.attendeeRowSearch.val("");
        this.clearAttendeeRows();
        this.attendeeModalState.activeSessionID = null;
        session_state.state = "mainPage";
    }

    clearAttendeeRows() {
        if (!this.modalRefs || this.modalRefs.tableBody.length === 0) {
            return;
        }

        this.modalRefs.tableBody.find("tr").not(".search-row").remove();
    }

    async refreshAttendees() {
        const sessionID = Number(this.attendeeModalState.activeSessionID);
        if (!Number.isFinite(sessionID)) {
            return;
        }

        const attendees = await this.db.get("attendees", { sessionID });
        this.renderAttendeeRows(attendees);
    }

    renderAttendeeRows(attendees = []) {
        if (!this.modalRefs || this.modalRefs.tableBody.length === 0) {
            return;
        }

        this.clearAttendeeRows();

        if (!Array.isArray(attendees) || attendees.length === 0) {
            this.modalRefs.tableBody.append(`
                <tr class="pdt-attendees-placeholder-row">
                    <td colspan="6">No attendees are attached to this session yet.</td>
                </tr>
            `);
            return;
        }

        for (const attendee of attendees) {
            const attendeeRow = this.buildAttendeeRow(attendee);
            this.modalRefs.tableBody.append(attendeeRow);
        }
    }

    buildAttendeeRow(attendee) {
        const attendeeName = this.escapeHtml(attendee?.name);
        const attendeeEmail = this.escapeHtml(attendee?.email);
        const certStatusID = this.getSafeAttendeeStatusID(attendee?.certStatusID);
        const commentButtonTitle = this.getCommentButtonTitle(attendee);
        const dateRangeMarkup = this.buildDateRangeMarkup(attendee?.dateRange);

        return `
            <tr class="pdt-attendees-row" data-person-id="${this.getSafePersonID(attendee?.personID)}" data-attendee-email="${attendeeEmail}">
                <td>
                    <p>${attendeeName}</p>
                    <p>${attendeeEmail}</p>
                </td>
                <td>
                    <select disabled>
                        ${this.buildCertStatusOptions(certStatusID)}
                    </select>
                </td>
                <td><input type="checkbox" disabled ${attendee?.ridCertified === true ? "checked" : ""}></td>
                <td class="date-range-cell">
                    ${dateRangeMarkup}
                </td>
                <td>
                    <button type="button" class="pdt-attendee-comment-button" title="${commentButtonTitle}">
                        <img class="pdt-person-card__icon" src="../assets/speech-bubble-1130.svg" alt=""
                            aria-hidden="true">
                    </button>
                </td>
                <td><button class="delete-button" type="button" disabled>X</button></td>
            </tr>
        `;
    }

    buildCertStatusOptions(selectedStatusID) {
        const statusOptions = Object.entries(this.attendeeStatuses)
            .map(([statusID, statusLabel]) => ({
                id: Number(statusID),
                label: String(statusLabel ?? "")
            }))
            .filter((statusOption) => Number.isFinite(statusOption.id) && statusOption.label !== "")
            .sort((leftStatus, rightStatus) => leftStatus.id - rightStatus.id);

        if (statusOptions.length === 0) {
            return `<option value="4" selected>Not Assigned</option>`;
        }

        return statusOptions.map((statusOption) => {
            const isSelected = statusOption.id === selectedStatusID ? " selected" : "";
            return `<option value="${statusOption.id}"${isSelected}>${this.escapeHtml(statusOption.label)}</option>`;
        }).join("");
    }

    buildDateRangeMarkup(dateRange) {
        const normalizedDateRange = String(dateRange ?? "").trim();
        if (normalizedDateRange === "") {
            return `
                <input type="date" disabled>
                <p>to</p>
                <input type="date" disabled>
            `;
        }

        if (normalizedDateRange.toLowerCase() === "not started") {
            return `<p>Not started</p>`;
        }

        const [startDate, endDate] = normalizedDateRange.split(" to ");
        const startDateValue = this.displayDateToInputValue(startDate);
        if (startDateValue === "") {
            return `<p>${this.escapeHtml(normalizedDateRange)}</p>`;
        }

        if (String(endDate ?? "").trim().toLowerCase() === "ongoing") {
            return `
                <input type="date" value="${startDateValue}" disabled>
                <p>to</p>
                <p>Ongoing</p>
            `;
        }

        const endDateValue = this.displayDateToInputValue(endDate);
        if (endDateValue === "") {
            return `<p>${this.escapeHtml(normalizedDateRange)}</p>`;
        }

        return `
            <input type="date" value="${startDateValue}" disabled>
            <p>to</p>
            <input type="date" value="${endDateValue}" disabled>
        `;
    }

    getCommentButtonTitle(attendee) {
        const hasComments = String(attendee?.adminComment ?? "").trim() !== "" || String(attendee?.memberComment ?? "").trim() !== "";
        return hasComments ? "Comments exist for this attendee." : "No comments yet.";
    }

    displayDateToInputValue(displayDate) {
        const normalizedDate = String(displayDate ?? "").trim();
        const dateParts = normalizedDate.split("/");
        if (dateParts.length !== 3) {
            return "";
        }

        const [month, day, year] = dateParts;
        if (month === "" || day === "" || year === "") {
            return "";
        }

        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    getSafePersonID(personID) {
        const numericPersonID = Number(personID);
        return Number.isFinite(numericPersonID) ? numericPersonID : 0;
    }

    getSafeAttendeeStatusID(statusID) {
        const numericStatusID = Number(statusID);
        if (Number.isFinite(numericStatusID) && this.attendeeStatuses[numericStatusID]) {
            return numericStatusID;
        }

        return 4;
    }

    escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\"", "&quot;")
            .replaceAll("'", "&#39;");
    }
}
