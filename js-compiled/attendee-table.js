(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // js/attendee-table/from-endpoint.js
  var data = class {
    static post(path, data2) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (typeof path !== "string" || path.trim() === "") {
        return void 0;
      }
      const target = this.get(path);
      if (!Array.isArray(target)) {
        return void 0;
      }
      if (path === "attendees") {
        const payload = data2 && typeof data2 === "object" ? data2 : {};
        const nextId = target.reduce((maxId, row) => {
          const parsedId = Number(row == null ? void 0 : row.id);
          if (!Number.isFinite(parsedId)) {
            return maxId;
          }
          return Math.max(maxId, parsedId);
        }, 0) + 1;
        const createdRow = {
          "id": nextId,
          "first-n": String((_b = (_a = payload["first-n"]) != null ? _a : payload.first) != null ? _b : "").trim(),
          "last-n": String((_d = (_c = payload["last-n"]) != null ? _c : payload.last) != null ? _d : "").trim(),
          "email": String((_e = payload.email) != null ? _e : "").trim(),
          "WP-id": -1,
          "t_hours": 0,
          "t_ceus": 0,
          "number": String((_h = (_g = (_f = payload.number) != null ? _f : payload.ph_number) != null ? _g : payload.phone) != null ? _h : "").trim()
        };
        target.push(createdRow);
        return createdRow;
      }
      target.push(data2);
      return data2;
    }
    // search is optional, use like get(a) or get(a, b)
    static get(path, search) {
      if (typeof path !== "string" || path.trim() === "") {
        return void 0;
      }
      const value = path.split(".").reduce((currentValue, key) => {
        if (currentValue === null || currentValue === void 0) {
          return void 0;
        }
        return currentValue[key];
      }, this.data);
      if (path !== "attendees" || !Array.isArray(value)) {
        return value;
      }
      const query = String(search != null ? search : "").trim().toLowerCase();
      if (query === "") {
        return value;
      }
      return value.filter((attendee) => {
        var _a, _b;
        const firstName = String((_a = attendee == null ? void 0 : attendee["first-n"]) != null ? _a : "").toLowerCase();
        const lastName = String((_b = attendee == null ? void 0 : attendee["last-n"]) != null ? _b : "").toLowerCase();
        return firstName.includes(query) || lastName.includes(query);
      });
    }
  };
  __publicField(data, "data", {
    "attendees": [
      {
        "id": 1,
        "first-n": "Judah",
        "last-n": "Nava",
        "email": "example@example.com",
        "WP-id": 404,
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
  });

  // js/attendee-table/event-hookups.js
  function event_hookups() {
    {
      const datas = data.get("attendees");
      if (!Array.isArray(datas)) return;
      if (datas.length !== 0) load_Attendees_Table(datas);
      document.querySelectorAll(".link_account_btn").forEach((button) => {
        button.addEventListener("click", () => link_account_btn($(button)));
      });
    }
    const new_member_modal = $(".pdt-add-new-member");
    const new_member_modal_wrapper = $("#pdt-modal-wrapper-for-add-new-member");
    const registered_modal = $(".pdt-presenter-check");
    const registered_modal_wrapper = $("#pdt-modal-wrapper-for-registered-presenter");
    {
      $("#pdt-add-member").on("click", function() {
        new_member_modal.prop("hidden", false);
        new_member_modal_wrapper.prop("hidden", false);
      });
      new_member_modal_wrapper.on("click", function(event) {
        if (event.target !== this) {
          return;
        }
        new_member_modal.prop("hidden", true);
        new_member_modal_wrapper.prop("hidden", true);
      });
      $("#pdt-is-presenter-btn").on("click", function() {
        registered_modal.prop("hidden", false);
        registered_modal_wrapper.prop("hidden", false);
        new_member_modal.prop("hidden", true);
        new_member_modal_wrapper.prop("hidden", true);
      });
      $("#pdt-new-member-cancel").click(function(e) {
        e.preventDefault();
        new_member_modal.prop("hidden", true);
        new_member_modal_wrapper.prop("hidden", true);
      });
      $("#pdt-new-member-submit").click(function() {
        var _a, _b, _c, _d;
        let f_name = String((_a = $("#pdt-f_name").val()) != null ? _a : "").trim();
        let l_name = String((_b = $("#pdt-l_name").val()) != null ? _b : "").trim();
        let email = String((_c = $("#pdt-email").val()) != null ? _c : "").trim();
        let ph_number = String((_d = $("#pdt-ph_number").val()) != null ? _d : "").trim();
        const errors = [];
        const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phone_pattern = /^\+?[0-9()\-\s.]{7,20}$/;
        if (l_name === "") {
          errors.push("Last name is required.");
        }
        if (email === "" || !email_pattern.test(email)) {
          errors.push("A valid email is required.");
        }
        if (ph_number !== "") {
          const digit_count = ph_number.replace(/\D/g, "").length;
          if (!phone_pattern.test(ph_number) || digit_count < 7) {
            errors.push("Phone number is invalid.");
          }
        }
        if (errors.length > 0) {
          alert(`Form data is incorrect:
- ${errors.join("\n- ")}`);
          return;
        }
        data.post("attendees", { "first-n": f_name, "last-n": l_name, "email": email, "number": ph_number });
        load_Attendees_Table(data.get("attendees"));
        $("#pdt-f_name").val("");
        $("#pdt-l_name").val("");
        $("#pdt-email").val("");
        $("#pdt-ph_number").val("");
        new_member_modal.prop("hidden", true);
        new_member_modal_wrapper.prop("hidden", true);
      });
    }
    {
      $("#pdt-registered-cancel").click(function() {
        new_member_modal.prop("hidden", false);
        new_member_modal_wrapper.prop("hidden", false);
        registered_modal.prop("hidden", true);
        registered_modal_wrapper.prop("hidden", true);
      });
      let presenterSearchCooldown;
      let selectedPresenterId = -1;
      $("#pdt-p_name").keyup(function(e) {
        let value = $(this).val();
        let dropdown = $("#pdt-presenter-options");
        selectedPresenterId = -1;
        dropdown.empty().prop("hidden", true);
        clearTimeout(presenterSearchCooldown);
        presenterSearchCooldown = setTimeout(function() {
          let results = data.get("attendees", value);
          if (!Array.isArray(results) || value.trim() === "") {
            return;
          }
          if (results.length === 0) {
            dropdown.append('<button type="button" class="pdt-presenter-option" data-id="-1">No Results</button>');
            dropdown.prop("hidden", false);
            return;
          }
          for (const result of results) {
            let fullName = `${result["first-n"]} ${result["last-n"]}`.trim();
            let option = `<button type="button" class="pdt-presenter-option" data-id="${result.id}" data-name="${fullName}">${fullName}</button>`;
            dropdown.append(option);
          }
          dropdown.prop("hidden", false);
        }, 300);
      });
      $("#pdt-presenter-options").on("click", ".pdt-presenter-option", function() {
        var _a, _b;
        selectedPresenterId = Number((_a = $(this).attr("data-id")) != null ? _a : -1);
        if (selectedPresenterId === -1) {
          return;
        }
        const selectedName = String((_b = $(this).attr("data-name")) != null ? _b : "");
        $("#pdt-p_name").val(selectedName);
        $("#pdt-presenter-options").empty().prop("hidden", true);
      });
    }
    const linkARMemerModal = $("#pdt-link-armember");
    {
      $("#pdt-link-armember-btn").click(function() {
        linkARMemerModal.prop("hidden", true);
      });
    }
  }
  function load_Attendees_Table(datas) {
    const table_body = $("#pdt-attendee-table tbody");
    table_body.empty();
    for (const row_data of datas) {
      let state = "Link Account";
      let wpId = Number(row_data["WP-id"]);
      if (wpId !== -1) {
        state = "WP #" + row_data["WP-id"];
      }
      let row = `
                <tr class="pdt-attendee-table__row">
                            <td class="pdt-attendee-table__cell">${row_data["first-n"]}</td>
                            <td class="pdt-attendee-table__cell">${row_data["last-n"]}</td>
                            <td class="pdt-attendee-table__cell">${row_data["email"]}</td>
                            <td class="pdt-attendee-table__cell">
                                <button data-id=${row_data["id"]} class="pdt-attendee-table__link-button link_account_btn pdt-button" type="button">${state}</button>
                            </td>
                            <td class="pdt-attendee-table__cell">${row_data["t_hours"]}</td>
                            <td class="pdt-attendee-table__cell">${row_data["t_ceus"]}</td>
                        </tr>
            `;
      table_body.append(row);
    }
  }
  function link_account_btn(button) {
    let person = button.data("id");
    console.log(person);
    $("#pdt-link-armember").prop("hidden", false);
  }

  // js/attendee-table.js
  if (typeof window.jQuery === "undefined") {
    console.error("PDT: jQuery is required for pdt-attendee-table.js");
  } else {
    window.$ = window.jQuery;
    $(document).ready(function() {
      "use strict";
      console.log("loading up event hookup.");
      event_hookups();
    });
  }
})();
//# sourceMappingURL=attendee-table.js.map
