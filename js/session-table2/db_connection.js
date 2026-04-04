import JwtApiClient from "../core/security.js";
import { session_state } from "./state.js";
export class db_connection {
    /*
    {
    "sessionID" : null,
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
        ["Name", "Email", (null | "YYYY-MM-DD"), (null | "YYYY-MM-DD"), attendeeStatusID, personID ],
        ...
    ]
    }
    Note, if date is not self paced, then attendee start/end dates are null
    */

    static attendeeDateRangesNormalized = false;

    static data = {
        "sessions" : [
            {
                "sessionID" : 1,
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
                    ["Talia Morgan", "talia.morgan@example.com", null, null, 2, 1],
                    ["Evan Price", "evan.price@example.com", null, null, 1, 2],
                    ["Sofia Kim", "sofia.kim@example.com", null, null, 3, 3],
                    ["Daniel Ross", "daniel.ross@example.com", null, null, 4, 4],
                    ["Mina Ali", "mina.ali@example.com", null, null, 2, 5],
                ]
            },
            {
                "sessionID" : 2,
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
                    ["Harper Nguyen", "harper.nguyen@example.com", null, null, 1, 6],
                    ["Jonah Clark", "jonah.clark@example.com", null, null, 4, 7],
                    ["Layla Scott", "layla.scott@example.com", null, null, 3, 8],
                    ["Isaac Bell", "isaac.bell@example.com", null, null, 2, 9],
                ]
            },
            {
                "sessionID" : 3,
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
                    ["Nora Diaz", "nora.diaz@example.com", null, null, 1, 10],
                    ["Caleb Foster", "caleb.foster@example.com", "2026-03-01", null, 2, 11],
                    ["Ivy Chen", "ivy.chen@example.com", "2026-03-07", "2026-03-10", 3, 12],
                    ["Peter Shah", "peter.shah@example.com", null, null, 4, 13],
                    ["Grace Hill", "grace.hill@example.com", "2026-03-05", null, 1, 14],
                    ["Owen Reed", "owen.reed@example.com", "2026-03-07", "2026-03-10", 2, 15],
                ]
            },
            {
                "sessionID" : 4,
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
                    ["Amara Lewis", "amara.lewis@example.com", null, null, 2, 16],
                    ["Theo Grant", "theo.grant@example.com", null, null, 1, 17],
                    ["Jade Rivera", "jade.rivera@example.com", null, null, 3, 18],
                    ["Miles Cooper", "miles.cooper@example.com", null, null, 4, 19],
                    ["Zoe Brooks", "zoe.brooks@example.com", null, null, 2, 20],
                ]
            },
            {
                "sessionID" : 5,
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
                    ["Leo Bennett", "leo.bennett@example.com", null, null, 2, 21],
                    ["Aisha Coleman", "aisha.coleman@example.com", null, null, 1, 22],
                    ["Riley Ward", "riley.ward@example.com", null, null, 3, 23],
                    ["Emma Stone", "emma.stone@example.com", null, null, 2, 24],
                ]
            },
            {
                "sessionID" : 6,
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
                    ["Seth Howard", "seth.howard@example.com", null, null, 1, 25],
                    ["Priya Desai", "priya.desai@example.com", null, null, 2, 26],
                    ["Naomi Turner", "naomi.turner@example.com", null, null, 4, 27],
                    ["Victor Hughes", "victor.hughes@example.com", null, null, 3, 28],
                    ["Claire Adams", "claire.adams@example.com", null, null, 1, 29],
                ]
            }
        ],
        "attendeeStatuses" : {
            1 : "Certified",
            2 : "Master",
            3 : "None",
            4 : "Not Assigned",
        },
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
        "ridCertificates" : [],
        "comments" : [],
    }

    constructor(apiBaseUrl = null, jwt = null) {
        this.apiBaseUrl = this.normalizeConfiguredValue(apiBaseUrl)?.replace(/\/+$/, "") ?? null;
        this.jwt = this.normalizeConfiguredValue(jwt);
        this.apiClient = this.apiBaseUrl && this.jwt
            ? new JwtApiClient(this.apiBaseUrl, this.jwt)
            : null;
        this.ensureNormalizedAttendeeDateRanges();
    }

    normalizeConfiguredValue(value) {
        const normalizedValue = String(value ?? "").trim();
        return normalizedValue === "" ? null : normalizedValue;
    }

    async getApiClient() {
        return this.apiClient;
    }

    ensureNormalizedAttendeeDateRanges() {
        if (db_connection.attendeeDateRangesNormalized) {
            return;
        }

        for (const session of db_connection.data.sessions) {
            const normalizedAttendees = this.normalizeStoredAttendeeEntries(session?.Attendees, session);
            session.Attendees = normalizedAttendees.map((attendeeEntry) => this.buildStoredAttendeeEntry(attendeeEntry));
            session.AttendeesCt = session.Attendees.length;
        }

        db_connection.attendeeDateRangesNormalized = true;
    }

    async get(resource, query = null) {
        if (resource === "sessions") {
            try {
                const apiClient = await this.getApiClient();
                if (apiClient) {
                    const sessionsPayload = await apiClient.get("api/sessions");
                    return structuredClone(this.normalizeSessionsResponse(sessionsPayload));
                }

                if (this.apiBaseUrl) {
                    const response = await fetch(`${this.apiBaseUrl}/api/sessions`);
                    if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`);
                    }

                    const sessionsPayload = await response.json();
                    return structuredClone(this.normalizeSessionsResponse(sessionsPayload));
                }
            } catch (error) {
                console.warn("Falling back to local session data for get(\"sessions\").", error);
                return structuredClone(this.getLocalSessions());
            }
        }
        else if (resource === "session") {
            const sessionID = Number(query?.sessionID);
            if (!Number.isFinite(sessionID)) {
                return null;
            }

            try {
                const apiClient = await this.getApiClient();
                if (apiClient) {
                    const sessionPayload = await apiClient.get(`api/sessions/${sessionID}`);
                    return structuredClone(this.normalizeSingleSessionResponse(sessionPayload));
                }

                if (this.apiBaseUrl) {
                    const response = await fetch(`${this.apiBaseUrl}/api/sessions/${sessionID}`);
                    if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`);
                    }

                    const sessionPayload = await response.json();
                    return structuredClone(this.normalizeSingleSessionResponse(sessionPayload));
                }
            } catch (error) {
                console.warn(`Falling back to local session data for get("session", { sessionID: ${sessionID} }).`, error);
            }

            const session = db_connection.data.sessions.find((entry) => entry.sessionID === sessionID);
            return structuredClone(session ? this.normalizeSessionForRead(session) : null);
        }
        else if (resource === "attendee") {
            const sessionID = Number(query?.sessionID);
            const personID = Number(query?.personID);
            if (!Number.isFinite(sessionID) || !Number.isFinite(personID)) {
                return null;
            }

            const session = db_connection.data.sessions.find((entry) => entry.sessionID === sessionID);
            if (!session) {
                return null;
            }

            return structuredClone(this.buildSessionAttendeeCandidate(session, personID));
        }
        else if (resource === "attendees") {
            const sessionID = Number(query?.sessionID);
            if (!Number.isFinite(sessionID)) {
                return structuredClone(this.buildAttendeeDirectoryRecords());
            }

            const session = db_connection.data.sessions.find((entry) => entry.sessionID === sessionID);
            if (!session) {
                return [];
            }

            return structuredClone(this.buildAttendeeRecords(session));
        }
        else if (resource === "attendeeStatuses")
            return structuredClone(db_connection.data.attendeeStatuses);
        else if (resource === "flags")
            return structuredClone(db_connection.data.flags);
        else if (resource === "presenters")
            return structuredClone(
                db_connection.data.members.filter((member) => member[3] === 1)
            );
        else if (resource === "comments") {
            const sessionID = Number(query?.sessionID);
            const personID = Number(query?.personID);
            if (!Number.isFinite(sessionID) || !Number.isFinite(personID)) {
                return {
                    sessionID: null,
                    personID: null,
                    adminComment: "",
                    memberComment: ""
                };
            }

            const comment = db_connection.data.comments.find((entry) => {
                return entry.sessionID === sessionID && entry.personID === personID;
            });

            return structuredClone(comment ?? {
                sessionID,
                personID,
                adminComment: "",
                memberComment: ""
            });
        }
        else if (resource === "sessionTypes")
            return structuredClone(db_connection.data.sessionTypes);
        else if (resource === "EventTypes")
            return structuredClone(db_connection.data.EventTypes);
        else if (resource === "CEUTypes")
            return structuredClone(db_connection.data.CEUTypes);
        return null;
    }

    getLocalSessions() {
        return db_connection.data.sessions.map((session) => this.normalizeSessionForRead(session));
    }

    normalizeSessionsResponse(sessionsPayload) {
        const normalizedPayload = this.parseStructuredPayload(sessionsPayload);
        const sessions = this.extractSessionsArray(normalizedPayload);
        if (!Array.isArray(sessions)) {
            const payloadDescription = this.describePayloadShape(normalizedPayload);
            throw new Error(`Unsupported sessions response shape (${payloadDescription})`);
        }

        return sessions
            .map((session) => this.normalizeSessionRecordForRead(session))
            .filter((session) => session !== null);
    }

    normalizeSingleSessionResponse(sessionPayload) {
        const normalizedPayload = this.parseStructuredPayload(sessionPayload);
        const session = this.extractSessionRecord(normalizedPayload);
        if (session === null) {
            const payloadDescription = this.describePayloadShape(normalizedPayload);
            throw new Error(`Unsupported session response shape (${payloadDescription})`);
        }

        const normalizedSession = this.normalizeSessionRecordForRead(session);
        if (normalizedSession === null) {
            throw new Error("Unsupported session response record");
        }

        return normalizedSession;
    }

    extractSessionsArray(sessionsPayload) {
        const normalizedPayload = this.parseStructuredPayload(sessionsPayload);
        if (normalizedPayload !== sessionsPayload) {
            return this.extractSessionsArray(normalizedPayload);
        }

        if (Array.isArray(normalizedPayload)) {
            return normalizedPayload;
        }

        if (!normalizedPayload || typeof normalizedPayload !== "object") {
            return null;
        }

        for (const key of ["sessions", "data", "results", "items", "records", "rows", "payload"]) {
            const candidate = normalizedPayload[key];
            if (Array.isArray(candidate)) {
                return candidate;
            }

            if (candidate && typeof candidate === "object") {
                const nestedSessions = this.extractSessionsArray(candidate);
                if (Array.isArray(nestedSessions)) {
                    return nestedSessions;
                }
            }
        }

        const objectValues = Object.values(normalizedPayload);
        if (objectValues.length > 0 && objectValues.every((value) => value && typeof value === "object" && !Array.isArray(value))) {
            const sessionRecords = objectValues.filter((value) => this.isSessionRecord(value));
            if (sessionRecords.length > 0) {
                return sessionRecords;
            }
        }

        return null;
    }

    extractSessionRecord(sessionPayload) {
        const normalizedPayload = this.parseStructuredPayload(sessionPayload);
        if (normalizedPayload !== sessionPayload) {
            return this.extractSessionRecord(normalizedPayload);
        }

        if (this.isSessionRecord(normalizedPayload)) {
            return normalizedPayload;
        }

        if (Array.isArray(normalizedPayload)) {
            const sessionRecord = normalizedPayload.find((candidate) => this.isSessionRecord(candidate));
            return sessionRecord ?? null;
        }

        if (!normalizedPayload || typeof normalizedPayload !== "object") {
            return null;
        }

        for (const key of ["session", "data", "result", "item", "record", "row", "payload"]) {
            const candidate = normalizedPayload[key];
            if (this.isSessionRecord(candidate)) {
                return candidate;
            }

            if (candidate && typeof candidate === "object") {
                const nestedRecord = this.extractSessionRecord(candidate);
                if (nestedRecord !== null) {
                    return nestedRecord;
                }
            }
        }

        const objectValues = Object.values(normalizedPayload);
        const sessionRecord = objectValues.find((candidate) => this.isSessionRecord(candidate));
        return sessionRecord ?? null;
    }

    parseStructuredPayload(payload) {
        if (typeof payload !== "string") {
            return payload;
        }

        const trimmedPayload = payload.trim();
        if (trimmedPayload === "") {
            return payload;
        }

        const looksLikeJson = (
            (trimmedPayload.startsWith("{") && trimmedPayload.endsWith("}"))
            || (trimmedPayload.startsWith("[") && trimmedPayload.endsWith("]"))
        );
        if (!looksLikeJson) {
            return payload;
        }

        try {
            return JSON.parse(trimmedPayload);
        } catch (_error) {
            return payload;
        }
    }

    describePayloadShape(payload) {
        if (payload && typeof payload === "object") {
            return `keys: ${Object.keys(payload).join(", ")}`;
        }

        if (typeof payload === "string") {
            const preview = payload.trim().slice(0, 80).replace(/\s+/g, " ");
            return preview === ""
                ? "type: string (empty)"
                : `type: string, preview: ${preview}`;
        }

        return `type: ${typeof payload}`;
    }

    normalizeSessionRecordForRead(session) {
        if (!this.isSessionRecord(session)) {
            return null;
        }

        const normalizedSession = structuredClone(session);
        if (!Array.isArray(normalizedSession.Attendees) && Array.isArray(normalizedSession.attendees)) {
            normalizedSession.Attendees = normalizedSession.attendees;
        }

        const attendeeCount = Number(normalizedSession.AttendeesCt);
        normalizedSession.AttendeesCt = Number.isFinite(attendeeCount)
            ? attendeeCount
            : (Array.isArray(normalizedSession.Attendees) ? normalizedSession.Attendees.length : 0);

        return this.normalizeSessionForRead(normalizedSession);
    }

    isSessionRecord(value) {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            return false;
        }

        return Number.isFinite(Number(value.sessionID))
            || typeof value.SessionTitle === "string"
            || typeof value.Date === "string"
            || Array.isArray(value.Attendees)
            || Array.isArray(value.attendees);
    }

    async set(resource, value) {
        if (resource === "sessionLock") {
            return structuredClone(this.updateSessionLock(value));
        }

        if (resource === "comments") {
            const sessionID = Number(value?.sessionID);
            const personID = Number(value?.personID);
            if (!Number.isFinite(sessionID) || !Number.isFinite(personID)) {
                return null;
            }

            const commentData = {
                sessionID,
                personID,
                adminComment: String(value?.adminComment ?? ""),
                memberComment: String(value?.memberComment ?? "")
            };

            const existingCommentIndex = db_connection.data.comments.findIndex((entry) => {
                return entry.sessionID === sessionID && entry.personID === personID;
            });

            if (existingCommentIndex >= 0) {
                db_connection.data.comments[existingCommentIndex] = commentData;
            } else {
                db_connection.data.comments.push(commentData);
            }

            return commentData;
        }

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

    updateSessionLock(value) {
        const sessionID = Number(value?.sessionID);
        if (!Number.isFinite(sessionID)) {
            return null;
        }

        const session = db_connection.data.sessions.find((entry) => entry.sessionID === sessionID);
        if (!session) {
            return null;
        }

        session.Lock = Number(value?.lock) === 1 ? 1 : 0;

        const lockerName = String(value?.locker ?? "").trim();
        session.Locker = lockerName === "" ? null : lockerName;

        return this.normalizeSessionForRead(session);
    }

    async put(resource, value) {
        /*
            {
            sessionID: 3,
            certifiedByUserID: 1,
            attendees: [
                {
                personID: 10,
                certStatusID: 1,
                dateRangeStart: "2026-03-24", // or null
                dateRangeEnd: null,           // or "2026-03-30"
                ridCertified: false,
                ridCertifiedAt: null          // or ISO datetime string
                }
            ]
            }
        */
        if (resource === "sessionAttendees") {
            return structuredClone(this.updateSessionAttendees(value));
        }

        if (resource === "attendeeRIDCertifications") {
            return structuredClone(this.updateAttendeeRIDCertifications(value));
        }

        if (resource !== "session") {
            return null;
        }
        /*
        {
            sessionID: #|null,
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
        const sessionID = value?.sessionID;
        if (sessionID === null) {
            const nextSessionID = this.getNextSessionID();
            const newSession = this.buildSessionRecord(value, nextSessionID);
            db_connection.data.sessions.push(newSession);
            return structuredClone(newSession);
        }

        const numericSessionID = Number(sessionID);
        if (!Number.isFinite(numericSessionID)) {
            return null;
        }

        const existingSession = db_connection.data.sessions.find((session) => session.sessionID === numericSessionID);
        if (!existingSession) {
            return null;
        }

        const updatedSession = this.buildSessionRecord(value, numericSessionID, existingSession);
        Object.assign(existingSession, updatedSession);
        return structuredClone(existingSession);
    }

    getNextSessionID() {
        return db_connection.data.sessions
            .map((session) => Number(session.sessionID))
            .filter((sessionID) => Number.isFinite(sessionID))
            .reduce((maxSessionID, sessionID) => Math.max(maxSessionID, sessionID), 0) + 1;
    }

    buildSessionRecord(value, sessionID, existingSession = null) {
        const sessionTypeID = this.normalizeOptionId(value?.sessionType) ?? existingSession?.SessionTypeID ?? null;
        const eventTypeID = this.normalizeOptionId(value?.eventType) ?? existingSession?.EventTypeID ?? null;
        const ceuTypeID = this.normalizeOptionId(value?.ceuType) ?? existingSession?.CEUTypeID ?? null;
        const sessionTypeLabel = this.getOptionLabel("sessionTypes", sessionTypeID) ?? existingSession?.SessionType ?? "";
        const eventTypeLabel = this.getOptionLabel("EventTypes", eventTypeID) ?? existingSession?.EventType ?? "";
        const ceuTypeLabel = this.getOptionLabel("CEUTypes", ceuTypeID);
        const ceuQualify = String(value?.ceuQualify ?? existingSession?.CEUQualify ?? "No");
        const ceuWeight = ceuQualify === "Yes"
            ? (Number(value?.ceuWeight) > 0 ? Number(value.ceuWeight) : (existingSession?.CEUWeight ?? 0))
            : 0;

        return {
            sessionID,
            Date: this.formatDateOption(value?.dateOption) ?? existingSession?.Date ?? "",
            SessionTitle: String(value?.sessionTitle ?? existingSession?.SessionTitle ?? "").trim(),
            Length: Number(value?.length) > 0 ? Number(value.length) : (existingSession?.Length ?? 0),
            SessionType: sessionTypeLabel,
            SessionTypeID: sessionTypeID,
            CEUWeight: ceuWeight,
            CEUConsideration: ceuTypeLabel ?? existingSession?.CEUConsideration ?? (ceuQualify === "No" ? "None" : ""),
            CEUTypeID: ceuTypeID,
            CEUQualify: ceuQualify,
            RIDQualify: this.formatYesNoLabel(value?.ridQualified ?? existingSession?.RIDQualify ?? "No"),
            EventType: eventTypeLabel,
            EventTypeID: eventTypeID,
            ParentType: String(value?.parentEvent ?? existingSession?.ParentType ?? "").trim(),
            Organizer: String(value?.organizer ?? existingSession?.Organizer ?? "").trim(),
            AttendeesCt: existingSession?.AttendeesCt ?? 0,
            Lock: existingSession?.Lock ?? 0,
            Locker: existingSession?.Locker ?? null,
            Attendees: structuredClone(existingSession?.Attendees ?? []),
            FlagIDs: Array.isArray(value?.flags)
                ? value.flags.filter((flagId) => Number.isFinite(Number(flagId))).map((flagId) => Number(flagId))
                : structuredClone(existingSession?.FlagIDs ?? []),
            PresenterIDs: Array.isArray(value?.presenters)
                ? value.presenters.filter((personId) => Number.isFinite(Number(personId))).map((personId) => Number(personId))
                : structuredClone(existingSession?.PresenterIDs ?? [])
        };
    }

    buildAttendeeRecords(session) {
        const sessionID = Number(session?.sessionID);
        const attendeeEntries = this.normalizeStoredAttendeeEntries(session?.Attendees, session);

        return attendeeEntries.map((attendeeEntry) => {
            const attendeeComments = db_connection.data.comments.find((commentEntry) => {
                return commentEntry.sessionID === sessionID && commentEntry.personID === Number(attendeeEntry.personID);
            });
            const ridCertification = this.getRIDCertificationRecord(sessionID, attendeeEntry.personID);
            const normalizedStatusID = this.normalizeAttendeeStatusId(attendeeEntry.certStatusID);
            const certStatusLabel = this.getAttendeeStatusLabel(normalizedStatusID);
            const dateRangeDisplay = this.buildAttendeeDateRangeDisplay(
                attendeeEntry.dateRangeStart,
                attendeeEntry.dateRangeEnd,
                session
            );

            return {
                sessionID,
                personID: Number(attendeeEntry.personID),
                name: String(attendeeEntry.name ?? "").trim(),
                email: String(attendeeEntry.email ?? "").trim(),
                dateRangeStart: attendeeEntry.dateRangeStart,
                dateRangeEnd: attendeeEntry.dateRangeEnd,
                dateRangeDisplay,
                dateRange: dateRangeDisplay,
                certStatusID: normalizedStatusID,
                certStatus: certStatusLabel,
                certStatusLabel,
                ridCertified: ridCertification !== null,
                ridCertifiedAt: ridCertification?.certifiedAt ?? null,
                ridCertifiedByUserID: ridCertification?.certifiedByUserID ?? null,
                adminComment: String(attendeeComments?.adminComment ?? ""),
                memberComment: String(attendeeComments?.memberComment ?? "")
            };
        });
    }

    buildAttendeeDirectoryRecords() {
        const attendeeDirectory = new Map();

        for (const memberEntry of db_connection.data.members) {
            if (Number(memberEntry?.[2]) !== 1) {
                continue;
            }

            const attendeeRecord = this.buildAttendeeDirectoryRecord(memberEntry?.[4], memberEntry?.[0], memberEntry?.[1]);
            if (!attendeeRecord) {
                continue;
            }

            attendeeDirectory.set(attendeeRecord.personID, attendeeRecord);
        }

        for (const session of db_connection.data.sessions) {
            const attendeeEntries = this.normalizeStoredAttendeeEntries(session?.Attendees, session);
            for (const attendeeEntry of attendeeEntries) {
                const attendeeRecord = this.buildAttendeeDirectoryRecord(attendeeEntry?.personID, attendeeEntry?.name, attendeeEntry?.email);
                if (!attendeeRecord || attendeeDirectory.has(attendeeRecord.personID)) {
                    continue;
                }

                attendeeDirectory.set(attendeeRecord.personID, attendeeRecord);
            }
        }

        return Array.from(attendeeDirectory.values()).sort((leftAttendee, rightAttendee) => {
            return leftAttendee.name.localeCompare(rightAttendee.name)
                || leftAttendee.email.localeCompare(rightAttendee.email)
                || leftAttendee.personID - rightAttendee.personID;
        });
    }

    buildAttendeeDirectoryRecord(personID, name, email) {
        const numericPersonID = Number(personID);
        const normalizedName = String(name ?? "").trim();
        const normalizedEmail = String(email ?? "").trim();
        if (!Number.isFinite(numericPersonID) || normalizedName === "" || normalizedEmail === "") {
            return null;
        }

        return {
            personID: numericPersonID,
            name: normalizedName,
            email: normalizedEmail,
            label: `${normalizedName} (${normalizedEmail})`
        };
    }

    getAttendeeDirectoryRecord(personID) {
        const numericPersonID = Number(personID);
        if (!Number.isFinite(numericPersonID)) {
            return null;
        }

        const attendeeMemberEntry = db_connection.data.members.find((memberEntry) => {
            return Number(memberEntry?.[4]) === numericPersonID && Number(memberEntry?.[2]) === 1;
        });
        if (attendeeMemberEntry) {
            return this.buildAttendeeDirectoryRecord(attendeeMemberEntry[4], attendeeMemberEntry[0], attendeeMemberEntry[1]);
        }

        for (const session of db_connection.data.sessions) {
            const attendeeEntries = this.normalizeStoredAttendeeEntries(session?.Attendees, session);
            const attendeeEntry = attendeeEntries.find((sessionAttendeeEntry) => {
                return Number(sessionAttendeeEntry?.personID) === numericPersonID;
            });
            if (attendeeEntry) {
                return this.buildAttendeeDirectoryRecord(attendeeEntry.personID, attendeeEntry.name, attendeeEntry.email);
            }
        }

        return null;
    }

    buildSessionAttendeeCandidate(session, personID) {
        const existingAttendeeRecord = this.buildAttendeeRecords(session).find((attendee) => {
            return attendee.personID === Number(personID);
        });
        if (existingAttendeeRecord) {
            return existingAttendeeRecord;
        }

        const attendeeDirectoryRecord = this.getAttendeeDirectoryRecord(personID);
        if (!attendeeDirectoryRecord) {
            return null;
        }

        const sessionID = Number(session?.sessionID);
        const attendeeComments = db_connection.data.comments.find((commentEntry) => {
            return commentEntry.sessionID === sessionID && commentEntry.personID === Number(personID);
        });
        const defaultStatusID = 4;
        const defaultStatusLabel = this.getAttendeeStatusLabel(defaultStatusID);

        return {
            sessionID,
            personID: attendeeDirectoryRecord.personID,
            name: attendeeDirectoryRecord.name,
            email: attendeeDirectoryRecord.email,
            dateRangeStart: null,
            dateRangeEnd: null,
            dateRangeDisplay: this.buildAttendeeDateRangeDisplay(null, null, session),
            dateRange: this.buildAttendeeDateRangeDisplay(null, null, session),
            certStatusID: defaultStatusID,
            certStatus: defaultStatusLabel,
            certStatusLabel: defaultStatusLabel,
            ridCertified: false,
            ridCertifiedAt: null,
            ridCertifiedByUserID: null,
            adminComment: String(attendeeComments?.adminComment ?? ""),
            memberComment: String(attendeeComments?.memberComment ?? "")
        };
    }

    updateAttendeeRIDCertifications(value) {
        const sessionID = Number(value?.sessionID);
        if (!Number.isFinite(sessionID)) {
            return [];
        }

        const session = db_connection.data.sessions.find((entry) => entry.sessionID === sessionID);
        if (!session) {
            return [];
        }

        const certifiedByUserID = this.normalizePositiveInteger(value?.certifiedByUserID);
        const attendeePayload = Array.isArray(value?.attendees) ? value.attendees : [];
        const attendeePayloadMap = new Map();

        for (const attendeeEntry of attendeePayload) {
            const normalizedAttendeeEntry = this.normalizeAttendeeRIDPayloadEntry(attendeeEntry);
            if (normalizedAttendeeEntry === null) {
                continue;
            }

            attendeePayloadMap.set(normalizedAttendeeEntry.personID, normalizedAttendeeEntry);
        }

        const sessionPersonIDs = this.normalizeStoredAttendeeEntries(session.Attendees, session)
            .map((attendeeEntry) => Number(attendeeEntry?.personID))
            .filter((personID) => Number.isFinite(personID));
        const nextRIDCertificates = [];

        for (const personID of sessionPersonIDs) {
            const existingCertification = this.getRIDCertificationRecord(sessionID, personID);
            const attendeeRIDEntry = attendeePayloadMap.get(personID);

            if (!attendeeRIDEntry) {
                if (existingCertification) {
                    nextRIDCertificates.push(existingCertification);
                }
                continue;
            }

            if (attendeeRIDEntry.ridCertified !== true) {
                continue;
            }

            const certifiedAt = attendeeRIDEntry.ridCertifiedAt
                ?? existingCertification?.certifiedAt
                ?? new Date().toISOString();
            const certificationChanged = !existingCertification
                || existingCertification.certifiedAt !== certifiedAt;

            nextRIDCertificates.push({
                sessionID,
                personID,
                certifiedAt,
                certifiedByUserID: certificationChanged
                    ? (certifiedByUserID ?? existingCertification?.certifiedByUserID ?? null)
                    : (existingCertification?.certifiedByUserID ?? certifiedByUserID ?? null)
            });
        }

        db_connection.data.ridCertificates = db_connection.data.ridCertificates
            .filter((certificationEntry) => certificationEntry.sessionID !== sessionID)
            .concat(nextRIDCertificates);

        return this.buildAttendeeRecords(session);
    }

    updateSessionAttendees(value) {
        const sessionID = Number(value?.sessionID);
        if (!Number.isFinite(sessionID)) {
            return [];
        }

        const session = db_connection.data.sessions.find((entry) => entry.sessionID === sessionID);
        if (!session) {
            return [];
        }

        const certifiedByUserID = this.normalizePositiveInteger(value?.certifiedByUserID);
        const attendeePayload = Array.isArray(value?.attendees) ? value.attendees : [];
        const nextAttendeeEntries = [];
        const nextRIDCertificates = [];
        const seenPersonIDs = new Set();

        for (const attendeeEntry of attendeePayload) {
            const normalizedAttendeeEntry = this.normalizeSessionAttendeePayloadEntry(attendeeEntry, session);
            if (!normalizedAttendeeEntry || seenPersonIDs.has(normalizedAttendeeEntry.personID)) {
                continue;
            }

            seenPersonIDs.add(normalizedAttendeeEntry.personID);
            nextAttendeeEntries.push(this.buildStoredAttendeeEntry(normalizedAttendeeEntry));

            if (!normalizedAttendeeEntry.ridCertified) {
                continue;
            }

            const existingCertification = this.getRIDCertificationRecord(sessionID, normalizedAttendeeEntry.personID);
            const certifiedAt = normalizedAttendeeEntry.ridCertifiedAt
                ?? existingCertification?.certifiedAt
                ?? new Date().toISOString();
            const certificationChanged = !existingCertification
                || existingCertification.certifiedAt !== certifiedAt;

            nextRIDCertificates.push({
                sessionID,
                personID: normalizedAttendeeEntry.personID,
                certifiedAt,
                certifiedByUserID: certificationChanged
                    ? (certifiedByUserID ?? existingCertification?.certifiedByUserID ?? null)
                    : (existingCertification?.certifiedByUserID ?? certifiedByUserID ?? null)
            });
        }

        session.Attendees = nextAttendeeEntries;
        session.AttendeesCt = nextAttendeeEntries.length;
        db_connection.data.ridCertificates = db_connection.data.ridCertificates
            .filter((certificationEntry) => certificationEntry.sessionID !== sessionID)
            .concat(nextRIDCertificates);

        return this.buildAttendeeRecords(session);
    }

    normalizeSessionForRead(session) {
        return {
            ...structuredClone(session),
            IsRIDQualifiedSession: this.isRIDQualifiedSession(session),
            IsSelfPacedSession: this.isSelfPacedSession(session),
            Attendees: this.normalizeSessionAttendees(session?.Attendees, session)
        };
    }

    normalizeSessionAttendees(attendeeEntries = [], session = null) {
        return this.normalizeStoredAttendeeEntries(attendeeEntries, session).map((attendeeEntry) => {
            return [
                String(attendeeEntry.name ?? "").trim(),
                String(attendeeEntry.email ?? "").trim(),
                this.buildAttendeeDateRangeDisplay(attendeeEntry.dateRangeStart, attendeeEntry.dateRangeEnd, session),
                this.getAttendeeStatusLabel(attendeeEntry.certStatusID),
                Number(attendeeEntry.personID)
            ];
        });
    }

    getAttendeeStatusLabel(statusValue) {
        const statusID = this.normalizeAttendeeStatusId(statusValue);
        return db_connection.data.attendeeStatuses[statusID] ?? db_connection.data.attendeeStatuses[4];
    }

    getRIDCertificationRecord(sessionID, personID) {
        const numericSessionID = Number(sessionID);
        const numericPersonID = Number(personID);
        if (!Number.isFinite(numericSessionID) || !Number.isFinite(numericPersonID)) {
            return null;
        }

        const certificationEntry = db_connection.data.ridCertificates.find((entry) => {
            return entry.sessionID === numericSessionID && entry.personID === numericPersonID;
        });

        if (!certificationEntry) {
            return null;
        }

        return {
            sessionID: numericSessionID,
            personID: numericPersonID,
            certifiedAt: this.normalizeRIDCertificationDateTime(certificationEntry.certifiedAt),
            certifiedByUserID: this.normalizePositiveInteger(certificationEntry.certifiedByUserID)
        };
    }

    isRIDQualifiedSession(session) {
        return String(session?.RIDQualify ?? "").trim().toLowerCase() === "yes";
    }

    isSelfPacedSession(session) {
        return String(session?.Date ?? "").trim() === "Self Paced";
    }

    normalizeAttendeeStatusId(statusValue) {
        const numericStatusID = Number(statusValue);
        if (Number.isFinite(numericStatusID) && db_connection.data.attendeeStatuses[numericStatusID]) {
            return numericStatusID;
        }

        const normalizedStatusLabel = String(statusValue ?? "").trim().toLowerCase();
        if (normalizedStatusLabel === "") {
            return 4;
        }

        for (const [statusID, statusLabel] of Object.entries(db_connection.data.attendeeStatuses)) {
            if (String(statusLabel).trim().toLowerCase() === normalizedStatusLabel) {
                return Number(statusID);
            }
        }

        if (normalizedStatusLabel === "associate") {
            return 1;
        }

        return 4;
    }

    normalizeAttendeeRIDPayloadEntry(attendeeEntry) {
        const personID = Number(attendeeEntry?.personID);
        if (!Number.isFinite(personID)) {
            return null;
        }

        const ridCertified = attendeeEntry?.ridCertified === true;
        return {
            personID,
            ridCertified,
            ridCertifiedAt: ridCertified ? this.normalizeRIDCertificationDateTime(attendeeEntry?.ridCertifiedAt) : null
        };
    }

    normalizeSessionAttendeePayloadEntry(attendeeEntry, session) {
        const personID = Number(attendeeEntry?.personID);
        if (!Number.isFinite(personID)) {
            return null;
        }

        const attendeeDirectoryRecord = this.getAttendeeDirectoryRecord(personID);
        if (!attendeeDirectoryRecord) {
            return null;
        }

        const certStatusID = this.normalizeAttendeeStatusId(attendeeEntry?.certStatusID);
        const isRIDQualifiedSession = this.isRIDQualifiedSession(session);
        const ridCertified = isRIDQualifiedSession && attendeeEntry?.ridCertified === true;
        const normalizedDateRange = this.normalizeSessionAttendeeDateRange(attendeeEntry, session);

        return {
            personID,
            name: attendeeDirectoryRecord.name,
            email: attendeeDirectoryRecord.email,
            dateRangeStart: normalizedDateRange.dateRangeStart,
            dateRangeEnd: normalizedDateRange.dateRangeEnd,
            certStatusID,
            ridCertified,
            ridCertifiedAt: ridCertified ? this.normalizeRIDCertificationDateTime(attendeeEntry?.ridCertifiedAt) : null
        };
    }

    normalizeSessionAttendeeDateRange(attendeeEntry, session) {
        if (!this.isSelfPacedSession(session)) {
            return {
                dateRangeStart: null,
                dateRangeEnd: null
            };
        }

        const normalizedSeparatedDateRange = this.normalizeAttendeeDateRangeValues(
            attendeeEntry?.dateRangeStart,
            attendeeEntry?.dateRangeEnd,
            session
        );
        if (normalizedSeparatedDateRange.dateRangeStart !== null || normalizedSeparatedDateRange.dateRangeEnd !== null) {
            return normalizedSeparatedDateRange;
        }

        return this.parseLegacyAttendeeDateRange(attendeeEntry?.dateRange, session);
    }

    normalizeStoredAttendeeEntries(attendeeEntries = [], session = null) {
        if (!Array.isArray(attendeeEntries)) {
            return [];
        }

        return attendeeEntries
            .map((attendeeEntry) => this.normalizeStoredAttendeeEntry(attendeeEntry, session))
            .filter((attendeeEntry) => attendeeEntry !== null);
    }

    normalizeStoredAttendeeEntry(attendeeEntry, session = null) {
        if (!Array.isArray(attendeeEntry)) {
            return null;
        }

        const normalizedName = String(attendeeEntry?.[0] ?? "").trim();
        const normalizedEmail = String(attendeeEntry?.[1] ?? "").trim();
        if (normalizedName === "" || normalizedEmail === "") {
            return null;
        }

        const isExpandedTuple = attendeeEntry.length >= 6;
        const dateRangeValues = isExpandedTuple
            ? this.normalizeAttendeeDateRangeValues(attendeeEntry?.[2], attendeeEntry?.[3], session)
            : this.parseLegacyAttendeeDateRange(attendeeEntry?.[2], session);
        const certStatusID = isExpandedTuple ? attendeeEntry?.[4] : attendeeEntry?.[3];
        const personID = Number(isExpandedTuple ? attendeeEntry?.[5] : attendeeEntry?.[4]);
        if (!Number.isFinite(personID)) {
            return null;
        }

        return {
            name: normalizedName,
            email: normalizedEmail,
            dateRangeStart: dateRangeValues.dateRangeStart,
            dateRangeEnd: dateRangeValues.dateRangeEnd,
            certStatusID: this.normalizeAttendeeStatusId(certStatusID),
            personID
        };
    }

    buildStoredAttendeeEntry(attendeeEntry) {
        return [
            String(attendeeEntry?.name ?? "").trim(),
            String(attendeeEntry?.email ?? "").trim(),
            attendeeEntry?.dateRangeStart ?? null,
            attendeeEntry?.dateRangeEnd ?? null,
            this.normalizeAttendeeStatusId(attendeeEntry?.certStatusID),
            Number(attendeeEntry?.personID)
        ];
    }

    normalizeAttendeeDateRangeValues(dateRangeStart, dateRangeEnd, session = null) {
        if (!this.isSelfPacedSession(session)) {
            return {
                dateRangeStart: null,
                dateRangeEnd: null
            };
        }

        const normalizedStartDate = this.normalizeFlexibleDateValue(dateRangeStart);
        const normalizedEndDate = this.normalizeFlexibleDateValue(dateRangeEnd);

        if (normalizedStartDate === null) {
            return {
                dateRangeStart: null,
                dateRangeEnd: null
            };
        }

        if (normalizedEndDate !== null && normalizedEndDate < normalizedStartDate) {
            return {
                dateRangeStart: normalizedStartDate,
                dateRangeEnd: null
            };
        }

        return {
            dateRangeStart: normalizedStartDate,
            dateRangeEnd: normalizedEndDate
        };
    }

    parseLegacyAttendeeDateRange(dateRange, session = null) {
        if (!this.isSelfPacedSession(session)) {
            return {
                dateRangeStart: null,
                dateRangeEnd: null
            };
        }

        const normalizedDateRange = String(dateRange ?? "").trim();
        if (normalizedDateRange === "" || normalizedDateRange.toLowerCase() === "not started") {
            return {
                dateRangeStart: null,
                dateRangeEnd: null
            };
        }

        const [startDate, endDate] = normalizedDateRange.split(/\s+to\s+/i);
        const normalizedStartDate = this.normalizeFlexibleDateValue(startDate);
        if (normalizedStartDate === null) {
            return {
                dateRangeStart: null,
                dateRangeEnd: null
            };
        }

        const normalizedEndDateLabel = String(endDate ?? "").trim().toLowerCase();
        if (normalizedEndDateLabel === "" || normalizedEndDateLabel === "ongoing") {
            return {
                dateRangeStart: normalizedStartDate,
                dateRangeEnd: null
            };
        }

        const normalizedEndDate = this.normalizeFlexibleDateValue(endDate);
        if (normalizedEndDate !== null && normalizedEndDate < normalizedStartDate) {
            return {
                dateRangeStart: normalizedStartDate,
                dateRangeEnd: null
            };
        }

        return {
            dateRangeStart: normalizedStartDate,
            dateRangeEnd: normalizedEndDate
        };
    }

    buildAttendeeDateRangeDisplay(dateRangeStart, dateRangeEnd, session = null) {
        if (!this.isSelfPacedSession(session)) {
            return null;
        }

        const normalizedStartDate = this.normalizeFlexibleDateValue(dateRangeStart);
        const normalizedEndDate = this.normalizeFlexibleDateValue(dateRangeEnd);

        if (normalizedStartDate === null) {
            return "Not started";
        }

        const formattedStartDate = this.formatInputDate(normalizedStartDate);
        if (formattedStartDate === null) {
            return "Not started";
        }

        if (normalizedEndDate === null) {
            return `${formattedStartDate} to Ongoing`;
        }

        const formattedEndDate = this.formatInputDate(normalizedEndDate);
        if (formattedEndDate === null) {
            return `${formattedStartDate} to Ongoing`;
        }

        return `${formattedStartDate} to ${formattedEndDate}`;
    }

    normalizeFlexibleDateValue(dateValue) {
        const normalizedDateValue = String(dateValue ?? "").trim();
        if (normalizedDateValue === "") {
            return null;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDateValue)) {
            return normalizedDateValue;
        }

        const displayDateMatch = normalizedDateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!displayDateMatch) {
            return null;
        }

        const [, month, day, year] = displayDateMatch;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    normalizeRIDCertificationDateTime(value) {
        const normalizedValue = String(value ?? "").trim();
        if (normalizedValue === "") {
            return null;
        }

        const timestamp = Date.parse(normalizedValue);
        if (Number.isNaN(timestamp)) {
            return null;
        }

        return new Date(timestamp).toISOString();
    }

    normalizePositiveInteger(value) {
        const numericValue = Number(value);
        if (!Number.isInteger(numericValue) || numericValue <= 0) {
            return null;
        }

        return numericValue;
    }

    normalizeOptionId(value) {
        const optionId = Number(value);
        return Number.isFinite(optionId) ? optionId : null;
    }

    getOptionLabel(resource, optionId) {
        if (optionId === null || optionId === undefined) {
            return null;
        }

        const resourceData = db_connection.data[resource] ?? {};
        return resourceData[optionId] ?? null;
    }

    formatYesNoLabel(value) {
        return String(value).toLowerCase() === "yes" ? "Yes" : "No";
    }

    formatDateOption(dateOption) {
        if (!Array.isArray(dateOption) || dateOption.length < 3) {
            return null;
        }

        const [dateType, startDate, endDate] = dateOption;
        if (dateType === 3) {
            return "Self Paced";
        }

        if (dateType === 2) {
            const formattedStartDate = this.formatInputDate(startDate);
            const formattedEndDate = this.formatInputDate(endDate);
            if (!formattedStartDate || !formattedEndDate) {
                return null;
            }

            return `${formattedStartDate} to ${formattedEndDate}`;
        }

        const formattedSingleDate = this.formatInputDate(startDate);
        return formattedSingleDate ?? null;
    }

    formatInputDate(dateValue) {
        const normalizedDate = String(dateValue ?? "").trim();
        const parts = normalizedDate.split("-");
        if (parts.length !== 3) {
            return null;
        }

        const [year, month, day] = parts;
        if (year === "" || month === "" || day === "") {
            return null;
        }

        return `${month}/${day}/${year}`;
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
