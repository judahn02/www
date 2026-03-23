(() => {
  // js/attendee-modal/event-hookups.js
  function event_hookups(attendeeDataNode, adminServiceDataNode) {
    const attendeeData = JSON.parse(attendeeDataNode.textContent);
    const adminServiceData = JSON.parse(adminServiceDataNode.textContent);
    {
      if (attendeeData.length === 0) {
        console.log("AttendeeData is empty");
      } else {
        const table_1 = document.getElementById("pdt-table-1");
        if (!table_1) {
          console.error("table_1 not found.");
          return;
        }
        const tbody = table_1.querySelector("tbody");
        if (!tbody) {
          console.error("tbody not found");
          return;
        }
        tbody.replaceChildren();
        for (const sessionData of attendeeData) {
          tbody.appendChild(format_session_row_1(sessionData));
          tbody.appendChild(format_session_row_2(sessionData));
        }
      }
    }
    {
      if (adminServiceData.length === 0) {
        console.log("adminServiceData is empty");
      } else {
        const table_2 = document.getElementById("pdt-table-2");
        if (!table_2) {
          console.error("table_2 not found.");
          return;
        }
        const tbody = table_2.querySelector("tbody");
        if (!tbody) {
          console.error("tbody not found");
          return;
        }
        tbody.replaceChildren();
        for (const adminServiceRow of adminServiceData) {
          tbody.appendChild(format_admin_service_row(adminServiceRow));
        }
      }
    }
    {
      let openPdtTab = function(event) {
        const tabId = event.currentTarget.dataset.tabTarget;
        const activePanel = document.getElementById(tabId);
        pdtTabPanels.forEach((panel) => {
          panel.style.display = "none";
        });
        pdtTabButtons.forEach((button) => {
          button.classList.remove("active");
        });
        if (activePanel) {
          activePanel.style.display = "block";
        }
        event.currentTarget.classList.add("active");
      };
      const modal_btn = document.getElementById("pdt-open-modal");
      modal_btn.addEventListener("click", () => {
        const modal = document.getElementById("pdt-modal");
        if (!modal) {
          return;
        }
        modal.style.display = "flex";
      });
      const modal_close_btn = document.getElementById("pdt-modal-close");
      modal_close_btn.addEventListener("click", () => {
        const modal = document.getElementById("pdt-modal");
        if (!modal) {
          return;
        }
        modal.style.display = "none";
      });
      const modal_window = document.getElementById("pdt-modal");
      if (!modal_window) {
        return;
      }
      modal_window.addEventListener("click", (event) => {
        if (event.target !== modal_window) {
          return;
        }
        modal_window.style.display = "none";
      });
      const export_btn = document.getElementById("pdt-export-btn");
      if (!export_btn) {
        return;
      }
      export_btn.addEventListener("click", () => {
        export_attendee_modal_csv(attendeeData, adminServiceData);
      });
      const pdtTabButtons = document.querySelectorAll(".pdt-tab-link");
      const pdtTabPanels = document.querySelectorAll(".pdt-tab-content");
      pdtTabButtons.forEach((button) => {
        button.addEventListener("click", openPdtTab);
      });
      if (pdtTabButtons.length > 0) {
        pdtTabButtons[0].click();
      }
    }
  }
  function format_session_row_1(sessionData) {
    const mainRow = document.createElement("tr");
    mainRow.className = "pdt-history-table__session-row";
    const mainRowValues = [
      sessionData.date,
      sessionData.title,
      sessionData.type,
      sessionData.hours,
      sessionData.ceu_cap,
      sessionData.ceu_wei,
      sessionData.rid_qual,
      sessionData.when_rid,
      sessionData.par_evnt,
      sessionData.evnt_type
    ];
    for (const value of mainRowValues) {
      const cell = document.createElement("td");
      cell.textContent = value;
      mainRow.appendChild(cell);
    }
    return mainRow;
  }
  function format_session_row_2(sessionData) {
    const detailRow = document.createElement("tr");
    const detailCell = document.createElement("td");
    detailCell.colSpan = 10;
    const wrapper = document.createElement("div");
    wrapper.className = "pdt-flags-and-comment";
    const flags = document.createElement("div");
    flags.className = "pdt-flags";
    const flagsText = document.createElement("span");
    flagsText.textContent = sessionData.flags;
    flags.appendChild(flagsText);
    const comment = document.createElement("div");
    comment.className = "pdt-comment";
    comment.textContent = sessionData.comment;
    wrapper.append(flags, comment);
    detailCell.appendChild(wrapper);
    detailRow.appendChild(detailCell);
    return detailRow;
  }
  function format_admin_service_row(adminServiceRow) {
    const row = document.createElement("tr");
    const rowValues = [
      adminServiceRow.start,
      adminServiceRow.end,
      adminServiceRow.type,
      adminServiceRow.ceu_wei
    ];
    for (const value of rowValues) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }
    return row;
  }
  function export_attendee_modal_csv(attendeeData, adminServiceData) {
    const csvParts = [
      build_session_csv(attendeeData),
      "",
      build_admin_service_csv(adminServiceData)
    ];
    const csvText = csvParts.join("\n");
    const csvBlob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const csvUrl = URL.createObjectURL(csvBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = csvUrl;
    downloadLink.download = "training-conference-admin-export.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(csvUrl);
  }
  function build_session_csv(attendeeData) {
    const rows = [
      ["Training and Conference History"],
      ["Date", "Session Title", "Type", "Hours", "CEU Capable", "CEU Weight", "RID Qualified", "When RID Submission?", "Parent Event", "Event Type", "Flags", "Comment"]
    ];
    for (const sessionData of attendeeData) {
      rows.push([
        sessionData.date,
        sessionData.title,
        sessionData.type,
        sessionData.hours,
        sessionData.ceu_cap,
        sessionData.ceu_wei,
        sessionData.rid_qual,
        sessionData.when_rid,
        sessionData.par_evnt,
        sessionData.evnt_type,
        sessionData.flags,
        sessionData.comment
      ]);
    }
    return rows.map(format_csv_row).join("\n");
  }
  function build_admin_service_csv(adminServiceData) {
    const rows = [
      ["Administrative Service"],
      ["Start", "End", "Type", "CEU Weight"]
    ];
    for (const adminServiceRow of adminServiceData) {
      rows.push([
        adminServiceRow.start,
        adminServiceRow.end,
        adminServiceRow.type,
        adminServiceRow.ceu_wei
      ]);
    }
    return rows.map(format_csv_row).join("\n");
  }
  function format_csv_row(rowValues) {
    return rowValues.map(format_csv_cell).join(",");
  }
  function format_csv_cell(value) {
    const text = String(value != null ? value : "");
    const escapedText = text.replaceAll('"', '""');
    return `"${escapedText}"`;
  }

  // js/attendee-modal.js
  (function() {
    "use strict";
    const rawModalData = window.PDTAttendeeModalData || {};
    const hasWindowModalData = window.PDTAttendeeModalData && (Array.isArray(rawModalData.sessions) || Array.isArray(rawModalData.admin_service));
    const sessions = Array.isArray(rawModalData.sessions) ? rawModalData.sessions : [];
    const adminService = Array.isArray(rawModalData.admin_service) ? rawModalData.admin_service : [];
    window.PDTAttendeeModalData = {
      sessions,
      admin_service: adminService
    };
    window.PDTModalGetSessions = function() {
      return window.PDTAttendeeModalData.sessions;
    };
    window.PDTModalGetAdminService = function() {
      return window.PDTAttendeeModalData.admin_service;
    };
    const hasDollar = typeof window.$ !== "undefined";
    const hasJQuery = typeof window.jQuery !== "undefined";
    if (!hasDollar && hasJQuery) {
      window.$ = window.jQuery;
    }
    if (typeof window.$ === "undefined") {
      console.error("PDT: jQuery is required for pdt-attendee-table.js");
      return;
    }
    function initAttendeeModal() {
      let attendeeDataNode;
      let adminServiceDataNode;
      if (hasWindowModalData) {
        attendeeDataNode = { textContent: JSON.stringify(window.PDTModalGetSessions()) };
        adminServiceDataNode = { textContent: JSON.stringify(window.PDTModalGetAdminService()) };
      } else {
        attendeeDataNode = document.getElementById("pdt-attendee-data");
        adminServiceDataNode = document.getElementById("pdt-admin-service-data");
        if (!attendeeDataNode) {
          console.error("The html json data is not found. Skipping table load.");
          return;
        }
        if (!adminServiceDataNode) {
          console.error("The admin service json data is not found. Skipping table load.");
          return;
        }
      }
      event_hookups(attendeeDataNode, adminServiceDataNode);
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAttendeeModal, { once: true });
      return;
    }
    initAttendeeModal();
  })();
})();
//# sourceMappingURL=attendee-modal.js.map
