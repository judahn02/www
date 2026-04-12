import { getSpeechBubbleIconURL } from "./assets.js";

export class attendee_table_renderer {
    render(tableHead, tableBody, options = {}) {
        if (!tableHead || tableHead.length === 0 || !tableBody || tableBody.length === 0) {
            return;
        }

        const attendees = Array.isArray(options?.attendees) ? options.attendees : [];
        const showRIDColumn = options?.showRIDColumn === true;
        const showSelfPacedDateRangeColumn = options?.showSelfPacedDateRangeColumn === true;
        const dateRangeRenderMode = options?.dateRangeRenderMode === "edit" ? "edit" : "display";
        const attendeeStatuses = options?.attendeeStatuses ?? {};
        const commentIconURL = String(options?.commentIconURL ?? getSpeechBubbleIconURL());
        const buildAttendeeSearchText = typeof options?.buildAttendeeSearchText === "function"
            ? options.buildAttendeeSearchText
            : () => "";
        const visibleColumnLabels = this.getVisibleColumnLabels({
            showRIDColumn,
            showSelfPacedDateRangeColumn
        });
        const visibleColumnCount = visibleColumnLabels.length;

        this.renderTableHead(tableHead, visibleColumnLabels);
        tableBody.empty();
        tableBody.append(this.buildSearchRow(visibleColumnCount));

        if (attendees.length === 0) {
            tableBody.append(this.buildEmptyStateRow(visibleColumnCount));
            return;
        }

        for (const attendee of attendees) {
            tableBody.append(this.buildAttendeeRow(attendee, {
                attendeeStatuses,
                commentIconURL,
                dateRangeRenderMode,
                showRIDColumn,
                showSelfPacedDateRangeColumn,
                attendeeSearchText: buildAttendeeSearchText(attendee)
            }));
        }
    }

    getVisibleColumnCount(options = {}) {
        return this.getVisibleColumnLabels(options).length;
    }

    getVisibleColumnLabels(options = {}) {
        const columnLabels = [
            "Attendee",
            "Certification Status at time of Attending"
        ];

        if (options?.showRIDColumn === true) {
            columnLabels.push("RID certified?");
        }

        if (options?.showSelfPacedDateRangeColumn === true) {
            columnLabels.push("Self Paced Date Range");
        }

        columnLabels.push("Comments", "Delete?");
        return columnLabels;
    }

    renderTableHead(tableHead, columnLabels) {
        const headerCells = columnLabels.map((columnLabel) => {
            return `<th>${this.escapeHtml(columnLabel)}</th>`;
        }).join("");

        tableHead.html(`
            <tr>
                ${headerCells}
            </tr>
        `);
    }

    buildSearchRow(columnCount) {
        return `
            <tr class="search-row">
                <td colspan="${columnCount}">
                    <input type="text" name="add-attendee" id="add-attendee"
                        placeholder="Add attendee: search attendees by name or email">
                </td>
            </tr>
        `;
    }

    buildEmptyStateRow(columnCount) {
        return `
            <tr class="pdt-attendees-placeholder-row">
                <td colspan="${columnCount}">No attendees are attached to this session yet.</td>
            </tr>
        `;
    }

    buildAttendeeRow(attendee, options = {}) {
        const attendeeName = this.escapeHtml(attendee?.name);
        const attendeeEmail = this.escapeHtml(attendee?.email);
        const attendeeSearchText = this.escapeHtml(options?.attendeeSearchText);
        const certStatusID = this.getSafeAttendeeStatusID(attendee?.certStatusID, options?.attendeeStatuses);
        const commentButtonTitle = this.getCommentButtonTitle(attendee);
        const commentIconURL = this.escapeHtml(options?.commentIconURL);
        const dateRangeMarkup = this.buildDateRangeMarkup(attendee, options?.dateRangeRenderMode);
        const attendeeCells = [
            `
                <td>
                    <p>${attendeeName}</p>
                    <p>${attendeeEmail}</p>
                </td>
            `,
            `
                <td>
                    <select class="pdt-attendee-cert-status">
                        ${this.buildCertStatusOptions(options?.attendeeStatuses, certStatusID)}
                    </select>
                </td>
            `
        ];

        if (options?.showRIDColumn === true) {
            attendeeCells.push(`
                <td class="pdt-rid-cell">
                    ${this.buildRIDCertificationMarkup(attendee)}
                </td>
            `);
        }

        if (options?.showSelfPacedDateRangeColumn === true) {
            attendeeCells.push(`
                <td class="date-range-cell">
                    ${dateRangeMarkup}
                </td>
            `);
        }

        attendeeCells.push(`
            <td>
                <button type="button" class="pdt-attendee-comment-button" title="${commentButtonTitle}">
                    <img class="pdt-person-card__icon" src="${commentIconURL}" alt=""
                        aria-hidden="true">
                </button>
            </td>
        `);
        attendeeCells.push(`<td><button class="delete-button pdt-attendee-delete-button" type="button">X</button></td>`);

        return `
            <tr class="pdt-attendees-row" data-person-id="${this.getSafePersonID(attendee?.personID)}" data-attendee-email="${attendeeEmail}" data-search-text="${attendeeSearchText}">
                ${attendeeCells.join("")}
            </tr>
        `;
    }

