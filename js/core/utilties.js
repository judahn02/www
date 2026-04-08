export default class util {
    constructor(parameters) {
        
    }

    
    /**
     * Normalizing to the standard date format or returns null if the value cannot be parsed.
     * @param {string} dateValue - A date string in YYYY-MM-DD or M/D/YYYY format.
     * @returns {string|null} A date string in YYYY-MM-DD format, or null if invalid.
     */
    static enfDate (dateValue) {
        // console.log("This is v1");
        // console.warn("This should not be called because the backend should take care of this.");

        const normalizedDateValue = String(dateValue ?? "").trim();
        if (normalizedDateValue === "") {
            return null;
        }

        

        // if its already normal,leave it alone
        if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDateValue)) {
            return normalizedDateValue;
        }

        

        const displayDateMatch = normalizedDateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!displayDateMatch) {
            console.log(normalizedDateValue);
            return null;
        }
        console.warn("enfDate: more than trim was needed.");

        const [, month, day, year] = displayDateMatch;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    }
}