const jq = window.jQuery || window.$ || window.jquery;

if (typeof jq !== "function") {
    throw new Error("PDT: jQuery is required before this bundle loads.");
}

export { jq as $, jq as jQuery };
