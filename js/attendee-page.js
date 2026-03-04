// Add core impore here when needed.
import { event_hookups } from "./attendee-page/event-hookups.js";


(function () {
    "use strict" ;

    function initAttendeePage() {

        event_hookups() ;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAttendeePage, { once: true });
        return;
    }

    initAttendeePage();
})();