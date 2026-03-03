
//TODO: double check that I can work in this function.
export function event_hookups(attendeeDataNode) {
    const attendeeData = JSON.parse(attendeeDataNode.textContent);


    // taking care of table_1
    {
        const table_1 = document.getElementById("table_1");
        if (!table_1) {
            console.error("table_1 not found.")
            return;
        }
        //remove the first row
        table_1.replaceChildren();

        // load up the data into variable



        for (const sessionData of attendeeData) {
            table_1.appendChild(format_session_row_1(sessionData));
            table_1.appendChild(format_session_row_2(sessionData));
        }


    }
    // const table_1 = document.getElementById("table_1");
    // const row = document.createElement('tr');
    // const cell = document.createElement("td");
    // cell.textContent = "2024-06-01";
    // row.appendChild(cell);
    // table_1.appendChild(row);


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