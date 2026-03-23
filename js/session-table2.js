import { session_state } from "./session-table2/state.js";
import { db_connection } from "./session-table2/db_connection.js";
import { host_connection } from "./session-table2/host_connection.js";
import { main_page } from "./session-table2/main_page.js";
import { show_attendees } from "./session-table2/show_attendees.js";
import { add_edit_session } from "./session-table2/add-edit-session.js";

(function () {
const jq = window.jQuery || window.jquery || window.$;
window.jQuery = window.jQuery || jq;
window.jquery = window.jquery || jq;
window.$ = window.$ || jq;

if (typeof window.$ === "undefined") {
    console.error("PDT: jQuery is required for pdt-session-table2.js");
} else {
    $(document).ready(async function () {
        "use strict";

        const dbC = new db_connection();
        const hostC = new host_connection();
        const mainPage = new main_page(
            dbC,
            hostC,
            new show_attendees(),
            new add_edit_session(dbC, hostC)
        );
        session_state.state = "mainPage" ;
        await mainPage.init();
    });
}
})();
