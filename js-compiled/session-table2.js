(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // js/shims/jquery-global.js
  var jq = window.jQuery || window.$ || window.jquery;
  if (typeof jq !== "function") {
    throw new Error("PDT: jQuery is required before this bundle loads.");
  }

  // js/session-table2/state.js
  var session_state = {
    // "state" is the acknoledgement if on main page or if on a specifc modal.
    "state": "mainPage"
  };

  // js/core/security.js
  var JwtApiClient = class {
    constructor(baseUrl, jwt) {
      this.baseUrl = baseUrl.replace(/\/+$/, "");
      this.jwt = jwt;
    }
    async get(path, extraHeaders = {}) {
      const url = `${this.baseUrl}/${path.replace(/^\/+/, "")}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "ASLTA-PDT-JWT": `Bearer ${this.jwt}`,
          Accept: "application/json",
          ...extraHeaders
        }
      });
      const contentType = response.headers.get("content-type") || "";
      const responseBody = contentType.includes("application/json") ? await response.json() : await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)}`);
      }
      return responseBody;
    }
    async patch(path, extraHeaders = {}, body = void 0) {
      const url = `${this.baseUrl}/${path.replace(/^\/+/, "")}`;
      const headers = {
        "ASLTA-PDT-JWT": `Bearer ${this.jwt}`,
        Accept: "application/json",
        ...extraHeaders
      };
      const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
      if (body !== void 0 && body !== null && !hasContentType) {
        headers["Content-Type"] = typeof body === "string" ? "text/plain" : "application/json";
      }
      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: body === void 0 || body === null ? void 0 : typeof body === "string" ? body : JSON.stringify(body)
      });
      const contentType = response.headers.get("content-type") || "";
      const responseBody = contentType.includes("application/json") ? await response.json() : await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)}`);
      }
      return responseBody;
    }
    async put(path, extraHeaders = {}, body = void 0) {
      const url = `${this.baseUrl}/${path.replace(/^\/+/, "")}`;
      const headers = {
        "ASLTA-PDT-JWT": `Bearer ${this.jwt}`,
        Accept: "application/json",
        ...extraHeaders
      };
      const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
      if (body !== void 0 && body !== null && !hasContentType) {
        headers["Content-Type"] = typeof body === "string" ? "text/plain" : "application/json";
      }
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: body === void 0 || body === null ? void 0 : typeof body === "string" ? body : JSON.stringify(body)
      });
      const contentType = response.headers.get("content-type") || "";
      if (response.status === 204) {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return null;
      }
      const responseBody = contentType.includes("application/json") ? await response.json() : await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)}`);
      }
      return responseBody;
    }
    async post(path, extraHeaders = {}, body = void 0) {
      const url = `${this.baseUrl}/${path.replace(/^\/+/, "")}`;
      const headers = {
        "ASLTA-PDT-JWT": `Bearer ${this.jwt}`,
        Accept: "application/json",
        ...extraHeaders
      };
      const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
      if (body !== void 0 && body !== null && !hasContentType) {
        headers["Content-Type"] = typeof body === "string" ? "text/plain" : "application/json";
      }
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: body === void 0 || body === null ? void 0 : typeof body === "string" ? body : JSON.stringify(body)
      });
      const contentType = response.headers.get("content-type") || "";
      if (response.status === 204) {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return null;
      }
      const responseBody = contentType.includes("application/json") ? await response.json() : await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)}`);
      }
      return responseBody;
    }
  };

  // js/core/utilties.js
  var util = class {
    constructor(parameters) {
    }
    static assert(condition, message = "Assertion failed") {
      if (!condition) {
        throw new Error(message);
      }
    }
    /**
     * Normalizing to the standard date format or returns null if the value cannot be parsed.
     * @param {string} dateValue - A date string in YYYY-MM-DD or M/D/YYYY format.
     * @returns {string|null} A date string in YYYY-MM-DD format, or null if invalid.
     */
    static enfDate(dateValue) {
      const normalizedDateValue = String(dateValue != null ? dateValue : "").trim();
      if (normalizedDateValue === "") {
        return null;
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDateValue)) {
        return normalizedDateValue;
      }
      const displayDateMatch = normalizedDateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!displayDateMatch) {
        console.log(normalizedDateValue);
        return null;
      }
      console.warn("enfDate: more than trim was needed.");
      const [, month, day, year] = displayDateMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  };

  // js/session-table2/db_connection.js
  var _db_connection = class _db_connection {
    /**
     * 
     * @param {string} apiBaseUrl 
     *  Can't have trailing '/'
     * @param {string} jwt 
     */
    constructor(apiBaseUrl = null, jwt = null, hostC = null) {
      this.apiBaseUrl = apiBaseUrl;
      this.jwt = jwt;
      this.hostC = hostC;
      if (!apiBaseUrl || !jwt || !hostC) {
        throw new Error("API Base URL, JWT, and or hostC are not present.");
      }
      this.apiClient = new JwtApiClient(apiBaseUrl, jwt);
      this.ensureNormalizedAttendeeDateRanges();
    }
    getApiClient() {
      return this.apiClient;
    }
    ensureNormalizedAttendeeDateRanges() {
      if (_db_connection.attendeeDateRangesNormalized) {
        return;
      }
      for (const session of _db_connection.data.sessions) {
        const normalizedAttendees = this.normalizeStoredAttendeeEntries(session == null ? void 0 : session.Attendees, session);
        session.Attendees = normalizedAttendees.map((attendeeEntry) => this.buildStoredAttendeeEntry(attendeeEntry));
        session.AttendeesCt = session.Attendees.length;
      }
      _db_connection.attendeeDateRangesNormalized = true;
    }
    async get(resource, query = null) {
      if (resource === "sessions") {
        try {
          return structuredClone((await this.apiClient.get("api/sessions"))["sessions"]);
        } catch (error) {
          throw Error("api/sessions is not available");
        }
      } else if (resource === "session") {
        const sessionID = Number(query == null ? void 0 : query.sessionID);
        util.assert(Number.isInteger(sessionID), "sessionID for the get session call is invalid");
        try {
          return structuredClone(await this.apiClient.get(`api/sessions/${sessionID}`));
        } catch (error) {
          throw Error(`api/sessions/${sessionID} is not available`);
        }
      } else if (resource === "attendee") {
        const sessionID = Number(query == null ? void 0 : query.sessionID);
        const personID = Number(query == null ? void 0 : query.personID);
        if (!Number.isInteger(sessionID) || !Number.isInteger(personID)) {
          return null;
        }
        return structuredClone(await this.apiClient.get(`api/sessions/${sessionID}/attendees/${personID}`));
      } else if (resource === "attendees") {
        const sessionID = Number(query == null ? void 0 : query.sessionID);
        util.assert(Number.isInteger(sessionID), `sessionID for get("attendees" needs to be an int. sessionID: ${query == null ? void 0 : query.sessionID}`);
        return structuredClone(await this.apiClient.get(`api/sessions/${sessionID}/attendees`));
      } else if (resource === "attendeesDir")
        return structuredClone(await this.apiClient.get(`api/attendees/directory`));
      else if (resource === "attendeeStatuses")
        return {
          1: "Certified",
          2: "Master",
          3: "None",
          4: "Not Assigned"
        };
      else if (resource === "flags")
        return structuredClone(await this.apiClient.get(`api/lookups/flags`));
      else if (resource === "presenters")
        return (await this.apiClient.get(`api/presenters/directory`))["members"];
      else if (resource === "comments") {
        const sessionID = Number(query == null ? void 0 : query.sessionID);
        const personID = Number(query == null ? void 0 : query.personID);
        util.assert(Number.isInteger(sessionID), "Comment: sessionID needs to be an Integer.");
        util.assert(Number.isInteger(personID), "Comment: personID needs to be an Integer.");
        return await this.apiClient.get(`api/sessions/${sessionID}/attendees/${personID}/comments`);
      } else if (resource === "sessionTypes")
        return await this.apiClient.get(`api/lookups/session-types`);
      else if (resource === "EventTypes")
        return await this.apiClient.get(`api/lookups/event-types`);
      else if (resource === "CEUTypes")
        return await this.apiClient.get(`api/lookups/ceu-types`);
      return null;
    }
    // This should most likely be removed when at final verison.
    parseStructuredPayload(payload) {
      throw Error("parseStructuredPayload should not be called.");
    }
    describePayloadShape(payload) {
      throw Error("describePayloadShape should not be called.");
    }
    normalizeSessionRecordForRead(session) {
      throw Error("normalizeSessionRecordForRead should not be called.");
    }
    isSessionRecord(value) {
      throw Error("isSessionRecord should not be called.");
    }
    async set(resource, value) {
      var _a, _b, _c, _d, _e, _f;
      if (resource === "sessionLock") {
        return structuredClone(await this.updateSessionLock(value));
      }
      if (resource === "comments") {
        const sessionID = Number(value == null ? void 0 : value.sessionID);
        const personID = Number(value == null ? void 0 : value.personID);
        if (!Number.isFinite(sessionID) || !Number.isFinite(personID)) {
          return null;
        }
        const commentData = {
          sessionID,
          personID,
          adminComment: String((_a = value == null ? void 0 : value.adminComment) != null ? _a : ""),
          memberComment: String((_b = value == null ? void 0 : value.memberComment) != null ? _b : "")
        };
        const savedComment = await this.apiClient.put(
          `api/sessions/${sessionID}/attendees/${personID}/comments`,
          { "Content-Type": "text/plain" },
          JSON.stringify(commentData)
        );
        const normalizedComment = {
          sessionID,
          personID,
          adminComment: String((_d = (_c = savedComment == null ? void 0 : savedComment.adminComment) != null ? _c : commentData.adminComment) != null ? _d : ""),
          memberComment: String((_f = (_e = savedComment == null ? void 0 : savedComment.memberComment) != null ? _e : commentData.memberComment) != null ? _f : "")
        };
        console.log("put comments", savedComment);
        return normalizedComment;
      }
      if (!["sessionTypes", "EventTypes", "CEUTypes"].includes(resource)) {
        return -1;
      }
      const label = String(value != null ? value : "").trim();
      if (label === "") {
        return -1;
      }
      let lookupEndpoint = "";
      if (resource === "sessionTypes") {
        lookupEndpoint = "api/lookups/session-types";
      } else if (resource === "EventTypes") {
        lookupEndpoint = "api/lookups/event-types";
      } else {
        lookupEndpoint = "api/lookups/ceu-types";
      }
      const response = await this.apiClient.post(
        lookupEndpoint,
        { "Content-Type": "text/plain" },
        JSON.stringify({ value: label })
      );
      const newID = Number(response == null ? void 0 : response.newID);
      if (!Number.isFinite(newID)) {
        return -1;
      }
      return newID;
    }
    // kiuytfrdc
    async updateSessionLock(value) {
      const sessionID = Number(value == null ? void 0 : value.sessionID);
      util.assert(Number.isInteger(sessionID), "updateSessionLock: sessionID needs to be an Int.");
      const userID = Number(await this.hostC.get("userID"));
      util.assert(Number.isInteger(userID), "updateSessionLock: userID needs to be an Int.");
      const updatedSession = await this.apiClient.patch(
        `api/sessions/${sessionID}/lock`,
        { "Content-Type": "text/plain" },
        { lockerWPID: userID }
      );
      if (updatedSession && typeof updatedSession === "object") {
        return this.normalizeSessionForRead(updatedSession);
      }
      return updatedSession;
    }
    async put(resource, value) {
      if (resource === "sessionAttendees") {
        const sessionID2 = Number(value == null ? void 0 : value.sessionID);
        if (!Number.isInteger(sessionID2)) {
          return [];
        }
        await this.apiClient.put(
          `api/sessions/${sessionID2}/attendees`,
          { "Content-Type": "text/plain" },
          {
            certifiedByUserID: this.normalizePositiveInteger(value == null ? void 0 : value.certifiedByUserID),
            attendees: Array.isArray(value == null ? void 0 : value.attendees) ? structuredClone(value.attendees) : []
          }
        );
        return structuredClone(await this.apiClient.get(`api/sessions/${sessionID2}/attendees`));
      }
      if (resource === "attendeeRIDCertifications") {
        return structuredClone(this.updateAttendeeRIDCertifications(value));
      }
      if (resource !== "session") {
        return null;
      }
      const sessionID = value == null ? void 0 : value.sessionID;
      if (sessionID === null) {
        const nextSessionID = this.getNextSessionID();
        const newSession = this.buildSessionRecord(value, nextSessionID);
        _db_connection.data.sessions.push(newSession);
        return structuredClone(newSession);
      }
      const numericSessionID = Number(sessionID);
      if (!Number.isFinite(numericSessionID)) {
        return null;
      }
      const existingSession = _db_connection.data.sessions.find((session) => session.sessionID === numericSessionID);
      if (!existingSession) {
        return null;
      }
      const updatedSession = this.buildSessionRecord(value, numericSessionID, existingSession);
      Object.assign(existingSession, updatedSession);
      return structuredClone(existingSession);
    }
    getNextSessionID() {
      return _db_connection.data.sessions.map((session) => Number(session.sessionID)).filter((sessionID) => Number.isFinite(sessionID)).reduce((maxSessionID, sessionID) => Math.max(maxSessionID, sessionID), 0) + 1;
    }
    buildSessionRecord(value, sessionID, existingSession = null) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E;
      const sessionTypeID = (_b = (_a = this.normalizeOptionId(value == null ? void 0 : value.sessionType)) != null ? _a : existingSession == null ? void 0 : existingSession.SessionTypeID) != null ? _b : null;
      const eventTypeID = (_d = (_c = this.normalizeOptionId(value == null ? void 0 : value.eventType)) != null ? _c : existingSession == null ? void 0 : existingSession.EventTypeID) != null ? _d : null;
      const ceuTypeID = (_f = (_e = this.normalizeOptionId(value == null ? void 0 : value.ceuType)) != null ? _e : existingSession == null ? void 0 : existingSession.CEUTypeID) != null ? _f : null;
      const sessionTypeLabel = (_h = (_g = this.getOptionLabel("sessionTypes", sessionTypeID)) != null ? _g : existingSession == null ? void 0 : existingSession.SessionType) != null ? _h : "";
      const eventTypeLabel = (_j = (_i = this.getOptionLabel("EventTypes", eventTypeID)) != null ? _i : existingSession == null ? void 0 : existingSession.EventType) != null ? _j : "";
      const ceuTypeLabel = this.getOptionLabel("CEUTypes", ceuTypeID);
      const ceuQualify = String((_l = (_k = value == null ? void 0 : value.ceuQualify) != null ? _k : existingSession == null ? void 0 : existingSession.CEUQualify) != null ? _l : "No");
      const ceuWeight = ceuQualify === "Yes" ? Number(value == null ? void 0 : value.ceuWeight) > 0 ? Number(value.ceuWeight) : (_m = existingSession == null ? void 0 : existingSession.CEUWeight) != null ? _m : 0 : 0;
      return {
        sessionID,
        Date: (_o = (_n = this.formatDateOption(value == null ? void 0 : value.dateOption)) != null ? _n : existingSession == null ? void 0 : existingSession.Date) != null ? _o : "",
        SessionTitle: String((_q = (_p = value == null ? void 0 : value.sessionTitle) != null ? _p : existingSession == null ? void 0 : existingSession.SessionTitle) != null ? _q : "").trim(),
        Length: Number(value == null ? void 0 : value.length) > 0 ? Number(value.length) : (_r = existingSession == null ? void 0 : existingSession.Length) != null ? _r : 0,
        SessionType: sessionTypeLabel,
        SessionTypeID: sessionTypeID,
        CEUWeight: ceuWeight,
        CEUConsideration: (_s = ceuTypeLabel != null ? ceuTypeLabel : existingSession == null ? void 0 : existingSession.CEUConsideration) != null ? _s : ceuQualify === "No" ? "None" : "",
        CEUTypeID: ceuTypeID,
        CEUQualify: ceuQualify,
        RIDQualify: this.formatYesNoLabel((_u = (_t = value == null ? void 0 : value.ridQualified) != null ? _t : existingSession == null ? void 0 : existingSession.RIDQualify) != null ? _u : "No"),
        EventType: eventTypeLabel,
        EventTypeID: eventTypeID,
        ParentType: String((_w = (_v = value == null ? void 0 : value.parentEvent) != null ? _v : existingSession == null ? void 0 : existingSession.ParentType) != null ? _w : "").trim(),
        Organizer: String((_y = (_x = value == null ? void 0 : value.organizer) != null ? _x : existingSession == null ? void 0 : existingSession.Organizer) != null ? _y : "").trim(),
        AttendeesCt: (_z = existingSession == null ? void 0 : existingSession.AttendeesCt) != null ? _z : 0,
        Lock: (_A = existingSession == null ? void 0 : existingSession.Lock) != null ? _A : 0,
        Locker: (_B = existingSession == null ? void 0 : existingSession.Locker) != null ? _B : null,
        Attendees: structuredClone((_C = existingSession == null ? void 0 : existingSession.Attendees) != null ? _C : []),
        FlagIDs: Array.isArray(value == null ? void 0 : value.flags) ? value.flags.filter((flagId) => Number.isFinite(Number(flagId))).map((flagId) => Number(flagId)) : structuredClone((_D = existingSession == null ? void 0 : existingSession.FlagIDs) != null ? _D : []),
        PresenterIDs: Array.isArray(value == null ? void 0 : value.presenters) ? value.presenters.filter((personId) => Number.isFinite(Number(personId))).map((personId) => Number(personId)) : structuredClone((_E = existingSession == null ? void 0 : existingSession.PresenterIDs) != null ? _E : [])
      };
    }
    buildAttendeeRecords(session) {
      const sessionID = Number(session == null ? void 0 : session.sessionID);
      const attendeeEntries = this.normalizeStoredAttendeeEntries(session == null ? void 0 : session.Attendees, session);
      return attendeeEntries.map((attendeeEntry) => {
        var _a, _b, _c, _d, _e, _f;
        const attendeeComments = _db_connection.data.comments.find((commentEntry) => {
          return commentEntry.sessionID === sessionID && commentEntry.personID === Number(attendeeEntry.personID);
        });
        const ridCertification = this.getRIDCertificationRecord(sessionID, attendeeEntry.personID);
        const normalizedStatusID = this.normalizeAttendeeStatusId(attendeeEntry.certStatusID);
        const dateRangeDisplay = this.buildAttendeeDateRangeDisplay(
          attendeeEntry.dateRangeStart,
          attendeeEntry.dateRangeEnd,
          session
        );
        return {
          sessionID,
          personID: Number(attendeeEntry.personID),
          name: String((_a = attendeeEntry.name) != null ? _a : "").trim(),
          email: String((_b = attendeeEntry.email) != null ? _b : "").trim(),
          dateRangeStart: attendeeEntry.dateRangeStart,
          dateRangeEnd: attendeeEntry.dateRangeEnd,
          dateRangeDisplay,
          certStatusID: normalizedStatusID,
          ridCertified: ridCertification !== null,
          ridCertifiedAt: (_c = ridCertification == null ? void 0 : ridCertification.certifiedAt) != null ? _c : null,
          ridCertifiedByUserID: (_d = ridCertification == null ? void 0 : ridCertification.certifiedByUserID) != null ? _d : null,
          adminComment: String((_e = attendeeComments == null ? void 0 : attendeeComments.adminComment) != null ? _e : ""),
          memberComment: String((_f = attendeeComments == null ? void 0 : attendeeComments.memberComment) != null ? _f : "")
        };
      });
    }
    buildAttendeeDirectoryRecords() {
      const attendeeDirectory = /* @__PURE__ */ new Map();
      for (const memberEntry of _db_connection.data.members) {
        if (Number(memberEntry == null ? void 0 : memberEntry[2]) !== 1) {
          continue;
        }
        const attendeeRecord = this.buildAttendeeDirectoryRecord(memberEntry == null ? void 0 : memberEntry[4], memberEntry == null ? void 0 : memberEntry[0], memberEntry == null ? void 0 : memberEntry[1]);
        if (!attendeeRecord) {
          continue;
        }
        attendeeDirectory.set(attendeeRecord.personID, attendeeRecord);
      }
      for (const session of _db_connection.data.sessions) {
        const attendeeEntries = this.normalizeStoredAttendeeEntries(session == null ? void 0 : session.Attendees, session);
        for (const attendeeEntry of attendeeEntries) {
          const attendeeRecord = this.buildAttendeeDirectoryRecord(attendeeEntry == null ? void 0 : attendeeEntry.personID, attendeeEntry == null ? void 0 : attendeeEntry.name, attendeeEntry == null ? void 0 : attendeeEntry.email);
          if (!attendeeRecord || attendeeDirectory.has(attendeeRecord.personID)) {
            continue;
          }
          attendeeDirectory.set(attendeeRecord.personID, attendeeRecord);
        }
      }
      return Array.from(attendeeDirectory.values()).sort((leftAttendee, rightAttendee) => {
        return leftAttendee.name.localeCompare(rightAttendee.name) || leftAttendee.email.localeCompare(rightAttendee.email) || leftAttendee.personID - rightAttendee.personID;
      });
    }
    buildAttendeeDirectoryRecord(personID, name, email) {
      const numericPersonID = Number(personID);
      const normalizedName = String(name != null ? name : "").trim();
      const normalizedEmail = String(email != null ? email : "").trim();
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
      const attendeeMemberEntry = _db_connection.data.members.find((memberEntry) => {
        return Number(memberEntry == null ? void 0 : memberEntry[4]) === numericPersonID && Number(memberEntry == null ? void 0 : memberEntry[2]) === 1;
      });
      if (attendeeMemberEntry) {
        return this.buildAttendeeDirectoryRecord(attendeeMemberEntry[4], attendeeMemberEntry[0], attendeeMemberEntry[1]);
      }
      for (const session of _db_connection.data.sessions) {
        const attendeeEntries = this.normalizeStoredAttendeeEntries(session == null ? void 0 : session.Attendees, session);
        const attendeeEntry = attendeeEntries.find((sessionAttendeeEntry) => {
          return Number(sessionAttendeeEntry == null ? void 0 : sessionAttendeeEntry.personID) === numericPersonID;
        });
        if (attendeeEntry) {
          return this.buildAttendeeDirectoryRecord(attendeeEntry.personID, attendeeEntry.name, attendeeEntry.email);
        }
      }
      return null;
    }
    buildSessionAttendeeCandidate(session, personID) {
      var _a, _b;
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
      const sessionID = Number(session == null ? void 0 : session.sessionID);
      const attendeeComments = _db_connection.data.comments.find((commentEntry) => {
        return commentEntry.sessionID === sessionID && commentEntry.personID === Number(personID);
      });
      const defaultStatusID = 4;
      let theReturn = {
        sessionID,
        personID: attendeeDirectoryRecord.personID,
        name: attendeeDirectoryRecord.name,
        email: attendeeDirectoryRecord.email,
        dateRangeStart: null,
        dateRangeEnd: null,
        dateRangeDisplay: this.buildAttendeeDateRangeDisplay(null, null, session),
        certStatusID: defaultStatusID,
        ridCertified: false,
        ridCertifiedAt: null,
        ridCertifiedByUserID: null,
        adminComment: String((_a = attendeeComments == null ? void 0 : attendeeComments.adminComment) != null ? _a : ""),
        memberComment: String((_b = attendeeComments == null ? void 0 : attendeeComments.memberComment) != null ? _b : "")
      };
      return theReturn;
    }
    updateAttendeeRIDCertifications(value) {
      var _a, _b, _c, _d, _e;
      const sessionID = Number(value == null ? void 0 : value.sessionID);
      if (!Number.isFinite(sessionID)) {
        return [];
      }
      const session = _db_connection.data.sessions.find((entry) => entry.sessionID === sessionID);
      if (!session) {
        return [];
      }
      const certifiedByUserID = this.normalizePositiveInteger(value == null ? void 0 : value.certifiedByUserID);
      const attendeePayload = Array.isArray(value == null ? void 0 : value.attendees) ? value.attendees : [];
      const attendeePayloadMap = /* @__PURE__ */ new Map();
      for (const attendeeEntry of attendeePayload) {
        const normalizedAttendeeEntry = this.normalizeAttendeeRIDPayloadEntry(attendeeEntry);
        if (normalizedAttendeeEntry === null) {
          continue;
        }
        attendeePayloadMap.set(normalizedAttendeeEntry.personID, normalizedAttendeeEntry);
      }
      const sessionPersonIDs = this.normalizeStoredAttendeeEntries(session.Attendees, session).map((attendeeEntry) => Number(attendeeEntry == null ? void 0 : attendeeEntry.personID)).filter((personID) => Number.isFinite(personID));
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
        const certifiedAt = (_b = (_a = attendeeRIDEntry.ridCertifiedAt) != null ? _a : existingCertification == null ? void 0 : existingCertification.certifiedAt) != null ? _b : (/* @__PURE__ */ new Date()).toISOString();
        const certificationChanged = !existingCertification || existingCertification.certifiedAt !== certifiedAt;
        nextRIDCertificates.push({
          sessionID,
          personID,
          certifiedAt,
          certifiedByUserID: certificationChanged ? (_c = certifiedByUserID != null ? certifiedByUserID : existingCertification == null ? void 0 : existingCertification.certifiedByUserID) != null ? _c : null : (_e = (_d = existingCertification == null ? void 0 : existingCertification.certifiedByUserID) != null ? _d : certifiedByUserID) != null ? _e : null
        });
      }
      _db_connection.data.ridCertificates = _db_connection.data.ridCertificates.filter((certificationEntry) => certificationEntry.sessionID !== sessionID).concat(nextRIDCertificates);
      return this.buildAttendeeRecords(session);
    }
    normalizeSessionForRead(session) {
      return {
        ...structuredClone(session),
        IsRIDQualifiedSession: this.isRIDQualifiedSession(session),
        IsSelfPacedSession: this.isSelfPacedSession(session),
        Attendees: this.normalizeSessionAttendees(session == null ? void 0 : session.Attendees, session)
      };
    }
    normalizeSessionAttendees(attendeeEntries = [], session = null) {
      return this.normalizeStoredAttendeeEntries(attendeeEntries, session).map((attendeeEntry) => {
        var _a, _b;
        return [
          String((_a = attendeeEntry.name) != null ? _a : "").trim(),
          String((_b = attendeeEntry.email) != null ? _b : "").trim(),
          this.buildAttendeeDateRangeDisplay(attendeeEntry.dateRangeStart, attendeeEntry.dateRangeEnd, session),
          this.getAttendeeStatusLabel(attendeeEntry.certStatusID),
          Number(attendeeEntry.personID)
        ];
      });
    }
    getAttendeeStatusLabel(statusValue) {
      var _a;
      const statusID = this.normalizeAttendeeStatusId(statusValue);
      return (_a = _db_connection.data.attendeeStatuses[statusID]) != null ? _a : _db_connection.data.attendeeStatuses[4];
    }
    getRIDCertificationRecord(sessionID, personID) {
      const numericSessionID = Number(sessionID);
      const numericPersonID = Number(personID);
      if (!Number.isFinite(numericSessionID) || !Number.isFinite(numericPersonID)) {
        return null;
      }
      const certificationEntry = _db_connection.data.ridCertificates.find((entry) => {
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
      var _a;
      return String((_a = session == null ? void 0 : session.RIDQualify) != null ? _a : "").trim().toLowerCase() === "yes";
    }
    isSelfPacedSession(session) {
      var _a;
      return String((_a = session == null ? void 0 : session.Date) != null ? _a : "").trim() === "Self Paced";
    }
    normalizeAttendeeStatusId(statusValue) {
      const numericStatusID = Number(statusValue);
      if (Number.isFinite(numericStatusID) && _db_connection.data.attendeeStatuses[numericStatusID]) {
        return numericStatusID;
      }
      const normalizedStatusLabel = String(statusValue != null ? statusValue : "").trim().toLowerCase();
      if (normalizedStatusLabel === "") {
        return 4;
      }
      for (const [statusID, statusLabel] of Object.entries(_db_connection.data.attendeeStatuses)) {
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
      const personID = Number(attendeeEntry == null ? void 0 : attendeeEntry.personID);
      if (!Number.isFinite(personID)) {
        return null;
      }
      const ridCertified = (attendeeEntry == null ? void 0 : attendeeEntry.ridCertified) === true;
      return {
        personID,
        ridCertified,
        ridCertifiedAt: ridCertified ? this.normalizeRIDCertificationDateTime(attendeeEntry == null ? void 0 : attendeeEntry.ridCertifiedAt) : null
      };
    }
    /**
     * 
     * @param {*} attendeeEntries 
     * @param {*} session 
     * @returns 
     * 
     */
    normalizeStoredAttendeeEntries(attendeeEntries = [], session = null) {
      if (!Array.isArray(attendeeEntries)) {
        return [];
      }
      return attendeeEntries.map((attendeeEntry) => this.normalizeStoredAttendeeEntry(attendeeEntry, session)).filter((attendeeEntry) => attendeeEntry !== null);
    }
    normalizeStoredAttendeeEntry(attendeeEntry, session = null) {
      var _a, _b;
      if (!Array.isArray(attendeeEntry)) {
        return null;
      }
      const normalizedName = String((_a = attendeeEntry == null ? void 0 : attendeeEntry[0]) != null ? _a : "").trim();
      const normalizedEmail = String((_b = attendeeEntry == null ? void 0 : attendeeEntry[1]) != null ? _b : "").trim();
      if (normalizedName === "" || normalizedEmail === "") {
        return null;
      }
      const isExpandedTuple = attendeeEntry.length >= 6;
      const dateRangeValues = {
        dateRangeStart: util.enfDate(attendeeEntry == null ? void 0 : attendeeEntry[2]),
        dateRangeEnd: util.enfDate(attendeeEntry == null ? void 0 : attendeeEntry[3])
      };
      const certStatusID = isExpandedTuple ? attendeeEntry == null ? void 0 : attendeeEntry[4] : attendeeEntry == null ? void 0 : attendeeEntry[3];
      const personID = Number(isExpandedTuple ? attendeeEntry == null ? void 0 : attendeeEntry[5] : attendeeEntry == null ? void 0 : attendeeEntry[4]);
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
      var _a, _b, _c, _d;
      return [
        String((_a = attendeeEntry == null ? void 0 : attendeeEntry.name) != null ? _a : "").trim(),
        String((_b = attendeeEntry == null ? void 0 : attendeeEntry.email) != null ? _b : "").trim(),
        (_c = attendeeEntry == null ? void 0 : attendeeEntry.dateRangeStart) != null ? _c : null,
        (_d = attendeeEntry == null ? void 0 : attendeeEntry.dateRangeEnd) != null ? _d : null,
        this.normalizeAttendeeStatusId(attendeeEntry == null ? void 0 : attendeeEntry.certStatusID),
        Number(attendeeEntry == null ? void 0 : attendeeEntry.personID)
      ];
    }
    buildAttendeeDateRangeDisplay(dateRangeStart, dateRangeEnd, session = null) {
      if (!this.isSelfPacedSession(session)) {
        return null;
      }
      const normalizedStartDate = util.enfDate(dateRangeStart);
      const normalizedEndDate = util.enfDate(dateRangeEnd);
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
    normalizeRIDCertificationDateTime(value) {
      const normalizedValue = String(value != null ? value : "").trim();
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
      var _a, _b;
      if (optionId === null || optionId === void 0) {
        return null;
      }
      const resourceData = (_a = _db_connection.data[resource]) != null ? _a : {};
      return (_b = resourceData[optionId]) != null ? _b : null;
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
      return formattedSingleDate != null ? formattedSingleDate : null;
    }
    formatInputDate(dateValue) {
      const normalizedDate = String(dateValue != null ? dateValue : "").trim();
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
      const label = String(flag != null ? flag : "").trim();
      if (label === "") {
        return null;
      }
      for (const [flagId, flagLabel] of Object.entries(_db_connection.data.flags)) {
        if (flagId === "top") {
          continue;
        }
        if (String(flagLabel).trim().toLowerCase() === label.toLowerCase()) {
          return Number(flagId);
        }
      }
      const nextId = Object.keys(_db_connection.data.flags).filter((flagId) => flagId !== "top").map((flagId) => Number(flagId)).filter((flagId) => Number.isFinite(flagId)).reduce((maxId, flagId) => Math.max(maxId, flagId), 0) + 1;
      _db_connection.data.flags[nextId] = label;
      return nextId;
    }
  };
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
  __publicField(_db_connection, "attendeeDateRangesNormalized", false);
  // Temporary local fallback data.
  // Do not add new product logic that depends on db_connection.data; it is
  // slated for removal once the backend endpoints fully cover this surface.
  __publicField(_db_connection, "data", {
    "sessions": [
      {
        "sessionID": 1,
        "Date": "03/11/2026",
        "SessionTitle": "Interpreter Ethics in Hybrid Teams",
        "Length": 75,
        "SessionType": "Lecture",
        "CEUWeight": 1.25,
        "CEUConsideration": "Ethics focus",
        "CEUQualify": "Yes",
        "RIDQualify": "Yes",
        "EventType": "Webinar",
        "ParentType": "March Learning Lab",
        "Organizer": "Carmen Wu",
        "AttendeesCt": 5,
        "Lock": 1,
        "Locker": "Priya Singh",
        "Attendees": [
          ["Talia Morgan", "talia.morgan@example.com", null, null, 2, 1],
          ["Evan Price", "evan.price@example.com", null, null, 1, 2],
          ["Sofia Kim", "sofia.kim@example.com", null, null, 3, 3],
          ["Daniel Ross", "daniel.ross@example.com", null, null, 4, 4],
          ["Mina Ali", "mina.ali@example.com", null, null, 2, 5]
        ]
      },
      {
        "sessionID": 2,
        "Date": "03/18/2026",
        "SessionTitle": "Medical Terminology Drill",
        "Length": 90,
        "SessionType": "Workshop",
        "CEUWeight": 1.5,
        "CEUConsideration": "Specialty vocabulary",
        "CEUQualify": "No",
        "RIDQualify": "No",
        "EventType": "Breakout",
        "ParentType": "Skill Builder Week",
        "Organizer": "Noah Patel",
        "AttendeesCt": 4,
        "Lock": 0,
        "Locker": null,
        "Attendees": [
          ["Harper Nguyen", "harper.nguyen@example.com", null, null, 1, 6],
          ["Jonah Clark", "jonah.clark@example.com", null, null, 4, 7],
          ["Layla Scott", "layla.scott@example.com", null, null, 3, 8],
          ["Isaac Bell", "isaac.bell@example.com", null, null, 2, 9]
        ]
      },
      {
        "sessionID": 3,
        "Date": "Self Paced",
        "SessionTitle": "Boundary Setting for Freelance Interpreters",
        "Length": 45,
        "SessionType": "Module",
        "CEUWeight": 0.75,
        "CEUConsideration": "Professional practice",
        "CEUQualify": "Yes",
        "RIDQualify": "Yes",
        "EventType": "Online Course",
        "ParentType": "Resource Library",
        "Organizer": "Rina Flores",
        "AttendeesCt": 6,
        "Lock": 0,
        "Locker": null,
        "Attendees": [
          ["Nora Diaz", "nora.diaz@example.com", null, null, 1, 10],
          ["Caleb Foster", "caleb.foster@example.com", "2026-03-01", null, 2, 11],
          ["Ivy Chen", "ivy.chen@example.com", "2026-03-07", "2026-03-10", 3, 12],
          ["Peter Shah", "peter.shah@example.com", null, null, 4, 13],
          ["Grace Hill", "grace.hill@example.com", "2026-03-05", null, 1, 14],
          ["Owen Reed", "owen.reed@example.com", "2026-03-07", "2026-03-10", 2, 15]
        ]
      },
      {
        "sessionID": 4,
        "Date": "04/02/2026 to 04/04/2026",
        "SessionTitle": "Leadership Intensive",
        "Length": 180,
        "SessionType": "Roundtable",
        "CEUWeight": 3,
        "CEUConsideration": "Advanced practice",
        "CEUQualify": "Yes",
        "RIDQualify": "Yes",
        "EventType": "Retreat",
        "ParentType": "Leadership Series",
        "Organizer": "Marcos Lee",
        "AttendeesCt": 5,
        "Lock": 1,
        "Locker": "Jason Zinza",
        "Attendees": [
          ["Amara Lewis", "amara.lewis@example.com", null, null, 2, 16],
          ["Theo Grant", "theo.grant@example.com", null, null, 1, 17],
          ["Jade Rivera", "jade.rivera@example.com", null, null, 3, 18],
          ["Miles Cooper", "miles.cooper@example.com", null, null, 4, 19],
          ["Zoe Brooks", "zoe.brooks@example.com", null, null, 2, 20]
        ]
      },
      {
        "sessionID": 5,
        "Date": "04/09/2026",
        "SessionTitle": "Legal Prep: Depositions and Hearings",
        "Length": 120,
        "SessionType": "Seminar",
        "CEUWeight": 2,
        "CEUConsideration": "Domain-specific scenarios",
        "CEUQualify": "Yes",
        "RIDQualify": "Yes",
        "EventType": "Conference",
        "ParentType": "Justice Access Forum",
        "Organizer": "Elena Brooks",
        "AttendeesCt": 4,
        "Lock": 1,
        "Locker": "Marta Silva",
        "Attendees": [
          ["Leo Bennett", "leo.bennett@example.com", null, null, 2, 21],
          ["Aisha Coleman", "aisha.coleman@example.com", null, null, 1, 22],
          ["Riley Ward", "riley.ward@example.com", null, null, 3, 23],
          ["Emma Stone", "emma.stone@example.com", null, null, 2, 24]
        ]
      },
      {
        "sessionID": 6,
        "Date": "04/21/2026 to 04/22/2026",
        "SessionTitle": "Mentor Circle Facilitation Lab",
        "Length": 150,
        "SessionType": "Workshop",
        "CEUWeight": 0,
        "CEUConsideration": "None",
        "CEUQualify": "No",
        "RIDQualify": "Yes",
        "EventType": "Cohort",
        "ParentType": "Spring Mentor Program",
        "Organizer": "Community Ops",
        "AttendeesCt": 5,
        "Lock": 1,
        "Locker": "Jason Zinza",
        "Attendees": [
          ["Seth Howard", "seth.howard@example.com", null, null, 1, 25],
          ["Priya Desai", "priya.desai@example.com", null, null, 2, 26],
          ["Naomi Turner", "naomi.turner@example.com", null, null, 4, 27],
          ["Victor Hughes", "victor.hughes@example.com", null, null, 3, 28],
          ["Claire Adams", "claire.adams@example.com", null, null, 1, 29]
        ]
      }
    ],
    "attendeeStatuses": {
      1: "Certified",
      2: "Master",
      3: "None",
      4: "Not Assigned"
    },
    "flags": {
      "top": [1, 2, 3, 4],
      1: "General",
      2: "PPO",
      3: "Advanced",
      4: "Ethics",
      5: "Medical",
      6: "Legal",
      7: "Educational",
      8: "Technology",
      9: "Leadership"
    },
    "sessionTypes": {
      1: "lecture",
      2: "workshop",
      3: "panel",
      4: "breakout",
      5: "roundtable"
    },
    "EventTypes": {
      1: "conference",
      2: "webinar",
      3: "retreat",
      4: "training",
      5: "series"
    },
    "CEUTypes": {
      1: "conference",
      2: "webinar",
      3: "retreat",
      4: "training",
      5: "series"
    },
    // [Name, email, attendee[0|1], presenter[0|1], personID]
    "members": [
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
      ["Claire Adams", "claire.adams@example.com", 1, 0, 29]
    ],
    "ridCertificates": [],
    "comments": []
  });
  var db_connection = _db_connection;

  // js/session-table2/assets.js
  function getSpeechBubbleIconURL() {
    var _a, _b;
    const configuredURL = String((_b = (_a = globalThis == null ? void 0 : globalThis.PDTSessionTableAssets) == null ? void 0 : _a.speechBubbleIconUrl) != null ? _b : "").trim();
    if (configuredURL !== "") {
      return configuredURL;
    }
    return "../assets/speech-bubble-1130.svg";
  }

  // js/session-table2/host_connection.js
  var host_connection = class {
    constructor(config = {}) {
      this.config = config;
    }
    async get(resource) {
      if (resource === "userID") {
        return this.resolveUserID();
      }
      if (resource === "userName") {
        return this.resolveUserName();
      }
      if (resource === "commentIconURL") {
        return this.getComment();
      }
      return null;
    }
    async getComment() {
      return this.resolveCommentIconURL();
    }
    resolveUserID() {
      var _a, _b, _c;
      const configuredUserID = this.normalizeUserID((_a = this.config) == null ? void 0 : _a.userID);
      if (configuredUserID !== null) {
        return configuredUserID;
      }
      const wpDataUserID = this.getWordPressUserID();
      if (wpDataUserID !== null) {
        return wpDataUserID;
      }
      const globalCandidates = [
        globalThis == null ? void 0 : globalThis.PDTSessionTable2UserID,
        (_b = globalThis == null ? void 0 : globalThis.PDTSessionTable2) == null ? void 0 : _b.userID,
        (_c = globalThis == null ? void 0 : globalThis.PDTAttendeeModalData) == null ? void 0 : _c.userID
      ];
      for (const candidate of globalCandidates) {
        const normalizedCandidate = this.normalizeUserID(candidate);
        if (normalizedCandidate !== null) {
          return normalizedCandidate;
        }
      }
      return 405;
    }
    resolveUserName() {
      var _a, _b, _c, _d, _e, _f, _g;
      const configuredUserName = this.normalizeUserName((_c = (_a = this.config) == null ? void 0 : _a.userName) != null ? _c : (_b = this.config) == null ? void 0 : _b.displayName);
      if (configuredUserName !== null) {
        return configuredUserName;
      }
      const wpDataUserName = this.getWordPressUserName();
      if (wpDataUserName !== null) {
        return wpDataUserName;
      }
      const globalCandidates = [
        globalThis == null ? void 0 : globalThis.PDTSessionTable2UserName,
        (_d = globalThis == null ? void 0 : globalThis.PDTSessionTable2) == null ? void 0 : _d.userName,
        (_e = globalThis == null ? void 0 : globalThis.PDTSessionTable2) == null ? void 0 : _e.displayName,
        (_f = globalThis == null ? void 0 : globalThis.PDTAttendeeModalData) == null ? void 0 : _f.userName,
        (_g = globalThis == null ? void 0 : globalThis.PDTAttendeeModalData) == null ? void 0 : _g.displayName
      ];
      for (const candidate of globalCandidates) {
        const normalizedCandidate = this.normalizeUserName(candidate);
        if (normalizedCandidate !== null) {
          return normalizedCandidate;
        }
      }
      return `User ${this.resolveUserID()}`;
    }
    getWordPressUserID() {
      var _a, _b, _c, _d, _e;
      try {
        const currentUser = (_e = (_d = (_c = (_b = (_a = globalThis == null ? void 0 : globalThis.wp) == null ? void 0 : _a.data) == null ? void 0 : _b.select) == null ? void 0 : _c.call(_b, "core")) == null ? void 0 : _d.getCurrentUser) == null ? void 0 : _e.call(_d);
        return this.normalizeUserID(currentUser == null ? void 0 : currentUser.id);
      } catch (_error) {
        return null;
      }
    }
    getWordPressUserName() {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      try {
        const currentUser = (_e = (_d = (_c = (_b = (_a = globalThis == null ? void 0 : globalThis.wp) == null ? void 0 : _a.data) == null ? void 0 : _b.select) == null ? void 0 : _c.call(_b, "core")) == null ? void 0 : _d.getCurrentUser) == null ? void 0 : _e.call(_d);
        return this.normalizeUserName(
          (_h = (_g = (_f = currentUser == null ? void 0 : currentUser.name) != null ? _f : currentUser == null ? void 0 : currentUser.display_name) != null ? _g : currentUser == null ? void 0 : currentUser.nickname) != null ? _h : currentUser == null ? void 0 : currentUser.username
        );
      } catch (_error) {
        return null;
      }
    }
    resolveCommentIconURL() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const configuredCommentIconURL = this.normalizeURL(
        (_e = (_c = (_a = this.config) == null ? void 0 : _a.commentIconURL) != null ? _c : (_b = this.config) == null ? void 0 : _b.commentURL) != null ? _e : (_d = this.config) == null ? void 0 : _d.commentIcon
      );
      if (configuredCommentIconURL !== null) {
        return configuredCommentIconURL;
      }
      const globalCandidates = [
        globalThis == null ? void 0 : globalThis.PDTSessionTable2CommentIconURL,
        (_f = globalThis == null ? void 0 : globalThis.PDTSessionTable2) == null ? void 0 : _f.commentIconURL,
        (_g = globalThis == null ? void 0 : globalThis.PDTSessionTable2) == null ? void 0 : _g.commentURL,
        (_h = globalThis == null ? void 0 : globalThis.PDTAttendeeModalData) == null ? void 0 : _h.commentIconURL,
        (_i = globalThis == null ? void 0 : globalThis.PDTAttendeeModalData) == null ? void 0 : _i.commentURL
      ];
      for (const candidate of globalCandidates) {
        const normalizedCandidate = this.normalizeURL(candidate);
        if (normalizedCandidate !== null) {
          return normalizedCandidate;
        }
      }
      return getSpeechBubbleIconURL();
    }
    normalizeUserID(value) {
      const numericUserID = Number(value);
      if (!Number.isInteger(numericUserID) || numericUserID <= 0) {
        return null;
      }
      return numericUserID;
    }
    normalizeUserName(value) {
      const normalizedUserName = String(value != null ? value : "").trim();
      if (normalizedUserName === "") {
        return null;
      }
      return normalizedUserName;
    }
    normalizeURL(value) {
      const normalizedURL = String(value != null ? value : "").trim();
      if (normalizedURL === "") {
        return null;
      }
      return normalizedURL;
    }
  };

  // js/session-table2/comment_manager.js
  var comment_manager = class {
    constructor(db = null) {
      this.db = db;
      this.activeCommentContext = null;
    }
    init(commentFields, tableBody) {
      this.bindModalEvents(commentFields);
      this.bindOpenTriggers(commentFields, tableBody);
    }
    bindModalEvents(commentFields) {
      commentFields.close.off("click.pdtComment").on("click.pdtComment", () => {
        this.close(commentFields);
      });
      commentFields.wrapper.off("click.pdtComment").on("click.pdtComment", (event) => {
        if (event.target !== commentFields.wrapper[0]) {
          return;
        }
        this.close(commentFields);
      });
      commentFields.submit.off("click.pdtComment").on("click.pdtComment", async () => {
        await this.saveComments(commentFields);
      });
    }
    bindOpenTriggers(commentFields, tableBody) {
      tableBody.off("click.pdtComment", ".pdt-person-card__icon").on("click.pdtComment", ".pdt-person-card__icon", async (event) => {
        var _a;
        const icon = jq(event.currentTarget);
        if (icon.attr("data-session-locked") === "1") {
          return;
        }
        const personCard = icon.closest(".pdt-person-card");
        const personName = String((_a = personCard.find("p").first().text()) != null ? _a : "").trim();
        const sessionID = Number(icon.attr("data-session-id"));
        const personID = Number(icon.attr("data-person-id"));
        if (!Number.isFinite(sessionID) || !Number.isFinite(personID)) {
          return;
        }
        await this.open(commentFields, {
          sessionID,
          personID,
          personName
        });
      });
    }
    async open(commentFields, context) {
      this.activeCommentContext = context;
      commentFields.titleName.text(context.personName);
      await this.loadComments(commentFields, context);
      commentFields.wrapper.prop("hidden", false);
      commentFields.admin.trigger("focus");
    }
    async loadComments(commentFields, context) {
      var _a, _b;
      const commentData = typeof (context == null ? void 0 : context.loadComments) === "function" ? await context.loadComments() : await this.db.get("comments", {
        sessionID: context.sessionID,
        personID: context.personID
      });
      commentFields.admin.val(String((_a = commentData == null ? void 0 : commentData.adminComment) != null ? _a : ""));
      commentFields.member.val(String((_b = commentData == null ? void 0 : commentData.memberComment) != null ? _b : ""));
    }
    async saveComments(commentFields) {
      var _a, _b, _c, _d;
      if (this.activeCommentContext === null) {
        return;
      }
      const onSave = (_a = this.activeCommentContext) == null ? void 0 : _a.onSave;
      const nextCommentData = {
        adminComment: String((_b = commentFields.admin.val()) != null ? _b : ""),
        memberComment: String((_c = commentFields.member.val()) != null ? _c : "")
      };
      if (typeof ((_d = this.activeCommentContext) == null ? void 0 : _d.saveComments) === "function") {
        await this.activeCommentContext.saveComments(nextCommentData);
      } else {
        await this.db.set("comments", {
          sessionID: this.activeCommentContext.sessionID,
          personID: this.activeCommentContext.personID,
          adminComment: nextCommentData.adminComment,
          memberComment: nextCommentData.memberComment
        });
      }
      this.close(commentFields);
      if (typeof onSave === "function") {
        await onSave(nextCommentData);
      }
    }
    close(commentFields) {
      commentFields.wrapper.prop("hidden", true);
      this.reset(commentFields);
    }
    reset(commentFields) {
      commentFields.titleName.text("");
      commentFields.admin.val("");
      commentFields.member.val("");
      this.activeCommentContext = null;
    }
  };

  // js/session-table2/main_page.js
  var main_page = class {
    constructor(db, host, showAttendees, addEditSession) {
      this.db = db;
      this.host = host;
      this.showAttendees = showAttendees;
      this.addEditSession = addEditSession;
      this.commentManager = new comment_manager(db);
      this.commentFields = null;
      this.commentIconURL = null;
      this.attendeeSortModes = [
        { field: "first", direction: "asc", label: "Sort: First A-Z" },
        { field: "last", direction: "asc", label: "Sort: Last A-Z" },
        { field: "first", direction: "desc", label: "Sort: First Z-A" },
        { field: "last", direction: "desc", label: "Sort: Last Z-A" }
      ];
    }
    async init() {
      const tableBody = await this.loadTable();
      if (tableBody.length === 0) {
        return;
      }
      const commentFields = {
        wrapper: jq("#pdt-shadow-comments"),
        modal: jq("#pdt-shadow-comments .pdt-comment-box"),
        titleName: jq("#pdt-shadow-comments h2 span"),
        admin: jq("#comment_box_admin"),
        member: jq("#comment_box"),
        close: jq("#closeCommentModal"),
        submit: jq("#submitCommentModal")
      };
      this.commentFields = commentFields;
      this.bumpTableScrollHint();
      this.commentManager.init(commentFields, tableBody);
      await this.showAttendees.init(this, this.commentManager, commentFields);
      tableBody.off("click.pdtDetails", ".pdt-details-button").on("click.pdtDetails", ".pdt-details-button", function() {
        const sessionRow = jq(this).closest("tr");
        const detailsRow = sessionRow.next("tr");
        if (!detailsRow.hasClass("details-row")) {
          return;
        }
        detailsRow.prop("hidden", !detailsRow.prop("hidden"));
      });
      tableBody.off("click.pdtSortAttendees", ".pdt-sort-attendees-button").on("click.pdtSortAttendees", ".pdt-sort-attendees-button", (event) => {
        this.sortAttendees(jq(event.currentTarget));
      });
      tableBody.off("click.pdtToggleSessionLock", ".pdt-lock-toggle-button").on("click.pdtToggleSessionLock", ".pdt-lock-toggle-button", async (event) => {
        await this.toggleSessionLock(jq(event.currentTarget));
      });
      tableBody.off("click.pdtOpenAttendeesModal", ".pdt-edit-attendees-button").on("click.pdtOpenAttendeesModal", ".pdt-edit-attendees-button", async (event) => {
        const sessionID = Number(jq(event.currentTarget).attr("data-session-id"));
        if (!Number.isFinite(sessionID)) {
          return;
        }
        await this.showAttendees.openForSession(sessionID);
      });
      await this.addEditSession.init(this);
      tableBody.off("click.pdtEditSession", ".pdt-edit-session-button").on("click.pdtEditSession", ".pdt-edit-session-button", async (event) => {
        const sessionID = Number(jq(event.currentTarget).attr("data-session-id"));
        if (!Number.isFinite(sessionID)) {
          return;
        }
        await this.addEditSession.openForEdit(sessionID);
      });
    }
    async loadTable() {
      const tableBody = jq(".pdt-main .table-wrapper table tbody");
      if (tableBody.length === 0) {
        return tableBody;
      }
      const commentIconURL = await this.getCommentIconURL();
      const sessionsResponse = await this.db.get("sessions");
      const sessions = Array.isArray(sessionsResponse) ? sessionsResponse : [];
      if (!Array.isArray(sessionsResponse)) {
        console.error("PDT: Expected sessions array but received:", sessionsResponse);
      }
      tableBody.empty();
      for (let session of sessions) {
        const lockView = this.getSessionLockView(session);
        let entry = `
                <tr data-session-id="${session.sessionID}">
                    <td>${session.Date}</td>
                    <td>${session.SessionTitle}</td>
                    <td>${session.Length} min</td>
                    <td>${session.SessionType}</td>
                    <td>${session.CEUWeight}</td>
                    <td>${session.CEUConsideration}</td>
                    <td>${session.CEUQualify}</td>
                    <td>${session.RIDQualify}</td>
                    <td>${session.EventType}</td>
                    <td>${session.ParentType}</td>
                    <td>${session.Organizer}</td>
                    <td>${session.AttendeesCt}</td>
                    <td class="pdt-actions-column">
                        <button data-session-id="${session.sessionID}" class="pdt-details-button" type="button">Details</button>
                    </td>
                </tr>
            `;
        let attendeeContacts = document.createElement("div");
        attendeeContacts.className = "pdt-details-people";
        const attendees = Array.isArray(session == null ? void 0 : session.Attendees) ? session.Attendees : [];
        for (let attendee of attendees) {
          let attendeeContact = document.createElement("div");
          attendeeContact.className = "pdt-person-card";
          attendeeContact.dataset.attendeeName = attendee[0];
          attendeeContact.dataset.personId = String(attendee[4]);
          const commentIconClassName = lockView.isLocked ? "pdt-person-card__icon pdt-person-card__icon--disabled" : "pdt-person-card__icon";
          const commentIconTitle = lockView.isLocked ? `Comments are locked for this session. ${lockView.statusText}.` : "Open comments";
          const attendeeDateMarkup = attendee[2] === null ? "" : `<p>${attendee[2]}</p>`;
          attendeeContact.innerHTML = `
                    <img data-session-id="${session.sessionID}" data-person-id="${attendee[4]}" data-session-locked="${lockView.isLocked ? "1" : "0"}" class="${commentIconClassName}" src="${commentIconURL}" alt=""
                    aria-hidden="true" title="${commentIconTitle}">
                    <p>${attendee[0]}</p>
                    <p>${attendee[1]}</p>
                    ${attendeeDateMarkup}
                    <p>${attendee[3]}</p>
                `;
          attendeeContacts.append(attendeeContact);
        }
        let attendeeSpace = `
                <tr data-session-id="${session.sessionID}" class="details-row" hidden>
                    <td colspan="13">
                        <div class="pdt-details-panel">
                            <div data-session-id="${session.sessionID}" class="pdt-buttons">
                                <p>${lockView.statusText}</p>
                                <button data-session-id="${session.sessionID}" class="pdt-lock-toggle-button" type="button">${lockView.toggleLabel}</button>
                                <button data-session-id="${session.sessionID}" data-sort-index="-1" class="pdt-sort-attendees-button" type="button">Sort: Original</button>
                                <button data-session-id="${session.sessionID}" class="pdt-edit-session-button" type="button" ${lockView.canEdit ? "" : "disabled"}>Edit Details</button>
                                <button data-session-id="${session.sessionID}" class="pdt-edit-attendees-button" type="button" ${lockView.canEdit ? "" : "disabled"}>Edit Attendees</button>
                            </div>
                            ${attendeeContacts.outerHTML}
                        </div>
                    </td>
                </tr> `;
        tableBody.append(entry, attendeeSpace);
      }
      return tableBody;
    }
    async getCommentIconURL() {
      var _a;
      if (typeof this.commentIconURL === "string" && this.commentIconURL.trim() !== "") {
        return this.commentIconURL;
      }
      const hostCommentIconURL = typeof ((_a = this.host) == null ? void 0 : _a.getComment) === "function" ? await this.host.getComment() : getSpeechBubbleIconURL();
      this.commentIconURL = String(hostCommentIconURL != null ? hostCommentIconURL : "").trim() || getSpeechBubbleIconURL();
      return this.commentIconURL;
    }
    getSessionLockView(session) {
      var _a;
      const lockerName = String((_a = session == null ? void 0 : session.Locker) != null ? _a : "").trim();
      const hasLocker = lockerName !== "";
      const isLocked = hasLocker && Number(session == null ? void 0 : session.Lock) === 1;
      return {
        canEdit: !isLocked,
        isLocked,
        statusText: hasLocker ? isLocked ? `Locked by ${lockerName}` : `Unlocked by ${lockerName}` : "Unlocked",
        toggleLabel: isLocked ? "Unlock" : "Lock"
      };
    }
    async toggleSessionLock(lockButton) {
      var _a, _b;
      const sessionID = Number(lockButton.attr("data-session-id"));
      if (!Number.isFinite(sessionID) || lockButton.prop("disabled")) {
        return;
      }
      const detailsRow = lockButton.closest(".details-row");
      const shouldKeepDetailsOpen = detailsRow.length > 0 && detailsRow.prop("hidden") === false;
      const session = await this.db.get("session", { sessionID });
      if (!session) {
        alert("That session could not be found. Please refresh the page and try again.");
        return;
      }
      const userName = String((_b = await ((_a = this.host) == null ? void 0 : _a.get("userName"))) != null ? _b : "").trim();
      if (userName === "") {
        alert("The current WordPress user name could not be determined, so the lock could not be updated.");
        return;
      }
      const currentLockView = this.getSessionLockView(session);
      const nextLockState = currentLockView.isLocked ? 0 : 1;
      lockButton.prop("disabled", true);
      lockButton.text(nextLockState === 1 ? "Locking..." : "Unlocking...");
      try {
        await this.db.set("sessionLock", {
          sessionID,
          lock: nextLockState,
          locker: userName
        });
        await this.loadTable();
        this.restoreDetailsRowVisibility(sessionID, shouldKeepDetailsOpen);
      } catch (_error) {
        alert("The session lock could not be updated. Please refresh the page and try again.");
        lockButton.prop("disabled", false);
        lockButton.text(currentLockView.toggleLabel);
      }
    }
    restoreDetailsRowVisibility(sessionID, shouldBeOpen) {
      if (!shouldBeOpen) {
        return;
      }
      const sessionRow = jq(`.pdt-main .table-wrapper table tbody > tr[data-session-id="${sessionID}"]`).not(".details-row").first();
      if (sessionRow.length === 0) {
        return;
      }
      sessionRow.next(".details-row").prop("hidden", false);
    }
    bumpTableScrollHint() {
      const tableWrapper = jq(".pdt-main .table-wrapper");
      if (tableWrapper.length === 0) {
        return;
      }
      const wrapperElement = tableWrapper[0];
      const hasMoreRight = wrapperElement.scrollWidth > wrapperElement.clientWidth + 1;
      if (!hasMoreRight) {
        return;
      }
      window.setTimeout(() => {
        if (wrapperElement.scrollLeft !== 0) {
          return;
        }
        tableWrapper.stop(true).animate({ scrollLeft: 28 }, 180).animate({ scrollLeft: 0 }, 220);
      }, 1e3);
    }
    sortAttendees(sortButton) {
      const attendeeContainer = sortButton.closest(".pdt-details-panel").find(".pdt-details-people").first();
      if (attendeeContainer.length === 0) {
        return;
      }
      const sortIndex = this.getNextAttendeeSortIndex(sortButton);
      const sortMode = this.attendeeSortModes[sortIndex];
      const attendeeCards = attendeeContainer.children(".pdt-person-card").get();
      attendeeCards.sort((leftCard, rightCard) => {
        return this.compareAttendeeCards(leftCard, rightCard, sortMode);
      });
      attendeeContainer.append(attendeeCards);
      sortButton.attr("data-sort-index", String(sortIndex));
      sortButton.text(sortMode.label);
    }
    getNextAttendeeSortIndex(sortButton) {
      const currentSortIndex = Number(sortButton.attr("data-sort-index"));
      if (!Number.isInteger(currentSortIndex) || currentSortIndex < 0) {
        return 0;
      }
      return (currentSortIndex + 1) % this.attendeeSortModes.length;
    }
    compareAttendeeCards(leftCard, rightCard, sortMode) {
      const leftSortData = this.getAttendeeSortData(leftCard);
      const rightSortData = this.getAttendeeSortData(rightCard);
      let comparison = 0;
      if (sortMode.field === "first") {
        comparison = this.compareSortValues(leftSortData.firstName, rightSortData.firstName);
        if (comparison === 0) {
          comparison = this.compareSortValues(leftSortData.lastName, rightSortData.lastName);
        }
      } else {
        comparison = this.compareSortValues(leftSortData.lastName, rightSortData.lastName);
        if (comparison === 0) {
          comparison = this.compareSortValues(leftSortData.firstName, rightSortData.firstName);
        }
      }
      if (comparison === 0) {
        comparison = this.compareSortValues(leftSortData.fullName, rightSortData.fullName);
      }
      if (comparison === 0) {
        comparison = leftSortData.personID - rightSortData.personID;
      }
      if (sortMode.direction === "desc") {
        comparison *= -1;
      }
      return comparison;
    }
    getAttendeeSortData(attendeeCard) {
      var _a, _b, _c;
      const attendeeName = String((_a = attendeeCard.dataset.attendeeName) != null ? _a : "").trim();
      const normalizedName = attendeeName.replace(/\s+/g, " ").trim();
      const nameParts = normalizedName === "" ? [] : normalizedName.split(" ");
      const firstName = ((_b = nameParts[0]) != null ? _b : "").toLocaleLowerCase();
      const lastName = ((_c = nameParts[nameParts.length - 1]) != null ? _c : firstName).toLocaleLowerCase();
      const personID = Number(attendeeCard.dataset.personId);
      return {
        firstName,
        lastName,
        fullName: normalizedName.toLocaleLowerCase(),
        personID: Number.isFinite(personID) ? personID : 0
      };
    }
    compareSortValues(leftValue, rightValue) {
      return String(leftValue).localeCompare(String(rightValue), void 0, { sensitivity: "base" });
    }
  };

  // js/session-table2/attendee_table_renderer.js
  var attendee_table_renderer = class {
    render(tableHead, tableBody, options = {}) {
      var _a, _b;
      if (!tableHead || tableHead.length === 0 || !tableBody || tableBody.length === 0) {
        return;
      }
      const attendees = Array.isArray(options == null ? void 0 : options.attendees) ? options.attendees : [];
      const showRIDColumn = (options == null ? void 0 : options.showRIDColumn) === true;
      const showSelfPacedDateRangeColumn = (options == null ? void 0 : options.showSelfPacedDateRangeColumn) === true;
      const dateRangeRenderMode = (options == null ? void 0 : options.dateRangeRenderMode) === "edit" ? "edit" : "display";
      const attendeeStatuses = (_a = options == null ? void 0 : options.attendeeStatuses) != null ? _a : {};
      const commentIconURL = String((_b = options == null ? void 0 : options.commentIconURL) != null ? _b : getSpeechBubbleIconURL());
      const buildAttendeeSearchText = typeof (options == null ? void 0 : options.buildAttendeeSearchText) === "function" ? options.buildAttendeeSearchText : () => "";
      const visibleColumnLabels = this.getVisibleColumnLabels({
        showRIDColumn,
        showSelfPacedDateRangeColumn
      });
      const visibleColumnCount = visibleColumnLabels.length;
      this.renderTableHead(tableHead, visibleColumnLabels);
      tableBody.empty();
      tableBody.append(this.buildSearchRow(visibleColumnCount));
      if (attendees.length === 0) {
        tableBody.append(this.buildEmptyStateRow(visibleColumnCount));
        return;
      }
      for (const attendee of attendees) {
        tableBody.append(this.buildAttendeeRow(attendee, {
          attendeeStatuses,
          commentIconURL,
          dateRangeRenderMode,
          showRIDColumn,
          showSelfPacedDateRangeColumn,
          attendeeSearchText: buildAttendeeSearchText(attendee)
        }));
      }
    }
    getVisibleColumnCount(options = {}) {
      return this.getVisibleColumnLabels(options).length;
    }
    getVisibleColumnLabels(options = {}) {
      const columnLabels = [
        "Attendee",
        "Certification Status at time of Attending"
      ];
      if ((options == null ? void 0 : options.showRIDColumn) === true) {
        columnLabels.push("RID certified?");
      }
      if ((options == null ? void 0 : options.showSelfPacedDateRangeColumn) === true) {
        columnLabels.push("Self Paced Date Range");
      }
      columnLabels.push("Comments", "Delete?");
      return columnLabels;
    }
    renderTableHead(tableHead, columnLabels) {
      const headerCells = columnLabels.map((columnLabel) => {
        return `<th>${this.escapeHtml(columnLabel)}</th>`;
      }).join("");
      tableHead.html(`
            <tr>
                ${headerCells}
            </tr>
        `);
    }
    buildSearchRow(columnCount) {
      return `
            <tr class="search-row">
                <td colspan="${columnCount}">
                    <input type="text" name="add-attendee" id="add-attendee"
                        placeholder="Add attendee: search attendees by name or email">
                </td>
            </tr>
        `;
    }
    buildEmptyStateRow(columnCount) {
      return `
            <tr class="pdt-attendees-placeholder-row">
                <td colspan="${columnCount}">No attendees are attached to this session yet.</td>
            </tr>
        `;
    }
    buildAttendeeRow(attendee, options = {}) {
      const attendeeName = this.escapeHtml(attendee == null ? void 0 : attendee.name);
      const attendeeEmail = this.escapeHtml(attendee == null ? void 0 : attendee.email);
      const attendeeSearchText = this.escapeHtml(options == null ? void 0 : options.attendeeSearchText);
      const certStatusID = this.getSafeAttendeeStatusID(attendee == null ? void 0 : attendee.certStatusID, options == null ? void 0 : options.attendeeStatuses);
      const commentButtonTitle = this.getCommentButtonTitle(attendee);
      const commentIconURL = this.escapeHtml(options == null ? void 0 : options.commentIconURL);
      const dateRangeMarkup = this.buildDateRangeMarkup(attendee, options == null ? void 0 : options.dateRangeRenderMode);
      const attendeeCells = [
        `
                <td>
                    <p>${attendeeName}</p>
                    <p>${attendeeEmail}</p>
                </td>
            `,
        `
                <td>
                    <select class="pdt-attendee-cert-status">
                        ${this.buildCertStatusOptions(options == null ? void 0 : options.attendeeStatuses, certStatusID)}
                    </select>
                </td>
            `
      ];
      if ((options == null ? void 0 : options.showRIDColumn) === true) {
        attendeeCells.push(`
                <td class="pdt-rid-cell">
                    ${this.buildRIDCertificationMarkup(attendee)}
                </td>
            `);
      }
      if ((options == null ? void 0 : options.showSelfPacedDateRangeColumn) === true) {
        attendeeCells.push(`
                <td class="date-range-cell">
                    ${dateRangeMarkup}
                </td>
            `);
      }
      attendeeCells.push(`
            <td>
                <button type="button" class="pdt-attendee-comment-button" title="${commentButtonTitle}">
                    <img class="pdt-person-card__icon" src="${commentIconURL}" alt=""
                        aria-hidden="true">
                </button>
            </td>
        `);
      attendeeCells.push(`<td><button class="delete-button pdt-attendee-delete-button" type="button">X</button></td>`);
      return `
            <tr class="pdt-attendees-row" data-person-id="${this.getSafePersonID(attendee == null ? void 0 : attendee.personID)}" data-attendee-email="${attendeeEmail}" data-search-text="${attendeeSearchText}">
                ${attendeeCells.join("")}
            </tr>
        `;
    }
    buildRIDCertificationMarkup(attendee) {
      const isRIDCertified = (attendee == null ? void 0 : attendee.ridCertified) === true;
      const ridCertifiedAtValue = this.escapeHtml(this.isoDateTimeToLocalInputValue(attendee == null ? void 0 : attendee.ridCertifiedAt));
      return `
            <div class="pdt-rid-certification">
                <label class="pdt-rid-certification__checkbox">
                    <input type="checkbox" class="pdt-rid-certified-checkbox" ${isRIDCertified ? "checked" : ""}>
                    <span>Certified</span>
                </label>
                <input type="datetime-local" class="pdt-rid-certified-at" value="${ridCertifiedAtValue}" ${isRIDCertified ? "" : "disabled"}>
            </div>
        `;
    }
    buildCertStatusOptions(attendeeStatuses, selectedStatusID) {
      const statusOptions = Object.entries(attendeeStatuses != null ? attendeeStatuses : {}).map(([statusID, statusLabel]) => ({
        id: Number(statusID),
        label: String(statusLabel != null ? statusLabel : "")
      })).filter((statusOption) => Number.isFinite(statusOption.id) && statusOption.label !== "").sort((leftStatus, rightStatus) => leftStatus.id - rightStatus.id);
      if (statusOptions.length === 0) {
        return `<option value="4" selected>Not Assigned</option>`;
      }
      return statusOptions.map((statusOption) => {
        const isSelected = statusOption.id === selectedStatusID ? " selected" : "";
        return `<option value="${statusOption.id}"${isSelected}>${this.escapeHtml(statusOption.label)}</option>`;
      }).join("");
    }
    buildDateRangeMarkup(attendee, renderMode = "display") {
      if (renderMode === "edit") {
        return this.buildEditableDateRangeMarkup(attendee);
      }
      return this.buildDisplayDateRangeMarkup(attendee);
    }
    buildEditableDateRangeMarkup(attendee) {
      const startDateValue = this.escapeHtml(this.normalizeDateInputValue(attendee == null ? void 0 : attendee.dateRangeStart));
      const endDateValue = this.escapeHtml(this.normalizeDateInputValue(attendee == null ? void 0 : attendee.dateRangeEnd));
      return `
            <div class="pdt-date-range-inputs">
                <input type="date" class="pdt-attendee-date-start" value="${startDateValue}">
                <p>to</p>
                <input type="date" class="pdt-attendee-date-end" value="${endDateValue}">
            </div>
        `;
    }
    buildDisplayDateRangeMarkup(attendee) {
      var _a;
      const startDateValue = this.normalizeDateInputValue(attendee == null ? void 0 : attendee.dateRangeStart);
      const endDateValue = this.normalizeDateInputValue(attendee == null ? void 0 : attendee.dateRangeEnd);
      const dateRangeDisplay = String((_a = attendee == null ? void 0 : attendee.dateRangeDisplay) != null ? _a : "").trim();
      if (startDateValue === "" && endDateValue === "") {
        return `<p>Not started</p>`;
      }
      if (startDateValue !== "" && endDateValue === "") {
        return `
                <input type="date" value="${startDateValue}" disabled>
                <p>to</p>
                <p>Ongoing</p>
            `;
      }
      if (endDateValue === "") {
        return `<p>${this.escapeHtml(dateRangeDisplay)}</p>`;
      }
      return `
            <input type="date" value="${startDateValue}" disabled>
            <p>to</p>
            <input type="date" value="${endDateValue}" disabled>
        `;
    }
    getCommentButtonTitle(attendee) {
      var _a, _b;
      const hasComments = String((_a = attendee == null ? void 0 : attendee.adminComment) != null ? _a : "").trim() !== "" || String((_b = attendee == null ? void 0 : attendee.memberComment) != null ? _b : "").trim() !== "";
      return hasComments ? "Comments exist for this attendee." : "No comments yet.";
    }
    isoDateTimeToLocalInputValue(isoDateTime) {
      const normalizedDateTime = this.normalizeRIDDateTimeValue(isoDateTime);
      if (normalizedDateTime === null) {
        return "";
      }
      const date = new Date(normalizedDateTime);
      if (Number.isNaN(date.getTime())) {
        return "";
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    normalizeRIDDateTimeValue(value) {
      const normalizedValue = String(value != null ? value : "").trim();
      if (normalizedValue === "") {
        return null;
      }
      const parsedTimestamp = Date.parse(normalizedValue.includes(" ") ? normalizedValue.replace(" ", "T") : normalizedValue);
      if (Number.isNaN(parsedTimestamp)) {
        return null;
      }
      return new Date(parsedTimestamp).toISOString();
    }
    normalizeDateInputValue(dateValue) {
      const normalizedDate = String(dateValue != null ? dateValue : "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
        return "";
      }
      return normalizedDate;
    }
    getSafePersonID(personID) {
      const numericPersonID = Number(personID);
      return Number.isFinite(numericPersonID) ? numericPersonID : 0;
    }
    getSafeAttendeeStatusID(statusID, attendeeStatuses) {
      const numericStatusID = Number(statusID);
      if (Number.isFinite(numericStatusID) && (attendeeStatuses == null ? void 0 : attendeeStatuses[numericStatusID])) {
        return numericStatusID;
      }
      return 4;
    }
    escapeHtml(value) {
      return String(value != null ? value : "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
    }
  };

  // js/session-table2/attendee_rid_manager.js
  var attendee_rid_manager = class {
    constructor(db = null, host = null) {
      this.db = db;
      this.host = host;
      this.attendeeRIDState = this.getDefaultState();
    }
    getDefaultState() {
      return {
        attendeesDraft: [],
        savedAttendees: [],
        isSaving: false
      };
    }
    reset() {
      this.attendeeRIDState = this.getDefaultState();
    }
    load(attendees = []) {
      this.attendeeRIDState = {
        attendeesDraft: this.cloneAttendees(attendees),
        savedAttendees: this.cloneAttendees(attendees),
        isSaving: false
      };
    }
    getDraftAttendees() {
      return this.attendeeRIDState.attendeesDraft;
    }
    getDraftAttendee(personID) {
      var _a;
      const normalizedPersonID = this.getSafePersonID(personID);
      if (normalizedPersonID <= 0) {
        return null;
      }
      return (_a = this.attendeeRIDState.attendeesDraft.find((attendee) => {
        return this.getSafePersonID(attendee == null ? void 0 : attendee.personID) === normalizedPersonID;
      })) != null ? _a : null;
    }
    getDraftPersonIDs() {
      return this.attendeeRIDState.attendeesDraft.map((attendee) => this.getSafePersonID(attendee == null ? void 0 : attendee.personID)).filter((personID) => personID > 0);
    }
    isSaving() {
      return this.attendeeRIDState.isSaving === true;
    }
    hasPendingChanges() {
      return JSON.stringify(this.buildComparableAttendeeState(this.attendeeRIDState.attendeesDraft)) !== JSON.stringify(this.buildComparableAttendeeState(this.attendeeRIDState.savedAttendees));
    }
    addAttendee(attendee) {
      const personID = this.getSafePersonID(attendee == null ? void 0 : attendee.personID);
      if (personID <= 0 || this.getDraftPersonIDs().includes(personID)) {
        return false;
      }
      this.attendeeRIDState.attendeesDraft = this.cloneAttendees([
        attendee,
        ...this.attendeeRIDState.attendeesDraft
      ]);
      return true;
    }
    updateAttendeeCertificationStatus(personID, nextCertStatusID, nextCertStatusLabel = "") {
      const attendeeIndex = this.attendeeRIDState.attendeesDraft.findIndex((attendee) => {
        return this.getSafePersonID(attendee == null ? void 0 : attendee.personID) === personID;
      });
      if (attendeeIndex < 0) {
        return;
      }
      const currentAttendee = this.attendeeRIDState.attendeesDraft[attendeeIndex];
      const normalizedStatusID = this.normalizeDraftCertStatusID(nextCertStatusID);
      this.attendeeRIDState.attendeesDraft[attendeeIndex] = {
        ...currentAttendee,
        certStatusID: normalizedStatusID
      };
    }
    updateAttendeeDateRange(personID, nextDateRange = {}) {
      var _a, _b;
      const attendeeIndex = this.attendeeRIDState.attendeesDraft.findIndex((attendee) => {
        return this.getSafePersonID(attendee == null ? void 0 : attendee.personID) === personID;
      });
      if (attendeeIndex < 0) {
        return null;
      }
      const currentAttendee = this.attendeeRIDState.attendeesDraft[attendeeIndex];
      const normalizedStartDate = this.normalizeDateInputValue(
        (_a = nextDateRange == null ? void 0 : nextDateRange.dateRangeStart) != null ? _a : currentAttendee == null ? void 0 : currentAttendee.dateRangeStart
      );
      let normalizedEndDate = this.normalizeDateInputValue(
        (_b = nextDateRange == null ? void 0 : nextDateRange.dateRangeEnd) != null ? _b : currentAttendee == null ? void 0 : currentAttendee.dateRangeEnd
      );
      if (normalizedStartDate === null) {
        normalizedEndDate = null;
      } else if (normalizedEndDate !== null && normalizedEndDate < normalizedStartDate) {
        normalizedEndDate = null;
      }
      this.attendeeRIDState.attendeesDraft[attendeeIndex] = {
        ...currentAttendee,
        dateRangeStart: normalizedStartDate,
        dateRangeEnd: normalizedEndDate,
        dateRangeDisplay: null
      };
      return this.attendeeRIDState.attendeesDraft[attendeeIndex];
    }
    updateAttendeeComments(personID, nextComments = {}) {
      var _a, _b, _c, _d;
      const attendeeIndex = this.attendeeRIDState.attendeesDraft.findIndex((attendee) => {
        return this.getSafePersonID(attendee == null ? void 0 : attendee.personID) === personID;
      });
      if (attendeeIndex < 0) {
        return null;
      }
      const currentAttendee = this.attendeeRIDState.attendeesDraft[attendeeIndex];
      this.attendeeRIDState.attendeesDraft[attendeeIndex] = {
        ...currentAttendee,
        adminComment: String((_b = (_a = nextComments == null ? void 0 : nextComments.adminComment) != null ? _a : currentAttendee == null ? void 0 : currentAttendee.adminComment) != null ? _b : ""),
        memberComment: String((_d = (_c = nextComments == null ? void 0 : nextComments.memberComment) != null ? _c : currentAttendee == null ? void 0 : currentAttendee.memberComment) != null ? _d : "")
      };
      return this.attendeeRIDState.attendeesDraft[attendeeIndex];
    }
    removeAttendee(personID) {
      const normalizedPersonID = this.getSafePersonID(personID);
      if (normalizedPersonID <= 0) {
        return false;
      }
      const nextDraftAttendees = this.attendeeRIDState.attendeesDraft.filter((attendee) => {
        return this.getSafePersonID(attendee == null ? void 0 : attendee.personID) !== normalizedPersonID;
      });
      if (nextDraftAttendees.length === this.attendeeRIDState.attendeesDraft.length) {
        return false;
      }
      this.attendeeRIDState.attendeesDraft = this.cloneAttendees(nextDraftAttendees);
      return true;
    }
    handleCheckboxChange(ridCheckbox) {
      var _a;
      const attendeeRow = ridCheckbox.closest(".pdt-attendees-row");
      const personID = Number(attendeeRow.attr("data-person-id"));
      if (!Number.isFinite(personID)) {
        return;
      }
      const ridDateTimeInput = attendeeRow.find(".pdt-rid-certified-at").first();
      const isRIDCertified = ridCheckbox.prop("checked") === true;
      let ridCertifiedAtValue = String((_a = ridDateTimeInput.val()) != null ? _a : "").trim();
      if (isRIDCertified) {
        if (ridCertifiedAtValue === "") {
          ridCertifiedAtValue = this.getCurrentDateTimeLocalInputValue();
          ridDateTimeInput.val(ridCertifiedAtValue);
        }
      } else {
        ridCertifiedAtValue = "";
        ridDateTimeInput.val("");
      }
      ridDateTimeInput.prop("disabled", !isRIDCertified);
      this.updateAttendeeRIDState(personID, {
        ridCertified: isRIDCertified,
        ridCertifiedAt: isRIDCertified ? this.dateTimeLocalInputValueToISO(ridCertifiedAtValue) : null
      });
    }
    handleDateTimeChange(ridDateTimeInput) {
      var _a;
      if (ridDateTimeInput.prop("disabled")) {
        return;
      }
      const attendeeRow = ridDateTimeInput.closest(".pdt-attendees-row");
      const personID = Number(attendeeRow.attr("data-person-id"));
      if (!Number.isFinite(personID)) {
        return;
      }
      let ridCertifiedAtValue = String((_a = ridDateTimeInput.val()) != null ? _a : "").trim();
      if (ridCertifiedAtValue === "") {
        ridCertifiedAtValue = this.getCurrentDateTimeLocalInputValue();
        ridDateTimeInput.val(ridCertifiedAtValue);
      }
      this.updateAttendeeRIDState(personID, {
        ridCertified: true,
        ridCertifiedAt: this.dateTimeLocalInputValueToISO(ridCertifiedAtValue)
      });
    }
    async saveChanges(sessionID) {
      var _a, _b;
      if (this.attendeeRIDState.isSaving || !this.hasPendingChanges()) {
        return null;
      }
      const numericSessionID = Number(sessionID);
      if (!Number.isFinite(numericSessionID)) {
        return null;
      }
      const invalidAttendee = this.attendeeRIDState.attendeesDraft.find((attendee) => {
        return (attendee == null ? void 0 : attendee.ridCertified) === true && this.normalizeRIDDateTimeValue(attendee == null ? void 0 : attendee.ridCertifiedAt) === null;
      });
      if (invalidAttendee) {
        alert(`RID certification for ${String((_a = invalidAttendee == null ? void 0 : invalidAttendee.name) != null ? _a : "this attendee").trim()} needs a valid date and time before saving.`);
        return null;
      }
      this.attendeeRIDState.isSaving = true;
      try {
        const currentUserID = Number(await ((_b = this.host) == null ? void 0 : _b.get("userID")));
        if (!Number.isInteger(currentUserID) || currentUserID <= 0) {
          alert("The current user could not be determined, so RID certification changes could not be saved.");
          return null;
        }
        const attendees = await this.db.put("sessionAttendees", {
          sessionID: numericSessionID,
          certifiedByUserID: currentUserID,
          attendees: this.buildSessionAttendeePayload()
        });
        this.attendeeRIDState.attendeesDraft = this.cloneAttendees(attendees);
        this.attendeeRIDState.savedAttendees = this.cloneAttendees(attendees);
        return this.attendeeRIDState.attendeesDraft;
      } finally {
        this.attendeeRIDState.isSaving = false;
      }
    }
    mergeIncomingAttendeeData(attendees = []) {
      const incomingAttendees = this.cloneAttendees(attendees);
      const deletedDraftPersonIDs = this.getDeletedPersonIDs(
        this.attendeeRIDState.savedAttendees,
        this.attendeeRIDState.attendeesDraft
      );
      this.attendeeRIDState.attendeesDraft = this.mergeAttendeeCollections(
        incomingAttendees,
        this.attendeeRIDState.attendeesDraft,
        { excludedPersonIDs: deletedDraftPersonIDs }
      );
      this.attendeeRIDState.savedAttendees = this.cloneAttendees(incomingAttendees);
    }
    updateAttendeeRIDState(personID, nextRIDState) {
      var _a, _b;
      const attendeeIndex = this.attendeeRIDState.attendeesDraft.findIndex((attendee) => {
        return this.getSafePersonID(attendee == null ? void 0 : attendee.personID) === personID;
      });
      if (attendeeIndex < 0) {
        return;
      }
      const currentAttendee = this.attendeeRIDState.attendeesDraft[attendeeIndex];
      this.attendeeRIDState.attendeesDraft[attendeeIndex] = {
        ...currentAttendee,
        ridCertified: nextRIDState.ridCertified === true,
        ridCertifiedAt: nextRIDState.ridCertified === true ? (_a = nextRIDState.ridCertifiedAt) != null ? _a : null : null,
        ridCertifiedByUserID: nextRIDState.ridCertified === true ? (_b = currentAttendee == null ? void 0 : currentAttendee.ridCertifiedByUserID) != null ? _b : null : null
      };
    }
    buildSessionAttendeePayload() {
      return this.attendeeRIDState.attendeesDraft.map((attendee) => {
        var _a, _b, _c, _d;
        const personID = this.getSafePersonID(attendee == null ? void 0 : attendee.personID);
        const isRIDCertified = (attendee == null ? void 0 : attendee.ridCertified) === true;
        return {
          personID,
          certStatusID: this.serializeCertStatusID(attendee == null ? void 0 : attendee.certStatusID),
          dateRangeStart: (_a = attendee == null ? void 0 : attendee.dateRangeStart) != null ? _a : null,
          dateRangeEnd: (_b = attendee == null ? void 0 : attendee.dateRangeEnd) != null ? _b : null,
          ridCertified: isRIDCertified,
          ridCertifiedAt: isRIDCertified ? this.normalizeRIDDateTimeValue(attendee == null ? void 0 : attendee.ridCertifiedAt) : null,
          adminComment: String((_c = attendee == null ? void 0 : attendee.adminComment) != null ? _c : ""),
          memberComment: String((_d = attendee == null ? void 0 : attendee.memberComment) != null ? _d : "")
        };
      });
    }
    mergeAttendeeCollections(incomingAttendees = [], existingAttendees = [], options = {}) {
      const incomingAttendeeMap = new Map(
        incomingAttendees.map((attendee) => [this.getSafePersonID(attendee == null ? void 0 : attendee.personID), attendee])
      );
      const excludedPersonIDs = (options == null ? void 0 : options.excludedPersonIDs) instanceof Set ? options.excludedPersonIDs : /* @__PURE__ */ new Set();
      const mergedAttendees = [];
      const seenPersonIDs = /* @__PURE__ */ new Set();
      for (const attendee of Array.isArray(existingAttendees) ? existingAttendees : []) {
        const personID = this.getSafePersonID(attendee == null ? void 0 : attendee.personID);
        if (personID <= 0 || seenPersonIDs.has(personID)) {
          continue;
        }
        const incomingAttendee = incomingAttendeeMap.get(personID);
        if (incomingAttendee) {
          mergedAttendees.push(this.applyDraftStateToAttendee(incomingAttendee, attendee));
        } else {
          mergedAttendees.push(this.cloneAttendees([attendee])[0]);
        }
        seenPersonIDs.add(personID);
      }
      for (const attendee of incomingAttendees) {
        const personID = this.getSafePersonID(attendee == null ? void 0 : attendee.personID);
        if (personID <= 0 || seenPersonIDs.has(personID) || excludedPersonIDs.has(personID)) {
          continue;
        }
        mergedAttendees.push(this.cloneAttendees([attendee])[0]);
        seenPersonIDs.add(personID);
      }
      return mergedAttendees;
    }
    applyDraftStateToAttendee(baseAttendee, draftAttendee) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      if (!draftAttendee) {
        return this.cloneAttendees([baseAttendee])[0];
      }
      const normalizedCertStatusID = this.normalizeDraftCertStatusID(
        (_a = draftAttendee == null ? void 0 : draftAttendee.certStatusID) != null ? _a : baseAttendee == null ? void 0 : baseAttendee.certStatusID
      );
      return {
        ...this.cloneAttendees([baseAttendee])[0],
        dateRangeStart: (_c = (_b = draftAttendee == null ? void 0 : draftAttendee.dateRangeStart) != null ? _b : baseAttendee == null ? void 0 : baseAttendee.dateRangeStart) != null ? _c : null,
        dateRangeEnd: (_e = (_d = draftAttendee == null ? void 0 : draftAttendee.dateRangeEnd) != null ? _d : baseAttendee == null ? void 0 : baseAttendee.dateRangeEnd) != null ? _e : null,
        dateRangeDisplay: (_g = (_f = draftAttendee == null ? void 0 : draftAttendee.dateRangeDisplay) != null ? _f : baseAttendee == null ? void 0 : baseAttendee.dateRangeDisplay) != null ? _g : null,
        certStatusID: normalizedCertStatusID,
        ridCertified: (draftAttendee == null ? void 0 : draftAttendee.ridCertified) === true,
        ridCertifiedAt: (draftAttendee == null ? void 0 : draftAttendee.ridCertified) === true ? this.normalizeRIDDateTimeValue(draftAttendee == null ? void 0 : draftAttendee.ridCertifiedAt) : null,
        ridCertifiedByUserID: (draftAttendee == null ? void 0 : draftAttendee.ridCertified) === true ? this.getPositiveIntegerOrNull(draftAttendee == null ? void 0 : draftAttendee.ridCertifiedByUserID) : null,
        adminComment: String((_i = (_h = draftAttendee == null ? void 0 : draftAttendee.adminComment) != null ? _h : baseAttendee == null ? void 0 : baseAttendee.adminComment) != null ? _i : ""),
        memberComment: String((_k = (_j = draftAttendee == null ? void 0 : draftAttendee.memberComment) != null ? _j : baseAttendee == null ? void 0 : baseAttendee.memberComment) != null ? _k : "")
      };
    }
    buildComparableAttendeeState(attendees = []) {
      return (Array.isArray(attendees) ? attendees : []).map((attendee) => {
        var _a, _b, _c, _d;
        const isRIDCertified = (attendee == null ? void 0 : attendee.ridCertified) === true;
        return {
          personID: this.getSafePersonID(attendee == null ? void 0 : attendee.personID),
          certStatusID: this.normalizeDraftCertStatusID(attendee == null ? void 0 : attendee.certStatusID),
          dateRangeStart: String((_a = attendee == null ? void 0 : attendee.dateRangeStart) != null ? _a : ""),
          dateRangeEnd: String((_b = attendee == null ? void 0 : attendee.dateRangeEnd) != null ? _b : ""),
          ridCertified: isRIDCertified,
          ridCertifiedAt: isRIDCertified ? this.normalizeRIDDateTimeValue(attendee == null ? void 0 : attendee.ridCertifiedAt) : null,
          adminComment: String((_c = attendee == null ? void 0 : attendee.adminComment) != null ? _c : ""),
          memberComment: String((_d = attendee == null ? void 0 : attendee.memberComment) != null ? _d : "")
        };
      }).sort((leftAttendee, rightAttendee) => leftAttendee.personID - rightAttendee.personID);
    }
    cloneAttendees(attendees = []) {
      return structuredClone(Array.isArray(attendees) ? attendees : []);
    }
    getCurrentDateTimeLocalInputValue() {
      const currentDate = /* @__PURE__ */ new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    dateTimeLocalInputValueToISO(dateTimeLocalValue) {
      const normalizedDateTimeLocalValue = String(dateTimeLocalValue != null ? dateTimeLocalValue : "").trim();
      if (normalizedDateTimeLocalValue === "") {
        return null;
      }
      const localDate = new Date(normalizedDateTimeLocalValue);
      if (Number.isNaN(localDate.getTime())) {
        return null;
      }
      return this.formatRIDDateTimeValue(localDate);
    }
    normalizeRIDDateTimeValue(value) {
      const normalizedValue = String(value != null ? value : "").trim();
      if (normalizedValue === "") {
        return null;
      }
      const parsedTimestamp = Date.parse(normalizedValue.includes(" ") ? normalizedValue.replace(" ", "T") : normalizedValue);
      if (Number.isNaN(parsedTimestamp)) {
        return null;
      }
      return this.formatRIDDateTimeValue(new Date(parsedTimestamp));
    }
    formatRIDDateTimeValue(date) {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return null;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    normalizeDateInputValue(dateValue) {
      const normalizedDateValue = String(dateValue != null ? dateValue : "").trim();
      if (normalizedDateValue === "") {
        return null;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDateValue)) {
        return null;
      }
      return normalizedDateValue;
    }
    getSafePersonID(personID) {
      const numericPersonID = Number(personID);
      return Number.isFinite(numericPersonID) ? numericPersonID : 0;
    }
    normalizeDraftCertStatusID(value) {
      const numericValue = Number(value);
      if (Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 3) {
        return numericValue;
      }
      return 4;
    }
    serializeCertStatusID(value) {
      const normalizedStatusID = this.normalizeDraftCertStatusID(value);
      return normalizedStatusID === 4 ? null : normalizedStatusID;
    }
    getPositiveIntegerOrNull(value) {
      const numericValue = Number(value);
      if (!Number.isInteger(numericValue) || numericValue <= 0) {
        return null;
      }
      return numericValue;
    }
    getPositiveIntegerOrDefault(value, defaultValue) {
      const numericValue = Number(value);
      if (Number.isInteger(numericValue) && numericValue > 0) {
        return numericValue;
      }
      return defaultValue;
    }
    getDeletedPersonIDs(savedAttendees = [], draftAttendees = []) {
      const draftPersonIDs = new Set(
        (Array.isArray(draftAttendees) ? draftAttendees : []).map((attendee) => this.getSafePersonID(attendee == null ? void 0 : attendee.personID)).filter((personID) => personID > 0)
      );
      return new Set(
        (Array.isArray(savedAttendees) ? savedAttendees : []).map((attendee) => this.getSafePersonID(attendee == null ? void 0 : attendee.personID)).filter((personID) => personID > 0 && !draftPersonIDs.has(personID))
      );
    }
  };

  // js/session-table2/attendee_filter_manager.js
  var attendee_filter_manager = class {
    constructor() {
      this.filterRefs = null;
      this.activeSearchValue = "";
    }
    init(filterRefs) {
      this.filterRefs = filterRefs;
      this.bindEvents();
    }
    bindEvents() {
      var _a;
      if (!((_a = this.filterRefs) == null ? void 0 : _a.searchField) || this.filterRefs.searchField.length === 0) {
        return;
      }
      this.filterRefs.searchField.off("input.pdtAttendeeFilter").on("input.pdtAttendeeFilter", (event) => {
        var _a2;
        this.activeSearchValue = String((_a2 = jq(event.currentTarget).val()) != null ? _a2 : "");
        this.applyFilter();
      });
    }
    reset() {
      var _a, _b, _c, _d;
      this.activeSearchValue = "";
      if (((_b = (_a = this.filterRefs) == null ? void 0 : _a.searchField) == null ? void 0 : _b.length) > 0) {
        this.filterRefs.searchField.val("");
      }
      if (((_d = (_c = this.filterRefs) == null ? void 0 : _c.tableBody) == null ? void 0 : _d.length) > 0) {
        this.filterRefs.tableBody.find(".pdt-attendees-filter-empty-row").remove();
        this.filterRefs.tableBody.find(".pdt-attendees-row").prop("hidden", false);
      }
    }
    applyFilter(searchValue = this.activeSearchValue) {
      var _a;
      if (!((_a = this.filterRefs) == null ? void 0 : _a.tableBody) || this.filterRefs.tableBody.length === 0) {
        return;
      }
      this.activeSearchValue = String(searchValue != null ? searchValue : "");
      const normalizedSearchValue = this.normalizeSearchValue(this.activeSearchValue);
      const attendeeRows = this.filterRefs.tableBody.find(".pdt-attendees-row");
      this.filterRefs.tableBody.find(".pdt-attendees-filter-empty-row").remove();
      if (attendeeRows.length === 0) {
        return;
      }
      let visibleRowCount = 0;
      attendeeRows.each((_, attendeeRow) => {
        const attendeeRowElement = jq(attendeeRow);
        const attendeeSearchText = this.normalizeSearchValue(attendeeRowElement.attr("data-search-text"));
        const rowMatches = normalizedSearchValue === "" || attendeeSearchText.includes(normalizedSearchValue);
        attendeeRowElement.prop("hidden", !rowMatches);
        if (rowMatches) {
          visibleRowCount += 1;
        }
      });
      if (normalizedSearchValue !== "" && visibleRowCount === 0) {
        this.filterRefs.tableBody.append(this.buildNoSearchResultsRow(this.getVisibleColumnCount()));
      }
    }
    getVisibleColumnCount() {
      var _a;
      if (typeof ((_a = this.filterRefs) == null ? void 0 : _a.getVisibleColumnCount) !== "function") {
        return 1;
      }
      return Number(this.filterRefs.getVisibleColumnCount()) || 1;
    }
    buildAttendeeSearchText(attendee) {
      var _a, _b;
      return `${String((_a = attendee == null ? void 0 : attendee.name) != null ? _a : "").trim()} ${String((_b = attendee == null ? void 0 : attendee.email) != null ? _b : "").trim()}`.trim();
    }
    buildNoSearchResultsRow(columnCount) {
      return `
            <tr class="pdt-attendees-placeholder-row pdt-attendees-filter-empty-row">
                <td colspan="${columnCount}">No attendees match that search.</td>
            </tr>
        `;
    }
    normalizeSearchValue(value) {
      return String(value != null ? value : "").toLowerCase().trim().replace(/\s+/g, " ");
    }
  };

  // js/session-table2/attendee_add_manager.js
  var attendee_add_manager = class {
    constructor(db = null) {
      this.db = db;
      this.attendeeSearchSelect = null;
      this.attendeeDirectory = [];
    }
    async init() {
    }
    // async load() {
    //     this.setDirectory(await this.db.get("attendeesDir"));
    // }
    setDirectory(attendeeDirectory = []) {
      this.attendeeDirectory = Array.isArray(attendeeDirectory) ? attendeeDirectory : [];
    }
    destroy() {
      if (!this.attendeeSearchSelect) {
        return;
      }
      this.attendeeSearchSelect.destroy();
      this.attendeeSearchSelect = null;
    }
    syncSearch(addAttendeeField, options = {}) {
      var _a;
      this.destroy();
      if (!addAttendeeField || addAttendeeField.length === 0 || typeof window.TomSelect === "undefined") {
        return;
      }
      const attendeeOptions = this.getAttendeeOptions((_a = options == null ? void 0 : options.excludedPersonIDs) != null ? _a : []);
      const placeholder = attendeeOptions.length === 0 ? "All attendees are already added" : "Add attendee: search attendees by name or email";
      this.attendeeSearchSelect = new TomSelect(addAttendeeField[0], {
        valueField: "id",
        labelField: "label",
        searchField: ["name", "email"],
        options: attendeeOptions,
        maxItems: 1,
        create: false,
        persist: false,
        placeholder,
        sortField: [
          { field: "name", direction: "asc" },
          { field: "email", direction: "asc" }
        ],
        render: {
          option: (optionData, escape) => {
            return `
                        <div class="pdt-add-attendee-option">
                            <span class="pdt-add-attendee-option__name">${escape(optionData.name)}</span>
                            <span class="pdt-add-attendee-option__email">${escape(optionData.email)}</span>
                        </div>
                    `;
          },
          item: (optionData, escape) => {
            return `<div>${escape(optionData.label)}</div>`;
          },
          no_results: () => {
            return `<div class="no-results">No matching attendees found.</div>`;
          }
        },
        onItemAdd: (value) => {
          var _a2, _b;
          const selectedAttendee = attendeeOptions.find((attendeeOption) => {
            return attendeeOption.id === Number(value);
          });
          if (!selectedAttendee) {
            alert("That attendee could not be added. Please refresh the page and try again.");
            (_a2 = this.attendeeSearchSelect) == null ? void 0 : _a2.clear();
            return;
          }
          (_b = this.attendeeSearchSelect) == null ? void 0 : _b.clear();
          const onAttendeeSelected = options == null ? void 0 : options.onAttendeeSelected;
          if (typeof onAttendeeSelected === "function") {
            void Promise.resolve(onAttendeeSelected(selectedAttendee));
          }
        }
      });
      if (attendeeOptions.length === 0) {
        this.attendeeSearchSelect.disable();
      }
    }
    getAttendeeOptions(excludedPersonIDs = []) {
      const excludedPersonIDSet = new Set(
        (Array.isArray(excludedPersonIDs) ? excludedPersonIDs : []).map((personID) => Number(personID)).filter((personID) => Number.isFinite(personID))
      );
      return this.attendeeDirectory.filter((attendeeEntry) => {
        return !excludedPersonIDSet.has(Number(attendeeEntry == null ? void 0 : attendeeEntry.personID));
      }).map((attendeeEntry) => {
        var _a, _b, _c, _d, _e;
        return {
          id: Number(attendeeEntry == null ? void 0 : attendeeEntry.personID),
          personID: Number(attendeeEntry == null ? void 0 : attendeeEntry.personID),
          name: String((_a = attendeeEntry == null ? void 0 : attendeeEntry.name) != null ? _a : "").trim(),
          email: String((_b = attendeeEntry == null ? void 0 : attendeeEntry.email) != null ? _b : "").trim(),
          label: String((_e = attendeeEntry == null ? void 0 : attendeeEntry.label) != null ? _e : `${String((_c = attendeeEntry == null ? void 0 : attendeeEntry.name) != null ? _c : "").trim()} (${String((_d = attendeeEntry == null ? void 0 : attendeeEntry.email) != null ? _d : "").trim()})`).trim()
        };
      }).filter((attendeeOption) => {
        return Number.isFinite(attendeeOption.id) && attendeeOption.name !== "" && attendeeOption.email !== "" && attendeeOption.label !== "";
      });
    }
  };

  // js/session-table2/show_attendees.js
  var show_attendees = class {
    constructor(db = null, host = null) {
      this.db = db;
      this.host = host;
      this.tableRenderer = new attendee_table_renderer();
      this.attendeeRIDManager = new attendee_rid_manager(db, host);
      this.attendeeFilterManager = new attendee_filter_manager();
      this.attendeeAddManager = new attendee_add_manager(db);
      this.mainPage = null;
      this.commentManager = null;
      this.commentFields = null;
      this.modalRefs = null;
      this.attendeeStatuses = {};
      this.commentIconURL = null;
      this.attendeeModalState = this.getDefaultAttendeeModalState();
    }
    async init(mainPage, commentManager = null, commentFields = null) {
      this.mainPage = mainPage;
      this.commentManager = commentManager;
      this.commentFields = commentFields;
      this.modalRefs = {
        wrapper: jq("#pdt-shadow-attendees"),
        modal: jq("#pdt-shadow-attendees .pdt-session-attendees"),
        sessionName: jq("#pdt-shadow-attendees .session-name"),
        attendeeSearch: jq("#pdt-shadow-attendees #attendee-search"),
        tableHead: jq("#pdt-shadow-attendees .table-wrapper table thead"),
        tableBody: jq("#pdt-shadow-attendees .table-wrapper table tbody"),
        cancel: jq("#pdt-shadow-attendees #closeAttendeesModal"),
        submit: jq("#pdt-shadow-attendees #saveAttendeesModal")
      };
      this.clearTableHead();
      this.clearAttendeeRows();
      this.bindModalEvents();
      this.bindCommentTriggers();
      this.bindAttendeeFieldEvents();
      await this.attendeeAddManager.init();
      this.attendeeFilterManager.init({
        searchField: this.modalRefs.attendeeSearch,
        tableBody: this.modalRefs.tableBody,
        getVisibleColumnCount: () => this.getVisibleColumnCount()
      });
      this.updateSubmitButtonState();
    }
    getDefaultAttendeeModalState() {
      return {
        activeSessionID: null,
        showRIDColumn: false,
        showSelfPacedDateRangeColumn: false
      };
    }
    bindModalEvents() {
      if (!this.modalRefs) {
        return;
      }
      this.modalRefs.cancel.off("click.pdtShowAttendees").on("click.pdtShowAttendees", async () => {
        await this.closeModal();
      });
      this.modalRefs.wrapper.off("click.pdtShowAttendees").on("click.pdtShowAttendees", async (event) => {
        if (event.target !== this.modalRefs.wrapper[0]) {
          return;
        }
        await this.closeModal();
      });
      this.modalRefs.submit.off("click.pdtShowAttendees").on("click.pdtShowAttendees", async () => {
        await this.saveAttendeeChanges();
      });
    }
    bindCommentTriggers() {
      if (!this.modalRefs) {
        return;
      }
      this.modalRefs.tableBody.off("click.pdtAttendeeComment", ".pdt-attendee-comment-button").on("click.pdtAttendeeComment", ".pdt-attendee-comment-button", async (event) => {
        await this.openCommentModal(jq(event.currentTarget));
      });
    }
    bindAttendeeFieldEvents() {
      if (!this.modalRefs) {
        return;
      }
      this.modalRefs.tableBody.off("change.pdtRIDCertified", ".pdt-rid-certified-checkbox").on("change.pdtRIDCertified", ".pdt-rid-certified-checkbox", (event) => {
        this.attendeeRIDManager.handleCheckboxChange(jq(event.currentTarget));
        this.updateSubmitButtonState();
      });
      this.modalRefs.tableBody.off("change.pdtRIDTimestamp", ".pdt-rid-certified-at").on("change.pdtRIDTimestamp", ".pdt-rid-certified-at", (event) => {
        this.attendeeRIDManager.handleDateTimeChange(jq(event.currentTarget));
        this.updateSubmitButtonState();
      });
      this.modalRefs.tableBody.off("change.pdtAttendeeCertStatus", ".pdt-attendee-cert-status").on("change.pdtAttendeeCertStatus", ".pdt-attendee-cert-status", (event) => {
        const certificationStatusField = jq(event.currentTarget);
        const attendeeRow = certificationStatusField.closest(".pdt-attendees-row");
        const personID = Number(attendeeRow.attr("data-person-id"));
        if (!Number.isFinite(personID)) {
          return;
        }
        const statusID = Number(certificationStatusField.val());
        this.attendeeRIDManager.updateAttendeeCertificationStatus(
          personID,
          statusID,
          this.getAttendeeStatusLabel(statusID)
        );
        this.updateSubmitButtonState();
      });
      this.modalRefs.tableBody.off("change.pdtAttendeeDateStart", ".pdt-attendee-date-start").on("change.pdtAttendeeDateStart", ".pdt-attendee-date-start", (event) => {
        this.handleAttendeeDateRangeChange(jq(event.currentTarget));
      });
      this.modalRefs.tableBody.off("change.pdtAttendeeDateEnd", ".pdt-attendee-date-end").on("change.pdtAttendeeDateEnd", ".pdt-attendee-date-end", (event) => {
        this.handleAttendeeDateRangeChange(jq(event.currentTarget));
      });
      this.modalRefs.tableBody.off("click.pdtDeleteAttendee", ".pdt-attendee-delete-button").on("click.pdtDeleteAttendee", ".pdt-attendee-delete-button", (event) => {
        const attendeeRow = jq(event.currentTarget).closest(".pdt-attendees-row");
        const personID = Number(attendeeRow.attr("data-person-id"));
        if (!Number.isFinite(personID)) {
          return;
        }
        const didRemoveAttendee = this.attendeeRIDManager.removeAttendee(personID);
        if (!didRemoveAttendee) {
          return;
        }
        this.renderAttendeeRows();
        this.updateSubmitButtonState();
      });
    }
    handleAttendeeDateRangeChange(dateField) {
      var _a, _b;
      const attendeeRow = dateField.closest(".pdt-attendees-row");
      const personID = Number(attendeeRow.attr("data-person-id"));
      if (!Number.isFinite(personID)) {
        return;
      }
      const startDateField = attendeeRow.find(".pdt-attendee-date-start").first();
      const endDateField = attendeeRow.find(".pdt-attendee-date-end").first();
      const updatedAttendee = this.attendeeRIDManager.updateAttendeeDateRange(personID, {
        dateRangeStart: startDateField.val(),
        dateRangeEnd: endDateField.val()
      });
      if (!updatedAttendee) {
        return;
      }
      startDateField.val((_a = updatedAttendee.dateRangeStart) != null ? _a : "");
      endDateField.val((_b = updatedAttendee.dateRangeEnd) != null ? _b : "");
      this.updateSubmitButtonState();
    }
    async openForSession(sessionID) {
      var _a;
      if (!this.modalRefs) {
        return;
      }
      const [sessionData, attendees, attendeeStatuses, attendeeDirectory] = await Promise.all([
        this.db.get("session", { sessionID }),
        this.db.get("attendees", { sessionID }),
        this.db.get("attendeeStatuses"),
        this.db.get("attendeesDir")
      ]);
      if (!sessionData) {
        alert("That session could not be found. Please refresh the page and try again.");
        return;
      }
      this.attendeeStatuses = attendeeStatuses != null ? attendeeStatuses : {};
      this.commentIconURL = await this.getCommentIconURL();
      this.attendeeAddManager.setDirectory(attendeeDirectory);
      this.attendeeModalState = {
        activeSessionID: sessionID,
        showRIDColumn: this.shouldShowRIDColumn(sessionData),
        showSelfPacedDateRangeColumn: this.shouldShowSelfPacedDateRangeColumn(sessionData)
      };
      this.attendeeRIDManager.load(attendees);
      this.modalRefs.sessionName.text(String((_a = sessionData.SessionTitle) != null ? _a : ""));
      this.attendeeFilterManager.reset();
      this.renderAttendeeRows();
      this.getAddAttendeeField().val("");
      this.updateSubmitButtonState();
      this.modalRefs.wrapper.prop("hidden", false);
      session_state.state = "showAttendees";
    }
    async openCommentModal(commentButton) {
      var _a;
      if (!this.commentManager || !this.commentFields) {
        return;
      }
      const sessionID = Number(this.attendeeModalState.activeSessionID);
      const attendeeRow = commentButton.closest(".pdt-attendees-row");
      const personID = Number(attendeeRow.attr("data-person-id"));
      const personName = String((_a = attendeeRow.find("td").first().find("p").first().text()) != null ? _a : "").trim();
      if (!Number.isFinite(sessionID) || !Number.isFinite(personID) || personName === "") {
        return;
      }
      await this.commentManager.open(this.commentFields, {
        sessionID,
        personID,
        personName,
        loadComments: async () => {
          var _a2, _b;
          const attendee = this.attendeeRIDManager.getDraftAttendee(personID);
          return {
            adminComment: String((_a2 = attendee == null ? void 0 : attendee.adminComment) != null ? _a2 : ""),
            memberComment: String((_b = attendee == null ? void 0 : attendee.memberComment) != null ? _b : "")
          };
        },
        saveComments: async (nextCommentData) => {
          this.attendeeRIDManager.updateAttendeeComments(personID, nextCommentData);
        },
        onSave: async () => {
          this.renderAttendeeRows();
          this.updateSubmitButtonState();
        }
      });
    }
    async saveAttendeeChanges() {
      var _a;
      if (!this.modalRefs) {
        return;
      }
      const sessionID = Number(this.attendeeModalState.activeSessionID);
      if (!Number.isFinite(sessionID)) {
        return;
      }
      const savePromise = this.attendeeRIDManager.saveChanges(sessionID);
      this.updateSubmitButtonState();
      const attendees = await savePromise;
      this.updateSubmitButtonState();
      if (!Array.isArray(attendees)) {
        return;
      }
      await ((_a = this.mainPage) == null ? void 0 : _a.loadTable());
      this.renderAttendeeRows();
    }
    async closeModal() {
      if (!this.modalRefs) {
        return;
      }
      this.modalRefs.wrapper.prop("hidden", true);
      this.attendeeFilterManager.reset();
      this.attendeeAddManager.destroy();
      this.getAddAttendeeField().val("");
      this.clearTableHead();
      this.clearAttendeeRows();
      this.attendeeRIDManager.reset();
      this.attendeeModalState = this.getDefaultAttendeeModalState();
      this.updateSubmitButtonState();
      session_state.state = "mainPage";
    }
    clearTableHead() {
      if (!this.modalRefs || this.modalRefs.tableHead.length === 0) {
        return;
      }
      this.modalRefs.tableHead.empty();
    }
    clearAttendeeRows() {
      if (!this.modalRefs || this.modalRefs.tableBody.length === 0) {
        return;
      }
      this.modalRefs.tableBody.empty();
    }
    async refreshAttendees() {
      const sessionID = Number(this.attendeeModalState.activeSessionID);
      if (!Number.isFinite(sessionID)) {
        return;
      }
      const attendees = await this.db.get("attendees", { sessionID });
      this.attendeeRIDManager.mergeIncomingAttendeeData(attendees);
      this.renderAttendeeRows();
      this.updateSubmitButtonState();
    }
    getAddAttendeeField() {
      return jq("#pdt-shadow-attendees #add-attendee");
    }
    async addAttendeeToDraft(attendeeDirectoryEntry) {
      const sessionID = Number(this.attendeeModalState.activeSessionID);
      if (!Number.isFinite(sessionID)) {
        return;
      }
      const attendeeCandidate = this.buildDraftAttendee(attendeeDirectoryEntry);
      if (!attendeeCandidate) {
        alert("That attendee could not be loaded. Please refresh the page and try again.");
        return;
      }
      const addedAttendee = this.attendeeRIDManager.addAttendee(attendeeCandidate);
      if (!addedAttendee) {
        return;
      }
      this.renderAttendeeRows();
      this.updateSubmitButtonState();
    }
    buildDraftAttendee(attendeeDirectoryEntry) {
      var _a, _b;
      const sessionID = Number(this.attendeeModalState.activeSessionID);
      const personID = Number(attendeeDirectoryEntry == null ? void 0 : attendeeDirectoryEntry.personID);
      const name = String((_a = attendeeDirectoryEntry == null ? void 0 : attendeeDirectoryEntry.name) != null ? _a : "").trim();
      const email = String((_b = attendeeDirectoryEntry == null ? void 0 : attendeeDirectoryEntry.email) != null ? _b : "").trim();
      if (!Number.isFinite(sessionID) || !Number.isFinite(personID) || name === "" || email === "") {
        return null;
      }
      return {
        sessionID,
        personID,
        name,
        email,
        dateRangeStart: null,
        dateRangeEnd: null,
        dateRangeDisplay: this.attendeeModalState.showSelfPacedDateRangeColumn ? "Not started" : null,
        certStatusID: 4,
        ridCertified: false,
        ridCertifiedAt: null,
        ridCertifiedByUserID: null,
        adminComment: "",
        memberComment: ""
      };
    }
    renderAttendeeRows() {
      if (!this.modalRefs || this.modalRefs.tableHead.length === 0 || this.modalRefs.tableBody.length === 0) {
        return;
      }
      this.tableRenderer.render(this.modalRefs.tableHead, this.modalRefs.tableBody, {
        attendees: this.attendeeRIDManager.getDraftAttendees(),
        attendeeStatuses: this.attendeeStatuses,
        commentIconURL: this.commentIconURL,
        dateRangeRenderMode: "edit",
        showRIDColumn: this.attendeeModalState.showRIDColumn,
        showSelfPacedDateRangeColumn: this.attendeeModalState.showSelfPacedDateRangeColumn,
        buildAttendeeSearchText: (attendee) => this.attendeeFilterManager.buildAttendeeSearchText(attendee)
      });
      this.attendeeFilterManager.applyFilter();
      this.attendeeAddManager.syncSearch(this.getAddAttendeeField(), {
        excludedPersonIDs: this.attendeeRIDManager.getDraftPersonIDs(),
        onAttendeeSelected: async (attendeeDirectoryEntry) => {
          await this.addAttendeeToDraft(attendeeDirectoryEntry);
        }
      });
    }
    getVisibleColumnCount() {
      return this.tableRenderer.getVisibleColumnCount({
        showRIDColumn: this.attendeeModalState.showRIDColumn,
        showSelfPacedDateRangeColumn: this.attendeeModalState.showSelfPacedDateRangeColumn
      });
    }
    getAttendeeStatusLabel(statusID) {
      var _a;
      const numericStatusID = Number(statusID);
      if (Number.isFinite(numericStatusID) && this.attendeeStatuses[numericStatusID]) {
        return this.attendeeStatuses[numericStatusID];
      }
      return (_a = this.attendeeStatuses[4]) != null ? _a : "Not Assigned";
    }
    shouldShowRIDColumn(sessionData) {
      var _a;
      if (typeof (sessionData == null ? void 0 : sessionData.IsRIDQualifiedSession) === "boolean") {
        return sessionData.IsRIDQualifiedSession;
      }
      return String((_a = sessionData == null ? void 0 : sessionData.RIDQualify) != null ? _a : "").trim().toLowerCase() === "yes";
    }
    shouldShowSelfPacedDateRangeColumn(sessionData) {
      var _a;
      if (typeof (sessionData == null ? void 0 : sessionData.IsSelfPacedSession) === "boolean") {
        return sessionData.IsSelfPacedSession;
      }
      return String((_a = sessionData == null ? void 0 : sessionData.Date) != null ? _a : "").trim() === "Self Paced";
    }
    updateSubmitButtonState() {
      if (!this.modalRefs || this.modalRefs.submit.length === 0) {
        return;
      }
      const isSaving = this.attendeeRIDManager.isSaving();
      this.modalRefs.submit.text(isSaving ? "Saving..." : "Save Attendees");
      this.modalRefs.submit.prop("disabled", isSaving || !this.attendeeRIDManager.hasPendingChanges());
    }
    async getCommentIconURL() {
      var _a;
      if (typeof this.commentIconURL === "string" && this.commentIconURL.trim() !== "") {
        return this.commentIconURL;
      }
      const hostCommentIconURL = typeof ((_a = this.host) == null ? void 0 : _a.getComment) === "function" ? await this.host.getComment() : getSpeechBubbleIconURL();
      this.commentIconURL = String(hostCommentIconURL != null ? hostCommentIconURL : "").trim() || getSpeechBubbleIconURL();
      return this.commentIconURL;
    }
  };

  // js/session-table2/flag_manager.js
  var flag_manager = class {
    constructor(db = null) {
      this.db = db;
      this.flagSearchSelect = null;
      this.flagsData = { top: [] };
      this.topFlagIds = /* @__PURE__ */ new Set();
    }
    async init(flagFields) {
      await this.load(flagFields);
      this.setupSearch(flagFields);
    }
    async reset(flagFields) {
      await this.load(flagFields);
      if (!this.flagSearchSelect) {
        return;
      }
      const flagOptions = this.getflagOptions(this.flagsData, this.topFlagIds);
      this.flagSearchSelect.clearOptions();
      this.flagSearchSelect.addOptions(flagOptions);
      this.flagSearchSelect.clear();
      this.flagSearchSelect.refreshOptions(false);
    }
    async load(flagFields) {
      this.flagsData = await this.db.get("flags");
      this.topFlagIds = new Set(this.flagsData.top);
      this.loadFlags(flagFields.list, this.flagsData);
    }
    setupSearch(flagFields) {
      if (flagFields.search.length === 0 || typeof window.TomSelect === "undefined") {
        return;
      }
      if (this.flagSearchSelect) {
        this.flagSearchSelect.destroy();
      }
      const flagOptions = this.getflagOptions(this.flagsData, this.topFlagIds);
      this.flagSearchSelect = new TomSelect(flagFields.search[0], {
        valueField: "id",
        labelField: "name",
        searchField: ["name"],
        options: flagOptions,
        maxItems: 1,
        create: false,
        render: {
          no_results: (data, escape) => {
            return `
                        <div class="pdt-add-flag-option create button" data-input="${escape(data.input)}">
                            Add "${escape(data.input)}"
                        </div>`;
          }
        },
        onItemAdd: (value) => {
          const id = Number(value);
          if (!this.flagsData[id]) {
            alert("That flag option is invalid. Please refresh the page and try again.");
            this.flagSearchSelect.clear();
            return;
          }
          this.addFlagToList(flagFields.list, id, this.flagsData[id]);
          this.topFlagIds.add(id);
          this.flagSearchSelect.removeOption(value);
          this.flagSearchSelect.refreshOptions(false);
          this.flagSearchSelect.clear();
        }
      });
      this.flagSearchSelect.dropdown_content.addEventListener("mousedown", async (event) => {
        var _a;
        const addFlagOption = event.target.closest(".pdt-add-flag-option");
        if (!addFlagOption) {
          return;
        }
        event.preventDefault();
        const newFlagLabel = String((_a = addFlagOption.getAttribute("data-input")) != null ? _a : "").trim();
        if (newFlagLabel === "") {
          return;
        }
        const existingFlagId = this.findFlagId(this.flagsData, newFlagLabel);
        if (existingFlagId !== null) {
          this.addFlagToList(flagFields.list, existingFlagId, this.flagsData[existingFlagId]);
          this.topFlagIds.add(existingFlagId);
          this.flagSearchSelect.removeOption(existingFlagId);
          this.flagSearchSelect.clear();
          this.flagSearchSelect.close();
          return;
        }
        const newFlagId = Number(await this.db.addFlag(newFlagLabel));
        if (!Number.isFinite(newFlagId)) {
          alert("Unable to add that flag right now. Please try again.");
          return;
        }
        this.flagsData[newFlagId] = newFlagLabel;
        this.addFlagToList(flagFields.list, newFlagId, newFlagLabel);
        this.topFlagIds.add(newFlagId);
        this.flagSearchSelect.clear();
        this.flagSearchSelect.close();
      });
    }
    loadFlags(flagList, flagsData) {
      flagList.empty();
      for (const flag of flagsData.top) {
        this.addFlagToList(flagList, flag, flagsData[flag], false);
      }
    }
    getflagOptions(flagsData, topFlagIds) {
      return Object.entries(flagsData).filter(([flagId]) => flagId !== "top" && !topFlagIds.has(Number(flagId))).map(([flagId, label]) => ({
        id: Number(flagId),
        name: label
      }));
    }
    addFlagToList(flagList, flagId, flagLabel, isChecked = true) {
      const existingFlag = flagList.find(`input[data-flagID="${flagId}"]`);
      if (existingFlag.length > 0) {
        existingFlag.prop("checked", isChecked || existingFlag.prop("checked"));
        return;
      }
      const option = `
            <label>
                <input type="checkbox" data-flagID=${flagId} name="flags" value="${flagLabel}" ${isChecked ? "checked" : ""}>
                ${flagLabel}
            </label>`;
      flagList.append(option);
    }
    findFlagId(flagsData, flagLabel) {
      const normalizedLabel = String(flagLabel != null ? flagLabel : "").trim().toLowerCase();
      if (normalizedLabel === "") {
        return null;
      }
      for (const [flagId, label] of Object.entries(flagsData)) {
        if (flagId === "top") {
          continue;
        }
        if (String(label).trim().toLowerCase() === normalizedLabel) {
          return Number(flagId);
        }
      }
      return null;
    }
    getFlags(flagFields) {
      const checkedFlags = flagFields.list.find('input[name="flags"]:checked');
      const flagIds = [];
      checkedFlags.each(function() {
        const flagId = Number(jq(this).attr("data-flagID"));
        if (Number.isFinite(flagId)) {
          flagIds.push(flagId);
        }
      });
      return flagIds;
    }
    setFlags(flagFields, selectedFlagIds = []) {
      const validSelectedIds = selectedFlagIds.filter((flagId) => this.flagsData[flagId]);
      this.topFlagIds = new Set(this.flagsData.top);
      this.loadFlags(flagFields.list, this.flagsData);
      for (const flagId of validSelectedIds) {
        this.addFlagToList(flagFields.list, flagId, this.flagsData[flagId], true);
        this.topFlagIds.add(flagId);
      }
      if (!this.flagSearchSelect) {
        return;
      }
      const flagOptions = this.getflagOptions(this.flagsData, this.topFlagIds);
      this.flagSearchSelect.clearOptions();
      this.flagSearchSelect.addOptions(flagOptions);
      this.flagSearchSelect.clear();
      this.flagSearchSelect.refreshOptions(false);
    }
  };

  // js/session-table2/dropdown_add_manager.js
  var dropdown_add_manager = class {
    constructor(db = null) {
      this.db = db;
      this.dropDownAddState = null;
      this.addOptionModal = null;
    }
    async init(dropDownFields, addOptionModal) {
      this.addOptionModal = addOptionModal;
      await this.loadDropDownFields(dropDownFields);
      this.bindDropDownAddNew(dropDownFields);
      this.bindAddOptionModal();
    }
    async reset(dropDownFields) {
      await this.loadDropDownFields(dropDownFields);
    }
    async loadDropDownFields(dropDownFields) {
      const sessionTypes = await this.db.get("sessionTypes");
      const eventTypes = await this.db.get("EventTypes");
      const ceuTypes = await this.db.get("CEUTypes");
      this.loadDropDownOptions(dropDownFields.sessionType, sessionTypes);
      this.loadDropDownOptions(dropDownFields.eventType, eventTypes);
      this.loadDropDownOptions(dropDownFields.ceuType, ceuTypes);
      dropDownFields.ridQualified.val("no");
    }
    loadDropDownOptions(selectField, optionsData) {
      const noneOption = selectField.find('option[value="0"]').detach();
      const addNewOption = selectField.find('option[value="-1"]').detach();
      const sortedOptions = Object.entries(optionsData != null ? optionsData : {}).sort((leftOption, rightOption) => {
        return String(leftOption[1]).localeCompare(String(rightOption[1]), void 0, { sensitivity: "base" });
      });
      selectField.empty();
      selectField.append(noneOption);
      for (const [optionId, optionLabel] of sortedOptions) {
        selectField.append(`<option value="${optionId}">${optionLabel}</option>`);
      }
      selectField.append(addNewOption);
      selectField.val("0");
    }
    bindDropDownAddNew(dropDownFields) {
      const addNewSelects = [
        dropDownFields.sessionType,
        dropDownFields.eventType,
        dropDownFields.ceuType
      ];
      for (const selectField of addNewSelects) {
        selectField.off("change.pdtAddNew").on("change.pdtAddNew", () => {
          if (selectField.val() !== "-1") {
            return;
          }
          this.handleDropDownAddNew(selectField);
        });
      }
    }
    handleDropDownAddNew(selectField) {
      selectField.val("0");
      const modalData = this.getDropDownModalData(selectField);
      if (modalData === null || !this.addOptionModal) {
        return;
      }
      this.dropDownAddState = {
        selectField,
        resource: modalData.resource
      };
      this.addOptionModal.title.text(modalData.title);
      this.addOptionModal.helper.text(modalData.helper);
      this.addOptionModal.input.val("");
      this.addOptionModal.feedback.text("").prop("hidden", true);
      this.addOptionModal.wrapper.prop("hidden", false);
      this.addOptionModal.input.trigger("focus");
    }
    bindAddOptionModal() {
      if (!this.addOptionModal) {
        return;
      }
      this.addOptionModal.cancel.off("click.pdtAddOption").on("click.pdtAddOption", () => {
        this.closeAddOptionModal();
      });
      this.addOptionModal.wrapper.off("click.pdtAddOption").on("click.pdtAddOption", (event) => {
        if (event.target !== this.addOptionModal.wrapper[0]) {
          return;
        }
        this.closeAddOptionModal();
      });
      this.addOptionModal.submit.off("click.pdtAddOption").on("click.pdtAddOption", async () => {
        await this.saveAddOptionModal();
      });
    }
    closeAddOptionModal() {
      if (!this.addOptionModal) {
        return;
      }
      this.addOptionModal.wrapper.prop("hidden", true);
      this.addOptionModal.input.val("");
      this.addOptionModal.feedback.text("").prop("hidden", true);
      this.dropDownAddState = null;
    }
    getDropDownModalData(selectField) {
      const selectId = selectField.attr("id");
      if (selectId === "session_type") {
        return {
          resource: "sessionTypes",
          title: "Add New Session Type",
          helper: "Enter a new session type label. Duplicate labels are case-insensitive."
        };
      }
      if (selectId === "event_type") {
        return {
          resource: "EventTypes",
          title: "Add New Event Type",
          helper: "Enter a new event type label. Duplicate labels are case-insensitive."
        };
      }
      if (selectId === "ceu_type") {
        return {
          resource: "CEUTypes",
          title: "Add New CEU Type",
          helper: "Enter a new CEU type label. Duplicate labels are case-insensitive."
        };
      }
      return null;
    }
    async saveAddOptionModal() {
      var _a;
      if (this.dropDownAddState === null || !this.addOptionModal) {
        return;
      }
      const label = String((_a = this.addOptionModal.input.val()) != null ? _a : "").trim();
      if (label === "") {
        this.addOptionModal.feedback.text("Please enter a label.").prop("hidden", false);
        this.addOptionModal.input.trigger("focus");
        return;
      }
      const optionId = Number(await this.db.set(this.dropDownAddState.resource, label));
      if (!Number.isFinite(optionId) || optionId < 0) {
        this.addOptionModal.feedback.text("That label already exists or could not be added.").prop("hidden", false);
        this.addOptionModal.input.trigger("focus");
        return;
      }
      const updatedOptions = await this.db.get(this.dropDownAddState.resource);
      this.loadDropDownOptions(this.dropDownAddState.selectField, updatedOptions);
      this.dropDownAddState.selectField.val(String(optionId));
      this.closeAddOptionModal();
    }
    getDropDownFields(dropDownFields) {
      var _a;
      return {
        sessionType: this.normalizeDropDownValue(dropDownFields.sessionType.val()),
        eventType: this.normalizeDropDownValue(dropDownFields.eventType.val()),
        ceuType: this.normalizeDropDownValue(dropDownFields.ceuType.val()),
        ridQualified: String((_a = dropDownFields.ridQualified.val()) != null ? _a : "no")
      };
    }
    setDropDownFields(dropDownFields, values = {}) {
      var _a;
      this.setDropDownValue(dropDownFields.sessionType, values.sessionType);
      this.setDropDownValue(dropDownFields.eventType, values.eventType);
      this.setDropDownValue(dropDownFields.ceuType, values.ceuType);
      dropDownFields.ridQualified.val(String((_a = values.ridQualified) != null ? _a : "no"));
    }
    setDropDownValue(selectField, value) {
      if (value === null || value === void 0) {
        selectField.val("0");
        return;
      }
      selectField.val(String(value));
    }
    normalizeDropDownValue(value) {
      if (value === "0" || value === "-1" || value === null || value === void 0) {
        return null;
      }
      return Number(value);
    }
    resetDropDownFields(dropDownFields) {
      dropDownFields.sessionType.val("0");
      dropDownFields.eventType.val("0");
      dropDownFields.ceuType.val("0");
      dropDownFields.ridQualified.val("no");
    }
  };

  // js/session-table2/presenter_manager.js
  var presenter_manager = class {
    constructor(db = null) {
      this.db = db;
      this.presenterSearchSelect = null;
      this.presentersData = [];
    }
    async init(presenterFields) {
      await this.load(presenterFields);
      this.setupSearch(presenterFields);
    }
    async reset(presenterFields) {
      await this.load(presenterFields);
      if (!this.presenterSearchSelect) {
        return;
      }
      const presenterOptions = this.getPresenterOptions(this.presentersData);
      this.presenterSearchSelect.clearOptions();
      this.presenterSearchSelect.addOptions(presenterOptions);
      this.presenterSearchSelect.clear();
      this.presenterSearchSelect.refreshOptions(false);
    }
    async load(presenterFields) {
      var _a;
      this.presentersData = (_a = await this.db.get("presenters")) != null ? _a : [];
    }
    setupSearch(presenterFields) {
      if (presenterFields.select.length === 0 || typeof window.TomSelect === "undefined") {
        return;
      }
      if (this.presenterSearchSelect) {
        this.presenterSearchSelect.destroy();
      }
      const presenterOptions = this.getPresenterOptions(this.presentersData);
      this.presenterSearchSelect = new TomSelect(presenterFields.select[0], {
        valueField: "id",
        labelField: "label",
        searchField: ["name", "email"],
        options: presenterOptions,
        maxItems: null,
        create: false,
        persist: false,
        sortField: [
          { field: "name", direction: "asc" }
        ]
      });
    }
    getPresenters(presenterFields) {
      var _a;
      if (this.presenterSearchSelect) {
        return this.presenterSearchSelect.items.map((presenterId) => Number(presenterId)).filter((presenterId) => Number.isFinite(presenterId));
      }
      const selectedValues = (_a = presenterFields.select.val()) != null ? _a : [];
      return selectedValues.map((presenterId) => Number(presenterId)).filter((presenterId) => Number.isFinite(presenterId));
    }
    getPresenterOptions(presentersData) {
      return (presentersData != null ? presentersData : []).map((presenter) => {
        const [name, email, attendeeIndex, presenterIndex, personId] = presenter;
        return {
          id: Number(personId),
          name: String(name != null ? name : ""),
          email: String(email != null ? email : ""),
          label: `${String(name != null ? name : "")} (${String(email != null ? email : "")})`
        };
      }).filter((presenterOption) => Number.isFinite(presenterOption.id));
    }
    setPresenters(presenterFields, selectedPresenterIds = []) {
      const presenterIds = selectedPresenterIds.map((presenterId) => Number(presenterId)).filter((presenterId) => Number.isFinite(presenterId)).map((presenterId) => String(presenterId));
      if (this.presenterSearchSelect) {
        this.presenterSearchSelect.setValue(presenterIds, true);
        return;
      }
      presenterFields.select.val(presenterIds);
    }
  };

  // js/session-table2/add-edit-session.js
  var add_edit_session = class {
    constructor(db = null, host = null) {
      this.db = db;
      this.host = host;
      this.flagManager = new flag_manager(db);
      this.dropDownAddManager = new dropdown_add_manager(db);
      this.presenterManager = new presenter_manager(db);
      this.mainPage = null;
      this.formRefs = null;
      this.sessionModalState = {
        mode: "create",
        activeSessionID: null
      };
    }
    async init(mainPage) {
      this.mainPage = mainPage;
      const sessionModal = {
        wrapper: jq("#pdt-shadow-session-modal"),
        modal: jq("#pdt-shadow-session-modal .pdt-add-edit-modal"),
        title: jq("#session-modal-title"),
        submit: jq("#pdt-shadow-session-modal #submitModal"),
        cancel: jq("#pdt-shadow-session-modal #cancelModal")
      };
      const addSessionButton = jq(".pdt-main #add-session");
      const flagFields = {
        list: sessionModal.modal.find(".pdt-flag-list"),
        search: sessionModal.modal.find("#flag-search")
      };
      const dateFields = {
        options: sessionModal.modal.find("#date-options"),
        singleDate: sessionModal.modal.find("#date"),
        startDate: sessionModal.modal.find("#date-start"),
        endDate: sessionModal.modal.find("#date-end")
      };
      const textFields = {
        organizer: sessionModal.modal.find("#organizer"),
        sessionTitle: sessionModal.modal.find("#session_title"),
        parentEvent: sessionModal.modal.find("#parent_event")
      };
      const ceuFields = {
        qualify: sessionModal.modal.find("#qual_for_ceu"),
        weight: sessionModal.modal.find("#ceu_weight")
      };
      const presenterFields = {
        select: sessionModal.modal.find("#presenter-select")
      };
      const lengthField = sessionModal.modal.find("#length");
      const dropDowns = sessionModal.modal.find(".pdt-panel--5");
      const dropSession = dropDowns.find("#session_type");
      const dropEvent = dropDowns.find("#event_type");
      const dropCEU = dropDowns.find("#ceu_type");
      const dropRID = dropDowns.find("#rid_qualified");
      const dropDownFields = {
        sessionType: dropSession,
        eventType: dropEvent,
        ceuType: dropCEU,
        ridQualified: dropRID
      };
      const addOptionModal = {
        wrapper: jq("#pdt-shadow-add-option-modal"),
        modal: jq("#pdt-shadow-add-option-modal .pdt-add-option-modal"),
        title: jq("#pdt-shadow-add-option-modal #add-option-title"),
        helper: jq("#pdt-shadow-add-option-modal #add-option-helper"),
        input: jq("#pdt-shadow-add-option-modal #add-option-input"),
        feedback: jq("#pdt-shadow-add-option-modal #add-option-feedback"),
        submit: jq("#pdt-shadow-add-option-modal #submitAddOption"),
        cancel: jq("#pdt-shadow-add-option-modal #cancelAddOption")
      };
      await this.flagManager.init(flagFields);
      await this.dropDownAddManager.init(dropDownFields, addOptionModal);
      await this.presenterManager.init(presenterFields);
      this.bindCEUFieldState(ceuFields, dropDownFields);
      this.applyCEUFieldState(ceuFields, dropDownFields);
      this.formRefs = {
        sessionModal,
        flagFields,
        dateFields,
        textFields,
        ceuFields,
        presenterFields,
        lengthField,
        dropDownFields
      };
      addSessionButton.off("click.pdtAddSession").on("click.pdtAddSession", async () => {
        await this.openForCreate();
      });
      sessionModal.wrapper.off("click.pdtAddSession").on("click.pdtAddSession", async (event) => {
        if (event.target === sessionModal.wrapper[0]) {
          await this.closeModal();
        }
      });
      sessionModal.cancel.off("click.pdtAddSession").on("click.pdtAddSession", async () => {
        await this.closeModal();
      });
      sessionModal.submit.off("click.pdtAddSession").on("click.pdtAddSession", async () => {
        var _a, _b;
        let dateOption = this.getDate(dateFields);
        if (!this.validateDate(dateOption, dateFields)) {
          return;
        }
        let length = this.getLength(lengthField);
        if (dateOption[0] === 1 && length === null) {
          alert("Please enter a valid positive length in minutes.");
          lengthField.trigger("focus");
          return;
        } else if (dateOption[0] !== 1 && length !== null) {
          alert("Length should only be set for a single date session.");
          lengthField.trigger("focus");
          return;
        }
        let flags = this.flagManager.getFlags(flagFields);
        let textFieldValues = this.getTextFields(textFields);
        if (!this.validateTextFields(textFieldValues, textFields)) {
          return;
        }
        let dropDownValues = this.dropDownAddManager.getDropDownFields(dropDownFields);
        let presenterValues = this.presenterManager.getPresenters(presenterFields);
        const qualifiesForCEU = String((_a = ceuFields.qualify.val()) != null ? _a : "yes") === "yes";
        const ceuWeightValue = String((_b = ceuFields.weight.val()) != null ? _b : "").trim();
        let ceuWeightForSave = null;
        if (qualifiesForCEU) {
          ceuWeightForSave = Number(ceuWeightValue);
          if (ceuWeightForSave <= 0 || Number.isNaN(ceuWeightForSave)) {
            alert("Please enter a valid positive CEU weight.");
            ceuFields.weight.trigger("focus");
            return;
          }
        }
        const ceuQualifyForSave = qualifiesForCEU ? "Yes" : "No";
        const ceuTypeForSave = qualifiesForCEU ? dropDownValues.ceuType : null;
        const sessionPayload = {
          sessionID: this.sessionModalState.activeSessionID,
          dateOption,
          length,
          flags,
          organizer: textFieldValues.organizer,
          sessionTitle: textFieldValues.sessionTitle,
          parentEvent: textFieldValues.parentEvent,
          sessionType: dropDownValues.sessionType,
          eventType: dropDownValues.eventType,
          ceuType: ceuTypeForSave,
          ridQualified: dropDownValues.ridQualified,
          presenters: presenterValues,
          ceuQualify: ceuQualifyForSave,
          ceuWeight: ceuWeightForSave
        };
        await this.db.put("session", sessionPayload);
        await this.mainPage.loadTable();
        await this.closeModal();
      });
    }
    async openForCreate() {
      if (!this.formRefs) {
        return;
      }
      await this.resetForm();
      this.formRefs.sessionModal.wrapper.prop("hidden", false);
    }
    async openForEdit(sessionID) {
      if (!this.formRefs) {
        return;
      }
      const sessionData = await this.db.get("session", { sessionID });
      if (!sessionData) {
        alert("That session could not be found. Please refresh the page and try again.");
        return;
      }
      await this.resetForm();
      this.setModalMode("edit", sessionData.sessionID);
      await this.populateFormFromSession(sessionData);
      this.formRefs.sessionModal.wrapper.prop("hidden", false);
    }
    async closeModal() {
      if (!this.formRefs) {
        return;
      }
      this.formRefs.sessionModal.wrapper.prop("hidden", true);
      await this.resetForm();
    }
    // The following are supporting functions for init, please understand init before continuing.
    async resetForm() {
      if (!this.formRefs) {
        return;
      }
      const {
        dateFields,
        textFields,
        ceuFields,
        presenterFields,
        lengthField,
        dropDownFields,
        flagFields
      } = this.formRefs;
      this.setModalMode("create", null);
      this.resetDateInputs(dateFields);
      this.resetLengthInput(lengthField);
      this.resetTextFields(textFields);
      ceuFields.qualify.val("yes");
      ceuFields.weight.val("1.0");
      await this.dropDownAddManager.reset(dropDownFields);
      await this.presenterManager.reset(presenterFields);
      await this.flagManager.reset(flagFields);
      this.applyCEUFieldState(ceuFields, dropDownFields);
    }
    setModalMode(mode, sessionID = null) {
      this.sessionModalState = {
        mode,
        activeSessionID: sessionID
      };
      if (!this.formRefs) {
        return;
      }
      if (mode === "edit") {
        this.formRefs.sessionModal.title.text("Edit Session");
        this.formRefs.sessionModal.submit.text("Save Changes");
        return;
      }
      this.formRefs.sessionModal.title.text("Add Session");
      this.formRefs.sessionModal.submit.text("Save Session");
    }
    async populateFormFromSession(sessionData) {
      var _a, _b, _c, _d, _e, _f;
      const {
        dateFields,
        textFields,
        ceuFields,
        presenterFields,
        lengthField,
        dropDownFields,
        flagFields
      } = this.formRefs;
      this.setDateFieldsFromSession(sessionData.Date, dateFields);
      if (this.isSingleDateSession(sessionData.Date) && Number(sessionData.Length) > 0) {
        lengthField.val(String(sessionData.Length));
      }
      textFields.organizer.val(String((_a = sessionData.Organizer) != null ? _a : ""));
      textFields.sessionTitle.val(String((_b = sessionData.SessionTitle) != null ? _b : ""));
      textFields.parentEvent.val(String((_c = sessionData.ParentType) != null ? _c : ""));
      const dropDownValues = await this.getSessionDropDownValues(sessionData);
      this.dropDownAddManager.setDropDownFields(dropDownFields, dropDownValues);
      ceuFields.qualify.val(String((_d = sessionData.CEUQualify) != null ? _d : "No").toLowerCase() === "yes" ? "yes" : "no");
      ceuFields.weight.val(Number(sessionData.CEUWeight) > 0 ? String(sessionData.CEUWeight) : "1.0");
      this.applyCEUFieldState(ceuFields, dropDownFields);
      this.flagManager.setFlags(flagFields, (_e = sessionData.FlagIDs) != null ? _e : []);
      this.presenterManager.setPresenters(presenterFields, (_f = sessionData.PresenterIDs) != null ? _f : []);
    }
    async getSessionDropDownValues(sessionData) {
      var _a, _b, _c, _d;
      const [sessionTypes, eventTypes, ceuTypes] = await Promise.all([
        this.db.get("sessionTypes"),
        this.db.get("EventTypes"),
        this.db.get("CEUTypes")
      ]);
      return {
        sessionType: (_a = sessionData.SessionTypeID) != null ? _a : this.findOptionIdByLabel(sessionTypes, sessionData.SessionType),
        eventType: (_b = sessionData.EventTypeID) != null ? _b : this.findOptionIdByLabel(eventTypes, sessionData.EventType),
        ceuType: (_c = sessionData.CEUTypeID) != null ? _c : this.findOptionIdByLabel(ceuTypes, sessionData.CEUConsideration),
        ridQualified: String((_d = sessionData.RIDQualify) != null ? _d : "No").toLowerCase() === "yes" ? "yes" : "no"
      };
    }
    getDate(dateFields) {
      const dateType = dateFields.options.find('input[name="date_mode"]:checked').val();
      const singleDate = dateFields.singleDate.val() || null;
      const startDate = dateFields.startDate.val() || null;
      const endDate = dateFields.endDate.val() || null;
      if (dateType === "range") {
        return [2, startDate, endDate];
      }
      if (dateType === "self_paced") {
        return [3, null, null];
      }
      return [1, singleDate, null];
    }
    resetDateInputs(dateFields) {
      dateFields.options.find('input[name="date_mode"][value="single"]').prop("checked", true);
      dateFields.singleDate.val("");
      dateFields.startDate.val("");
      dateFields.endDate.val("");
    }
    resetLengthInput(lengthField) {
      lengthField.val("");
    }
    validateDate(dateOption, dateFields) {
      const [dateType, startDate, endDate] = dateOption;
      if (dateType === 1) {
        if (!startDate) {
          alert("Please choose a single date.");
          dateFields.singleDate.trigger("focus");
          return false;
        }
        return true;
      }
      if (dateType === 2) {
        if (!startDate) {
          alert("Please choose a start date.");
          dateFields.startDate.trigger("focus");
          return false;
        }
        if (!endDate) {
          alert("Please choose an end date.");
          dateFields.endDate.trigger("focus");
          return false;
        }
        if (endDate < startDate) {
          alert("End date must be on or after the start date.");
          dateFields.endDate.trigger("focus");
          return false;
        }
        return true;
      }
      return true;
    }
    getLength(lengthField) {
      const length = Number(lengthField.val());
      if (length <= 0 || Number.isNaN(length)) {
        return null;
      }
      return length;
    }
    getTextFields(textFields) {
      var _a, _b, _c;
      return {
        organizer: String((_a = textFields.organizer.val()) != null ? _a : "").trim(),
        sessionTitle: String((_b = textFields.sessionTitle.val()) != null ? _b : "").trim(),
        parentEvent: String((_c = textFields.parentEvent.val()) != null ? _c : "").trim()
      };
    }
    validateTextFields(textFieldValues, textFields) {
      if (textFieldValues.sessionTitle === "") {
        alert("Please enter a session title.");
        textFields.sessionTitle.trigger("focus");
        return false;
      }
      return true;
    }
    resetTextFields(textFields) {
      textFields.organizer.val("");
      textFields.sessionTitle.val("");
      textFields.parentEvent.val("");
    }
    bindCEUFieldState(ceuFields, dropDownFields) {
      ceuFields.qualify.off("change.pdtCEUState").on("change.pdtCEUState", () => {
        this.applyCEUFieldState(ceuFields, dropDownFields);
      });
    }
    applyCEUFieldState(ceuFields, dropDownFields) {
      var _a;
      const qualifiesForCEU = String((_a = ceuFields.qualify.val()) != null ? _a : "yes") === "yes";
      ceuFields.weight.prop("disabled", !qualifiesForCEU);
      dropDownFields.ceuType.prop("disabled", !qualifiesForCEU);
    }
    setDateFieldsFromSession(dateValue, dateFields) {
      this.resetDateInputs(dateFields);
      const normalizedDateValue = String(dateValue != null ? dateValue : "").trim();
      if (normalizedDateValue === "" || normalizedDateValue === "Self Paced") {
        dateFields.options.find('input[name="date_mode"][value="self_paced"]').prop("checked", true);
        return;
      }
      if (normalizedDateValue.includes(" to ")) {
        const [startDate, endDate] = normalizedDateValue.split(" to ");
        dateFields.options.find('input[name="date_mode"][value="range"]').prop("checked", true);
        dateFields.startDate.val(this.displayDateToInputValue(startDate));
        dateFields.endDate.val(this.displayDateToInputValue(endDate));
        return;
      }
      dateFields.options.find('input[name="date_mode"][value="single"]').prop("checked", true);
      dateFields.singleDate.val(this.displayDateToInputValue(normalizedDateValue));
    }
    displayDateToInputValue(displayDate) {
      const normalizedDate = String(displayDate != null ? displayDate : "").trim();
      const dateParts = normalizedDate.split("/");
      if (dateParts.length !== 3) {
        return "";
      }
      const [month, day, year] = dateParts;
      if (month === "" || day === "" || year === "") {
        return "";
      }
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    isSingleDateSession(dateValue) {
      const normalizedDateValue = String(dateValue != null ? dateValue : "").trim();
      return normalizedDateValue !== "" && normalizedDateValue !== "Self Paced" && !normalizedDateValue.includes(" to ");
    }
    findOptionIdByLabel(optionsData, label) {
      const normalizedLabel = String(label != null ? label : "").trim().toLowerCase();
      if (normalizedLabel === "") {
        return null;
      }
      for (const [optionId, optionLabel] of Object.entries(optionsData != null ? optionsData : {})) {
        if (String(optionLabel != null ? optionLabel : "").trim().toLowerCase() === normalizedLabel) {
          return Number(optionId);
        }
      }
      return null;
    }
  };

  // js/session-table2.js
  (function() {
    if (typeof jq !== "function") {
      console.error("PDT: jQuery is required for pdt-session-table2.js");
    } else {
      jq(document).ready(async function() {
        "use strict";
        const apiBaseUrl = "https://aslta-api-v3.judahsbase.com";
        const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTMyMn0.r_yhCUsRyPFYNP5oQVT4EpS6Aojmhah0aMQQL_IPQg9DDQeADEVyUx84QlJt6rTx2S2QSjuxmI3xB2ftl7WE4UoFCgYOT-RW3ehU0tDcU_1RnMCW3NqBfMtaIHXDd_u3er0BiQm25nEiCWF8JtQcQWOASRHuRb5dox6wJO5C-Jm7iQlwJGsAnlXTGqTUqfH_AhPAm35CJO8omtpMX7lgfhdmvivMDtsdwW5sLXmeKm0JhrNKcpPQjZJ_HkTXJRP_LD80dgA1n1qQFSgbQint4giRITNeTMk6pqUUXXgkduJUUW_v1qqZoMwt85CkPNkyb7E9Fcc7gBj9IdTrrl_aXw";
        const hostC = new host_connection();
        const dbC = new db_connection(apiBaseUrl, jwt, hostC);
        const mainPage = new main_page(
          dbC,
          hostC,
          new show_attendees(dbC, hostC),
          new add_edit_session(dbC, hostC)
        );
        session_state.state = "mainPage";
        await mainPage.init();
      });
    }
  })();
})();
//# sourceMappingURL=session-table2.js.map
