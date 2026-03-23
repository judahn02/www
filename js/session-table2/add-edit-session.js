import { session_state } from "./state.js";
import { flag_manager } from "./flag_manager.js";
import { dropdown_add_manager } from "./dropdown_add_manager.js";
import { presenter_manager } from "./presenter_manager.js";
export class add_edit_session {
    constructor(db = null, host = null) {
        this.db = db;
        this.host = host;
        this.flagManager = new flag_manager(db);
        this.dropDownAddManager = new dropdown_add_manager(db);
        this.presenterManager = new presenter_manager(db);
        this.mainPage = null;
        this.formRefs = null;
        this.sessionModalState = {
            mode: "create",
            activeSessionID: null
        };
    }

    async init(mainPage) {
        this.mainPage = mainPage;
        const sessionModal = {
            wrapper: $("#pdt-shadow-session-modal"),
            modal: $("#pdt-shadow-session-modal .pdt-add-edit-modal"),
            title: $("#session-modal-title"),
            submit: $("#pdt-shadow-session-modal #submitModal"),
            cancel: $("#pdt-shadow-session-modal #cancelModal")
        };
        const addSessionButton = $(".pdt-main #add-session");
        const flagFields = {
            list: sessionModal.modal.find(".pdt-flag-list"),
            search: sessionModal.modal.find("#flag-search")
        };
        const dateFields = {
            options: sessionModal.modal.find("#date-options"),
            singleDate: sessionModal.modal.find("#date"),
            startDate: sessionModal.modal.find("#date-start"),
            endDate: sessionModal.modal.find("#date-end")
        };
        const textFields = {
            organizer: sessionModal.modal.find("#organizer"),
            sessionTitle: sessionModal.modal.find("#session_title"),
            parentEvent: sessionModal.modal.find("#parent_event")
        };
        const ceuFields = {
            qualify: sessionModal.modal.find("#qual_for_ceu"),
            weight: sessionModal.modal.find("#ceu_weight")
        };
        const presenterFields = {
            select: sessionModal.modal.find("#presenter-select")
        };
        const lengthField = sessionModal.modal.find("#length");
        const dropDowns = sessionModal.modal.find(".pdt-panel--5");
        const dropSession = dropDowns.find("#session_type");
        const dropEvent = dropDowns.find("#event_type");
        const dropCEU = dropDowns.find("#ceu_type");
        const dropRID = dropDowns.find("#rid_qualified");
        const dropDownFields = {
            sessionType: dropSession,
            eventType: dropEvent,
            ceuType: dropCEU,
            ridQualified: dropRID
        };
        const addOptionModal = {
            wrapper: $("#pdt-shadow-add-option-modal"),
            modal: $("#pdt-shadow-add-option-modal .pdt-add-option-modal"),
            title: $("#pdt-shadow-add-option-modal #add-option-title"),
            helper: $("#pdt-shadow-add-option-modal #add-option-helper"),
            input: $("#pdt-shadow-add-option-modal #add-option-input"),
            feedback: $("#pdt-shadow-add-option-modal #add-option-feedback"),
            submit: $("#pdt-shadow-add-option-modal #submitAddOption"),
            cancel: $("#pdt-shadow-add-option-modal #cancelAddOption")
        };

        await this.flagManager.init(flagFields);
        await this.dropDownAddManager.init(dropDownFields, addOptionModal);
        await this.presenterManager.init(presenterFields);
        this.bindCEUFieldState(ceuFields, dropDownFields);
        this.applyCEUFieldState(ceuFields, dropDownFields);
        this.formRefs = {
            sessionModal,
            flagFields,
            dateFields,
            textFields,
            ceuFields,
            presenterFields,
            lengthField,
            dropDownFields
        };


        // Add session button
        addSessionButton.off("click.pdtAddSession").on("click.pdtAddSession", async () => {
            await this.openForCreate();
        });


        // Click outside of Modal
        sessionModal.wrapper.off("click.pdtAddSession").on("click.pdtAddSession", async (event) => {
            if (event.target === sessionModal.wrapper[0]) {
                await this.closeModal();
            }
        });


        // Cancel Button
        sessionModal.cancel.off("click.pdtAddSession").on("click.pdtAddSession", async () => {
            await this.closeModal();
        });


        // Submit Button
        sessionModal.submit.off("click.pdtAddSession").on("click.pdtAddSession", async () => {
           
            // --- get data ---
            // get date
            let dateOption = this.getDate(dateFields);
            if (!this.validateDate(dateOption, dateFields)) {
                return;
            }
            // get length
            let length = this.getLength(lengthField);
            if (dateOption[0] === 1 && length === null) {
                alert("Please enter a valid positive length in minutes.");
                lengthField.trigger("focus");
                return;
            } else if (dateOption[0] !== 1 && length !== null) {
                alert("Length should only be set for a single date session.");
                lengthField.trigger("focus");
                return;
            }
            // flags
            let flags = this.flagManager.getFlags(flagFields);
            // text fields
            let textFieldValues = this.getTextFields(textFields);
            if (!this.validateTextFields(textFieldValues, textFields)) {
                return;
            }
            // Drop Downs
            let dropDownValues = this.dropDownAddManager.getDropDownFields(dropDownFields);
            let presenterValues = this.presenterManager.getPresenters(presenterFields);
            // Quality for CEUs
            const qualifiesForCEU = String(ceuFields.qualify.val() ?? "yes") === "yes";
            const ceuWeightValue = String(ceuFields.weight.val() ?? "").trim();
            let ceuWeightForSave = null;
            if (qualifiesForCEU) {
                ceuWeightForSave = Number(ceuWeightValue);
                if (ceuWeightForSave <= 0 || Number.isNaN(ceuWeightForSave)) {
                    alert("Please enter a valid positive CEU weight.");
                    ceuFields.weight.trigger("focus");
                    return;
                }
            }
            const ceuQualifyForSave = qualifiesForCEU ? "Yes" : "No";
            const ceuTypeForSave = qualifiesForCEU ? dropDownValues.ceuType : null;
            

            // --- Send Data ---
            const sessionPayload = {
                sessionID: this.sessionModalState.activeSessionID,
                dateOption,
                length,
                flags,
                organizer: textFieldValues.organizer,
                sessionTitle: textFieldValues.sessionTitle,
                parentEvent: textFieldValues.parentEvent,
                sessionType: dropDownValues.sessionType,
                eventType: dropDownValues.eventType,
                ceuType: ceuTypeForSave,
                ridQualified: dropDownValues.ridQualified,
                presenters: presenterValues,
                ceuQualify: ceuQualifyForSave,
                ceuWeight: ceuWeightForSave
            };
            await this.db.put("session", sessionPayload);


            // --- refresh sessions ---
            await this.mainPage.loadTable();
            await this.closeModal();


        });

        // Delete once done developing. 
        // sessionModal.wrapper.prop("hidden", false);
    }

