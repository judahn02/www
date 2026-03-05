/*
    This is data that will come from 
*/

export class data {

    static data = {
        //No keys are allowed to have a '.' in them.
        "summary": {
            "total-hours": 1.5,
            "recent_session": "A New Way to Teach ASL Literature",
            "recent_session_date": "2024-06-01",
            "train-n-conf": [1, 3, 4, 7, 9, 11, 14, 16, 18, 20],
            "admin-service": [1, 2, 5, 8, 12, 15, 19, 23, 27, 30]
        },
        "sessions": [
            {
                "date": "not started",
                "session_title": "A New Way to Teach ASL Literature",
                "type": "Workshop",
                "hours": "1.5h",
                "ceu_capable": "Yes",
                "ceu_weight": "1.50",
                "rid_qualified": "Yes",
                "rid_submission": "2000-01-01",
                "parent_event": "Summer Institute",
                "event_type": "Training",
                "flags": "General | PPO | Advanced",
                "comment": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui earum nostrum esse iste, reprehenderit veniam repudiandae error deleniti natus officia labore libero animi repellat perferendis deserunt omnis odit non aliquid. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia eum repudiandae repellendus. Unde ipsum ab tempora. Quisquam reiciendis repellat numquam corporis ex fuga ad, temporibus fugiat voluptatibus, eius repudiandae modi!"
            },
            {
                "date": "2023-11-14",
                "session_title": "Language Access in Practice",
                "type": "Training",
                "hours": "1.0h",
                "ceu_capable": "Yes",
                "ceu_weight": "1.00",
                "rid_qualified": "No",
                "rid_submission": "Not Relevant",
                "parent_event": "Regional Forum",
                "event_type": "Conference",
                "flags": null,
                "comment": null
            },
            {
                "date": "2000-01-01 to 2000-02-01",
                "session_title": "Interpreter Ethics Review",
                "type": "Confrence",
                "hours": "2.0h",
                "ceu_capable": "Yes",
                "ceu_weight": "2.00",
                "rid_qualified": "Yes",
                "rid_submission": "Not Submitted",
                "parent_event": "Ethics Series",
                "event_type": "Training",
                "flags": "No Flags",
                "comment": "No comment"
            },
            {
                "date": "2000-01-01 to ongoing",
                "session_title": "Community Outreach Basics",
                "type": "Roundtable",
                "hours": "0.5h",
                "ceu_capable": "No",
                "ceu_weight": "0.00",
                "rid_qualified": "No",
                "rid_submission": "Not Relevant",
                "parent_event": "Volunteer Day",
                "event_type": "Workshop",
                "flags": null,
                "comment": null
            },
            {
                "date": "not started",
                "session_title": "Digital Tools for ASL Classrooms",
                "type": "Workshops",
                "hours": "1.2h",
                "ceu_capable": "Yes",
                "ceu_weight": "1.20",
                "rid_qualified": "Yes",
                "rid_submission": "2000-01-01",
                "parent_event": "Fall Summit",
                "event_type": "Conference",
                "flags": null,
                "comment": null
            }
        ]
    }

    static get(path) {
        if (typeof path !== "string" || path.trim() === "") {
            return undefined;
        }

        return path.split(".").reduce((currentValue, key) => {
            if (currentValue === null || currentValue === undefined) {
                return undefined;
            }

            return currentValue[key];
        }, this.data);
    }

    static normalizeSessionType(value) {
        const normalized = String(value || "").trim().toLowerCase();

        if (normalized === "workshops") {
            return "workshop";
        }

        if (normalized === "confrence") {
            return "conference";
        }

        return normalized;
    }

    static querySessions(filters = {}) {
        const sessions = this.get("sessions");
        if (!Array.isArray(sessions)) {
            return [];
        }

        const searchText = String(filters.searchText || "").trim().toLowerCase();
        const selectedType = this.normalizeSessionType(filters.selectedType || "all");

        return sessions.filter((session) => {
            const sessionType = this.normalizeSessionType(session.type);
            const matchesType = selectedType === "all" || sessionType === selectedType;
            if (!matchesType) {
                return false;
            }

            if (searchText === "") {
                return true;
            }

            const searchableText = [
                session.session_title,
                session.type
            ].map((value) => String(value || "").toLowerCase());

            return searchableText.some((value) => value.includes(searchText));
        });
    }
}
