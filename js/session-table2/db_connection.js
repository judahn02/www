import { session_state } from "./state.js";
export class db_connection {
    /*
    {
    "localID" : null,
    "Date": ("Self Paced" | "MM/DD/YYYY" | "MM/DD/YYYY to MM/DD/YYYY"),
    "SessionTitle" : "Name",
    "Length" : 60,
    "SessionType" : "",
    "CEUWeight" : 1.0,
    "CEUConsideration" : "",
    "CEUQualify" : "",
    "RIDQualify" : "",
    "EventType" :  "",
    "ParentType" : "",
    "Organizer" : "",
    "AttendeesCt" : 0,
    "Lock" : (0 | 1),
    "Locker" : (null | "Jason Zinza"),
    "Attendees" : [
        ["Name", "Email", (null | "MM/DD/YYYY to MM/DD/YYYY" | "MM/DD/YYYY to ongoing" | "not started"), "Cert", personID ],
        ...
    ]
    }
    Note, if date is not self paced, then attendees date is null
    */

    static data = {
        "sessions" : [
            {
                "localID" : null,
                "Date": "03/11/2026",
                "SessionTitle" : "Interpreter Ethics in Hybrid Teams",
                "Length" : 75,
                "SessionType" : "Lecture",
                "CEUWeight" : 1.25,
                "CEUConsideration" : "Ethics focus",
                "CEUQualify" : "Yes",
                "RIDQualify" : "Yes",
                "EventType" :  "Webinar",
                "ParentType" : "March Learning Lab",
                "Organizer" : "Carmen Wu",
                "AttendeesCt" : 5,
                "Lock" : 1,
                "Locker" : "Priya Singh",
                "Attendees" : [
                    ["Talia Morgan", "talia.morgan@example.com", null, "Master", 1],
                    ["Evan Price", "evan.price@example.com", null, "Associate", 2],
                    ["Sofia Kim", "sofia.kim@example.com", null, "None", 3],
                    ["Daniel Ross", "daniel.ross@example.com", null, "Not Assigned", 4],
                    ["Mina Ali", "mina.ali@example.com", null, "Master", 5],
                ]
            },
            {
                "localID" : null,
                "Date": "03/18/2026",
                "SessionTitle" : "Medical Terminology Drill",
                "Length" : 90,
                "SessionType" : "Workshop",
                "CEUWeight" : 1.5,
                "CEUConsideration" : "Specialty vocabulary",
                "CEUQualify" : "No",
                "RIDQualify" : "No",
                "EventType" :  "Breakout",
                "ParentType" : "Skill Builder Week",
                "Organizer" : "Noah Patel",
                "AttendeesCt" : 4,
                "Lock" : 0,
                "Locker" : null,
                "Attendees" : [
                    ["Harper Nguyen", "harper.nguyen@example.com", null, "Associate", 6],
                    ["Jonah Clark", "jonah.clark@example.com", null, "Not Assigned", 7],
                    ["Layla Scott", "layla.scott@example.com", null, "None", 8],
                    ["Isaac Bell", "isaac.bell@example.com", null, "Master", 9],
                ]
            },
            {
                "localID" : null,
                "Date": "Self Paced",
                "SessionTitle" : "Boundary Setting for Freelance Interpreters",
                "Length" : 45,
                "SessionType" : "Module",
                "CEUWeight" : 0.75,
                "CEUConsideration" : "Professional practice",
                "CEUQualify" : "Yes",
                "RIDQualify" : "Yes",
                "EventType" :  "Online Course",
                "ParentType" : "Resource Library",
                "Organizer" : "Rina Flores",
                "AttendeesCt" : 6,
                "Lock" : 0,
                "Locker" : null,
                "Attendees" : [
                    ["Nora Diaz", "nora.diaz@example.com", "not started", "Associate", 10],
                    ["Caleb Foster", "caleb.foster@example.com", "03/01/2026 to ongoing", "Master", 11],
                    ["Ivy Chen", "ivy.chen@example.com", "03/07/2026 to 03/10/2026", "None", 12],
                    ["Peter Shah", "peter.shah@example.com", "not started", "Not Assigned", 13],
                    ["Grace Hill", "grace.hill@example.com", "03/05/2026 to ongoing", "Associate", 14],
                    ["Owen Reed", "owen.reed@example.com", "03/07/2026 to 03/10/2026", "Master", 15],
                ]
            },
            {
                "localID" : null,
                "Date": "04/02/2026 to 04/04/2026",
                "SessionTitle" : "Leadership Intensive",
                "Length" : 180,
                "SessionType" : "Roundtable",
                "CEUWeight" : 3.0,
                "CEUConsideration" : "Advanced practice",
                "CEUQualify" : "Yes",
                "RIDQualify" : "Yes",
                "EventType" :  "Retreat",
                "ParentType" : "Leadership Series",
                "Organizer" : "Marcos Lee",
                "AttendeesCt" : 5,
                "Lock" : 1,
                "Locker" : "Jason Zinza",
                "Attendees" : [
                    ["Amara Lewis", "amara.lewis@example.com", null, "Master", 16],
                    ["Theo Grant", "theo.grant@example.com", null, "Associate", 17],
                    ["Jade Rivera", "jade.rivera@example.com", null, "None", 18],
                    ["Miles Cooper", "miles.cooper@example.com", null, "Not Assigned", 19],
                    ["Zoe Brooks", "zoe.brooks@example.com", null, "Master", 20],
                ]
            },
            {
                "localID" : null,
                "Date": "04/09/2026",
                "SessionTitle" : "Legal Prep: Depositions and Hearings",
                "Length" : 120,
                "SessionType" : "Seminar",
                "CEUWeight" : 2.0,
                "CEUConsideration" : "Domain-specific scenarios",
                "CEUQualify" : "Yes",
                "RIDQualify" : "Yes",
                "EventType" :  "Conference",
                "ParentType" : "Justice Access Forum",
                "Organizer" : "Elena Brooks",
                "AttendeesCt" : 4,
                "Lock" : 1,
                "Locker" : "Marta Silva",
                "Attendees" : [
                    ["Leo Bennett", "leo.bennett@example.com", null, "Master", 21],
                    ["Aisha Coleman", "aisha.coleman@example.com", null, "Associate", 22],
                    ["Riley Ward", "riley.ward@example.com", null, "None", 23],
                    ["Emma Stone", "emma.stone@example.com", null, "Master", 24],
                ]
            },
            {
                "localID" : null,
                "Date": "04/21/2026 to 04/22/2026",
                "SessionTitle" : "Mentor Circle Facilitation Lab",
                "Length" : 150,
                "SessionType" : "Workshop",
                "CEUWeight" : 0,
                "CEUConsideration" : "None",
                "CEUQualify" : "No",
                "RIDQualify" : "Yes",
                "EventType" :  "Cohort",
                "ParentType" : "Spring Mentor Program",
                "Organizer" : "Community Ops",
                "AttendeesCt" : 5,
                "Lock" : 1,
                "Locker" : "Jason Zinza",
                "Attendees" : [
                    ["Seth Howard", "seth.howard@example.com", null, "Associate", 25],
                    ["Priya Desai", "priya.desai@example.com", null, "Master", 26],
                    ["Naomi Turner", "naomi.turner@example.com", null, "Not Assigned", 27],
                    ["Victor Hughes", "victor.hughes@example.com", null, "None", 28],
                    ["Claire Adams", "claire.adams@example.com", null, "Associate", 29],
                ]
            }
        ],
        "flags" : {
            "top" : [1,2,3,4],
            1 : "General",
            2 : "PPO",
            3 : "Advanced",
            4 : "Ethics",
            5 : "Medical",
            6 : "Legal",
            7 : "Educational",
            8 : "Technology",
            9 : "Leadership",
        },
        "sessionTypes" : {
            1 : "lecture",
            2 : "workshop",
            3 : "panel",
            4 : "breakout",
            5 : "roundtable",
        },
        "EventTypes" : {
            1 : "conference",
            2 : "webinar",
            3 : "retreat",
            4 : "training",
            5 : "series",
        },
        "CEUTypes" : {
            1 : "conference",
            2 : "webinar",
            3 : "retreat",
            4 : "training",
            5 : "series",
        },
        // [Name, email, attendee[0|1], presenter[0|1], personID]
        "members" : [
            ["Talia Morgan", "talia.morgan@example.com", 1, 1, 1],
            ["Evan Price", "evan.price@example.com", 1, 0, 2],
            ["Sofia Kim", "sofia.kim@example.com", 1, 0, 3],
            ["Daniel Ross", "daniel.ross@example.com", 1, 1, 4],
            ["Mina Ali", "mina.ali@example.com", 1, 0, 5],
            ["Harper Nguyen", "harper.nguyen@example.com", 1, 1, 6],
            ["Jonah Clark", "jonah.clark@example.com", 1, 0, 7],
            ["Layla Scott", "layla.scott@example.com", 1, 0, 8],
            ["Isaac Bell", "isaac.bell@example.com", 1, 1, 9],
            ["Nora Diaz", "nora.diaz@example.com", 1, 0, 10],
            ["Caleb Foster", "caleb.foster@example.com", 1, 1, 11],
            ["Ivy Chen", "ivy.chen@example.com", 1, 0, 12],
            ["Peter Shah", "peter.shah@example.com", 1, 0, 13],
            ["Grace Hill", "grace.hill@example.com", 1, 1, 14],
            ["Owen Reed", "owen.reed@example.com", 1, 1, 15],
            ["Amara Lewis", "amara.lewis@example.com", 1, 0, 16],
            ["Theo Grant", "theo.grant@example.com", 1, 1, 17],
            ["Jade Rivera", "jade.rivera@example.com", 1, 0, 18],
            ["Miles Cooper", "miles.cooper@example.com", 1, 0, 19],
            ["Zoe Brooks", "zoe.brooks@example.com", 1, 1, 20],
            ["Leo Bennett", "leo.bennett@example.com", 1, 1, 21],
            ["Aisha Coleman", "aisha.coleman@example.com", 1, 0, 22],
            ["Riley Ward", "riley.ward@example.com", 1, 0, 23],
            ["Emma Stone", "emma.stone@example.com", 1, 1, 24],
            ["Seth Howard", "seth.howard@example.com", 1, 0, 25],
            ["Priya Desai", "priya.desai@example.com", 1, 1, 26],
            ["Naomi Turner", "naomi.turner@example.com", 1, 0, 27],
            ["Victor Hughes", "victor.hughes@example.com", 1, 1, 28],
            ["Claire Adams", "claire.adams@example.com", 1, 0, 29],
        ],
    }

