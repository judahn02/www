import { session_state } from "./state.js";
import { comment_manager } from "./comment_manager.js";
export class main_page {

    constructor(db, host, showAttendees, addEditSession) {
        this.db = db;
        this.host = host;
        this.showAttendees = showAttendees;
        this.addEditSession = addEditSession;
        this.commentManager = new comment_manager(db);
    }

    async init() {
        const tableBody = await this.loadTable();
        if (tableBody.length === 0) {
            return ;
        }
        const commentFields = {
            wrapper: $("#pdt-shadow-comments"),
            modal: $("#pdt-shadow-comments .pdt-comment-box"),
            titleName: $("#pdt-shadow-comments h2 span"),
            admin: $("#comment_box_admin"),
            member: $("#comment_box"),
            close: $("#closeCommentModal"),
            submit: $("#submitCommentModal")
        };

        this.bumpTableScrollHint();
        this.commentManager.init(commentFields, tableBody);

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


        // fill in table
        // first generates the data points row, than the body of attendees.
        for (let session of sessions) {
            let entry = `
                <tr data-session-id="${session.sessionID}">
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
                        <button data-session-id="${session.sessionID}" class="pdt-details-button" type="button">Details</button>
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
                        <img data-session-id="${session.sessionID}" data-person-id="${attendee[4]}" class="pdt-person-card__icon" src="../assets/speech-bubble-1130.svg" alt=""
                        aria-hidden="true">
                        <p>${attendee[0]}</p>
                        <p>${attendee[1]}</p>
                        <p>${attendee[3]}</p>
                    `;
                }
                else {
                    attendeeContact.innerHTML = `
                        <img data-session-id="${session.sessionID}" data-person-id="${attendee[4]}" class="pdt-person-card__icon" src="../assets/speech-bubble-1130.svg" alt=""
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
                <tr data-session-id="${session.sessionID}" class="details-row" hidden>
                    <td colspan="13">
                        <div class="pdt-details-panel">
                            <div data-session-id="${session.sessionID}" class="pdt-buttons">
                                ${lockStat}
                                <button data-session-id="${session.sessionID}" type="button" disabled>${lockStatBtn}</button>
                                <button data-session-id="${session.sessionID}" type="button" disabled>Sort</button>
                                <button data-session-id="${session.sessionID}" type="button" disabled>Edit Details</button>
                                <button data-session-id="${session.sessionID}" type="button" disabled>Edit Attendees</button>
                            </div>
                            ${attendeeContacts.outerHTML}
                        </div>
                    </td>
                </tr> ` ;

            tableBody.append(entry, attendeeSpace) ;
        }

        return tableBody ;
    }

    bumpTableScrollHint() {
        const tableWrapper = $(".pdt-main .table-wrapper");
        if (tableWrapper.length === 0) {
            return ;
        }

        const wrapperElement = tableWrapper[0];
        const hasMoreRight = wrapperElement.scrollWidth > wrapperElement.clientWidth + 1;
        if (!hasMoreRight) {
            return ;
        }

        window.setTimeout(() => {
            if (wrapperElement.scrollLeft !== 0) {
                return ;
            }

            tableWrapper.stop(true).animate({ scrollLeft: 28 }, 180).animate({ scrollLeft: 0 }, 220);
        }, 1000);
    }

   
}
