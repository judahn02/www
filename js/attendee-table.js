import { event_hookups } from "./attendee-table/event-hookups.js"


if (typeof window.jQuery === "undefined") {
    console.error("PDT: jQuery is required for pdt-attendee-table.js");
} else {
    window.$ = window.jQuery;

    $(document).ready(function() {
        "use strict" ;
        console.log("loading up event hookup.")
        // maybe initiate a loading icon
        event_hookups() ;
        // maybe disable the loading icon.
    }) ;
}
