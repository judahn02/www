

export function event_hookups(attendeeDataNode, adminServiceDataNode) {
    const attendeeData = JSON.parse(attendeeDataNode.textContent);
    const adminServiceData = JSON.parse(adminServiceDataNode.textContent);


    // taking care of table_1
    //Tip: the color is tied to the odd/event row value.
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
            if (!tbody) { console.error("tbody not found"); return; }
            // Tip: the attendee data array will alway be sent but might be emtpy, I need to keep the current child in that case.
            tbody.replaceChildren();

            for (const sessionData of attendeeData) {
                tbody.appendChild(format_session_row_1(sessionData));
                tbody.appendChild(format_session_row_2(sessionData));
            }
        }
    }

    {
        // Table 2 logic goes here
        if (adminServiceData.length === 0) {
            console.log("adminServiceData is empty");
        } else {
            const table_2 = document.getElementById("pdt-table-2");

            if (!table_2) {
                console.error("table_2 not found.");
                return;
            }

            const tbody = table_2.querySelector("tbody");
            if (!tbody) { console.error("tbody not found"); return; }
            tbody.replaceChildren();

            for (const adminServiceRow of adminServiceData) {
                tbody.appendChild(format_admin_service_row(adminServiceRow));
            }
        }
    }

    //ALL Event Listeners are HERE!
    {
        const modal_btn = document.getElementById("pdt-open-modal") ;
        modal_btn.addEventListener("click", () => {
            const modal = document.getElementById("pdt-modal");
            if (!modal) { return; }
            modal.style.display = "flex";
        })
        const modal_close_btn = document.getElementById("pdt-modal-close") ;
        modal_close_btn .addEventListener("click", () => {
            const modal = document.getElementById("pdt-modal");
            if (!modal) { return; }
            modal.style.display = "none";
        })

        const modal_window = document.getElementById("pdt-modal");
        if (!modal_window) { return; }
        modal_window.addEventListener("click", (event) => {
            if (event.target !== modal_window) { return; }
            modal_window.style.display = "none";
        });

        const export_btn = document.getElementById("pdt-export-btn") ;
        if (!export_btn) { return; }
        export_btn.addEventListener("click", () => {
            export_attendee_modal_csv(attendeeData, adminServiceData);
        });
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
    const text = String(value ?? "");
    const escapedText = text.replaceAll("\"", "\"\"");
    return `"${escapedText}"`;
}
