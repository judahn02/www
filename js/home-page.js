import { JwtCreationClient } from "./home-page/jwt-creation-client.js";

const JWT_CREATION_ENDPOINT = "/wp-json/aslta/v1/jwtCreation";

(function () {
    "use strict";

    const jq = window.jQuery || window.$ || window.jquery;
    window.jQuery = window.jQuery || jq;
    window.$ = window.$ || jq;
    window.jquery = window.jquery || jq;

    if (typeof window.$ !== "function") {
        console.error("PDT: jQuery is required for pdt-home-page.js");
        return;
    }

    const $ = window.$;

    $(document).ready(function () {
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

    $generateKeyPairsButton.on("click", async function () {
        setButtonState($generateKeyPairsButton, true, "Generating...");
        setStatus($statusNode, "Generating a new JWT key pair...", "info");

        try {
            const result = await requestKeyPair(client);
            downloadPublicKey(result);

            const filenameSuffix = result.filename ? ` as ${result.filename}` : "";
            setStatus($statusNode, `Public key downloaded${filenameSuffix}.`, "success");
        } catch (error) {
            if (error?.isCanceled) {
                setStatus($statusNode, "Key pair regeneration canceled.", "info");
                return;
            }

            console.error("PDT: JWT key generation failed.", error);
            setStatus($statusNode, error?.message || "Unable to generate a JWT key pair.", "error");
        } finally {
            setButtonState($generateKeyPairsButton, false, idleLabel);
        }
    });
}

function getJwtBaseUrl() {
    const configuredBaseUrl = window.PDTHomePageConfig?.baseUrl;

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
