import { session_state } from "./session-table2/state.js";
import { db_connection } from "./session-table2/db_connection.js";
import { host_connection } from "./session-table2/host_connection.js";
import { main_page } from "./session-table2/main_page.js";
import { show_attendees } from "./session-table2/show_attendees.js";
import { add_edit_session } from "./session-table2/add-edit-session.js";

(function () {
if (typeof $ !== "function") {
    console.error("PDT: jQuery is required for pdt-session-table2.js");
} else {
    $(document).ready(async function () {
        "use strict";

        const apiBaseUrl = "https://aslta-api-v3.judahsbase.com";
        const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTMyMn0.r_yhCUsRyPFYNP5oQVT4EpS6Aojmhah0aMQQL_IPQg9DDQeADEVyUx84QlJt6rTx2S2QSjuxmI3xB2ftl7WE4UoFCgYOT-RW3ehU0tDcU_1RnMCW3NqBfMtaIHXDd_u3er0BiQm25nEiCWF8JtQcQWOASRHuRb5dox6wJO5C-Jm7iQlwJGsAnlXTGqTUqfH_AhPAm35CJO8omtpMX7lgfhdmvivMDtsdwW5sLXmeKm0JhrNKcpPQjZJ_HkTXJRP_LD80dgA1n1qQFSgbQint4giRITNeTMk6pqUUXXgkduJUUW_v1qqZoMwt85CkPNkyb7E9Fcc7gBj9IdTrrl_aXw"; // Paste the JWT here once it's available.
        const dbC = new db_connection(apiBaseUrl, jwt);
        const hostC = new host_connection();
        const mainPage = new main_page(
            dbC,
            hostC,
            new show_attendees(dbC, hostC),
            new add_edit_session(dbC, hostC)
        );
        session_state.state = "mainPage" ;
        await mainPage.init();
    });
}
})();
