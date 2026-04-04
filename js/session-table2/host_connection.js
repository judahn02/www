import { session_state } from "./state.js";
export class host_connection {
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

    resolveUserName() {
        const configuredUserName = this.normalizeUserName(this.config?.userName ?? this.config?.displayName);
        if (configuredUserName !== null) {
            return configuredUserName;
        }

        const wpDataUserName = this.getWordPressUserName();
        if (wpDataUserName !== null) {
            return wpDataUserName;
        }

        const globalCandidates = [
            globalThis?.PDTSessionTable2UserName,
            globalThis?.PDTSessionTable2?.userName,
            globalThis?.PDTSessionTable2?.displayName,
            globalThis?.PDTAttendeeModalData?.userName,
            globalThis?.PDTAttendeeModalData?.displayName
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
        try {
            const currentUser = globalThis?.wp?.data?.select?.("core")?.getCurrentUser?.();
            return this.normalizeUserID(currentUser?.id);
        } catch (_error) {
            return null;
        }
    }

    getWordPressUserName() {
        try {
            const currentUser = globalThis?.wp?.data?.select?.("core")?.getCurrentUser?.();
            return this.normalizeUserName(
                currentUser?.name
                ?? currentUser?.display_name
                ?? currentUser?.nickname
                ?? currentUser?.username
            );
        } catch (_error) {
            return null;
        }
    }

    resolveCommentIconURL() {
        const configuredCommentIconURL = this.normalizeURL(
            this.config?.commentIconURL
            ?? this.config?.commentURL
            ?? this.config?.commentIcon
        );
        if (configuredCommentIconURL !== null) {
            return configuredCommentIconURL;
        }

        const globalCandidates = [
            globalThis?.PDTSessionTable2CommentIconURL,
            globalThis?.PDTSessionTable2?.commentIconURL,
            globalThis?.PDTSessionTable2?.commentURL,
            globalThis?.PDTAttendeeModalData?.commentIconURL,
            globalThis?.PDTAttendeeModalData?.commentURL
        ];

        for (const candidate of globalCandidates) {
            const normalizedCandidate = this.normalizeURL(candidate);
            if (normalizedCandidate !== null) {
                return normalizedCandidate;
            }
        }

        return "../assets/speech-bubble-1130.svg";
    }

    normalizeUserID(value) {
        const numericUserID = Number(value);
        if (!Number.isInteger(numericUserID) || numericUserID <= 0) {
            return null;
        }

        return numericUserID;
    }

    normalizeUserName(value) {
        const normalizedUserName = String(value ?? "").trim();
        if (normalizedUserName === "") {
            return null;
        }

        return normalizedUserName;
    }

    normalizeURL(value) {
        const normalizedURL = String(value ?? "").trim();
        if (normalizedURL === "") {
            return null;
        }

        return normalizedURL;
    }
}
