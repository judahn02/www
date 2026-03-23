export class presenter_manager {
    constructor(db = null) {
        this.db = db;
        this.presenterSearchSelect = null;
        this.presentersData = [];
    }

    async init(presenterFields) {
        await this.load(presenterFields);
        this.setupSearch(presenterFields);
    }

    async reset(presenterFields) {
        await this.load(presenterFields);

        if (!this.presenterSearchSelect) {
            return;
        }

        const presenterOptions = this.getPresenterOptions(this.presentersData);
        this.presenterSearchSelect.clearOptions();
        this.presenterSearchSelect.addOptions(presenterOptions);
        this.presenterSearchSelect.clear();
        this.presenterSearchSelect.refreshOptions(false);
    }

    async load(presenterFields) {
        this.presentersData = await this.db.get("presenters") ?? [];
    }

    setupSearch(presenterFields) {
        if (presenterFields.select.length === 0 || typeof window.TomSelect === "undefined") {
            return;
        }

        if (this.presenterSearchSelect) {
            this.presenterSearchSelect.destroy();
        }

        const presenterOptions = this.getPresenterOptions(this.presentersData);
        this.presenterSearchSelect = new TomSelect(presenterFields.select[0], {
            valueField: "id",
            labelField: "label",
            searchField: ["name", "email"],
            options: presenterOptions,
            maxItems: null,
            create: false,
            persist: false,
            sortField: [
                { field: "name", direction: "asc" }
            ]
        });
    }

    getPresenters(presenterFields) {
        if (this.presenterSearchSelect) {
            return this.presenterSearchSelect.items
                .map((presenterId) => Number(presenterId))
                .filter((presenterId) => Number.isFinite(presenterId));
        }

        const selectedValues = presenterFields.select.val() ?? [];
        return selectedValues
            .map((presenterId) => Number(presenterId))
            .filter((presenterId) => Number.isFinite(presenterId));
    }

    getPresenterOptions(presentersData) {
        return (presentersData ?? [])
            .map((presenter) => {
                const [name, email, attendeeIndex, presenterIndex, personId] = presenter;
                return {
                    id: Number(personId),
                    name: String(name ?? ""),
                    email: String(email ?? ""),
                    label: `${String(name ?? "")} (${String(email ?? "")})`
                };
            })
            .filter((presenterOption) => Number.isFinite(presenterOption.id));
    }
}
