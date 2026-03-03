// Add core impore here when needed.
import { event_hookups } from "./attendee-modal/event-hooksups.js";


(function () {
    "use strict";

    function initAttendeeModal() {
        // Vite entry point placeholder for attendee modal behavior.
        const attendeeDataNode = document.getElementById("attendee-data");
        if (!attendeeDataNode) {
            console.error("The html json data is not found. Skipping table 1 load.")
            return;
        }
        else event_hookups(attendeeDataNode);

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAttendeeModal, { once: true });
        return;
    }

    initAttendeeModal();
})();
