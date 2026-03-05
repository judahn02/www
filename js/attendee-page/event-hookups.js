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
    if (!adminServiceBtn) { console.error("can't connect pdt-admin-service-btn"); }
    else {
        adminServiceBtn.addEventListener("click", () => {
            adminServiceBtn_f(adminServiceBtn)
        })
    }

    const yearsSpan = document.getElementById("pdt-years") ;
    yearsSpan.textContent = 1 ; // first value.

    const totalHoursSpan = document.getElementById("pdt-total-hours") ;
    totalHoursSpan.textContent = data.get("summary.total-hours") ;

    const recentSessionSpan = document.getElementById("pdt-recent_session") ;
    recentSessionSpan.textContent = data.get("summary.recent_session") ;

    const recentSessionDateSpan = document.getElementById("pdt-recent_session_date") ;
    recentSessionDateSpan.textContent = data.get("summary.recent_session_date") ;

    const ceuTotalSpan = document.getElementById("pdt-ceu-total") ;
    ceuTotalSpan.textContent = data.get("summary.train-n-conf")[0] + data.get("summary.admin-service")[0] ;

    const ceuTrainConfSpan = document.getElementById("pdt-ceu-trainConf") ;
    ceuTrainConfSpan.textContent = data.get("summary.train-n-conf")[0] ;

    const ceuAdminServSpan = document.getElementById("pdt-ceu-adminServ") ;
    ceuAdminServSpan.textContent = data.get("summary.admin-service")[0] ;

    const slider = document.getElementById("pdt-progress-years");
    slider.value = 1; // current value on load
    slider.addEventListener("input", (e) => {
        
        onYearsUpdated(ceuTotalSpan, ceuTrainConfSpan, ceuAdminServSpan, Number(e.target.value));
        yearsSpan.textContent = Number(e.target.value) ;
    });

    const filterState = {
        searchText: "",
        selectedType: "all"
    };

    // Connect these to your HTML elements when ready.
    const searchInput = null;
    const allFilterBtn = null;
    const workshopsFilterBtn = null;
    const trainingFilterBtn = null;
    const conferenceFilterBtn = null;

    const filterButtons = {
        all: allFilterBtn,
        workshop: workshopsFilterBtn,
        training: trainingFilterBtn,
        conference: conferenceFilterBtn
    };

    wireSessionFilters(searchInput, filterButtons, filterState);
    refreshSessionsTable(filterState, filterButtons);
    

}

function editPersonBtn_f(button) {
    console.log("pdt-edit-person-btn");
}

function adminServiceBtn_f(button) {
    console.log("pdt-admin-service-btn");
}

function onYearsUpdated(ceuTotal, ceuTrainConf, ceuAdminServ, value) {
    
    ceuTotal.textContent = data.get("summary.train-n-conf")[value-1] + data.get("summary.admin-service")[value-1] ;
    ceuTrainConf.textContent = data.get("summary.train-n-conf")[value-1] ;
    ceuAdminServ.textContent = data.get("summary.admin-service")[value-1] ;

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
