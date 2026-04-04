export class JwtCreationClient {
    constructor(requestUrl, fetchImpl = window.fetch.bind(window)) {
        this.requestUrl = this.#normalizeRequestUrl(requestUrl);
        this.fetchImpl = fetchImpl;
    }

    async createJwtKey() {
        return this.#postJwtCreation(false);
    }

    async recreateJwtKey() {
        return this.#postJwtCreation(true);
    }

    async #postJwtCreation(shouldChange) {
        const url = new URL(this.requestUrl);

        if (shouldChange) {
            url.searchParams.set("change", "change");
        }

        const response = await this.fetchImpl(url, {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            const detail = await response.text().catch(() => "");
            const error = new Error(`JWT creation request failed with status ${response.status}.`);
            error.status = response.status;
            error.detail = detail;
            throw error;
        }

        return {
            filename: this.#getFilename(response.headers.get("content-disposition")),
            publicKey: await response.text()
        };
    }

    #normalizeRequestUrl(requestUrl) {
        if (requestUrl instanceof URL) {
            return requestUrl.toString();
        }

        const normalizedUrl = String(requestUrl || "").trim();
        if (normalizedUrl === "") {
            throw new Error("JWT creation requires a request URL.");
        }

        return normalizedUrl;
    }

    #getFilename(contentDisposition) {
        if (!contentDisposition) {
            return null;
        }

        const match = contentDisposition.match(/filename="([^"]+)"/i);
        return match ? match[1] : null;
    }
}
