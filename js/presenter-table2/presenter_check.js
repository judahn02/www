
export class presenter_check {

    constructor() {
        this.selectedPresenterID = null;
        this.presenterSelect = null;
    }

    syncSubmitState(submitBtn) {
        submitBtn.prop("disabled", !this.selectedPresenterID);
    }

    syncInputLockState(control, defaultPlaceholder) {
        if (control.items.length >= 1) {
            control.setTextboxValue("");
            control.close();
            control.control_input.setAttribute("disabled", "disabled");
            control.control_input.setAttribute("placeholder", "");
            control.input.setAttribute("placeholder", "");
        } else {
            control.control_input.removeAttribute("disabled");
            control.control_input.setAttribute("placeholder", defaultPlaceholder);
            control.input.setAttribute("placeholder", defaultPlaceholder);
        }

        control.inputState();
    }

    resetPresenterSelection(submitBtn, defaultPlaceholder) {
        this.selectedPresenterID = null;

        if (this.presenterSelect) {
            this.presenterSelect.clear(true);
            this.syncInputLockState(this.presenterSelect, defaultPlaceholder);
        }

        this.syncSubmitState(submitBtn);
    }

    clearNewMemberForm() {
        $(".pdt-add-new-member #f_name").val("");
        $(".pdt-add-new-member #l_name").val("");
        $(".pdt-add-new-member #email").val("");
        $(".pdt-add-new-member #p_number").val("");
    }

    async init(db, host, refreshTable) {
        this.db = db;
        this.host = host;
        this.refreshTable = refreshTable;

        const regPresShadow = $("#pdt-shadow-registered-attendee");
        const regPresModal = $("#pdt-attendee-check");
        const regPresenterSubmitBtn = $("#pdt-attendee-check #reg-attendee-submit");
        const presenterInput = document.getElementById("attendee-select");
        const presenterDefaultPlaceholder = presenterInput?.getAttribute("placeholder") || "";

        if (!presenterInput) {
            console.error("PDT: #attendee-select input was not found.");
            return;
        }

        const hidePresenterCheck = () => {
            this.resetPresenterSelection(regPresenterSubmitBtn, presenterDefaultPlaceholder);
            regPresShadow.prop("hidden", true);
            regPresModal.prop("hidden", true);
        };

        $("#pdt-n-member-modal #r_presenter").off("click.pdtPresenterCheck").on("click.pdtPresenterCheck", () => {
            this.resetPresenterSelection(regPresenterSubmitBtn, presenterDefaultPlaceholder);
            regPresShadow.prop("hidden", false);
            regPresModal.prop("hidden", false);
        });

        $("#pdt-attendee-check #reg-attendee-cancel").off("click.pdtPresenterCheck").on("click.pdtPresenterCheck", () => {
            hidePresenterCheck();
        });

        regPresShadow.off("click.pdtPresenterCheck").on("click.pdtPresenterCheck", (event) => {
            const clickedInsideModal = regPresModal.is(event.target) || regPresModal.has(event.target).length > 0;
            if (clickedInsideModal) {
                return;
            }

            hidePresenterCheck();
        });

        if (!this.presenterSelect) {
            this.presenterSelect = new TomSelect("#attendee-select", {
                plugins: ["remove_button"],
                valueField: "id",
                labelField: "name",
                searchField: ["name", "email", "id"],
                maxItems: 1,
                shouldLoad(query) {
                    return query.length >= 2;
                },
                load: async (query, callback) => {
                    try {
                        const results = await this.host.get("presenters", query);
                        callback(results);
                    } catch (error) {
                        console.error("Presenter search failed:", error);
                        callback();
                    }
                },
                render: {
                    option: (item, escape) => {
                        return `
            <div class="option-row">
              <span class="option-name">${escape(item.name)}</span>
              <span class="option-id">${escape(item.id)}</span>
              <span class="option-email">${escape(item.email)}</span>
            </div>
          `;
                    },
                    item: (item, escape) => {
                        return `
            <div class="chip" title="${escape(item.email)}">
              <span class="chip-name">${escape(item.name)}</span>
              <span class="chip-id">${escape(item.id)}</span>
              <span class="chip-email">${escape(item.email)}</span>
            </div>
          `;
                    }
                },
                onItemAdd: (value) => {
                    const selectedOption = this.presenterSelect.options[value];
                    this.selectedPresenterID = selectedOption?.id ?? value;
                    this.presenterSelect.setTextboxValue("");
                    this.presenterSelect.refreshOptions(false);
                    this.syncInputLockState(this.presenterSelect, presenterDefaultPlaceholder);
                    this.syncSubmitState(regPresenterSubmitBtn);
                },
                onItemRemove: () => {
                    this.selectedPresenterID = this.presenterSelect.items.length > 0 ?
                        this.presenterSelect.items[0] :
                        null;

                    this.syncInputLockState(this.presenterSelect, presenterDefaultPlaceholder);
                    this.syncSubmitState(regPresenterSubmitBtn);
                },
                onChange: () => {
                    this.selectedPresenterID = this.presenterSelect.items.length > 0 ?
                        this.presenterSelect.items[0] :
                        null;

                    this.syncInputLockState(this.presenterSelect, presenterDefaultPlaceholder);
                    this.syncSubmitState(regPresenterSubmitBtn);
                }
            });
        }

        this.resetPresenterSelection(regPresenterSubmitBtn, presenterDefaultPlaceholder);

        regPresenterSubmitBtn.off("click.pdtPresenterCheck").on("click.pdtPresenterCheck", async () => {
            if (regPresenterSubmitBtn.prop("disabled")) {
                return;
            }

            const selectedValue = this.presenterSelect.items.length > 0 ? this.presenterSelect.items[0] : null;
            const selectedOption = selectedValue ? this.presenterSelect.options[selectedValue] : null;
            if (!selectedOption) {
                return;
            }

            const presenters = await this.db.get("presenters");
            const alreadyExists = Array.isArray(presenters) && presenters.some((presenter) => {
                return String(presenter?.armember_id) === String(selectedOption.id);
            });

            if (alreadyExists) {
                alert("That presenter is already in the table.");
                return;
            }

            await this.db.set("presenters", {
                name: selectedOption.name,
                email: selectedOption.email,
                phone: "",
                session_count: 0,
                armember_id: selectedOption.id
            });

            if (typeof this.refreshTable === "function") {
                await this.refreshTable();
            }

            this.clearNewMemberForm();
            hidePresenterCheck();
            $("#pdt-shadow-new-member").prop("hidden", true);
            $("#pdt-n-member-modal").prop("hidden", true);
        });
    }
}
