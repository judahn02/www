export default class JwtApiClient {
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
        ...extraHeaders,
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)}`);
    }

    return responseBody;
  }

  async patch(path, extraHeaders = {}, body = undefined) {
    const url = `${this.baseUrl}/${path.replace(/^\/+/, "")}`;
    const headers = {
      "ASLTA-PDT-JWT": `Bearer ${this.jwt}`,
      Accept: "application/json",
      ...extraHeaders,
    };

    const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
    if (body !== undefined && body !== null && !hasContentType) {
      headers["Content-Type"] = typeof body === "string" ? "text/plain" : "application/json";
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: body === undefined || body === null ? undefined : (typeof body === "string" ? body : JSON.stringify(body)),
    });

    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)}`);
    }

    return responseBody;
  }

  async put(path, extraHeaders = {}, body = undefined) {
    const url = `${this.baseUrl}/${path.replace(/^\/+/, "")}`;
    const headers = {
      "ASLTA-PDT-JWT": `Bearer ${this.jwt}`,
      Accept: "application/json",
      ...extraHeaders,
    };

    const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
    if (body !== undefined && body !== null && !hasContentType) {
      headers["Content-Type"] = typeof body === "string" ? "text/plain" : "application/json";
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: body === undefined || body === null ? undefined : (typeof body === "string" ? body : JSON.stringify(body)),
    });

    const contentType = response.headers.get("content-type") || "";
    if (response.status === 204) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return null;
    }

    const responseBody = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)}`);
    }

    return responseBody;
  }
}