    async openForCreate() {
        if (!this.formRefs) {
            return;
        }

        await this.resetForm();
        this.formRefs.sessionModal.wrapper.prop("hidden", false);
    }

    async openForEdit(sessionID) {
        if (!this.formRefs) {
            return;
        }

        const sessionData = await this.db.get("session", { sessionID });
        if (!sessionData) {
            alert("That session could not be found. Please refresh the page and try again.");
            return;
        }

        await this.resetForm();
        this.setModalMode("edit", sessionData.sessionID);
        await this.populateFormFromSession(sessionData);
        this.formRefs.sessionModal.wrapper.prop("hidden", false);
    }

    async closeModal() {
        if (!this.formRefs) {
            return;
        }

        this.formRefs.sessionModal.wrapper.prop("hidden", true);
        await this.resetForm();
    }

    // The following are supporting functions for init, please understand init before continuing.

    async resetForm() {
        if (!this.formRefs) {
            return;
        }

        const {
            dateFields,
            textFields,
            ceuFields,
            presenterFields,
            lengthField,
            dropDownFields,
            flagFields
        } = this.formRefs;

        this.setModalMode("create", null);
        this.resetDateInputs(dateFields);
        this.resetLengthInput(lengthField);
        this.resetTextFields(textFields);
        ceuFields.qualify.val("yes");
        ceuFields.weight.val("1.0");
        await this.dropDownAddManager.reset(dropDownFields);
        await this.presenterManager.reset(presenterFields);
        await this.flagManager.reset(flagFields);
        this.applyCEUFieldState(ceuFields, dropDownFields);
    }

