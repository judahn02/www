import { session_state } from "./state.js";
export class host_connection {
    constructor(config = {}) {
        this.config = config;
    }

    async get(resource) {
        if (resource === "userID") {
            return this.resolveUserID();
        }

        return null;
    }

    resolveUserID() {
        const configuredUserID = this.normalizeUserID(this.config?.userID);
        if (configuredUserID !== null) {
            return configuredUserID;
        }

        const wpDataUserID = this.getWordPressUserID();
        if (wpDataUserID !== null) {
            return wpDataUserID;
        }

        const globalCandidates = [
            globalThis?.PDTSessionTable2UserID,
            globalThis?.PDTSessionTable2?.userID,
            globalThis?.PDTAttendeeModalData?.userID
        ];

        for (const candidate of globalCandidates) {
            const normalizedCandidate = this.normalizeUserID(candidate);
            if (normalizedCandidate !== null) {
                return normalizedCandidate;
            }
        }

        // Temporary fallback while this host wrapper stands in for WordPress.
        return 1;
    }

    getWordPressUserID() {
        try {
            const currentUser = globalThis?.wp?.data?.select?.("core")?.getCurrentUser?.();
            return this.normalizeUserID(currentUser?.id);
        } catch (_error) {
            return null;
        }
    }

    normalizeUserID(value) {
        const numericUserID = Number(value);
        if (!Number.isInteger(numericUserID) || numericUserID <= 0) {
            return null;
        }

        return numericUserID;
    }
}
