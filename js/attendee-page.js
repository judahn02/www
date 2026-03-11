// Add core impore here when needed.
import { event_hookups } from "./attendee-page/event-hookups.js";


(function () {
    "use strict" ;

    const jq = window.jQuery || window.$;

    if (typeof jq === "undefined") {
        console.error("PDT: jQuery is required for pdt-attendee-table.js");
    } else {
        // Support environments that expose jQuery as either `jQuery` or `$`.
        window.jQuery = window.jQuery || jq;
        window.$ = window.$ || jq;

        function initAttendeePage() {

            event_hookups() ;
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initAttendeePage, { once: true });
            return;
        }

        initAttendeePage();
    }
})();
