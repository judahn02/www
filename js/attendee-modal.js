// Add core impore here when needed.
import { event_hookups } from "./attendee-modal/event-hooksups.js";



// Note: more js will be needed to hook up the modal to act like a modal.

(function () {
    "use strict";

    function initAttendeeModal() {
        // Vite entry point placeholder for attendee modal behavior.
        const attendeeDataNode = document.getElementById("attendee-data");
        const adminServiceDataNode = document.getElementById("admin-service-data");

        if (!attendeeDataNode) {
            console.error("The html json data is not found. Skipping table load.");
            return;
        }

        if (!adminServiceDataNode) {
            console.error("The admin service json data is not found. Skipping table load.");
            return;
        }

        event_hookups(attendeeDataNode, adminServiceDataNode);

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAttendeeModal, { once: true });
        return;
    }

    initAttendeeModal();
})();
