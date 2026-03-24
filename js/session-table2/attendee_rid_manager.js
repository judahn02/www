export class attendee_rid_manager {
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

    isSaving() {
        return this.attendeeRIDState.isSaving === true;
    }

    hasPendingChanges() {
        return JSON.stringify(this.buildComparableRIDState(this.attendeeRIDState.attendeesDraft))
            !== JSON.stringify(this.buildComparableRIDState(this.attendeeRIDState.savedAttendees));
    }

    handleCheckboxChange(ridCheckbox) {
        const attendeeRow = ridCheckbox.closest(".pdt-attendees-row");
        const personID = Number(attendeeRow.attr("data-person-id"));
        if (!Number.isFinite(personID)) {
            return;
        }

        const ridDateTimeInput = attendeeRow.find(".pdt-rid-certified-at").first();
        const isRIDCertified = ridCheckbox.prop("checked") === true;
        let ridCertifiedAtValue = String(ridDateTimeInput.val() ?? "").trim();

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
        if (ridDateTimeInput.prop("disabled")) {
            return;
        }

        const attendeeRow = ridDateTimeInput.closest(".pdt-attendees-row");
        const personID = Number(attendeeRow.attr("data-person-id"));
        if (!Number.isFinite(personID)) {
            return;
        }

        let ridCertifiedAtValue = String(ridDateTimeInput.val() ?? "").trim();
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
        if (this.attendeeRIDState.isSaving || !this.hasPendingChanges()) {
            return null;
        }

        const numericSessionID = Number(sessionID);
        if (!Number.isFinite(numericSessionID)) {
            return null;
        }

        const invalidAttendee = this.attendeeRIDState.attendeesDraft.find((attendee) => {
            return attendee?.ridCertified === true && this.normalizeRIDDateTimeValue(attendee?.ridCertifiedAt) === null;
        });
        if (invalidAttendee) {
            alert(`RID certification for ${String(invalidAttendee?.name ?? "this attendee").trim()} needs a valid date and time before saving.`);
            return null;
        }

        this.attendeeRIDState.isSaving = true;

        try {
            const currentUserID = Number(await this.host?.get("userID"));
            if (!Number.isInteger(currentUserID) || currentUserID <= 0) {
                alert("The current user could not be determined, so RID certification changes could not be saved.");
                return null;
            }

            const attendees = await this.db.put("attendeeRIDCertifications", {
                sessionID: numericSessionID,
                certifiedByUserID: currentUserID,
                attendees: this.buildRIDCertificationPayload()
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
        const currentDraftRIDLookup = this.buildAttendeeRIDLookup(this.attendeeRIDState.attendeesDraft);
        const currentSavedRIDLookup = this.buildAttendeeRIDLookup(this.attendeeRIDState.savedAttendees);

        this.attendeeRIDState.attendeesDraft = incomingAttendees.map((attendee) => {
            return this.applyRIDLookupToAttendee(attendee, currentDraftRIDLookup);
        });
        this.attendeeRIDState.savedAttendees = incomingAttendees.map((attendee) => {
            return this.applyRIDLookupToAttendee(attendee, currentSavedRIDLookup);
        });
    }

    updateAttendeeRIDState(personID, nextRIDState) {
        const attendeeIndex = this.attendeeRIDState.attendeesDraft.findIndex((attendee) => {
            return this.getSafePersonID(attendee?.personID) === personID;
        });
        if (attendeeIndex < 0) {
            return;
        }

        const currentAttendee = this.attendeeRIDState.attendeesDraft[attendeeIndex];
        this.attendeeRIDState.attendeesDraft[attendeeIndex] = {
            ...currentAttendee,
            ridCertified: nextRIDState.ridCertified === true,
            ridCertifiedAt: nextRIDState.ridCertified === true ? nextRIDState.ridCertifiedAt ?? null : null,
            ridCertifiedByUserID: nextRIDState.ridCertified === true ? currentAttendee?.ridCertifiedByUserID ?? null : null
        };
    }

    buildRIDCertificationPayload() {
        return this.attendeeRIDState.attendeesDraft.map((attendee) => {
            const personID = this.getSafePersonID(attendee?.personID);
            const isRIDCertified = attendee?.ridCertified === true;
            return {
                personID,
                ridCertified: isRIDCertified,
                ridCertifiedAt: isRIDCertified ? this.normalizeRIDDateTimeValue(attendee?.ridCertifiedAt) : null
            };
        });
    }

    buildAttendeeRIDLookup(attendees = []) {
        const ridLookup = new Map();

        for (const attendee of Array.isArray(attendees) ? attendees : []) {
            const personID = this.getSafePersonID(attendee?.personID);
            ridLookup.set(personID, {
                ridCertified: attendee?.ridCertified === true,
                ridCertifiedAt: this.normalizeRIDDateTimeValue(attendee?.ridCertifiedAt),
                ridCertifiedByUserID: this.getPositiveIntegerOrNull(attendee?.ridCertifiedByUserID)
            });
        }

        return ridLookup;
    }

    applyRIDLookupToAttendee(attendee, ridLookup) {
        const personID = this.getSafePersonID(attendee?.personID);
        const ridData = ridLookup.get(personID);
        if (!ridData) {
            return attendee;
        }

        return {
            ...attendee,
            ridCertified: ridData.ridCertified,
            ridCertifiedAt: ridData.ridCertified ? ridData.ridCertifiedAt : null,
            ridCertifiedByUserID: ridData.ridCertified ? ridData.ridCertifiedByUserID : null
        };
    }

    buildComparableRIDState(attendees = []) {
        return (Array.isArray(attendees) ? attendees : [])
            .map((attendee) => {
                const isRIDCertified = attendee?.ridCertified === true;
                return {
                    personID: this.getSafePersonID(attendee?.personID),
                    ridCertified: isRIDCertified,
                    ridCertifiedAt: isRIDCertified ? this.normalizeRIDDateTimeValue(attendee?.ridCertifiedAt) : null
                };
            })
            .sort((leftAttendee, rightAttendee) => leftAttendee.personID - rightAttendee.personID);
    }

    cloneAttendees(attendees = []) {
        return structuredClone(Array.isArray(attendees) ? attendees : []);
    }

    getCurrentDateTimeLocalInputValue() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    dateTimeLocalInputValueToISO(dateTimeLocalValue) {
        const normalizedDateTimeLocalValue = String(dateTimeLocalValue ?? "").trim();
        if (normalizedDateTimeLocalValue === "") {
            return null;
        }

        const localDate = new Date(normalizedDateTimeLocalValue);
        if (Number.isNaN(localDate.getTime())) {
            return null;
        }

        return localDate.toISOString();
    }

    normalizeRIDDateTimeValue(value) {
        const normalizedValue = String(value ?? "").trim();
        if (normalizedValue === "") {
            return null;
        }

        const parsedTimestamp = Date.parse(normalizedValue);
        if (Number.isNaN(parsedTimestamp)) {
            return null;
        }

        return new Date(parsedTimestamp).toISOString();
    }

    getSafePersonID(personID) {
        const numericPersonID = Number(personID);
        return Number.isFinite(numericPersonID) ? numericPersonID : 0;
    }

    getPositiveIntegerOrNull(value) {
        const numericValue = Number(value);
        if (!Number.isInteger(numericValue) || numericValue <= 0) {
            return null;
        }

        return numericValue;
    }
}
