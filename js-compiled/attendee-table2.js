(() => {
  // js/shims/jquery-global.js
  var jq = window.jQuery || window.$ || window.jquery;
  if (typeof jq !== "function") {
    throw new Error("PDT: jQuery is required before this bundle loads.");
  }

  // js/attendee-table2.js
  var serverData = {
    "attendees": [
      {
        "id": 1,
        "first-n": "Judah",
        "last-n": "Nava",
        "email": "example@example.com",
        "WP-id": "u_404",
        // or -1 if there is not wp id attached.
        "t_hours": 7.5,
        "t_ceus": 0.15,
        "number": "123-123-1234"
      },
      {
        "id": 2,
        "first-n": "Avery",
        "last-n": "Collins",
        "email": "avery.collins@example.com",
        "WP-id": -1,
        "t_hours": 9,
        "t_ceus": 0.18,
        "number": "123-123-1234"
      },
      {
        "id": 3,
        "first-n": "Mason",
        "last-n": "Reed",
        "email": "mason.reed@example.com",
        "WP-id": -1,
        "t_hours": 6,
        "t_ceus": 0.12,
        "number": "123-123-1234"
      },
      {
        "id": 4,
        "first-n": "Olivia",
        "last-n": "Turner",
        "email": "olivia.turner@example.com",
        "WP-id": -1,
        "t_hours": 8.5,
        "t_ceus": 0.17,
        "number": "123-123-1234"
      },
      {
        "id": 5,
        "first-n": "Sophia",
        "last-n": "Bennett",
        "email": "sophia.bennett@example.com",
        "WP-id": -1,
        "t_hours": 10,
        "t_ceus": 0.2,
        "number": "123-123-1234"
      }
    ]
  };
  (function() {
    const hasDollar = typeof window.$ !== "undefined";
    const hasJQuery = typeof window.jQuery !== "undefined";
    if (!hasDollar && hasJQuery) {
      window.$ = window.jQuery;
    }
    if (typeof window.$ === "undefined") {
      console.error("PDT: jQuery is required for pdt-attendee-table.js");
      return;
    }
    class DataService {
      constructor() {
        this.collections = /* @__PURE__ */ new Map([
          [
            "attendees",
            [
              { id: "u_101", name: "Ava Thompson", email: "ava.thompson@northstar.dev" },
              { id: "u_102", name: "Liam Chen", email: "liam.chen@horizonlabs.io" },
              { id: "u_103", name: "Noah Patel", email: "noah.patel@atlasgroup.com" },
              { id: "u_104", name: "Emma Williams", email: "emma.williams@brightside.co" },
              { id: "u_105", name: "Olivia Martinez", email: "olivia.martinez@zenithsystems.net" },
              { id: "u_106", name: "Ethan Brooks", email: "ethan.brooks@acmecorp.org" },
              { id: "u_107", name: "Mia Robinson", email: "mia.robinson@riversoft.ai" },
              { id: "u_108", name: "Lucas Nguyen", email: "lucas.nguyen@cedarworks.com" },
              { id: "u_109", name: "Sophia Kim", email: "sophia.kim@milestone.app" },
              { id: "u_110", name: "James Walker", email: "james.walker@solaris.cloud" },
              { id: "u_111", name: "Isabella Davis", email: "isabella.davis@peakpoint.io" },
              { id: "u_112", name: "Benjamin Lewis", email: "ben.lewis@emeraldtech.dev" },
              { id: "u_113", name: "Charlotte Young", email: "charlotte.young@foundryhq.com" },
              { id: "u_114", name: "Henry Clark", email: "henry.clark@lighthouse.ai" },
              { id: "u_115", name: "Amelia Hall", email: "amelia.hall@oakridge.net" },
              { id: "u_116", name: "Daniel Scott", email: "daniel.scott@vectorworks.org" },
              { id: "u_404", name: "Judah J Nava", email: "judahnava02@gmail.com" }
            ]
          ]
        ]);
      }
      // This method is async on purpose so the UI layer remains unchanged
      // when we swap mock data for a real HTTP API later.
      async get(resource, query = "") {
        await new Promise((resolve) => setTimeout(resolve, 250));
        const source = this.collections.get(resource) || [];
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return [];
        const matches = source.filter((item) => {
          const name = item.name.toLowerCase();
          const email = item.email.toLowerCase();
          const id = String(item.id).toLowerCase();
          return name.includes(normalizedQuery) || email.includes(normalizedQuery) || id.includes(normalizedQuery);
        });
        return matches.slice(0, 12);
      }
      async set(resource, data2) {
        if (resource !== "attendees") {
          return null;
        }
        const source = Array.isArray(serverData == null ? void 0 : serverData.attendees) ? serverData.attendees : [];
        const maxId = source.reduce((max, item) => {
          const candidate = Number(item == null ? void 0 : item.id);
          return Number.isFinite(candidate) ? Math.max(max, candidate) : max;
        }, 0);
        return maxId + 1;
      }
      /*
            // Real backend version (example only):
            async get(resource, query = "") {
              const token = localStorage.getItem("jwt_token");
              const url = `/api/${encodeURIComponent(resource)}?q=${encodeURIComponent(query)}`;
      
              const response = await fetch(url, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              });
      
              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }
      
              const payload = await response.json();
              return Array.isArray(payload.items) ? payload.items : [];
            }
            */
    }
    const data = new DataService();
    const attendeeInput = document.getElementById("attendee-select");
    if (!attendeeInput) {
      console.error("PDT: #attendee-select input was not found.");
      return;
    }
    const defaultPlaceholder = attendeeInput.getAttribute("placeholder") || "";
    const table = jq(".pdt-main #attendee-table tbody");
    const attendees = Array.isArray(serverData == null ? void 0 : serverData.attendees) ? serverData.attendees : [];
    if (attendees.length !== 0) {
      table.empty();
      for (const line of attendees) {
        let button = `<button class="link-button button" data-id="${line.id}" type="button">Link Account?</button>`;
        if (line["WP-id"] !== -1) {
          button = `<button class="link-button button" data-id="${line.id}" type="button">WP # <span>${line["WP-id"]}</span></button>`;
        }
        let row = `
            <tr class="row">
                <td class="cell">${line["first-n"]}</td>
                <td class="cell">${line["last-n"]}</td>
                <td class="cell">${line["email"]}</td>
                <td class="cell">
                    ${button}
                </td>
                <td class="cell">${line["t_hours"]}</td>
                <td class="cell">${line["t_ceus"]}</td>
            </tr>
        `;
        table.append(row);
      }
    }
    const linkModalShadow = jq("#pdt-shadow-link-armember");
    const linkModal = jq("#pdt-link-armember");
    let selectedID = null;
    let buttonID = null;
    let buttonObject = null;
    const linkMemberBtn = jq(".pdt-link-armember #link-member");
    table.on("click", ".link-button", async function() {
      const attendeeId = Number(jq(this).data("id"));
      buttonID = attendeeId;
      buttonObject = this;
      const attendee = attendees.find((entry) => entry.id === attendeeId);
      const attendeeCopy = attendee ? { ...attendee } : null;
      jq(".pdt-link-armember #contact").text(
        "" + attendeeCopy["first-n"] + " " + attendeeCopy["last-n"] + " | " + attendeeCopy.email
      );
      jq(".pdt-link-armember #id-stat").text("This attendee is not linked to any ARMember account.");
      if (attendeeCopy["WP-id"] !== -1) {
        const results = await data.get("attendees", String(attendeeCopy["WP-id"]));
        const linkedAccount = results.find(
          (item) => String(item.id) === String(attendeeCopy["WP-id"])
        );
        if (linkedAccount) {
          jq(".pdt-link-armember #id-stat").text(
            `ARMember[ ID: ${linkedAccount.id} | ${linkedAccount.name} | ${linkedAccount.email} ]`
          );
        } else {
          jq(".pdt-link-armember #id-stat").text(
            `This attendee is not linked to any ARMember account.`
          );
        }
      }
      resetLinkSelection();
      linkModalShadow.prop("hidden", false);
    });
    linkModalShadow.on("click", function(event) {
      const clickedInsideModal = linkModal.is(event.target) || linkModal.has(event.target).length > 0;
      if (clickedInsideModal) {
        return;
      }
      linkModalShadow.prop("hidden", true);
      resetLinkSelection();
    });
    jq(".pdt-link-armember #link-cancel").on("click", function() {
      linkModalShadow.prop("hidden", true);
      resetLinkSelection();
    });
    const attendeeSelect = new TomSelect("#attendee-select", {
      plugins: ["remove_button"],
      valueField: "id",
      labelField: "name",
      searchField: ["name", "email"],
      maxItems: 8,
      shouldLoad(query) {
        return query.length >= 2;
      },
      load: async (query, callback) => {
        try {
          const results = await data.get("attendees", query);
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
              <span class="option-email">${escape(item.email)}</span>
            </div>
          `;
        },
        item: (item, escape) => {
          return `
            <div class="chip" title="${escape(item.email)}">
              <span class="chip-name">${escape(item.name)}</span>
              <span class="chip-email">${escape(item.email)}</span>
            </div>
          `;
        }
      },
      onItemAdd(value, itemEl) {
        var _a;
        const selectedOption = this.options[value];
        selectedID = (_a = selectedOption == null ? void 0 : selectedOption.id) != null ? _a : value;
        linkMemberBtn.prop("disabled", !selectedID);
        this.setTextboxValue("");
        this.refreshOptions(false);
        syncInputLockState(this);
      },
      onItemRemove() {
        selectedID = this.items.length > 0 ? this.items[0] : null;
        linkMemberBtn.prop("disabled", !selectedID);
        syncInputLockState(this);
      },
      onChange() {
        selectedID = this.items.length > 0 ? this.items[0] : null;
        linkMemberBtn.prop("disabled", !selectedID);
      }
    });
    function syncInputLockState(control) {
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
    function resetLinkSelection() {
      selectedID = null;
      linkMemberBtn.prop("disabled", true);
      attendeeSelect.clear(true);
      syncInputLockState(attendeeSelect);
    }
    resetLinkSelection();
    linkMemberBtn.on("click", function() {
      if (jq(this).prop("disabled")) {
        return;
      }
      console.log(selectedID);
      console.log(buttonID);
      if (!buttonObject || !buttonID || !selectedID) {
        return;
      }
      const attendee = attendees.find((entry) => entry.id === buttonID);
      if (attendee) {
        attendee["WP-id"] = selectedID;
      }
      const updatedButton = `WP # <span>${selectedID}</span>`;
      jq(buttonObject).html(updatedButton);
      linkModalShadow.prop("hidden", true);
      resetLinkSelection();
    });
    const nMemberShadow = jq("#pdt-shadow-new-member");
    const nMemberModal = jq("#pdt-n-member-modal");
    jq(".pdt-main #add-member").on("click", function() {
      nMemberShadow.prop("hidden", false);
      nMemberModal.prop("hidden", false);
    });
    jq(".pdt-add-new-member #n-member-cancel").on("click", function() {
      nMemberShadow.prop("hidden", true);
      nMemberModal.prop("hidden", true);
    });
    nMemberShadow.on("click", function(event) {
      const clickedInsideModal = nMemberModal.is(event.target) || nMemberModal.has(event.target).length > 0;
      if (clickedInsideModal) {
        return;
      }
      nMemberShadow.prop("hidden", true);
      nMemberModal.prop("hidden", true);
    });
    jq(".pdt-add-new-member #n-member-submit").on("click", async function() {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const lastNameInput = jq(".pdt-add-new-member #l_name");
      const emailInput = jq(".pdt-add-new-member #email");
      const lastName = (_b = (_a = lastNameInput.val()) == null ? void 0 : _a.toString().trim()) != null ? _b : "";
      const email = (_d = (_c = emailInput.val()) == null ? void 0 : _c.toString().trim()) != null ? _d : "";
      if (!lastName || !email) {
        alert("Last name and email are required.");
        (!lastName ? lastNameInput : emailInput).trigger("focus");
        return;
      }
      const newMemberInputs = [
        (_f = (_e = jq(".pdt-add-new-member #f_name").val()) == null ? void 0 : _e.toString().trim()) != null ? _f : "",
        lastName,
        email,
        (_h = (_g = jq(".pdt-add-new-member #p_number").val()) == null ? void 0 : _g.toString().trim()) != null ? _h : ""
      ];
      jq(".pdt-add-new-member #f_name").val("");
      jq(".pdt-add-new-member #l_name").val("");
      jq(".pdt-add-new-member #email").val("");
      jq(".pdt-add-new-member #p_number").val("");
      let id = await data.set("attendees", newMemberInputs);
      const newAttendee = {
        id,
        "first-n": newMemberInputs[0],
        "last-n": newMemberInputs[1],
        "email": newMemberInputs[2],
        "WP-id": -1,
        "t_hours": 0,
        "t_ceus": 0,
        "number": newMemberInputs[3]
      };
      if (!Array.isArray(serverData.attendees)) {
        serverData.attendees = [];
      }
      serverData.attendees.push(newAttendee);
      nMemberShadow.prop("hidden", true);
      nMemberModal.prop("hidden", true);
    });
    const regPresShadow = jq("#pdt-shadow-registered-presenter");
    const regPresModal = jq("#pdt-presenter-check");
    const regPresenterSubmitBtn = jq("#pdt-presenter-check #reg-presenter-submit");
    const presenterInput = document.getElementById("presenter-select");
    const presenterDefaultPlaceholder = (presenterInput == null ? void 0 : presenterInput.getAttribute("placeholder")) || "";
    let selectedPresenterID = null;
    function syncPresenterSubmitState() {
      regPresenterSubmitBtn.prop("disabled", !selectedPresenterID);
    }
    function syncPresenterInputLockState(control) {
      if (control.items.length >= 1) {
        control.setTextboxValue("");
        control.close();
        control.control_input.setAttribute("disabled", "disabled");
        control.control_input.setAttribute("placeholder", "");
        control.input.setAttribute("placeholder", "");
      } else {
        control.control_input.removeAttribute("disabled");
        control.control_input.setAttribute("placeholder", presenterDefaultPlaceholder);
        control.input.setAttribute("placeholder", presenterDefaultPlaceholder);
      }
      control.inputState();
    }
    function resetPresenterSelection() {
      selectedPresenterID = null;
      presenterSelect.clear(true);
      syncPresenterInputLockState(presenterSelect);
      syncPresenterSubmitState();
    }
    jq("#pdt-n-member-modal #r_presenter").on("click", function() {
      resetPresenterSelection();
      regPresShadow.prop("hidden", false);
      regPresModal.prop("hidden", false);
    });
    jq("#pdt-presenter-check #reg-presenter-cancel").on("click", function() {
      resetPresenterSelection();
      regPresShadow.prop("hidden", true);
      regPresModal.prop("hidden", true);
    });
    regPresShadow.on("click", function(event) {
      const clickedInsideModal = regPresModal.is(event.target) || regPresModal.has(event.target).length > 0;
      if (clickedInsideModal) {
        return;
      }
      resetPresenterSelection();
      regPresShadow.prop("hidden", true);
      regPresModal.prop("hidden", true);
    });
    const presenterSelect = new TomSelect("#presenter-select", {
      plugins: ["remove_button"],
      valueField: "id",
      labelField: "name",
      searchField: ["name", "email"],
      maxItems: 1,
      shouldLoad(query) {
        return query.length >= 2;
      },
      load: async (query, callback) => {
        try {
          const results = await data.get("attendees", query);
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
              <span class="option-email">${escape(item.email)}</span>
            </div>
          `;
        },
        item: (item, escape) => {
          return `
            <div class="chip" title="${escape(item.email)}">
              <span class="chip-name">${escape(item.name)}</span>
              <span class="chip-email">${escape(item.email)}</span>
            </div>
          `;
        }
      },
      onItemAdd(value) {
        var _a;
        const selectedOption = this.options[value];
        selectedPresenterID = (_a = selectedOption == null ? void 0 : selectedOption.id) != null ? _a : value;
        this.setTextboxValue("");
        this.refreshOptions(false);
        syncPresenterInputLockState(this);
        syncPresenterSubmitState();
      },
      onItemRemove() {
        selectedPresenterID = this.items.length > 0 ? this.items[0] : null;
        syncPresenterInputLockState(this);
        syncPresenterSubmitState();
      },
      onChange() {
        selectedPresenterID = this.items.length > 0 ? this.items[0] : null;
        syncPresenterInputLockState(this);
        syncPresenterSubmitState();
      }
    });
    regPresenterSubmitBtn.on("click", function() {
      if (jq(this).prop("disabled")) {
        return;
      }
      const selectedValue = presenterSelect.items.length > 0 ? presenterSelect.items[0] : null;
      const selectedOption = selectedValue ? presenterSelect.options[selectedValue] : null;
      const presenterPayload = selectedOption ? { id: selectedOption.id, name: selectedOption.name, email: selectedOption.email } : null;
      if (!presenterPayload) {
        return;
      }
      data.set("attendees", presenterPayload);
      regPresShadow.prop("hidden", true);
      regPresModal.prop("hidden", true);
      nMemberShadow.prop("hidden", true);
      nMemberModal.prop("hidden", true);
    });
    syncPresenterInputLockState(presenterSelect);
    syncPresenterSubmitState();
  })();
})();
//# sourceMappingURL=attendee-table2.js.map