    buildRIDCertificationMarkup(attendee) {
        const isRIDCertified = attendee?.ridCertified === true;
        const ridCertifiedAtValue = this.escapeHtml(this.isoDateTimeToLocalInputValue(attendee?.ridCertifiedAt));

        return `
            <div class="pdt-rid-certification">
                <label class="pdt-rid-certification__checkbox">
                    <input type="checkbox" class="pdt-rid-certified-checkbox" ${isRIDCertified ? "checked" : ""}>
                    <span>Certified</span>
                </label>
                <input type="datetime-local" class="pdt-rid-certified-at" value="${ridCertifiedAtValue}" ${isRIDCertified ? "" : "disabled"}>
            </div>
        `;
    }

    buildCertStatusOptions(attendeeStatuses, selectedStatusID) {
        const statusOptions = Object.entries(attendeeStatuses ?? {})
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

    buildDateRangeMarkup(attendee, renderMode = "display") {
        if (renderMode === "edit") {
            return this.buildEditableDateRangeMarkup(attendee);
        }

        return this.buildDisplayDateRangeMarkup(attendee);
    }

    buildEditableDateRangeMarkup(attendee) {
        const startDateValue = this.escapeHtml(this.normalizeDateInputValue(attendee?.dateRangeStart));
        const endDateValue = this.escapeHtml(this.normalizeDateInputValue(attendee?.dateRangeEnd));

        return `
            <div class="pdt-date-range-inputs">
                <input type="date" class="pdt-attendee-date-start" value="${startDateValue}">
                <p>to</p>
                <input type="date" class="pdt-attendee-date-end" value="${endDateValue}">
            </div>
        `;
    }

    buildDisplayDateRangeMarkup(attendee) {
        const startDateValue = this.normalizeDateInputValue(attendee?.dateRangeStart);
        const endDateValue = this.normalizeDateInputValue(attendee?.dateRangeEnd);
        const dateRangeDisplay = String(attendee?.dateRangeDisplay ?? "").trim();

        if (startDateValue === "" && endDateValue === "") {
            return `<p>Not started</p>`;
        }

        if (startDateValue !== "" && endDateValue === "") {
            return `
                <input type="date" value="${startDateValue}" disabled>
                <p>to</p>
                <p>Ongoing</p>
            `;
        }

        if (endDateValue === "") {
            return `<p>${this.escapeHtml(dateRangeDisplay)}</p>`;
        }

        return `
            <input type="date" value="${startDateValue}" disabled>
            <p>to</p>
            <input type="date" value="${endDateValue}" disabled>
        `;
    }

    getCommentButtonTitle(attendee) {
        const hasComments = String(attendee?.adminComment ?? "").trim() !== ""
            || String(attendee?.memberComment ?? "").trim() !== "";
        return hasComments ? "Comments exist for this attendee." : "No comments yet.";
    }

    isoDateTimeToLocalInputValue(isoDateTime) {
        const normalizedDateTime = this.normalizeRIDDateTimeValue(isoDateTime);
        if (normalizedDateTime === null) {
            return "";
        }

        const date = new Date(normalizedDateTime);
        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    normalizeRIDDateTimeValue(value) {
        const normalizedValue = String(value ?? "").trim();
        if (normalizedValue === "") {
            return null;
        }

        const parsedTimestamp = Date.parse(normalizedValue.includes(" ")
            ? normalizedValue.replace(" ", "T")
            : normalizedValue);
        if (Number.isNaN(parsedTimestamp)) {
            return null;
        }

        return new Date(parsedTimestamp).toISOString();
    }

    normalizeDateInputValue(dateValue) {
        const normalizedDate = String(dateValue ?? "").trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
            return "";
        }

        return normalizedDate;
    }

    getSafePersonID(personID) {
        const numericPersonID = Number(personID);
        return Number.isFinite(numericPersonID) ? numericPersonID : 0;
    }

    getSafeAttendeeStatusID(statusID, attendeeStatuses) {
        const numericStatusID = Number(statusID);
        if (Number.isFinite(numericStatusID) && attendeeStatuses?.[numericStatusID]) {
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
