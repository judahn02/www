import { session_state } from "./state.js";
import { comment_manager } from "./comment_manager.js";
export class main_page {

    constructor(db, host, showAttendees, addEditSession) {
        this.db = db;
        this.host = host;
        this.showAttendees = showAttendees;
        this.addEditSession = addEditSession;
        this.commentManager = new comment_manager(db);
        this.attendeeSortModes = [
            { field: "first", direction: "asc", label: "Sort: First A-Z" },
            { field: "last", direction: "asc", label: "Sort: Last A-Z" },
            { field: "first", direction: "desc", label: "Sort: First Z-A" },
            { field: "last", direction: "desc", label: "Sort: Last Z-A" }
        ];
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

        tableBody.off("click.pdtSortAttendees", ".pdt-sort-attendees-button").on("click.pdtSortAttendees", ".pdt-sort-attendees-button", (event) => {
            this.sortAttendees($(event.currentTarget));
        });

        await this.addEditSession.init(this) ;
        tableBody.off("click.pdtEditSession", ".pdt-edit-session-button").on("click.pdtEditSession", ".pdt-edit-session-button", async (event) => {
            const sessionID = Number($(event.currentTarget).attr("data-session-id"));
            if (!Number.isFinite(sessionID)) {
                return ;
            }

            await this.addEditSession.openForEdit(sessionID);
        });
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
                attendeeContact.dataset.attendeeName = attendee[0];
                attendeeContact.dataset.personId = String(attendee[4]);

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
                                <button data-session-id="${session.sessionID}" data-sort-index="-1" class="pdt-sort-attendees-button" type="button">Sort: Original</button>
                                <button data-session-id="${session.sessionID}" class="pdt-edit-session-button" type="button">Edit Details</button>
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

    sortAttendees(sortButton) {
        const attendeeContainer = sortButton.closest(".pdt-details-panel").find(".pdt-details-people").first();
        if (attendeeContainer.length === 0) {
            return ;
        }

        const sortIndex = this.getNextAttendeeSortIndex(sortButton);
        const sortMode = this.attendeeSortModes[sortIndex];
        const attendeeCards = attendeeContainer.children(".pdt-person-card").get();

        attendeeCards.sort((leftCard, rightCard) => {
            return this.compareAttendeeCards(leftCard, rightCard, sortMode);
        });

        attendeeContainer.append(attendeeCards);
        sortButton.attr("data-sort-index", String(sortIndex));
        sortButton.text(sortMode.label);
    }

    getNextAttendeeSortIndex(sortButton) {
        const currentSortIndex = Number(sortButton.attr("data-sort-index"));
        if (!Number.isInteger(currentSortIndex) || currentSortIndex < 0) {
            return 0;
        }

        return (currentSortIndex + 1) % this.attendeeSortModes.length;
    }

    compareAttendeeCards(leftCard, rightCard, sortMode) {
        const leftSortData = this.getAttendeeSortData(leftCard);
        const rightSortData = this.getAttendeeSortData(rightCard);

        let comparison = 0;
        if (sortMode.field === "first") {
            comparison = this.compareSortValues(leftSortData.firstName, rightSortData.firstName);
            if (comparison === 0) {
                comparison = this.compareSortValues(leftSortData.lastName, rightSortData.lastName);
            }
        }
        else {
            comparison = this.compareSortValues(leftSortData.lastName, rightSortData.lastName);
            if (comparison === 0) {
                comparison = this.compareSortValues(leftSortData.firstName, rightSortData.firstName);
            }
        }

        if (comparison === 0) {
            comparison = this.compareSortValues(leftSortData.fullName, rightSortData.fullName);
        }

        if (comparison === 0) {
            comparison = leftSortData.personID - rightSortData.personID;
        }

        if (sortMode.direction === "desc") {
            comparison *= -1;
        }

        return comparison;
    }

    getAttendeeSortData(attendeeCard) {
        const attendeeName = String(attendeeCard.dataset.attendeeName ?? "").trim();
        const normalizedName = attendeeName.replace(/\s+/g, " ").trim();
        const nameParts = normalizedName === "" ? [] : normalizedName.split(" ");
        const firstName = (nameParts[0] ?? "").toLocaleLowerCase();
        const lastName = (nameParts[nameParts.length - 1] ?? firstName).toLocaleLowerCase();
        const personID = Number(attendeeCard.dataset.personId);

        return {
            firstName,
            lastName,
            fullName: normalizedName.toLocaleLowerCase(),
            personID: Number.isFinite(personID) ? personID : 0
        };
    }

    compareSortValues(leftValue, rightValue) {
        return String(leftValue).localeCompare(String(rightValue), undefined, { sensitivity: "base" });
    }
}
