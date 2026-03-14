export class link_modal {

    constructor() {
        this.selectedID = null;
        this.buttonID = null;
        this.buttonObject = null;
        this.presenterSelect = null;
        this.presenters = [];
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

    resetLinkSelection(linkMemberBtn, defaultPlaceholder) {
        this.selectedID = null;
        linkMemberBtn.prop("disabled", true);

        if (!this.presenterSelect) {
            return;
        }

        this.presenterSelect.clear(true);
        this.syncInputLockState(this.presenterSelect, defaultPlaceholder);
    }

    async init(table, db, host) {
        this.db = db;
        this.host = host;
        this.presenters = await this.db.get("presenters");

        const linkModalShadow = $("#pdt-shadow-link-armember");
        const linkModal = $("#pdt-link-armember");
        const linkMemberBtn = $(".pdt-link-armember #link-member");
        const presenterSelectInput = document.getElementById("presenter-select");
        const defaultPlaceholder = presenterSelectInput?.getAttribute("placeholder") || "";

        if (!presenterSelectInput) {
            console.error("PDT: #presenter-select input was not found.");
            return;
        }

        table.off("click.pdtLinkModal", ".link-button").on("click.pdtLinkModal", ".link-button", async (event) => {
            const button = event.currentTarget;
            const presenterId = Number($(button).data("id"));
            this.buttonID = presenterId;
            this.buttonObject = button;
            this.presenters = await this.db.get("presenters");

            const presenter = this.presenters.find((entry) => entry.id === presenterId);
            const presenterCopy = presenter ? { ...presenter } : null;
            if (!presenterCopy) {
                return;
            }

            $(".pdt-link-armember #contact").text(
                "" + presenterCopy["name"] + " | " + presenterCopy["email"]
            );

            $(".pdt-link-armember #id-stat").text("This presenter is not linked to any ARMember account.");

            if (presenterCopy["armember_id"] !== -1) {
                const results = await this.host.get("presenters", String(presenterCopy["armember_id"]));
                const linkedAccount = results.find(
                    (item) => String(item.id) === String(presenterCopy["armember_id"])
                );

                if (linkedAccount) {
                    $(".pdt-link-armember #id-stat").text(
                        `ARMember[ ID: ${linkedAccount.id} | ${linkedAccount.name} | ${linkedAccount.email} ]`
                    );
                } else {
                    $(".pdt-link-armember #id-stat").text(
                        `ARMember[ ID: ${presenterCopy["armember_id"]} ]`
                    );
                }
            }

            this.resetLinkSelection(linkMemberBtn, defaultPlaceholder);
            linkModalShadow.prop("hidden", false);
        });

        linkModalShadow.off("click.pdtLinkModal").on("click.pdtLinkModal", (event) => {
            const clickedInsideModal = linkModal.is(event.target) || linkModal.has(event.target).length > 0;
            if (clickedInsideModal) {
                return;
            }

            linkModalShadow.prop("hidden", true);
            this.resetLinkSelection(linkMemberBtn, defaultPlaceholder);
        });

        $(".pdt-link-armember #link-cancel").off("click.pdtLinkModal").on("click.pdtLinkModal", () => {
            linkModalShadow.prop("hidden", true);
            this.resetLinkSelection(linkMemberBtn, defaultPlaceholder);
        });

        if (!this.presenterSelect) {
            this.presenterSelect = new TomSelect("#presenter-select", {
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
                        console.error("Search failed:", error);
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
                    this.selectedID = selectedOption?.id ?? value;
                    linkMemberBtn.prop("disabled", !this.selectedID);

                    this.presenterSelect.setTextboxValue("");
                    this.presenterSelect.refreshOptions(false);
                    this.syncInputLockState(this.presenterSelect, defaultPlaceholder);
                },
                onItemRemove: () => {
                    this.selectedID = this.presenterSelect.items.length > 0 ?
                        this.presenterSelect.items[0] :
                        null;

                    linkMemberBtn.prop("disabled", !this.selectedID);
                    this.syncInputLockState(this.presenterSelect, defaultPlaceholder);
                },
                onChange: () => {
                    this.selectedID = this.presenterSelect.items.length > 0 ?
                        this.presenterSelect.items[0] :
                        null;

                    linkMemberBtn.prop("disabled", !this.selectedID);
                }
            });
        }

        this.resetLinkSelection(linkMemberBtn, defaultPlaceholder);

        linkMemberBtn.off("click.pdtLinkModal").on("click.pdtLinkModal", () => {
            if (linkMemberBtn.prop("disabled")) {
                return;
            }

            if (!this.buttonObject || this.buttonID === null || !this.selectedID) {
                return;
            }

            const presenter = this.presenters.find((entry) => entry.id === this.buttonID);
            if (presenter) {
                presenter.armember_id = this.selectedID;
            }

            $(this.buttonObject).val(this.selectedID);
            $(".pdt-link-armember #id-stat").text(`ARMember[ ID: ${this.selectedID} ]`);

            linkModalShadow.prop("hidden", true);
            this.resetLinkSelection(linkMemberBtn, defaultPlaceholder);
        });
    }
}
