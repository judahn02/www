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
    const body = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
    }

    return body;
  }
}
