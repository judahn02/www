

/*
Notes:
- There is a lot of checking going on related to urls and endpoints, it would be nice if it was its own datatype that was just compatiable.


*/

/**
 * @param {*} value 
 * @returns {string|null}
 * takes unnknown value and either returns it's string value trimed or null (could not be converted to string)
*/
function normalizeConfiguredValue(value) {
    const normalizedValue = String(value ?? "").trim();
    return normalizedValue === "" ? null : normalizedValue;
}

function normalizeFlexibleDateValue() {
    
}