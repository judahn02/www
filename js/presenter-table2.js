// All of these are
import { db_connection } from "./presenter-table2/from-db.js";
import { host_connection } from "./presenter-table2/from-host.js";
import { main_page } from "./presenter-table2/main_page.js";
import { link_modal } from "./presenter-table2/link_modal.js";
import { new_member } from "./presenter-table2/new_member.js";
import { presenter_check } from "./presenter-table2/presenter_check.js";

(function () {
    // jQuery Check
    const jq = window.jQuery || window.jquery || window.$;
    window.jQuery = window.jQuery || jq;
    window.jquery = window.jquery || jq;
    window.$ = window.$ || jq;

    if (typeof window.$ === "undefined") {
        console.error("PDT: jQuery is required for pdt-attendee-table.js");
    } else {
        $(document).ready(async function () {
            "use strict";
            // maybe initiate a loading icon

            // Initialize the class instances
            const dbC = new db_connection();
            const hostC = new host_connection();
            const mainPage = new main_page(
                dbC,
                hostC,
                new link_modal(),
                new new_member(),
                new presenter_check()
            );


            // Initialize the data.
            await mainPage.init();
            // maybe disable the loading icon.
        });
    }
})();
