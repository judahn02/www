export class dropdown_add_manager {
    constructor(db = null) {
        this.db = db;
        this.dropDownAddState = null;
        this.addOptionModal = null;
    }

    async init(dropDownFields, addOptionModal) {
        this.addOptionModal = addOptionModal;
        await this.loadDropDownFields(dropDownFields);
        this.bindDropDownAddNew(dropDownFields);
        this.bindAddOptionModal();
    }

    async reset(dropDownFields) {
        await this.loadDropDownFields(dropDownFields);
    }

    async loadDropDownFields(dropDownFields) {
        const sessionTypes = await this.db.get("sessionTypes");
        const eventTypes = await this.db.get("EventTypes");
        const ceuTypes = await this.db.get("CEUTypes");

        this.loadDropDownOptions(dropDownFields.sessionType, sessionTypes);
        this.loadDropDownOptions(dropDownFields.eventType, eventTypes);
        this.loadDropDownOptions(dropDownFields.ceuType, ceuTypes);
        dropDownFields.ridQualified.val("no");
    }

    loadDropDownOptions(selectField, optionsData) {
        const noneOption = selectField.find('option[value="0"]').detach();
        const addNewOption = selectField.find('option[value="-1"]').detach();
        const sortedOptions = Object.entries(optionsData ?? {}).sort((leftOption, rightOption) => {
            return String(leftOption[1]).localeCompare(String(rightOption[1]), undefined, { sensitivity: "base" });
        });

        selectField.empty();
        selectField.append(noneOption);

        for (const [optionId, optionLabel] of sortedOptions) {
            selectField.append(`<option value="${optionId}">${optionLabel}</option>`);
        }

        selectField.append(addNewOption);
        selectField.val("0");
    }

    bindDropDownAddNew(dropDownFields) {
        const addNewSelects = [
            dropDownFields.sessionType,
            dropDownFields.eventType,
            dropDownFields.ceuType
        ];

        for (const selectField of addNewSelects) {
            selectField.off("change.pdtAddNew").on("change.pdtAddNew", () => {
                if (selectField.val() !== "-1") {
                    return;
                }

                this.handleDropDownAddNew(selectField);
            });
        }
    }

    handleDropDownAddNew(selectField) {
        selectField.val("0");
        const modalData = this.getDropDownModalData(selectField);
        if (modalData === null || !this.addOptionModal) {
            return;
        }

        this.dropDownAddState = {
            selectField,
            resource: modalData.resource
        };

        this.addOptionModal.title.text(modalData.title);
        this.addOptionModal.helper.text(modalData.helper);
        this.addOptionModal.input.val("");
        this.addOptionModal.feedback.text("").prop("hidden", true);
        this.addOptionModal.wrapper.prop("hidden", false);
        this.addOptionModal.input.trigger("focus");
    }

    bindAddOptionModal() {
        if (!this.addOptionModal) {
            return;
        }

        this.addOptionModal.cancel.off("click.pdtAddOption").on("click.pdtAddOption", () => {
            this.closeAddOptionModal();
        });

        this.addOptionModal.wrapper.off("click.pdtAddOption").on("click.pdtAddOption", (event) => {
            if (event.target !== this.addOptionModal.wrapper[0]) {
                return;
            }

            this.closeAddOptionModal();
        });

        this.addOptionModal.submit.off("click.pdtAddOption").on("click.pdtAddOption", async () => {
            await this.saveAddOptionModal();
        });
    }

    closeAddOptionModal() {
        if (!this.addOptionModal) {
            return;
        }

        this.addOptionModal.wrapper.prop("hidden", true);
        this.addOptionModal.input.val("");
        this.addOptionModal.feedback.text("").prop("hidden", true);
        this.dropDownAddState = null;
    }

    getDropDownModalData(selectField) {
        const selectId = selectField.attr("id");
        if (selectId === "session_type") {
            return {
                resource: "sessionTypes",
                title: "Add New Session Type",
                helper: "Enter a new session type label. Duplicate labels are case-insensitive."
            };
        }

        if (selectId === "event_type") {
            return {
                resource: "EventTypes",
                title: "Add New Event Type",
                helper: "Enter a new event type label. Duplicate labels are case-insensitive."
            };
        }

        if (selectId === "ceu_type") {
            return {
                resource: "CEUTypes",
                title: "Add New CEU Type",
                helper: "Enter a new CEU type label. Duplicate labels are case-insensitive."
            };
        }

        return null;
    }

    async saveAddOptionModal() {
        if (this.dropDownAddState === null || !this.addOptionModal) {
            return;
        }

        const label = String(this.addOptionModal.input.val() ?? "").trim();
        if (label === "") {
            this.addOptionModal.feedback.text("Please enter a label.").prop("hidden", false);
            this.addOptionModal.input.trigger("focus");
            return;
        }

        const optionId = Number(await this.db.set(this.dropDownAddState.resource, label));
        if (!Number.isFinite(optionId) || optionId < 0) {
            this.addOptionModal.feedback.text("That label already exists or could not be added.").prop("hidden", false);
            this.addOptionModal.input.trigger("focus");
            return;
        }

        const updatedOptions = await this.db.get(this.dropDownAddState.resource);
        this.loadDropDownOptions(this.dropDownAddState.selectField, updatedOptions);
        this.dropDownAddState.selectField.val(String(optionId));
        this.closeAddOptionModal();
    }

    getDropDownFields(dropDownFields) {
        return {
            sessionType: this.normalizeDropDownValue(dropDownFields.sessionType.val()),
            eventType: this.normalizeDropDownValue(dropDownFields.eventType.val()),
            ceuType: this.normalizeDropDownValue(dropDownFields.ceuType.val()),
            ridQualified: String(dropDownFields.ridQualified.val() ?? "no")
        };
    }

    setDropDownFields(dropDownFields, values = {}) {
        this.setDropDownValue(dropDownFields.sessionType, values.sessionType);
        this.setDropDownValue(dropDownFields.eventType, values.eventType);
        this.setDropDownValue(dropDownFields.ceuType, values.ceuType);
        dropDownFields.ridQualified.val(String(values.ridQualified ?? "no"));
    }

    setDropDownValue(selectField, value) {
        if (value === null || value === undefined) {
            selectField.val("0");
            return;
        }

        selectField.val(String(value));
    }

    normalizeDropDownValue(value) {
        if (value === "0" || value === "-1" || value === null || value === undefined) {
            return null;
        }

        return Number(value);
    }

    resetDropDownFields(dropDownFields) {
        dropDownFields.sessionType.val("0");
        dropDownFields.eventType.val("0");
        dropDownFields.ceuType.val("0");
        dropDownFields.ridQualified.val("no");
    }
}
