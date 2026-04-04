(() => {
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // js/shims/jquery-global.js
  var jq = window.jQuery || window.$ || window.jquery;
  if (typeof jq !== "function") {
    throw new Error("PDT: jQuery is required before this bundle loads.");
  }

  // js/home-page/jwt-creation-client.js
  var _JwtCreationClient_instances, postJwtCreation_fn, normalizeRequestUrl_fn, getFilename_fn;
  var JwtCreationClient = class {
    constructor(requestUrl, fetchImpl = window.fetch.bind(window)) {
      __privateAdd(this, _JwtCreationClient_instances);
      this.requestUrl = __privateMethod(this, _JwtCreationClient_instances, normalizeRequestUrl_fn).call(this, requestUrl);
      this.fetchImpl = fetchImpl;
    }
    async createJwtKey() {
      return __privateMethod(this, _JwtCreationClient_instances, postJwtCreation_fn).call(this, false);
    }
    async recreateJwtKey() {
      return __privateMethod(this, _JwtCreationClient_instances, postJwtCreation_fn).call(this, true);
    }
  };
  _JwtCreationClient_instances = new WeakSet();
  postJwtCreation_fn = async function(shouldChange) {
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
      filename: __privateMethod(this, _JwtCreationClient_instances, getFilename_fn).call(this, response.headers.get("content-disposition")),
      publicKey: await response.text()
    };
  };
  normalizeRequestUrl_fn = function(requestUrl) {
    if (requestUrl instanceof URL) {
      return requestUrl.toString();
    }
    const normalizedUrl = String(requestUrl || "").trim();
    if (normalizedUrl === "") {
      throw new Error("JWT creation requires a request URL.");
    }
    return normalizedUrl;
  };
  getFilename_fn = function(contentDisposition) {
    if (!contentDisposition) {
      return null;
    }
    const match = contentDisposition.match(/filename="([^"]+)"/i);
    return match ? match[1] : null;
  };

  // js/home-page.js
  var JWT_CREATION_ENDPOINT = "/wp-json/aslta/v1/jwtCreation";
  (function() {
    "use strict";
    const jq2 = window.jQuery || window.$ || window.jquery;
    window.jQuery = window.jQuery || jq2;
    window.$ = window.$ || jq2;
    window.jquery = window.jquery || jq2;
    if (typeof window.$ !== "function") {
      console.error("PDT: jQuery is required for pdt-home-page.js");
      return;
    }
    const $ = window.$;
    $(document).ready(function() {
      initHomePage();
    });
  })();
  function initHomePage() {
    const $ = window.$;
    const $generateKeyPairsButton = $("#pdt-generate-keypairs-btn");
    const $statusNode = $("#pdt-jwt-key-status");
    if ($generateKeyPairsButton.length === 0) {
      console.error("PDT: #pdt-generate-keypairs-btn was not found.");
      return;
    }
    if ($statusNode.length === 0) {
      console.error("PDT: #pdt-jwt-key-status was not found.");
      return;
    }
    const client = new JwtCreationClient(getJwtCreationUrl());
    const idleLabel = $generateKeyPairsButton.text().trim() || "Generate KeyPairs";
    $generateKeyPairsButton.data("idleLabel", idleLabel);
    $generateKeyPairsButton.on("click", async function() {
      setButtonState($generateKeyPairsButton, true, "Generating...");
      setStatus($statusNode, "Generating a new JWT key pair...", "info");
      try {
        const result = await requestKeyPair(client);
        downloadPublicKey(result);
        const filenameSuffix = result.filename ? ` as ${result.filename}` : "";
        setStatus($statusNode, `Public key downloaded${filenameSuffix}.`, "success");
      } catch (error) {
        if (error == null ? void 0 : error.isCanceled) {
          setStatus($statusNode, "Key pair regeneration canceled.", "info");
          return;
        }
        console.error("PDT: JWT key generation failed.", error);
        setStatus($statusNode, (error == null ? void 0 : error.message) || "Unable to generate a JWT key pair.", "error");
      } finally {
        setButtonState($generateKeyPairsButton, false, idleLabel);
      }
    });
  }
  function getJwtBaseUrl() {
    var _a;
    const configuredBaseUrl = (_a = window.PDTHomePageConfig) == null ? void 0 : _a.baseUrl;
    if (typeof configuredBaseUrl === "string" && configuredBaseUrl.trim() !== "") {
      return configuredBaseUrl.trim();
    }
    return window.location.origin;
  }
  function getJwtCreationUrl() {
    return new URL(JWT_CREATION_ENDPOINT, getJwtBaseUrl());
  }
  async function requestKeyPair(client) {
    try {
      return await client.createJwtKey();
    } catch (error) {
      if (!shouldOfferRecreate(error)) {
        throw error;
      }
      const shouldReplaceExistingKeyPair = window.confirm(
        "A key pair may already exist. Do you want to replace it with a newly generated key pair?"
      );
      if (!shouldReplaceExistingKeyPair) {
        const cancelError = new Error("Key pair regeneration was canceled.");
        cancelError.isCanceled = true;
        throw cancelError;
      }
      return client.recreateJwtKey();
    }
  }
  function shouldOfferRecreate(error) {
    if (!error) {
      return false;
    }
    if (error.status === 409) {
      return true;
    }
    const errorText = `${error.message || ""} ${error.detail || ""}`.toLowerCase();
    return errorText.includes("already") || errorText.includes("exist");
  }
  function downloadPublicKey({ filename, publicKey }) {
    const $ = window.$;
    const blob = new Blob([publicKey], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const $downloadLink = $("<a>");
    $downloadLink.attr("href", blobUrl);
    $downloadLink.attr("download", filename || "jwt-public-key.pem");
    $("body").append($downloadLink);
    $downloadLink[0].click();
    $downloadLink.remove();
    URL.revokeObjectURL(blobUrl);
  }
  function setButtonState($button, isBusy, label) {
    $button.prop("disabled", isBusy);
    $button.attr("aria-busy", String(isBusy));
    $button.text(label);
  }
  function setStatus($node, message, tone) {
    $node.prop("hidden", !message);
    $node.text(message);
    $node.attr("data-status", tone);
  }
})();
//# sourceMappingURL=home-page.js.map