    constructor() {
        
    }

    async get(resource) {
        if (resource === "sessions")
            return structuredClone(db_connection.data.sessions);
        else if (resource === "flags")
            return structuredClone(db_connection.data.flags);
        else if (resource === "presenters")
            return structuredClone(
                db_connection.data.members.filter((member) => member[3] === 1)
            );
        else if (resource === "sessionTypes")
            return structuredClone(db_connection.data.sessionTypes);
        else if (resource === "EventTypes")
            return structuredClone(db_connection.data.EventTypes);
        else if (resource === "CEUTypes")
            return structuredClone(db_connection.data.CEUTypes);
        return null;
    }

    async set(resource, value) {
        if (!["sessionTypes", "EventTypes", "CEUTypes"].includes(resource)) {
            return -1;
        }

        const label = String(value ?? "").trim();
        if (label === "") {
            return -1;
        }

        const resourceData = db_connection.data[resource];
        for (const existingLabel of Object.values(resourceData)) {
            if (String(existingLabel).trim().toLowerCase() === label.toLowerCase()) {
                return -1;
            }
        }

        const nextId = Object.keys(resourceData)
            .map((optionId) => Number(optionId))
            .filter((optionId) => Number.isFinite(optionId))
            .reduce((maxId, optionId) => Math.max(maxId, optionId), 0) + 1;

        resourceData[nextId] = label;
        return nextId;
    }