    setModalMode(mode, sessionID = null) {
        this.sessionModalState = {
            mode,
            activeSessionID: sessionID
        };

        if (!this.formRefs) {
            return;
        }

        if (mode === "edit") {
            this.formRefs.sessionModal.title.text("Edit Session");
            this.formRefs.sessionModal.submit.text("Save Changes");
            return;
        }

        this.formRefs.sessionModal.title.text("Add Session");
        this.formRefs.sessionModal.submit.text("Save Session");
    }

    async populateFormFromSession(sessionData) {
        const {
            dateFields,
            textFields,
            ceuFields,
            presenterFields,
            lengthField,
            dropDownFields,
            flagFields
        } = this.formRefs;

        this.setDateFieldsFromSession(sessionData.Date, dateFields);
        if (this.isSingleDateSession(sessionData.Date) && Number(sessionData.Length) > 0) {
            lengthField.val(String(sessionData.Length));
        }

        textFields.organizer.val(String(sessionData.Organizer ?? ""));
        textFields.sessionTitle.val(String(sessionData.SessionTitle ?? ""));
        textFields.parentEvent.val(String(sessionData.ParentType ?? ""));

        const dropDownValues = await this.getSessionDropDownValues(sessionData);
        this.dropDownAddManager.setDropDownFields(dropDownFields, dropDownValues);

        ceuFields.qualify.val(String(sessionData.CEUQualify ?? "No").toLowerCase() === "yes" ? "yes" : "no");
        ceuFields.weight.val(Number(sessionData.CEUWeight) > 0 ? String(sessionData.CEUWeight) : "1.0");
        this.applyCEUFieldState(ceuFields, dropDownFields);

        this.flagManager.setFlags(flagFields, sessionData.FlagIDs ?? []);
        this.presenterManager.setPresenters(presenterFields, sessionData.PresenterIDs ?? []);
    }

    async getSessionDropDownValues(sessionData) {
        const [sessionTypes, eventTypes, ceuTypes] = await Promise.all([
            this.db.get("sessionTypes"),
            this.db.get("EventTypes"),
            this.db.get("CEUTypes")
        ]);

        return {
            sessionType: sessionData.SessionTypeID ?? this.findOptionIdByLabel(sessionTypes, sessionData.SessionType),
            eventType: sessionData.EventTypeID ?? this.findOptionIdByLabel(eventTypes, sessionData.EventType),
            ceuType: sessionData.CEUTypeID ?? this.findOptionIdByLabel(ceuTypes, sessionData.CEUConsideration),
            ridQualified: String(sessionData.RIDQualify ?? "No").toLowerCase() === "yes" ? "yes" : "no"
        };
    }

    getDate(dateFields) {
        const dateType = dateFields.options.find('input[name="date_mode"]:checked').val();
        const singleDate = dateFields.singleDate.val() || null;
        const startDate = dateFields.startDate.val() || null;
        const endDate = dateFields.endDate.val() || null;

        //[type, (startD | null), (endD | null)] - 1=normal, 2=range, 3=selfpaced
        if (dateType === "range") {
            return [2, startDate, endDate];
        }

        if (dateType === "self_paced") {
            return [3, null, null];
        }

        return [1, singleDate, null];
    }

    resetDateInputs(dateFields) {
        dateFields.options.find('input[name="date_mode"][value="single"]').prop("checked", true);
        dateFields.singleDate.val("");
        dateFields.startDate.val("");
        dateFields.endDate.val("");
    }

    resetLengthInput(lengthField) {
        lengthField.val("");
    }

