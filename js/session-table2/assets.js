export function getSpeechBubbleIconURL() {
    const configuredURL = String(globalThis?.PDTSessionTableAssets?.speechBubbleIconUrl ?? "").trim();
    if (configuredURL !== "") {
        return configuredURL;
    }

    return "../assets/speech-bubble-1130.svg";
}