    async put(resource, value) {
        
        if (resource !== "session") {
            return null;
        }
        /*
        {
            ceuQualify: "Yes|No",
            ceuType: #|null,
            ceuWeight: #.#|null,
            dateOption: [1, "date_start|null", "date_end|null"],
            eventType: #,
            flags: [#,...],
            length: #,
            organizer: "asdfasdf",
            parentEvent: "asdfsdf",
            presenters: [#, #, ...],
            ridQualified: "yes",
            sessionTitle: "A test",
            sessionType: 2
        }
        */
        console.log(value) ;
        return null;
    }

    async addFlag(flag) {
        // simulates adding another flag and generating a new id.
        const label = String(flag ?? "").trim() ;
        if (label === "") {
            return null ;
        }

        for (const [flagId, flagLabel] of Object.entries(db_connection.data.flags)) {
            if (flagId === "top") {
                continue ;
            }

            if (String(flagLabel).trim().toLowerCase() === label.toLowerCase()) {
                return Number(flagId) ;
            }
        }

        const nextId = Object.keys(db_connection.data.flags)
            .filter((flagId) => flagId !== "top")
            .map((flagId) => Number(flagId))
            .filter((flagId) => Number.isFinite(flagId))
            .reduce((maxId, flagId) => Math.max(maxId, flagId), 0) + 1 ;

        db_connection.data.flags[nextId] = label ;
        return nextId ;
    }
}
