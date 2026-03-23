import { session_state } from "./state.js";
export class show_attendees {
    constructor(db = null, host = null) {
        this.db = db;
        this.host = host;
        this.mainPage = null;
        this.modalRefs = null;
        this.attendeeModalState = {
            activeSessionID: null
        };
    }

    async init(mainPage) {
        this.mainPage = mainPage;
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

    async openForSession(sessionID) {
        if (!this.modalRefs) {
            return;
        }

        const sessionData = await this.db.get("session", { sessionID });
        if (!sessionData) {
            alert("That session could not be found. Please refresh the page and try again.");
            return;
        }

        this.attendeeModalState.activeSessionID = sessionID;
        this.modalRefs.sessionName.text(String(sessionData.SessionTitle ?? ""));
        this.modalRefs.attendeeSearch.val("");
        this.modalRefs.attendeeRowSearch.val("");
        this.renderPendingAttendeeState();
        this.modalRefs.wrapper.prop("hidden", false);
        session_state.state = "showAttendees";
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

    renderPendingAttendeeState() {
        if (!this.modalRefs || this.modalRefs.tableBody.length === 0) {
            return;
        }

        this.clearAttendeeRows();
        this.modalRefs.tableBody.append(`
            <tr class="pdt-attendees-placeholder-row">
                <td colspan="6">Attendee editing rows will be added next.</td>
            </tr>
        `);
    }
}