    validateDate(dateOption, dateFields) {
        const [dateType, startDate, endDate] = dateOption;

        if (dateType === 1) {
            if (!startDate) {
                alert("Please choose a single date.");
                dateFields.singleDate.trigger("focus");
                return false;
            }

            return true;
        }

        if (dateType === 2) {
            if (!startDate) {
                alert("Please choose a start date.");
                dateFields.startDate.trigger("focus");
                return false;
            }

            if (!endDate) {
                alert("Please choose an end date.");
                dateFields.endDate.trigger("focus");
                return false;
            }

            if (endDate < startDate) {
                alert("End date must be on or after the start date.");
                dateFields.endDate.trigger("focus");
                return false;
            }

            return true;
        }

        return true;
    }

    getLength(lengthField) {
        const length = Number(lengthField.val());

        // Treat blank, zero, negative, and invalid values as no usable length.
        if (length <= 0 || Number.isNaN(length)) {
            return null;
        }

        return length;
    }

    getTextFields(textFields) {
        return {
            organizer: String(textFields.organizer.val() ?? "").trim(),
            sessionTitle: String(textFields.sessionTitle.val() ?? "").trim(),
            parentEvent: String(textFields.parentEvent.val() ?? "").trim()
        };
    }

    validateTextFields(textFieldValues, textFields) {
        if (textFieldValues.sessionTitle === "") {
            alert("Please enter a session title.");
            textFields.sessionTitle.trigger("focus");
            return false;
        }

        return true;
    }

    resetTextFields(textFields) {
        textFields.organizer.val("");
        textFields.sessionTitle.val("");
        textFields.parentEvent.val("");
    }

    bindCEUFieldState(ceuFields, dropDownFields) {
        ceuFields.qualify.off("change.pdtCEUState").on("change.pdtCEUState", () => {
            this.applyCEUFieldState(ceuFields, dropDownFields);
        });
    }

    applyCEUFieldState(ceuFields, dropDownFields) {
        const qualifiesForCEU = String(ceuFields.qualify.val() ?? "yes") === "yes";
        ceuFields.weight.prop("disabled", !qualifiesForCEU);
        dropDownFields.ceuType.prop("disabled", !qualifiesForCEU);
    }

    setDateFieldsFromSession(dateValue, dateFields) {
        this.resetDateInputs(dateFields);
        const normalizedDateValue = String(dateValue ?? "").trim();
        if (normalizedDateValue === "" || normalizedDateValue === "Self Paced") {
            dateFields.options.find('input[name="date_mode"][value="self_paced"]').prop("checked", true);
            return;
        }

        if (normalizedDateValue.includes(" to ")) {
            const [startDate, endDate] = normalizedDateValue.split(" to ");
            dateFields.options.find('input[name="date_mode"][value="range"]').prop("checked", true);
            dateFields.startDate.val(this.displayDateToInputValue(startDate));
            dateFields.endDate.val(this.displayDateToInputValue(endDate));
            return;
        }

        dateFields.options.find('input[name="date_mode"][value="single"]').prop("checked", true);
        dateFields.singleDate.val(this.displayDateToInputValue(normalizedDateValue));
    }

    displayDateToInputValue(displayDate) {
        const normalizedDate = String(displayDate ?? "").trim();
        const dateParts = normalizedDate.split("/");
        if (dateParts.length !== 3) {
            return "";
        }

        const [month, day, year] = dateParts;
        if (month === "" || day === "" || year === "") {
            return "";
        }

        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    isSingleDateSession(dateValue) {
        const normalizedDateValue = String(dateValue ?? "").trim();
        return normalizedDateValue !== "" && normalizedDateValue !== "Self Paced" && !normalizedDateValue.includes(" to ");
    }

    findOptionIdByLabel(optionsData, label) {
        const normalizedLabel = String(label ?? "").trim().toLowerCase();
        if (normalizedLabel === "") {
            return null;
        }

        for (const [optionId, optionLabel] of Object.entries(optionsData ?? {})) {
            if (String(optionLabel ?? "").trim().toLowerCase() === normalizedLabel) {
                return Number(optionId);
            }
        }

        return null;
    }

}
