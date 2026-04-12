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

    getDraftAttendee(personID) {
        const normalizedPersonID = this.getSafePersonID(personID);
        if (normalizedPersonID <= 0) {
            return null;
        }

        return this.attendeeRIDState.attendeesDraft.find((attendee) => {
            return this.getSafePersonID(attendee?.personID) === normalizedPersonID;
        }) ?? null;
    }

    getDraftPersonIDs() {
        return this.attendeeRIDState.attendeesDraft
            .map((attendee) => this.getSafePersonID(attendee?.personID))
            .filter((personID) => personID > 0);
    }

    isSaving() {
        return this.attendeeRIDState.isSaving === true;
    }

    hasPendingChanges() {
        return JSON.stringify(this.buildComparableAttendeeState(this.attendeeRIDState.attendeesDraft))
            !== JSON.stringify(this.buildComparableAttendeeState(this.attendeeRIDState.savedAttendees));
    }

    addAttendee(attendee) {
        const personID = this.getSafePersonID(attendee?.personID);
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
            return this.getSafePersonID(attendee?.personID) === personID;
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
        const attendeeIndex = this.attendeeRIDState.attendeesDraft.findIndex((attendee) => {
            return this.getSafePersonID(attendee?.personID) === personID;
        });
        if (attendeeIndex < 0) {
            return null;
        }

        const currentAttendee = this.attendeeRIDState.attendeesDraft[attendeeIndex];
        const normalizedStartDate = this.normalizeDateInputValue(
            nextDateRange?.dateRangeStart ?? currentAttendee?.dateRangeStart
        );
        let normalizedEndDate = this.normalizeDateInputValue(
            nextDateRange?.dateRangeEnd ?? currentAttendee?.dateRangeEnd
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
        const attendeeIndex = this.attendeeRIDState.attendeesDraft.findIndex((attendee) => {
            return this.getSafePersonID(attendee?.personID) === personID;
        });
        if (attendeeIndex < 0) {
            return null;
        }

        const currentAttendee = this.attendeeRIDState.attendeesDraft[attendeeIndex];
        this.attendeeRIDState.attendeesDraft[attendeeIndex] = {
            ...currentAttendee,
            adminComment: String(nextComments?.adminComment ?? currentAttendee?.adminComment ?? ""),
            memberComment: String(nextComments?.memberComment ?? currentAttendee?.memberComment ?? "")
        };

        return this.attendeeRIDState.attendeesDraft[attendeeIndex];
    }

    removeAttendee(personID) {
        const normalizedPersonID = this.getSafePersonID(personID);
        if (normalizedPersonID <= 0) {
            return false;
        }

        const nextDraftAttendees = this.attendeeRIDState.attendeesDraft.filter((attendee) => {
            return this.getSafePersonID(attendee?.personID) !== normalizedPersonID;
        });

        if (nextDraftAttendees.length === this.attendeeRIDState.attendeesDraft.length) {
            return false;
        }

        this.attendeeRIDState.attendeesDraft = this.cloneAttendees(nextDraftAttendees);
        return true;
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

    buildSessionAttendeePayload() {
        return this.attendeeRIDState.attendeesDraft.map((attendee) => {
            const personID = this.getSafePersonID(attendee?.personID);
            const isRIDCertified = attendee?.ridCertified === true;
            return {
                personID,
                certStatusID: this.serializeCertStatusID(attendee?.certStatusID),
                dateRangeStart: attendee?.dateRangeStart ?? null,
                dateRangeEnd: attendee?.dateRangeEnd ?? null,
                ridCertified: isRIDCertified,
                ridCertifiedAt: isRIDCertified ? this.normalizeRIDDateTimeValue(attendee?.ridCertifiedAt) : null,
                adminComment: String(attendee?.adminComment ?? ""),
                memberComment: String(attendee?.memberComment ?? "")
            };
        });
    }

    mergeAttendeeCollections(incomingAttendees = [], existingAttendees = [], options = {}) {
        const incomingAttendeeMap = new Map(
            incomingAttendees.map((attendee) => [this.getSafePersonID(attendee?.personID), attendee])
        );
        const excludedPersonIDs = options?.excludedPersonIDs instanceof Set
            ? options.excludedPersonIDs
            : new Set();
        const mergedAttendees = [];
        const seenPersonIDs = new Set();

        for (const attendee of Array.isArray(existingAttendees) ? existingAttendees : []) {
            const personID = this.getSafePersonID(attendee?.personID);
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
            const personID = this.getSafePersonID(attendee?.personID);
            if (personID <= 0 || seenPersonIDs.has(personID) || excludedPersonIDs.has(personID)) {
                continue;
            }

            mergedAttendees.push(this.cloneAttendees([attendee])[0]);
            seenPersonIDs.add(personID);
        }

        return mergedAttendees;
    }

    applyDraftStateToAttendee(baseAttendee, draftAttendee) {
        if (!draftAttendee) {
            return this.cloneAttendees([baseAttendee])[0];
        }

        const normalizedCertStatusID = this.normalizeDraftCertStatusID(
            draftAttendee?.certStatusID ?? baseAttendee?.certStatusID
        );

        return {
            ...this.cloneAttendees([baseAttendee])[0],
            dateRangeStart: draftAttendee?.dateRangeStart ?? baseAttendee?.dateRangeStart ?? null,
            dateRangeEnd: draftAttendee?.dateRangeEnd ?? baseAttendee?.dateRangeEnd ?? null,
            dateRangeDisplay: draftAttendee?.dateRangeDisplay ?? baseAttendee?.dateRangeDisplay ?? null,
            certStatusID: normalizedCertStatusID,
            ridCertified: draftAttendee?.ridCertified === true,
            ridCertifiedAt: draftAttendee?.ridCertified === true ? this.normalizeRIDDateTimeValue(draftAttendee?.ridCertifiedAt) : null,
            ridCertifiedByUserID: draftAttendee?.ridCertified === true ? this.getPositiveIntegerOrNull(draftAttendee?.ridCertifiedByUserID) : null,
            adminComment: String(draftAttendee?.adminComment ?? baseAttendee?.adminComment ?? ""),
            memberComment: String(draftAttendee?.memberComment ?? baseAttendee?.memberComment ?? "")
        };
    }

    buildComparableAttendeeState(attendees = []) {
        return (Array.isArray(attendees) ? attendees : [])
            .map((attendee) => {
                const isRIDCertified = attendee?.ridCertified === true;
                return {
                    personID: this.getSafePersonID(attendee?.personID),
                    certStatusID: this.normalizeDraftCertStatusID(attendee?.certStatusID),
                    dateRangeStart: String(attendee?.dateRangeStart ?? ""),
                    dateRangeEnd: String(attendee?.dateRangeEnd ?? ""),
                    ridCertified: isRIDCertified,
                    ridCertifiedAt: isRIDCertified ? this.normalizeRIDDateTimeValue(attendee?.ridCertifiedAt) : null,
                    adminComment: String(attendee?.adminComment ?? ""),
                    memberComment: String(attendee?.memberComment ?? "")
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

        return this.formatRIDDateTimeValue(localDate);
    }

    normalizeRIDDateTimeValue(value) {
        const normalizedValue = String(value ?? "").trim();
        if (normalizedValue === "") {
            return null;
        }

        const parsedTimestamp = Date.parse(normalizedValue.includes(" ")
            ? normalizedValue.replace(" ", "T")
            : normalizedValue);
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
        const normalizedDateValue = String(dateValue ?? "").trim();
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
            (Array.isArray(draftAttendees) ? draftAttendees : [])
                .map((attendee) => this.getSafePersonID(attendee?.personID))
                .filter((personID) => personID > 0)
        );

        return new Set(
            (Array.isArray(savedAttendees) ? savedAttendees : [])
                .map((attendee) => this.getSafePersonID(attendee?.personID))
                .filter((personID) => personID > 0 && !draftPersonIDs.has(personID))
        );
    }
}
