(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // js/attendee-page/from-endpoint.js
  var data = class {
    static get(path) {
      if (typeof path !== "string" || path.trim() === "") {
        return void 0;
      }
      return path.split(".").reduce((currentValue, key) => {
        if (currentValue === null || currentValue === void 0) {
          return void 0;
        }
        return currentValue[key];
      }, this.data);
    }
    static set(path, value) {
      if (typeof path !== "string" || path.trim() === "") {
        return false;
      }
      const keys = path.split(".");
      if (keys.some((key) => key.trim() === "")) {
        return false;
      }
      let target = this.data;
      for (let i = 0; i < keys.length - 1; i += 1) {
        const key = keys[i];
        const currentValue = target[key];
        if (currentValue === null || currentValue === void 0) {
          target[key] = {};
        } else if (typeof currentValue !== "object" || Array.isArray(currentValue)) {
          return false;
        }
        target = target[key];
      }
      const lastKey = keys[keys.length - 1];
      let normalizedValue = value;
      if (lastKey === "admin_service") {
        normalizedValue = this.assignMissingAdminServiceOgIds(value);
      }
      target[lastKey] = normalizedValue;
      return true;
    }
    static assignMissingAdminServiceOgIds(value) {
      if (!Array.isArray(value)) {
        return value;
      }
      const rows = value.map((row) => ({ ...row }));
      const usedOgIds = /* @__PURE__ */ new Set();
      let nextId = 1;
      rows.forEach((row) => {
        var _a;
        const ogId = String((_a = row == null ? void 0 : row.og_id) != null ? _a : "").trim();
        if (ogId === "") {
          return;
        }
        usedOgIds.add(ogId);
        const parsed = Number.parseInt(ogId, 10);
        if (Number.isFinite(parsed)) {
          nextId = Math.max(nextId, parsed + 1);
        }
      });
      return rows.map((row) => {
        var _a;
        const nextRow = { ...row };
        const ogId = String((_a = nextRow == null ? void 0 : nextRow.og_id) != null ? _a : "").trim();
        if (ogId !== "") {
          return nextRow;
        }
        while (usedOgIds.has(String(nextId))) {
          nextId += 1;
        }
        nextRow.og_id = String(nextId);
        usedOgIds.add(String(nextId));
        nextId += 1;
        return nextRow;
      });
    }
    static normalizeSessionType(value) {
      const normalized = String(value || "").trim().toLowerCase();
      if (normalized === "workshops") {
        return "workshop";
      }
      if (normalized === "confrence") {
        return "conference";
      }
      return normalized;
    }
    static querySessions(filters = {}) {
      const sessions = this.get("sessions");
      if (!Array.isArray(sessions)) {
        return [];
      }
      const searchText = String(filters.searchText || "").trim().toLowerCase();
      const selectedType = this.normalizeSessionType(filters.selectedType || "all");
      return sessions.filter((session) => {
        const sessionType = this.normalizeSessionType(session.type);
        const matchesType = selectedType === "all" || sessionType === selectedType;
        if (!matchesType) {
          return false;
        }
        if (searchText === "") {
          return true;
        }
        const searchableText = [
          session.session_title,
          session.type
        ].map((value) => String(value || "").toLowerCase());
        return searchableText.some((value) => value.includes(searchText));
      });
    }
  };
  __publicField(data, "data", {
    //No keys are allowed to have a '.' in them.
    "contact": {
      "first": "John",
      "last": "Doe",
      "email": "email@email.com",
      "number": "123-123-1234"
    },
    "summary": {
      "total-hours": 1.5,
      "recent_session": "A New Way to Teach ASL Literature",
      "recent_session_date": "2024-06-01",
      "train-n-conf": [1, 3, 4, 7, 9, 11, 14, 16, 18, 20],
      "admin-service": [1, 2, 5, 8, 12, 15, 19, 23, 27, 30]
    },
    "sessions": [
      {
        "date": "not started",
        "session_title": "A New Way to Teach ASL Literature",
        "type": "Workshop",
        "hours": "1.5h",
        "ceu_capable": "Yes",
        "ceu_weight": "1.50",
        "rid_qualified": "Yes",
        "rid_submission": "2000-01-01",
        "parent_event": "Summer Institute",
        "event_type": "Training",
        "flags": "General | PPO | Advanced",
        "comment": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui earum nostrum esse iste, reprehenderit veniam repudiandae error deleniti natus officia labore libero animi repellat perferendis deserunt omnis odit non aliquid. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia eum repudiandae repellendus. Unde ipsum ab tempora. Quisquam reiciendis repellat numquam corporis ex fuga ad, temporibus fugiat voluptatibus, eius repudiandae modi!"
      },
      {
        "date": "2023-11-14",
        "session_title": "Language Access in Practice",
        "type": "Training",
        "hours": "1.0h",
        "ceu_capable": "Yes",
        "ceu_weight": "1.00",
        "rid_qualified": "No",
        "rid_submission": "Not Relevant",
        "parent_event": "Regional Forum",
        "event_type": "Conference",
        "flags": "No Flags",
        "comment": "No comment"
      },
      {
        "date": "2000-01-01 to 2000-02-01",
        "session_title": "Interpreter Ethics Review",
        "type": "Confrence",
        "hours": "2.0h",
        "ceu_capable": "Yes",
        "ceu_weight": "2.00",
        "rid_qualified": "Yes",
        "rid_submission": "Not Submitted",
        "parent_event": "Ethics Series",
        "event_type": "Training",
        "flags": "No Flags",
        "comment": "No comment"
      },
      {
        "date": "2000-01-01 to ongoing",
        "session_title": "Community Outreach Basics",
        "type": "Roundtable",
        "hours": "0.5h",
        "ceu_capable": "No",
        "ceu_weight": "0.00",
        "rid_qualified": "No",
        "rid_submission": "Not Relevant",
        "parent_event": "Volunteer Day",
        "event_type": "Workshop",
        "flags": "No Flags",
        "comment": "No comment"
      },
      {
        "date": "not started",
        "session_title": "Digital Tools for ASL Classrooms",
        "type": "Workshops",
        "hours": "1.2h",
        "ceu_capable": "Yes",
        "ceu_weight": "1.20",
        "rid_qualified": "Yes",
        "rid_submission": "2000-01-01",
        "parent_event": "Fall Summit",
        "event_type": "Conference",
        "flags": "No Flags",
        "comment": "No comment"
      }
    ],
    "admin_service": [
      {
        "og_id": "2",
        "tmp_id": "2",
        "start": "2024-01-15",
        "end": "2024-03-15",
        "type": "Board Member",
        "ceu_wei": "0.50"
      },
      {
        "og_id": "3",
        "tmp_id": "2",
        "start": "2023-06-01",
        "end": "2023-08-31",
        "type": "Committee Chair",
        "ceu_wei": "0.75"
      },
      {
        "og_id": "4",
        "tmp_id": "2",
        "start": "2022-09-10",
        "end": "2022-12-20",
        "type": "Mentorship Lead",
        "ceu_wei": "0.40"
      },
      {
        "og_id": "5",
        "tmp_id": "2",
        "start": "2021-02-05",
        "end": "2021-05-28",
        "type": "Workshop Coordinator",
        "ceu_wei": "0.60"
      },
      {
        "og_id": "6",
        "tmp_id": "2",
        "start": "2020-10-01",
        "end": "2020-12-18",
        "type": "Advisory Panel",
        "ceu_wei": "0.30"
      }
    ],
    // This is only here for refrence, 
    "admin_service_deleted_ogs": [
      /* if any og rows were deleted, their id's are stored here.*/
    ]
  });

  // js/attendee-page/event-hookups.js
  function event_hookups() {
    var _a, _b, _c, _d;
    const editPersonBtn = document.getElementById("pdt-edit-person-btn");
    if (!editPersonBtn) {
      console.error("can't connect pdt-edit-person-btn");
    } else {
      editPersonBtn.addEventListener("click", () => {
        editPersonBtn_f(editPersonBtn);
      });
    }
    const adminServiceBtn = document.getElementById("pdt-admin-service-btn");
    const yearsSpan = document.getElementById("pdt-years");
    yearsSpan.textContent = 1;
    const totalHoursSpan = document.getElementById("pdt-total-hours");
    totalHoursSpan.textContent = data.get("summary.total-hours");
    const recentSessionSpan = document.getElementById("pdt-recent_session");
    recentSessionSpan.textContent = data.get("summary.recent_session");
    const recentSessionDateSpan = document.getElementById("pdt-recent_session_date");
    recentSessionDateSpan.textContent = data.get("summary.recent_session_date");
    const ceuTotalSpan = document.getElementById("pdt-ceu-total");
    ceuTotalSpan.textContent = data.get("summary.train-n-conf")[0] + data.get("summary.admin-service")[0];
    const ceuTrainConfSpan = document.getElementById("pdt-ceu-trainConf");
    ceuTrainConfSpan.textContent = data.get("summary.train-n-conf")[0];
    const ceuAdminServSpan = document.getElementById("pdt-ceu-adminServ");
    ceuAdminServSpan.textContent = data.get("summary.admin-service")[0];
    const slider = document.getElementById("pdt-progress-years");
    slider.value = 1;
    slider.addEventListener("input", (e) => {
      onYearsUpdated(ceuTotalSpan, ceuTrainConfSpan, ceuAdminServSpan, Number(e.target.value));
      yearsSpan.textContent = Number(e.target.value);
    });
    const filterState = {
      searchText: "",
      selectedType: "all"
    };
    const exportReport = document.getElementById("pdt-export-report");
    wireExportReport(exportReport);
    const searchInput = document.getElementById("pdt-session-search");
    const allFilterBtn = document.getElementById("pdt-all-button");
    const workshopsFilterBtn = document.getElementById("pdt-workshops-button");
    const trainingFilterBtn = document.getElementById("pdt-trainig-button");
    const conferenceFilterBtn = document.getElementById("pdt-confrence-button");
    const filterButtons = {
      all: allFilterBtn,
      workshop: workshopsFilterBtn,
      training: trainingFilterBtn,
      conference: conferenceFilterBtn
    };
    wireSessionFilters(searchInput, filterButtons, filterState);
    refreshSessionsTable(filterState, filterButtons);
    {
      const editPersonModal = document.getElementById("pdt-edit-person-modal");
      if (!editPersonModal) {
        console.error("can't connect pdt-edit-person-modal");
        return;
      }
      const f_name_text = document.getElementById("pdt-f_name");
      if (!f_name_text) {
        console.error("can't connect pdt-f_name");
      } else {
        f_name_text.value = String((_a = data.get("contact.first")) != null ? _a : "");
      }
      const l_name_text = document.getElementById("pdt-l_name");
      if (!l_name_text) {
        console.error("can't connect pdt-l_name");
      } else {
        l_name_text.value = String((_b = data.get("contact.last")) != null ? _b : "");
      }
      const email_text = document.getElementById("pdt-email");
      if (!email_text) {
        console.error("can't connect pdt-email");
      } else {
        email_text.value = String((_c = data.get("contact.email")) != null ? _c : "");
      }
      const number_text = document.getElementById("pdt-number");
      if (!number_text) {
        console.error("can't conncet pdt-number");
      } else {
        number_text.value = String((_d = data.get("contact.number")) != null ? _d : "");
      }
      const editPersonCancelBtn = document.getElementById("pdt-edit-person-cancel");
      if (!editPersonCancelBtn) {
        console.error("can't connect pdt-edit-person-cancel");
      } else {
        editPersonCancelBtn.addEventListener("click", () => {
          editPersonModal.hidden = true;
        });
      }
      editPersonModal.addEventListener("click", (event) => {
        if (event.target !== editPersonModal) {
          return;
        }
        editPersonModal.hidden = true;
      });
      const editPersonSaveBtn = document.getElementById("pdt-edit-person-save");
      if (!editPersonSaveBtn) {
        console.error("can't connect pdt-edit-person-save");
      } else {
        editPersonSaveBtn.addEventListener("click", () => {
          if (!f_name_text || !l_name_text || !email_text || !number_text) {
            console.error("missing one or more edit-person inputs");
            return;
          }
          const person_contact = {
            first: f_name_text.value,
            last: l_name_text.value,
            email: email_text.value,
            number: number_text.value
          };
          data.set("contact", person_contact);
          document.getElementById("pdt-full-name").textContent = f_name_text.value + " " + l_name_text.value;
          document.getElementById("pdt-page-email").textContent = email_text.value;
          document.getElementById("pdt-page-number").textContent = number_text.value;
          editPersonModal.hidden = true;
        });
      }
    }
    {
      const admin_service_window = document.getElementById("pdt-admin-service-modal");
      const admin_service_tbody = admin_service_window == null ? void 0 : admin_service_window.querySelector("table tbody");
      const admin_start_input = document.getElementById("admin_start");
      const admin_end_input = document.getElementById("admin_end");
      const admin_type_input = document.getElementById("admin_type");
      const admin_ceuw_input = document.getElementById("admin_ceuw");
      const add_admin_service_row = document.getElementById("pst-add-admin-service-row");
      const admin_service_cancel = document.getElementById("pdt-admin-service-cancel");
      const admin_service_save = document.getElementById("pdt-admin-service-save");
      const add_row = add_admin_service_row == null ? void 0 : add_admin_service_row.closest("tr");
      let admin_service_data = [];
      const admin_service_deleted_ogs = [];
      let next_tmp_id = 1;
      if (!admin_service_window || !admin_service_tbody || !add_row) {
        console.error("can't connect admin service modal/table");
        return;
      }
      if (!admin_start_input || !admin_end_input || !admin_type_input || !admin_ceuw_input) {
        console.error("can't connect admin service inputs");
        return;
      }
      if (!add_admin_service_row) {
        console.error("can't connect pst-add-admin-service-row");
        return;
      }
      if (!admin_service_cancel) {
        console.error("can't connect pdt-admin-service-cancel");
        return;
      }
      if (!admin_service_save) {
        console.error("can't connect pdt-admin-service-save");
        return;
      }
      if (!adminServiceBtn) {
        console.error("can't connect pdt-admin-service-btn");
      } else {
        adminServiceBtn.addEventListener("click", () => {
          admin_service_data = normalizeAdminServiceTmpIds(cloneAdminServiceRows(data.get("admin_service")));
          admin_service_deleted_ogs.length = 0;
          next_tmp_id = computeNextTmpId(admin_service_data);
          renderAdminServiceTable(admin_service_tbody, add_row, admin_service_data);
          admin_service_window.hidden = false;
        });
      }
      admin_service_window.addEventListener("click", (event) => {
        if (event.target !== admin_service_window) {
          return;
        }
        admin_service_window.hidden = true;
        admin_service_deleted_ogs.length = 0;
      });
      admin_service_cancel.addEventListener("click", () => {
        admin_service_window.hidden = true;
        admin_service_deleted_ogs.length = 0;
      });
      admin_service_save.addEventListener("click", () => {
        data.set("admin_service", cloneAdminServiceRows(admin_service_data));
        data.set("admin_service_deleted_ogs", mergeDeletedIds(data.get("admin_service_deleted_ogs"), admin_service_deleted_ogs));
        admin_service_window.hidden = true;
        admin_service_deleted_ogs.length = 0;
      });
      add_admin_service_row.addEventListener("click", () => {
        const nextRow = readAdminServiceInputs(admin_start_input, admin_end_input, admin_type_input, admin_ceuw_input);
        const validationError = validateAdminServiceRow(nextRow);
        if (validationError) {
          console.error(validationError);
          return;
        }
        admin_service_data.push({
          og_id: null,
          tmp_id: String(next_tmp_id),
          start: nextRow.start,
          end: nextRow.end,
          type: nextRow.type,
          ceu_wei: nextRow.ceu_wei
        });
        next_tmp_id += 1;
        renderAdminServiceTable(admin_service_tbody, add_row, admin_service_data);
        clearAdminServiceInputs(admin_start_input, admin_end_input, admin_type_input, admin_ceuw_input);
      });
      admin_service_tbody.addEventListener("click", (event) => {
        const deleteBtn = event.target.closest("[data-action='delete-admin-service']");
        if (!deleteBtn) {
          return;
        }
        const rowTmpId = String(deleteBtn.dataset.tmpId || "");
        if (!rowTmpId) {
          return;
        }
        const index = admin_service_data.findIndex((row) => String(row.tmp_id) === rowTmpId);
        if (index < 0) {
          return;
        }
        const [removedRow] = admin_service_data.splice(index, 1);
        const removedOgId = removedRow == null ? void 0 : removedRow.og_id;
        if (removedOgId !== null && removedOgId !== void 0 && String(removedOgId).trim() !== "") {
          const normalizedOgId = String(removedOgId);
          if (!admin_service_deleted_ogs.includes(normalizedOgId)) {
            admin_service_deleted_ogs.push(normalizedOgId);
          }
        }
        renderAdminServiceTable(admin_service_tbody, add_row, admin_service_data);
      });
      renderAdminServiceTable(admin_service_tbody, add_row, []);
      {
        const debugAdminServiceBtn = document.getElementById("debug-admin-service");
        if (!debugAdminServiceBtn) {
          console.error("can't connect debug-admin-service");
        } else {
          debugAdminServiceBtn.addEventListener("click", () => {
            const cacheSnapshot = cloneAdminServiceRows(admin_service_data);
            const dataSnapshot = cloneAdminServiceRows(data.get("admin_service"));
            const deletedSnapshot = [...admin_service_deleted_ogs];
            console.group("Debug Admin Service");
            console.log("cache (admin_service_data):", cacheSnapshot);
            console.log("data.get('admin_service'):", dataSnapshot);
            console.log("pending admin_service_deleted_ogs:", deletedSnapshot);
            console.groupEnd();
          });
        }
      }
    }
  }
  function editPersonBtn_f(button) {
    const editPersonModal = document.getElementById("pdt-edit-person-modal");
    if (!editPersonModal) {
      console.error("can't connect pdt-edit-person-modal");
      return;
    }
    editPersonModal.hidden = false;
  }
  function onYearsUpdated(ceuTotal, ceuTrainConf, ceuAdminServ, value) {
    ceuTotal.textContent = data.get("summary.train-n-conf")[value - 1] + data.get("summary.admin-service")[value - 1];
    ceuTrainConf.textContent = data.get("summary.train-n-conf")[value - 1];
    ceuAdminServ.textContent = data.get("summary.admin-service")[value - 1];
  }
  function wireSessionFilters(searchInput, filterButtons, filterState) {
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        filterState.searchText = event.target.value || "";
        refreshSessionsTable(filterState, filterButtons);
      });
    }
    attachFilterClick(filterButtons.all, "all", filterState, filterButtons);
    attachFilterClick(filterButtons.workshop, "workshop", filterState, filterButtons);
    attachFilterClick(filterButtons.training, "training", filterState, filterButtons);
    attachFilterClick(filterButtons.conference, "conference", filterState, filterButtons);
  }
  function attachFilterClick(button, nextType, filterState, filterButtons) {
    if (!button) {
      return;
    }
    button.addEventListener("click", () => {
      filterState.selectedType = nextType;
      refreshSessionsTable(filterState, filterButtons);
    });
  }
  function refreshSessionsTable(filterState, filterButtons) {
    const allSessions = data.get("sessions");
    const filteredSessions = data.querySessions(filterState);
    markActiveFilterButton(filterButtons, filterState.selectedType);
    renderSessionsTable(filteredSessions, {
      hasBaseData: Array.isArray(allSessions) && allSessions.length > 0
    });
  }
  function markActiveFilterButton(filterButtons, selectedType) {
    if (!filterButtons) {
      return;
    }
    const normalizedSelectedType = data.normalizeSessionType(selectedType);
    Object.entries(filterButtons).forEach(([typeKey, button]) => {
      if (!button) {
        return;
      }
      const isActive = data.normalizeSessionType(typeKey) === normalizedSelectedType;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }
  function renderSessionsTable(sessions, options = {}) {
    const { hasBaseData = false } = options;
    const sessionsTable = document.getElementById("pdt-session-table");
    if (!sessionsTable) {
      console.error("can't connect #pdt-session-table");
      return;
    }
    const sessionsTableBody = sessionsTable.querySelector("tbody");
    if (!sessionsTableBody) {
      console.error("can't connect #pdt-session-table tbody");
      return;
    }
    sessionsTableBody.innerHTML = "";
    if (!Array.isArray(sessions) || sessions.length === 0) {
      const emptyMessage = hasBaseData ? "No sessions match your filters" : "No Session Data Found";
      renderNoSessionsRow(sessionsTableBody, emptyMessage);
      return;
    }
    const fragment = document.createDocumentFragment();
    sessions.forEach((session) => {
      const sessionRow = document.createElement("tr");
      sessionRow.className = "pdt-session-table__row";
      appendCell(sessionRow, session.date);
      appendCell(sessionRow, session.session_title);
      appendTypeCell(sessionRow, session.type);
      appendCell(sessionRow, session.hours);
      appendCell(sessionRow, session.ceu_capable);
      appendCell(sessionRow, session.ceu_weight);
      appendCell(sessionRow, session.rid_qualified);
      appendCell(sessionRow, session.rid_submission);
      appendCell(sessionRow, session.parent_event);
      appendCell(sessionRow, session.event_type);
      const controlsCell = document.createElement("td");
      const hasExpansion = Boolean(session.flags || session.comment);
      if (hasExpansion) {
        const expandBtn = document.createElement("button");
        expandBtn.type = "button";
        expandBtn.textContent = "Expand";
        controlsCell.appendChild(expandBtn);
        sessionRow.appendChild(controlsCell);
        fragment.appendChild(sessionRow);
        const expansionRow = createExpansionRow(session);
        fragment.appendChild(expansionRow);
        expandBtn.addEventListener("click", () => {
          const isOpen = expansionRow.style.display === "table-row";
          expansionRow.style.display = isOpen ? "none" : "table-row";
          expandBtn.textContent = isOpen ? "Expand" : "Hide";
        });
      } else {
        controlsCell.textContent = "-";
        sessionRow.appendChild(controlsCell);
        fragment.appendChild(sessionRow);
      }
    });
    sessionsTableBody.appendChild(fragment);
  }
  function renderNoSessionsRow(tableBody, message) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    const text = document.createElement("p");
    cell.colSpan = 11;
    text.textContent = message;
    cell.appendChild(text);
    row.appendChild(cell);
    tableBody.appendChild(row);
  }
  function appendCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = formatCellValue(value);
    row.appendChild(cell);
  }
  function appendTypeCell(row, value) {
    const cell = document.createElement("td");
    const typeDiv = document.createElement("div");
    typeDiv.className = "pdt-session-table__type";
    typeDiv.textContent = formatCellValue(value);
    cell.appendChild(typeDiv);
    row.appendChild(cell);
  }
  function createExpansionRow(session) {
    const expansionRow = document.createElement("tr");
    const cell = document.createElement("td");
    const wrapper = document.createElement("div");
    const flagsDiv = document.createElement("div");
    const flagsSpan = document.createElement("span");
    const commentDiv = document.createElement("div");
    expansionRow.style.display = "none";
    cell.colSpan = 11;
    wrapper.className = "pdt-session-table__expansion";
    flagsDiv.className = "pdt-flags";
    commentDiv.className = "pdt-comment";
    flagsSpan.textContent = formatCellValue(session.flags);
    commentDiv.textContent = formatCellValue(session.comment);
    flagsDiv.appendChild(flagsSpan);
    wrapper.appendChild(flagsDiv);
    wrapper.appendChild(commentDiv);
    cell.appendChild(wrapper);
    expansionRow.appendChild(cell);
    return expansionRow;
  }
  function formatCellValue(value) {
    if (value === null || value === void 0 || value === "") {
      return "-";
    }
    return String(value);
  }
  function wireExportReport(exportReportButton) {
    if (!exportReportButton) {
      console.error("can't connect pdt-export-report");
      return;
    }
    exportReportButton.addEventListener("click", () => {
      const sessions = data.get("sessions");
      const adminService = data.get("admin_service");
      exportAttendeePageCsv(sessions, adminService);
    });
  }
  function exportAttendeePageCsv(sessionsData, adminServiceData) {
    const csvParts = [
      buildSessionsCsv(sessionsData),
      "",
      buildAdminServiceCsv(adminServiceData)
    ];
    const csvText = csvParts.join("\n");
    const csvBlob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const csvUrl = URL.createObjectURL(csvBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = csvUrl;
    downloadLink.download = "attendee-report.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(csvUrl);
  }
  function buildSessionsCsv(sessionsData) {
    const safeSessions = Array.isArray(sessionsData) ? sessionsData : [];
    const rows = [
      ["Training and Conference History"],
      ["Date", "Session Title", "Type", "Hours", "CEU Capable", "CEU Weight", "RID Qualified", "When RID Submission?", "Parent Event", "Event Type", "Flags", "Comment"]
    ];
    safeSessions.forEach((session) => {
      rows.push([
        session.date,
        session.session_title,
        session.type,
        session.hours,
        session.ceu_capable,
        session.ceu_weight,
        session.rid_qualified,
        session.rid_submission,
        session.parent_event,
        session.event_type,
        session.flags,
        session.comment
      ]);
    });
    return rows.map(formatCsvRow).join("\n");
  }
  function buildAdminServiceCsv(adminServiceData) {
    const safeAdminService = Array.isArray(adminServiceData) ? adminServiceData : [];
    const rows = [
      ["Administrative Service"],
      ["Start", "End", "Type", "CEU Weight"]
    ];
    safeAdminService.forEach((row) => {
      rows.push([
        row.start,
        row.end,
        row.type,
        row.ceu_wei
      ]);
    });
    return rows.map(formatCsvRow).join("\n");
  }
  function formatCsvRow(rowValues) {
    return rowValues.map(formatCsvCell).join(",");
  }
  function formatCsvCell(value) {
    const text = String(value != null ? value : "");
    const escapedText = text.replaceAll('"', '""');
    return `"${escapedText}"`;
  }
  function cloneAdminServiceRows(rows) {
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows.map((row) => ({ ...row }));
  }
  function normalizeAdminServiceTmpIds(rows) {
    const safeRows = Array.isArray(rows) ? rows : [];
    const usedTmpIds = /* @__PURE__ */ new Set();
    let nextId = 1;
    return safeRows.map((row) => {
      var _a;
      const nextRow = { ...row };
      const candidate = String((_a = nextRow.tmp_id) != null ? _a : "").trim();
      if (candidate !== "" && !usedTmpIds.has(candidate)) {
        usedTmpIds.add(candidate);
        const parsed = Number.parseInt(candidate, 10);
        if (Number.isFinite(parsed)) {
          nextId = Math.max(nextId, parsed + 1);
        }
        return nextRow;
      }
      while (usedTmpIds.has(String(nextId))) {
        nextId += 1;
      }
      nextRow.tmp_id = String(nextId);
      usedTmpIds.add(String(nextId));
      nextId += 1;
      return nextRow;
    });
  }
  function computeNextTmpId(rows) {
    const safeRows = Array.isArray(rows) ? rows : [];
    const maxId = safeRows.reduce((highest, row) => {
      var _a;
      const current = Number.parseInt(String((_a = row == null ? void 0 : row.tmp_id) != null ? _a : ""), 10);
      if (!Number.isFinite(current)) {
        return highest;
      }
      return Math.max(highest, current);
    }, 0);
    return maxId + 1;
  }
  function renderAdminServiceTable(tableBody, addRow, rows) {
    if (!tableBody || !addRow) {
      return;
    }
    tableBody.replaceChildren(addRow);
    if (!Array.isArray(rows) || rows.length === 0) {
      const emptyRow = document.createElement("tr");
      const emptyCell = document.createElement("td");
      const emptyText = document.createElement("small");
      emptyCell.colSpan = 5;
      emptyText.textContent = "No administrative service entries found.";
      emptyCell.appendChild(emptyText);
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
      return;
    }
    const fragment = document.createDocumentFragment();
    rows.forEach((row) => {
      fragment.appendChild(buildAdminServiceDataRow(row));
    });
    tableBody.appendChild(fragment);
  }
  function buildAdminServiceDataRow(row) {
    var _a;
    const tableRow = document.createElement("tr");
    const startCell = document.createElement("td");
    const endCell = document.createElement("td");
    const typeCell = document.createElement("td");
    const ceuCell = document.createElement("td");
    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    startCell.textContent = formatCellValue(row == null ? void 0 : row.start);
    endCell.textContent = formatCellValue(row == null ? void 0 : row.end);
    typeCell.textContent = formatCellValue(row == null ? void 0 : row.type);
    ceuCell.textContent = formatCellValue(row == null ? void 0 : row.ceu_wei);
    deleteBtn.type = "button";
    deleteBtn.textContent = "X";
    deleteBtn.dataset.action = "delete-admin-service";
    deleteBtn.dataset.tmpId = String((_a = row == null ? void 0 : row.tmp_id) != null ? _a : "");
    deleteCell.appendChild(deleteBtn);
    tableRow.appendChild(startCell);
    tableRow.appendChild(endCell);
    tableRow.appendChild(typeCell);
    tableRow.appendChild(ceuCell);
    tableRow.appendChild(deleteCell);
    return tableRow;
  }
  function readAdminServiceInputs(startInput, endInput, typeInput, ceuWeightInput) {
    var _a, _b;
    const selectedTypeText = ((_b = (_a = typeInput == null ? void 0 : typeInput.options) == null ? void 0 : _a[typeInput.selectedIndex]) == null ? void 0 : _b.text) || "";
    return {
      start: String((startInput == null ? void 0 : startInput.value) || "").trim(),
      end: String((endInput == null ? void 0 : endInput.value) || "").trim(),
      type: selectedTypeText.trim(),
      ceu_wei: String((ceuWeightInput == null ? void 0 : ceuWeightInput.value) || "").trim()
    };
  }
  function validateAdminServiceRow(row) {
    if (!row.start || !row.end || !row.type || !row.ceu_wei) {
      return "admin service row is missing one or more required values";
    }
    if (row.type === "Select type") {
      return "please choose an admin service type";
    }
    const startTime = Date.parse(row.start);
    const endTime = Date.parse(row.end);
    if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
      return "admin service row contains invalid date values";
    }
    if (endTime < startTime) {
      return "admin service end date cannot be before start date";
    }
    const ceuWeight = Number.parseFloat(row.ceu_wei);
    if (!Number.isFinite(ceuWeight) || ceuWeight < 0) {
      return "admin service CEU weight must be a non-negative number";
    }
    row.ceu_wei = ceuWeight.toFixed(2);
    return "";
  }
  function clearAdminServiceInputs(startInput, endInput, typeInput, ceuWeightInput) {
    startInput.value = "";
    endInput.value = "";
    typeInput.value = "";
    ceuWeightInput.value = "";
  }
  function mergeDeletedIds(existingDeletedIds, pendingDeletedIds) {
    const existing = Array.isArray(existingDeletedIds) ? existingDeletedIds.map((id) => String(id)) : [];
    const pending = Array.isArray(pendingDeletedIds) ? pendingDeletedIds.map((id) => String(id)) : [];
    return Array.from(/* @__PURE__ */ new Set([...existing, ...pending]));
  }

  // js/attendee-page.js
  (function() {
    "use strict";
    const jq = window.jQuery || window.$;
    if (typeof jq === "undefined") {
      console.error("PDT: jQuery is required for pdt-attendee-table.js");
    } else {
      let initAttendeePage = function() {
        event_hookups();
      };
      window.jQuery = window.jQuery || jq;
      window.$ = window.$ || jq;
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAttendeePage, { once: true });
        return;
      }
      initAttendeePage();
    }
  })();
})();
//# sourceMappingURL=attendee-page.js.map
