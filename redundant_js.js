

/*
Notes:
- There is a lot of checking going on related to urls and endpoints, it would be nice if it was its own datatype that was just compatiable.


*/

/**
 * @param {*} value 
 * @returns {string|null}
 * takes unnknown value and either returns it's string value trimed or null (could not be converted to string)
*/
function normalizeConfiguredValue(value) {
    const normalizedValue = String(value ?? "").trim();
    return normalizedValue === "" ? null : normalizedValue;
}

function normalizeFlexibleDateValue() {
    
}

    isSessionRecord(value) {
        throw Error("isSessionRecord should not be called.");
        // if (!value || typeof value !== "object" || Array.isArray(value)) {
        //     return false;
        // }

        // return Number.isFinite(Number(value.sessionID))
        //     || typeof value.SessionTitle === "string"
        //     || typeof value.Date === "string"
        //     || Array.isArray(value.Attendees)
        //     || Array.isArray(value.attendees);
    }


     normalizeSessionRecordForRead(session) {

        const normalizedSession = structuredClone(session);

        normalizedSession.AttendeesCt = Number(normalizedSession.AttendeesCt);

        return {
            ...structuredClone(session),
            IsRIDQualifiedSession: this.isRIDQualifiedSession(session),
            IsSelfPacedSession: this.isSelfPacedSession(session),
            Attendees: this.normalizeSessionAttendees(session?.Attendees, session)
        };
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

       parseStructuredPayload(payload) {
        // console.log("parseStructuredPayload")
        if (typeof payload !== "string") {
            // console.log("It's not a string");
            return payload;
        }
        throw new Error("parseStructuredPayload: A string was passed in here. Not sure why. BackEnd Fix?");
        
    }