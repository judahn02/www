

export class data {

    static data = {
        "attendees" : [
            {
                "id" : 1,
                "first-n" : "Judah",
                "last-n" : "Nava",
                "email" : "example@example.com",
                "WP-id" : 404, // or -1 if there is not wp id attached.
                "t_hours" : 7.5,
                "t_ceus" : 0.15,
                "number": "123-123-1234"
            },
            {
                "id" : 2,
                "first-n" : "Avery",
                "last-n" : "Collins",
                "email" : "avery.collins@example.com",
                "WP-id" : -1,
                "t_hours" : 9.0,
                "t_ceus" : 0.18,
                "number": "123-123-1234"
            },
            {
                "id" : 3,
                "first-n" : "Mason",
                "last-n" : "Reed",
                "email" : "mason.reed@example.com",
                "WP-id" : -1,
                "t_hours" : 6.0,
                "t_ceus" : 0.12,
                "number": "123-123-1234"
            },
            {
                "id" : 4,
                "first-n" : "Olivia",
                "last-n" : "Turner",
                "email" : "olivia.turner@example.com",
                "WP-id" : -1,
                "t_hours" : 8.5,
                "t_ceus" : 0.17,
                "number": "123-123-1234"
            },
            {
                "id" : 5,
                "first-n" : "Sophia",
                "last-n" : "Bennett",
                "email" : "sophia.bennett@example.com",
                "WP-id" : -1,
                "t_hours" : 10.0,
                "t_ceus" : 0.20,
                "number": "123-123-1234"
            }
        ]
    }

    static post(path, data) {
        // not the same as put/patch
        if (typeof path !== "string" || path.trim() === "") {
            return undefined;
        }

        const target = this.get(path);
        if (!Array.isArray(target)) {
            return undefined;
        }

        if (path === "attendees") {
            const payload = (data && typeof data === "object") ? data : {};
            const nextId = target.reduce((maxId, row) => {
                const parsedId = Number(row?.id);
                if (!Number.isFinite(parsedId)) {
                    return maxId;
                }
                return Math.max(maxId, parsedId);
            }, 0) + 1;

            const createdRow = {
                "id": nextId,
                "first-n": String(payload["first-n"] ?? payload.first ?? "").trim(),
                "last-n": String(payload["last-n"] ?? payload.last ?? "").trim(),
                "email": String(payload.email ?? "").trim(),
                "WP-id": -1,
                "t_hours": 0,
                "t_ceus": 0,
                "number": String(payload.number ?? payload.ph_number ?? payload.phone ?? "").trim()
            };

            target.push(createdRow);
            return createdRow;
        }

        target.push(data);
        return data;
    }
    
    // search is optional, use like get(a) or get(a, b)
    static get(path, search) {
        if (typeof path !== "string" || path.trim() === "") {
            return undefined;
        }

        const value = path.split(".").reduce((currentValue, key) => {
            if (currentValue === null || currentValue === undefined) {
                return undefined;
            }

            return currentValue[key];
        }, this.data);

        if (path !== "attendees" || !Array.isArray(value)) {
            return value;
        }

        const query = String(search ?? "").trim().toLowerCase();
        if (query === "") {
            return value;
        }

        return value.filter((attendee) => {
            const firstName = String(attendee?.["first-n"] ?? "").toLowerCase();
            const lastName = String(attendee?.["last-n"] ?? "").toLowerCase();
            return firstName.includes(query) || lastName.includes(query);
        });
    }
}
