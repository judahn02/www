export class attendee_filter_manager {
    constructor() {
        this.filterRefs = null;
        this.activeSearchValue = "";
    }

    init(filterRefs) {
        this.filterRefs = filterRefs;
        this.bindEvents();
    }

    bindEvents() {
        if (!this.filterRefs?.searchField || this.filterRefs.searchField.length === 0) {
            return;
        }

        this.filterRefs.searchField.off("input.pdtAttendeeFilter").on("input.pdtAttendeeFilter", (event) => {
            this.activeSearchValue = String($(event.currentTarget).val() ?? "");
            this.applyFilter();
        });
    }

    reset() {
        this.activeSearchValue = "";

        if (this.filterRefs?.searchField?.length > 0) {
            this.filterRefs.searchField.val("");
        }

        if (this.filterRefs?.tableBody?.length > 0) {
            this.filterRefs.tableBody.find(".pdt-attendees-filter-empty-row").remove();
            this.filterRefs.tableBody.find(".pdt-attendees-row").prop("hidden", false);
        }
    }

    applyFilter(searchValue = this.activeSearchValue) {
        if (!this.filterRefs?.tableBody || this.filterRefs.tableBody.length === 0) {
            return;
        }

        this.activeSearchValue = String(searchValue ?? "");
        const normalizedSearchValue = this.normalizeSearchValue(this.activeSearchValue);
        const attendeeRows = this.filterRefs.tableBody.find(".pdt-attendees-row");
        this.filterRefs.tableBody.find(".pdt-attendees-filter-empty-row").remove();

        if (attendeeRows.length === 0) {
            return;
        }

        let visibleRowCount = 0;
        attendeeRows.each((_, attendeeRow) => {
            const attendeeRowElement = $(attendeeRow);
            const attendeeSearchText = this.normalizeSearchValue(attendeeRowElement.attr("data-search-text"));
            const rowMatches = normalizedSearchValue === "" || attendeeSearchText.includes(normalizedSearchValue);
            attendeeRowElement.prop("hidden", !rowMatches);

            if (rowMatches) {
                visibleRowCount += 1;
            }
        });

        if (normalizedSearchValue !== "" && visibleRowCount === 0) {
            this.filterRefs.tableBody.append(this.buildNoSearchResultsRow(this.getVisibleColumnCount()));
        }
    }

    getVisibleColumnCount() {
        if (typeof this.filterRefs?.getVisibleColumnCount !== "function") {
            return 1;
        }

        return Number(this.filterRefs.getVisibleColumnCount()) || 1;
    }

    buildAttendeeSearchText(attendee) {
        return `${String(attendee?.name ?? "").trim()} ${String(attendee?.email ?? "").trim()}`.trim();
    }

    buildNoSearchResultsRow(columnCount) {
        return `
            <tr class="pdt-attendees-placeholder-row pdt-attendees-filter-empty-row">
                <td colspan="${columnCount}">No attendees match that search.</td>
            </tr>
        `;
    }

    normalizeSearchValue(value) {
        return String(value ?? "").toLowerCase().trim().replace(/\s+/g, " ");
    }
}
