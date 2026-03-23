import { session_state } from "./state.js";
export class main_page {

    static index = 1 ;

    constructor(db, host, showAttendees, addEditSession) {
        this.db = db;
        this.host = host;
        this.showAttendees = showAttendees;
        this.addEditSession = addEditSession;
    }

    async init() {
        const tableBody = await this.loadTable();
        if (tableBody.length === 0) {
            return ;
        }

        // hook up table row details button
        tableBody.off("click.pdtDetails", ".pdt-details-button").on("click.pdtDetails", ".pdt-details-button", function () {
            const sessionRow = $(this).closest("tr");
            const detailsRow = sessionRow.next("tr");

            if (!detailsRow.hasClass("details-row")) {
                return ;
            }

            detailsRow.prop("hidden", !detailsRow.prop("hidden")); // on off logic
        });

        await this.addEditSession.init(this) ;
    }

    async loadTable() {

        // using for loops over session objects and their inner arrays of attendees.
        const tableBody = $(".pdt-main .table-wrapper table tbody");
        if (tableBody.length === 0) {
            return tableBody ;
        }

        const sessions = await this.db.get("sessions");
        // This is an array of objects
        tableBody.empty() ;
        this.index = 1 ;


        // fill in table
        // first generates the data points row, than the body of attendees.
        for (let session of sessions) {
            session.localID = this.index ;
            let entry = `
                <tr data-id="${session.localID}">
                    <td>${session.Date}</td>
                    <td>${session.SessionTitle}</td>
                    <td>${session.Length} min</td>
                    <td>${session.SessionType}</td>
                    <td>${session.CEUWeight}</td>
                    <td>${session.CEUConsideration}</td>
                    <td>${session.CEUQualify}</td>
                    <td>${session.RIDQualify}</td>
                    <td>${session.EventType}</td>
                    <td>${session.ParentType}</td>
                    <td>${session.Organizer}</td>
                    <td>${session.AttendeesCt}</td>
                    <td class="pdt-actions-column">
                        <button data-id="${session.localID}" class="pdt-details-button" type="button">Details</button>
                    </td>
                </tr>
            ` ;

            let attendeeContacts = document.createElement("div");
            attendeeContacts.className = "pdt-details-people";
            for (let attendee of session.Attendees) {
                let attendeeContact = document.createElement("div");
                attendeeContact.className = "pdt-person-card";

                if (attendee[2] === null) {
                    attendeeContact.innerHTML = `
                        <img data-id="${session.localID}" data-aid="${attendee[4]}" class="pdt-person-card__icon" src="../assets/speech-bubble-1130.svg" alt=""
                        aria-hidden="true">
                        <p>${attendee[0]}</p>
                        <p>${attendee[1]}</p>
                        <p>${attendee[3]}</p>
                    `;
                }
                else {
                    attendeeContact.innerHTML = `
                        <img data-id="${session.localID}" data-aid="${attendee[4]}" class="pdt-person-card__icon" src="../assets/speech-bubble-1130.svg" alt=""
                        aria-hidden="true">
                        <p>${attendee[0]}</p>
                        <p>${attendee[1]}</p>
                        <p>${attendee[2]}</p>
                        <p>${attendee[3]}</p>
                    `;
                }
                attendeeContacts.append(attendeeContact) ;
            }

            let lockStat = `<p></p>`;
            let lockStatBtn = `Lock` ;
            if (session.Locker !== null) {
                if (session.Lock === 1) { //locked
                    lockStat = `<p>Locked by ${session.Locker}</p>`;
                    lockStatBtn = `Unlock` ;
                }
                else {
                    lockStat = `<p>Unlocked by ${session.Locker}</p>`;
                }
            }

            let attendeeSpace = `
                <tr data-id="${session.localID}" class="details-row" hidden>
                    <td colspan="13">
                        <div class="pdt-details-panel">
                            <div data-id="${session.localID}" class="pdt-buttons">
                                ${lockStat}
                                <button data-id="${session.localID}" type="button" disabled>${lockStatBtn}</button>
                                <button data-id="${session.localID}" type="button" disabled>Sort</button>
                                <button data-id="${session.localID}" type="button" disabled>Edit Details</button>
                                <button data-id="${session.localID}" type="button" disabled>Edit Attendees</button>
                            </div>
                            ${attendeeContacts.outerHTML}
                        </div>
                    </td>
                </tr> ` ;

            tableBody.append(entry, attendeeSpace) ;
            this.index = this.index + 1 ;
        }

        return tableBody ;
    }

   
}
