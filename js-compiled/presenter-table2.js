(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // js/presenter-table2/from-db.js
  var _db_connection = class _db_connection {
    // this function will do the following. 
    // it will return a refrence to the data it caches on its own. 
    // so every class that uses it won't have to worry about passing refrence alwas.
    async get(resource, search) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (typeof resource !== "string" || resource.trim() === "") {
        return void 0;
      }
      const value = resource.split(".").reduce((currentValue, key) => {
        if (currentValue === null || currentValue === void 0) {
          return void 0;
        }
        return currentValue[key];
      }, _db_connection.data);
      if (resource !== "presenters" || !Array.isArray(value)) {
        return value;
      }
      const query = String(search != null ? search : "").trim().toLowerCase();
      if (query === "") {
        return value;
      }
      return value.filter((presenter) => {
        var _a, _b, _c, _d;
        const name = String((_a = presenter == null ? void 0 : presenter.name) != null ? _a : "").toLowerCase();
        const email = String((_b = presenter == null ? void 0 : presenter.email) != null ? _b : "").toLowerCase();
        const phone = String((_c = presenter == null ? void 0 : presenter.phone) != null ? _c : "").toLowerCase();
        const armemberId = String((_d = presenter == null ? void 0 : presenter.armember_id) != null ? _d : "").toLowerCase();
        return name.includes(query) || email.includes(query) || phone.includes(query) || armemberId.includes(query);
      });
    }
    async set(resource, data) {
      var _a, _b, _c, _d, _e;
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (resource !== "presenters" || data === null || typeof data !== "object") {
        return null;
      }
      if (!Array.isArray(_db_connection.data.presenters)) {
        _db_connection.data.presenters = [];
      }
      const maxId = _db_connection.data.presenters.reduce((maxValue, presenter) => {
        const presenterId = Number(presenter == null ? void 0 : presenter.id);
        return Number.isFinite(presenterId) ? Math.max(maxValue, presenterId) : maxValue;
      }, 0);
      const newPresenter = {
        id: maxId + 1,
        name: String((_a = data.name) != null ? _a : "").trim(),
        email: String((_b = data.email) != null ? _b : "").trim(),
        phone: String((_c = data.phone) != null ? _c : "").trim(),
        session_count: Number((_d = data.session_count) != null ? _d : 0) || 0,
        armember_id: (_e = data.armember_id) != null ? _e : -1
      };
      _db_connection.data.presenters.push(newPresenter);
      return newPresenter;
    }
  };
  __publicField(_db_connection, "data", {
    "presenters": [
      {
        "id": 1,
        "name": "Avery Collins",
        "email": "avery.collins@example.com",
        "phone": "(555) 201-4401",
        "session_count": 3,
        "armember_id": -1
      },
      {
        "id": 2,
        "name": "Noah Patel",
        "email": "noah.patel@example.com",
        "phone": "(555) 318-2294",
        "session_count": 5,
        "armember_id": -1
      },
      {
        "id": 3,
        "name": "Emma Williams",
        "email": "emma.williams@example.com",
        "phone": "(555) 442-1180",
        "session_count": 2,
        "armember_id": -1
      },
      {
        "id": 4,
        "name": "Lucas Nguyen",
        "email": "lucas.nguyen@example.com",
        "phone": "(555) 109-7732",
        "session_count": 4,
        "armember_id": -1
      },
      {
        "id": 5,
        "name": "Sophia Martinez",
        "email": "sophia.martinez@example.com",
        "phone": "(555) 667-9043",
        "session_count": 1,
        "armember_id": -1
      },
      {
        "id": 6,
        "name": "James Walker",
        "email": "james.walker@example.com",
        "phone": "(555) 580-3316",
        "session_count": 6,
        "armember_id": "arm_122"
      },
      {
        "id": 7,
        "name": "Mia Robinson",
        "email": "mia.robinson@example.com",
        "phone": "(555) 724-8105",
        "session_count": 3,
        "armember_id": -1
      },
      {
        "id": 8,
        "name": "Daniel Scott",
        "email": "daniel.scott@example.com",
        "phone": "(555) 936-2257",
        "session_count": 7,
        "armember_id": "arm_441"
      }
    ]
  });
  var db_connection = _db_connection;

  // js/presenter-table2/from-host.js
  var _host_connection = class _host_connection {
    constructor() {
      this.collections = new Map(Object.entries(_host_connection.data));
    }
    async get(resource, query = "") {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const source = this.collections.get(resource) || [];
      const normalizedQuery = String(query != null ? query : "").trim().toLowerCase();
      if (!normalizedQuery) return [];
      const matches = source.filter((item) => {
        const name = item.name.toLowerCase();
        const email = item.email.toLowerCase();
        const id = String(item.id).toLowerCase();
        return name.includes(normalizedQuery) || email.includes(normalizedQuery) || id.includes(normalizedQuery);
      });
      return matches.slice(0, 12);
    }
  };
  __publicField(_host_connection, "data", {
    "presenters": [
      { id: "arm_110", name: "Isabella Davis", email: "isabella.davis@peakpoint.io" },
      { id: "arm_112", name: "Benjamin Lewis", email: "ben.lewis@emeraldtech.dev" },
      { id: "arm_113", name: "Charlotte Young", email: "charlotte.young@foundryhq.com" },
      { id: "arm_114", name: "Henry Clark", email: "henry.clark@lighthouse.ai" },
      { id: "arm_115", name: "Amelia Hall", email: "amelia.hall@oakridge.net" },
      { id: "arm_122", name: "James Walker", email: "james.walker@solaris.cloud" },
      { id: "arm_204", name: "Noah Patel", email: "noah.patel@atlasgroup.com" },
      { id: "arm_318", name: "Lucas Nguyen", email: "lucas.nguyen@cedarworks.com" },
      { id: "arm_404", name: "Judah J Nava", email: "judahnava02@gmail.com" },
      { id: "arm_441", name: "Daniel Scott", email: "daniel.scott@vectorworks.org" }
    ]
  });
  var host_connection = _host_connection;

  // js/presenter-table2/main_page.js
  var main_page = class {
    constructor(db, host, lModal, nMember, aCheck) {
      this.db = db;
      this.host = host;
      this.linkModal = lModal;
      this.newMember = nMember;
      this.attendeeCheck = aCheck;
    }
    async renderTable(tableBody) {
      var _a, _b, _c, _d;
      let presenters = await this.db.get("presenters");
      if (tableBody.length === 0 || !Array.isArray(presenters)) {
        return;
      }
      tableBody.empty();
      for (const presenter of presenters) {
        const armemberCell = presenter.armember_id === -1 ? `<input type="button" class="link-button button" data-id="${presenter.id}" value="Link Account">` : `<input type="button" class="link-button button" data-id="${presenter.id}" value="${presenter.armember_id}">`;
        const row = `
                <td>${(_a = presenter.name) != null ? _a : ""}</td>
                <td>${(_b = presenter.email) != null ? _b : ""}</td>
                <td>${(_c = presenter.phone) != null ? _c : ""}</td>
                <td>${(_d = presenter.session_count) != null ? _d : 0}</td>
                <td>${armemberCell}</td>
                <td><input type="button" class="button" value="\u2193 Details" disabled></td>
            `;
        tableBody.append(`<tr>${row}</tr>`);
      }
    }
    async init(params) {
      const tableBody = $(".pdt-main #presenter-table tbody");
      if (tableBody.length === 0) {
        return;
      }
      const refreshTable = async () => {
        await this.renderTable(tableBody);
      };
      await refreshTable();
      await this.linkModal.init(
        tableBody,
        this.db,
        this.host
      );
      await this.newMember.init(
        this.db,
        refreshTable
      );
      await this.attendeeCheck.init(
        this.db,
        this.host,
        refreshTable
      );
      return;
    }
  };

  // js/presenter-table2/link_modal.js
  var link_modal = class {
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
      const defaultPlaceholder = (presenterSelectInput == null ? void 0 : presenterSelectInput.getAttribute("placeholder")) || "";
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
            var _a;
            const selectedOption = this.presenterSelect.options[value];
            this.selectedID = (_a = selectedOption == null ? void 0 : selectedOption.id) != null ? _a : value;
            linkMemberBtn.prop("disabled", !this.selectedID);
            this.presenterSelect.setTextboxValue("");
            this.presenterSelect.refreshOptions(false);
            this.syncInputLockState(this.presenterSelect, defaultPlaceholder);
          },
          onItemRemove: () => {
            this.selectedID = this.presenterSelect.items.length > 0 ? this.presenterSelect.items[0] : null;
            linkMemberBtn.prop("disabled", !this.selectedID);
            this.syncInputLockState(this.presenterSelect, defaultPlaceholder);
          },
          onChange: () => {
            this.selectedID = this.presenterSelect.items.length > 0 ? this.presenterSelect.items[0] : null;
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
  };

  // js/presenter-table2/new_member.js
  var new_member = class {
    clearForm() {
      $(".pdt-add-new-member #f_name").val("");
      $(".pdt-add-new-member #l_name").val("");
      $(".pdt-add-new-member #email").val("");
      $(".pdt-add-new-member #p_number").val("");
    }
    async init(db, refreshTable) {
      this.db = db;
      this.refreshTable = refreshTable;
      const nMemberShadow = $("#pdt-shadow-new-member");
      const nMemberModal = $("#pdt-n-member-modal");
      const closeModal = () => {
        nMemberShadow.prop("hidden", true);
        nMemberModal.prop("hidden", true);
        this.clearForm();
      };
      $(".pdt-main #add-member").off("click.pdtNewMember").on("click.pdtNewMember", () => {
        nMemberShadow.prop("hidden", false);
        nMemberModal.prop("hidden", false);
      });
      $(".pdt-add-new-member #n-member-cancel").off("click.pdtNewMember").on("click.pdtNewMember", () => {
        closeModal();
      });
      nMemberShadow.off("click.pdtNewMember").on("click.pdtNewMember", (event) => {
        const clickedInsideModal = nMemberModal.is(event.target) || nMemberModal.has(event.target).length > 0;
        if (clickedInsideModal) {
          return;
        }
        closeModal();
      });
      $(".pdt-add-new-member #n-member-submit").off("click.pdtNewMember").on("click.pdtNewMember", async () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const firstName = (_b = (_a = $(".pdt-add-new-member #f_name").val()) == null ? void 0 : _a.toString().trim()) != null ? _b : "";
        const lastNameInput = $(".pdt-add-new-member #l_name");
        const emailInput = $(".pdt-add-new-member #email");
        const phone = (_d = (_c = $(".pdt-add-new-member #p_number").val()) == null ? void 0 : _c.toString().trim()) != null ? _d : "";
        const lastName = (_f = (_e = lastNameInput.val()) == null ? void 0 : _e.toString().trim()) != null ? _f : "";
        const email = (_h = (_g = emailInput.val()) == null ? void 0 : _g.toString().trim()) != null ? _h : "";
        if (!lastName || !email) {
          alert("Last name and email are required.");
          (!lastName ? lastNameInput : emailInput).trigger("focus");
          return;
        }
        const presenterName = [firstName, lastName].filter(Boolean).join(" ");
        await this.db.set("presenters", {
          name: presenterName,
          email,
          phone,
          session_count: 0,
          armember_id: -1
        });
        if (typeof this.refreshTable === "function") {
          await this.refreshTable();
        }
        closeModal();
      });
    }
  };

  // js/presenter-table2/presenter_check.js
  var presenter_check = class {
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
      const presenterDefaultPlaceholder = (presenterInput == null ? void 0 : presenterInput.getAttribute("placeholder")) || "";
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
            var _a;
            const selectedOption = this.presenterSelect.options[value];
            this.selectedPresenterID = (_a = selectedOption == null ? void 0 : selectedOption.id) != null ? _a : value;
            this.presenterSelect.setTextboxValue("");
            this.presenterSelect.refreshOptions(false);
            this.syncInputLockState(this.presenterSelect, presenterDefaultPlaceholder);
            this.syncSubmitState(regPresenterSubmitBtn);
          },
          onItemRemove: () => {
            this.selectedPresenterID = this.presenterSelect.items.length > 0 ? this.presenterSelect.items[0] : null;
            this.syncInputLockState(this.presenterSelect, presenterDefaultPlaceholder);
            this.syncSubmitState(regPresenterSubmitBtn);
          },
          onChange: () => {
            this.selectedPresenterID = this.presenterSelect.items.length > 0 ? this.presenterSelect.items[0] : null;
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
          return String(presenter == null ? void 0 : presenter.armember_id) === String(selectedOption.id);
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
  };

  // js/presenter-table2.js
  (function() {
    const jq = window.jQuery || window.jquery || window.$;
    window.jQuery = window.jQuery || jq;
    window.jquery = window.jquery || jq;
    window.$ = window.$ || jq;
    if (typeof window.$ === "undefined") {
      console.error("PDT: jQuery is required for pdt-attendee-table.js");
    } else {
      $(document).ready(async function() {
        "use strict";
        const dbC = new db_connection();
        const hostC = new host_connection();
        const mainPage = new main_page(
          dbC,
          hostC,
          new link_modal(),
          new new_member(),
          new presenter_check()
        );
        await mainPage.init();
      });
    }
  })();
})();
//# sourceMappingURL=presenter-table2.js.map
