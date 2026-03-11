// Add core impore here when needed.
import { event_hookups } from "./attendee-modal/event-hookups.js";



// Note: more js will be needed to hook up the modal to act like a modal.

(function () {
    "use strict";

    const rawModalData = window.PDTAttendeeModalData || {};
    const hasWindowModalData = window.PDTAttendeeModalData && (
        Array.isArray(rawModalData.sessions) || Array.isArray(rawModalData.admin_service)
    );
    const sessions = Array.isArray(rawModalData.sessions) ? rawModalData.sessions : [];
    const adminService = Array.isArray(rawModalData.admin_service) ? rawModalData.admin_service : [];

    window.PDTAttendeeModalData = {
        sessions: sessions,
        admin_service: adminService
    };

    window.PDTModalGetSessions = function () {
        return window.PDTAttendeeModalData.sessions;
    };

    window.PDTModalGetAdminService = function () {
        return window.PDTAttendeeModalData.admin_service;
    };

    const hasDollar = typeof window.$ !== "undefined";
    const hasJQuery = typeof window.jQuery !== "undefined";
    if (!hasDollar && hasJQuery) {
        window.$ = window.jQuery;
    }

    if (typeof window.$ === "undefined") {
        console.error("PDT: jQuery is required for pdt-attendee-table.js");
        return;
    }

    function initAttendeeModal() {
        let attendeeDataNode;
        let adminServiceDataNode;

        if (hasWindowModalData) {
            attendeeDataNode = { textContent: JSON.stringify(window.PDTModalGetSessions()) };
            adminServiceDataNode = { textContent: JSON.stringify(window.PDTModalGetAdminService()) };
        } else {
            // Fallback for non-WordPress/local HTML JSON nodes.
            attendeeDataNode = document.getElementById("pdt-attendee-data");
            adminServiceDataNode = document.getElementById("pdt-admin-service-data");

            if (!attendeeDataNode) {
                console.error("The html json data is not found. Skipping table load.");
                return;
            }

            if (!adminServiceDataNode) {
                console.error("The admin service json data is not found. Skipping table load.");
                return;
            }
        }

        event_hookups(attendeeDataNode, adminServiceDataNode);

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAttendeeModal, { once: true });
        return;
    }

    initAttendeeModal();
})();
