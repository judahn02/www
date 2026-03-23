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
    }

    async init(mainPage) {
        const sessionModal = {
            wrapper: $("#pdt-shadow-session-modal"),
            modal: $("#pdt-shadow-session-modal .pdt-add-edit-modal"),
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


        // Add session button
        addSessionButton.off("click.pdtAddSession").on("click.pdtAddSession", function () {
            sessionModal.wrapper.prop("hidden", false);
        });


        // Click outside of Modal
        sessionModal.wrapper.off("click.pdtAddSession").on("click.pdtAddSession", function (e) {
            if (e.target === this) {
                sessionModal.wrapper.prop("hidden", true);
            }
        });


        // Cancel Button
        sessionModal.cancel.off("click.pdtAddSession").on("click.pdtAddSession", function () {
            sessionModal.wrapper.prop("hidden", true);
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
                sessionID: null,
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
            await mainPage.loadTable();
            sessionModal.wrapper.prop("hidden", true);
            
            // --- Clean Data ---
            this.resetDateInputs(dateFields);
            this.resetLengthInput(lengthField);
            this.resetTextFields(textFields);
            ceuFields.qualify.val("yes");
            ceuFields.weight.val("1.0");
            await this.dropDownAddManager.reset(dropDownFields);
            await this.presenterManager.reset(presenterFields);
            this.applyCEUFieldState(ceuFields, dropDownFields);
            await this.flagManager.reset(flagFields);


        });

        // Delete once done developing. 
        // sessionModal.wrapper.prop("hidden", false);
    }

    // The following are supporting functions for init, please understand init before continuing.

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

}
