export class flag_manager {
    constructor(db = null) {
        this.db = db;
        this.flagSearchSelect = null;
        this.flagsData = { top: [] };
        this.topFlagIds = new Set();
    }

    async init(flagFields) {
        await this.load(flagFields);
        this.setupSearch(flagFields);
    }

    async reset(flagFields) {
        await this.load(flagFields);

        if (!this.flagSearchSelect) {
            return;
        }

        const flagOptions = this.getflagOptions(this.flagsData, this.topFlagIds);
        this.flagSearchSelect.clearOptions();
        this.flagSearchSelect.addOptions(flagOptions);
        this.flagSearchSelect.clear();
        this.flagSearchSelect.refreshOptions(false);
    }

    async load(flagFields) {
        this.flagsData = await this.db.get("flags");
        this.topFlagIds = new Set(this.flagsData.top);
        this.loadFlags(flagFields.list, this.flagsData);
    }

    setupSearch(flagFields) {
        if (flagFields.search.length === 0 || typeof window.TomSelect === "undefined") {
            return;
        }

        if (this.flagSearchSelect) {
            this.flagSearchSelect.destroy();
        }

        const flagOptions = this.getflagOptions(this.flagsData, this.topFlagIds);
        this.flagSearchSelect = new TomSelect(flagFields.search[0], {
            valueField: "id",
            labelField: "name",
            searchField: ["name"],
            options: flagOptions,
            maxItems: 1,
            create: false,
            render: {
                no_results: (data, escape) => {
                    return `
                        <div class="pdt-add-flag-option create button" data-input="${escape(data.input)}">
                            Add "${escape(data.input)}"
                        </div>`;
                }
            },
            onItemAdd: (value) => {
                const id = Number(value);
                if (!this.flagsData[id]) {
                    alert("That flag option is invalid. Please refresh the page and try again.");
                    this.flagSearchSelect.clear();
                    return;
                }

                this.addFlagToList(flagFields.list, id, this.flagsData[id]);
                this.topFlagIds.add(id);
                this.flagSearchSelect.removeOption(value);
                this.flagSearchSelect.refreshOptions(false);
                this.flagSearchSelect.clear();
            }
        });

        this.flagSearchSelect.dropdown_content.addEventListener("mousedown", async (event) => {
            const addFlagOption = event.target.closest(".pdt-add-flag-option");
            if (!addFlagOption) {
                return;
            }

            event.preventDefault();

            const newFlagLabel = String(addFlagOption.getAttribute("data-input") ?? "").trim();
            if (newFlagLabel === "") {
                return;
            }

            const existingFlagId = this.findFlagId(this.flagsData, newFlagLabel);
            if (existingFlagId !== null) {
                this.addFlagToList(flagFields.list, existingFlagId, this.flagsData[existingFlagId]);
                this.topFlagIds.add(existingFlagId);
                this.flagSearchSelect.removeOption(existingFlagId);
                this.flagSearchSelect.clear();
                this.flagSearchSelect.close();
                return;
            }

            const newFlagId = Number(await this.db.addFlag(newFlagLabel));
            if (!Number.isFinite(newFlagId)) {
                alert("Unable to add that flag right now. Please try again.");
                return;
            }

            this.flagsData[newFlagId] = newFlagLabel;
            this.addFlagToList(flagFields.list, newFlagId, newFlagLabel);
            this.topFlagIds.add(newFlagId);
            this.flagSearchSelect.clear();
            this.flagSearchSelect.close();
        });
    }

    loadFlags(flagList, flagsData) {
        flagList.empty();
        for (const flag of flagsData.top) {
            this.addFlagToList(flagList, flag, flagsData[flag], false);
        }
    }

    getflagOptions(flagsData, topFlagIds) {
        return Object.entries(flagsData)
            .filter(([flagId]) => flagId !== "top" && !topFlagIds.has(Number(flagId)))
            .map(([flagId, label]) => ({
                id: Number(flagId),
                name: label
            }));
    }

    addFlagToList(flagList, flagId, flagLabel, isChecked = true) {
        const existingFlag = flagList.find(`input[data-flagID="${flagId}"]`);
        if (existingFlag.length > 0) {
            existingFlag.prop("checked", isChecked || existingFlag.prop("checked"));
            return;
        }

        const option = `
            <label>
                <input type="checkbox" data-flagID=${flagId} name="flags" value="${flagLabel}" ${isChecked ? "checked" : ""}>
                ${flagLabel}
            </label>`;
        flagList.append(option);
    }

    findFlagId(flagsData, flagLabel) {
        const normalizedLabel = String(flagLabel ?? "").trim().toLowerCase();
        if (normalizedLabel === "") {
            return null;
        }

        for (const [flagId, label] of Object.entries(flagsData)) {
            if (flagId === "top") {
                continue;
            }

            if (String(label).trim().toLowerCase() === normalizedLabel) {
                return Number(flagId);
            }
        }

        return null;
    }

    getFlags(flagFields) {
        const checkedFlags = flagFields.list.find('input[name="flags"]:checked');
        const flagIds = [];

        checkedFlags.each(function () {
            const flagId = Number($(this).attr("data-flagID"));
            if (Number.isFinite(flagId)) {
                flagIds.push(flagId);
            }
        });

        return flagIds;
    }

    setFlags(flagFields, selectedFlagIds = []) {
        const validSelectedIds = selectedFlagIds.filter((flagId) => this.flagsData[flagId]);
        this.topFlagIds = new Set(this.flagsData.top);
        this.loadFlags(flagFields.list, this.flagsData);

        for (const flagId of validSelectedIds) {
            this.addFlagToList(flagFields.list, flagId, this.flagsData[flagId], true);
            this.topFlagIds.add(flagId);
        }

        if (!this.flagSearchSelect) {
            return;
        }

        const flagOptions = this.getflagOptions(this.flagsData, this.topFlagIds);
        this.flagSearchSelect.clearOptions();
        this.flagSearchSelect.addOptions(flagOptions);
        this.flagSearchSelect.clear();
        this.flagSearchSelect.refreshOptions(false);
    }
}
