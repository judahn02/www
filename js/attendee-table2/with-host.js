

export class wpConnection {

    static data = {
        "wp-accounts" : [
            ["Judah Nava", "judah.nava@example.com", 1],
            ["John Doe", "jdoe@example.com", 3],
            ["Mya Florr", "mflorr@example.com", 4],
            ["Lena Brooks", "lbrooks@example.com", 5],
            ["Caleb Norris", "cnorris@example.com", 6],
            ["Priya Shah", "pshah@example.com", 7],
            ["Evan Kim", "ekim@example.com", 8],
            ["Nora Wells", "nwells@example.com", 9],
            ["Diego Ramos", "dramos@example.com", 10],
            ["Tessa Lane", "tlane@example.com", 11],
            ["Owen Price", "oprice@example.com", 12],
            ["Amina Yusuf", "ayusuf@example.com", 13],
            ["Grant Heller", "gheller@example.com", 14],

        ]
    }

    static get(dataTable, search=null) {
        // this methods simulates the database connection,
        // will be used to design connection and replace it. 
        if (dataTable === "wp-accounts" && search !== null) {
            const rawQuery = String(search).trim();
            if (/^\d+$/.test(rawQuery)) {
                const match = this.data["wp-accounts"]
                    .find(([, , id]) => String(id) === rawQuery);
                return match ? [...match] : null;
            }

            const query = rawQuery.toLowerCase();
            return this.data["wp-accounts"]
                .filter(([name, email]) =>
                    name.toLowerCase().includes(query) || email.toLowerCase().includes(query)
                )
                .map((entry) => [...entry]);
        }
    }
}
