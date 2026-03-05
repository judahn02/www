import { data } from "./from-endpoint.js";
// if I set let variables here, can the functions use them?

export function event_hookups() {

    // set variables here

    const editPersonBtn = document.getElementById("pdt-edit-person-btn");
    if (!editPersonBtn) { console.error("can't connect pdt-edit-person-btn"); }
    else {
        editPersonBtn.addEventListener("click", () => {
            editPersonBtn_f(editPersonBtn);
        });
    }

    const adminServiceBtn = document.getElementById("pdt-admin-service-btn");
    // if logic moved below to admin service section.

    const yearsSpan = document.getElementById("pdt-years");
    yearsSpan.textContent = 1; // first value.

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
    slider.value = 1; // current value on load
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

    // Connect these to your HTML elements when ready.
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
        // In these brackets a where the window will be worked on
        const editPersonModal = document.getElementById("pdt-edit-person-modal");
        if (!editPersonModal) {
            console.error("can't connect pdt-edit-person-modal");
            return;
        }

        // loading preset data. 
        // Notice: The attendee page will initially be loaded by php, but this will
        //  change things on the page if used.
        const f_name_text = document.getElementById("pdt-f_name");
        if (!f_name_text) {
            console.error("can't connect pdt-f_name");
        } else {
            f_name_text.value = String(data.get("contact.first") ?? "");
        }

        const l_name_text = document.getElementById("pdt-l_name");
        if (!l_name_text) {
            console.error("can't connect pdt-l_name");
        } else {
            l_name_text.value = String(data.get("contact.last") ?? "");
        }

        const email_text = document.getElementById("pdt-email");
        if (!email_text) {
            console.error("can't connect pdt-email");
        } else {
            email_text.value = String(data.get("contact.email") ?? "");
        }

        const number_text = document.getElementById("pdt-number");
        if (!number_text) {
            console.error("can't conncet pdt-number");
        } else {
            number_text.value = String(data.get("contact.number") ?? "");
        }

        // clicking cancel button
        const editPersonCancelBtn = document.getElementById("pdt-edit-person-cancel");
        if (!editPersonCancelBtn) {
            console.error("can't connect pdt-edit-person-cancel");
        } else {
            editPersonCancelBtn.addEventListener("click", () => {
                editPersonModal.hidden = true;
            })
        }

        // clicking outside of the window
        editPersonModal.addEventListener("click", (event) => {
            if (event.target !== editPersonModal) { return; }
            editPersonModal.hidden = true;
        });

        // save presenter
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

                //update the front end
                document.getElementById("pdt-full-name").textContent = f_name_text.value + " " + l_name_text.value;
                document.getElementById("pdt-page-email").textContent = email_text.value;
                document.getElementById("pdt-page-number").textContent = number_text.value;

                // close out
                editPersonModal.hidden = true;
            });
        }




    }

    // Administrative Service
    {
        // I want a client side cache of the admin table - this variable below
        let admin_service_data = data.get("admin_service");
        // There probably should be a variable that hold the next available id.
        // Note: the serverside database will be the one to assign id's, the ones generated
        //  here will only be used for identification. 
        const admin_service_window = document.getElementById("pdt-admin-service-modal");
        //TODO: maybe a const of the table here?

        const admin_service_deleted_ogs = [] ; // To note when. 


        // Hooking up the Administrative Service Button
        if (!adminServiceBtn) { console.error("can't connect pdt-admin-service-btn"); }
        else {
            adminServiceBtn.addEventListener("click", () => {
                if (!admin_service_window) {
                    console.error("can't connect pdt-admin-service-modal");
                    return;
                } ;

                admin_service_data = data.get("admin_service");

                //TODO: load table here with function call and data.


                admin_service_window.hidden = false;
            })
        }

        // clicking outside of the window
        admin_service_window.addEventListener("click", (event) => {
            if (event.target !== admin_service_window) { return; }
            admin_service_window.hidden = true;
        });


        // Hooking up the Cancel button.
        const admin_service_cancel = document.getElementById("pdt-admin-service-cancel") ;
        if(!admin_service_cancel) {
            console.error("can't connect pdt-admin-service-cancel") ;
            return ;
        } else {
            admin_service_cancel.addEventListener("click", () => {
                admin_service_window.hidden = true;
            })

            // Clear out the admin_service_deleted_ogs
        } ;

        // Hooking up the Save button
        const admin_service_save = document.getElementById("pdt-admin-service-save") ;
        if(!admin_service_save) {
            console.error("can't connect pdt-admin-service-save") ;
        } else {
            // use data.set to send over a copy of admin_service_data, 
            // be sure to s
            
            
            // row is a proper update
        }


        const add_admin_service_row = document.getElementById("pst-add-admin-service-row") ;
        if(!add_admin_service_row) {
            console.error("can't connect pst-add-admin-service-row") ;
            return ;
        } else {
            // collect the inputs and clear them

            // add to both table row and admin_service_data

            // get anything else ready for the next time someone presses the button. 
        }

        // Last button here defined is the Save session. 
        


        // Note: when loading the table, each button x will need a unique identifier
        /* it looks like this is the best strat.

        admin_service_data.forEach((row, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = "X";
            btn.addEventListener("click", () => removeAdminRow(index)); // preset param
        });
            The button is to delete the row from view and the admin table cache. 
            when deleted, add it to the "admin_service_deleted_ogs" array.
        */

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
    if (value === null || value === undefined || value === "") {
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
    const text = String(value ?? "");
    const escapedText = text.replaceAll("\"", "\"\"");
    return `"${escapedText}"`;
}
