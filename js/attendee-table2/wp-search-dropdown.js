export class WpSearchDropdown {
    constructor({
        inputSelector,
        resultsSelector,
        actionButtonSelector,
        searchFn,
        loadingDelay = 120,
    }) {
        this.$input = $(inputSelector);
        this.$results = $(resultsSelector);
        this.$actionButton = $(actionButtonSelector);
        this.searchFn = searchFn;
        this.loadingDelay = loadingDelay;

        this.rows = [];
        this.activeIndex = -1;
        this.requestId = 0;
        this.isBound = false;
    }

    isReady() {
        return (
            this.$input.length > 0 &&
            this.$results.length > 0 &&
            this.$actionButton.length > 0 &&
            typeof this.searchFn === "function"
        );
    }

    bind() {
        if (!this.isReady() || this.isBound) {
            return;
        }

        this.$input.on("input", (event) => {
            const query = String($(event.currentTarget).val()).trim();
            this.$actionButton.prop("disabled", true);
            this.$input.removeAttr("data-selected-id");
            if (query === "") {
                this.close();
                return;
            }

            const currentRequestId = ++this.requestId;
            this.renderStatus("Loading...", "is-loading");

            // Simulate async behavior so the loading option can be shown first.
            window.setTimeout(() => {
                if (currentRequestId !== this.requestId) {
                    return;
                }
                const rawResults = this.searchFn(query);
                const rows = this.normalizeRows(rawResults);
                this.renderRows(rows);
            }, this.loadingDelay);
        });

        this.$input.on("keydown", (event) => {
            if (event.key === "Escape") {
                this.close();
                return;
            }

            if (this.$results.prop("hidden")) {
                return;
            }

            const optionCount = this.rows.length;
            if (optionCount === 0) {
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                const nextIndex = this.activeIndex < optionCount - 1 ? this.activeIndex + 1 : 0;
                this.setActiveIndex(nextIndex);
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                const nextIndex = this.activeIndex > 0 ? this.activeIndex - 1 : optionCount - 1;
                this.setActiveIndex(nextIndex);
                return;
            }

            if (event.key === "Enter" && this.activeIndex >= 0) {
                event.preventDefault();
                this.selectRow(this.activeIndex);
            }
        });

        this.$results.on("click", ".pdt-search-option", (event) => {
            const optionIndex = Number($(event.currentTarget).data("index"));
            if (Number.isNaN(optionIndex)) {
                return;
            }
            this.selectRow(optionIndex);
        });

        $(document).on("click", (event) => {
            if (this.$results.prop("hidden")) {
                return;
            }

            const clickedInsideInput = this.$input.is(event.target) || this.$input.has(event.target).length > 0;
            const clickedInsideResults = this.$results.is(event.target) || this.$results.has(event.target).length > 0;
            if (!clickedInsideInput && !clickedInsideResults) {
                this.close();
            }
        });

        this.isBound = true;
    }

    reset() {
        this.$input.val("");
        this.$input.removeAttr("data-selected-id");
        this.$actionButton.prop("disabled", true);
        this.close();
    }

    close() {
        this.$results.empty().prop("hidden", true);
        this.rows = [];
        this.activeIndex = -1;
    }

    normalizeRows(rawResults) {
        if (!Array.isArray(rawResults)) {
            return [];
        }

        // wpConnection.get can return either one row [name, email, id]
        // or many rows [[...], [...]] depending on the query.
        if (rawResults.length === 3 && !Array.isArray(rawResults[0])) {
            return [rawResults];
        }

        return rawResults.filter((row) => Array.isArray(row) && row.length >= 3);
    }

    renderStatus(label, cssClass) {
        this.$results
            .html(`<button type="button" class="pdt-search-option ${cssClass}" disabled>${label}</button>`)
            .prop("hidden", false);
        this.activeIndex = -1;
    }

    renderRows(rows) {
        this.rows = rows.map((row) => [...row]);
        this.activeIndex = -1;

        if (this.rows.length === 0) {
            this.renderStatus("No results found", "is-empty");
            return;
        }

        let html = "";
        for (let index = 0; index < this.rows.length; index += 1) {
            const row = this.rows[index];
            const name = row[0];
            const email = row[1];
            const id = row[2];

            html += `
                <button type="button" class="pdt-search-option" data-index="${index}">
                    <span class="pdt-search-option__title">${name}</span>
                    <span class="pdt-search-option__meta">${email} | ID: ${id}</span>
                </button>
            `;
        }

        this.$results.html(html).prop("hidden", false);
    }

    setActiveIndex(nextIndex) {
        this.activeIndex = nextIndex;
        this.$results.find(".pdt-search-option").removeClass("is-active");
        this.$results.find(`.pdt-search-option[data-index="${nextIndex}"]`).addClass("is-active");
    }

    selectRow(index) {
        const row = this.rows[index];
        if (!row) {
            return;
        }

        const name = row[0];
        const id = row[2];
        this.$input.val(name);
        this.$input.attr("data-selected-id", String(id));
        this.$actionButton.prop("disabled", false);
        this.close();
    }
}
