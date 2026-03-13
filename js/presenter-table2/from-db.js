
export class db_connection {

    static data = {
        "presenters" : [
            {
                "id": 1,
                "name": "Avery Collins",
                "email": "avery.collins@example.com",
                "phone": "(555) 201-4401",
                "session_count": 3,
                "armember_id": -1
            },
            {
                "id": 2,
                "name": "Noah Patel",
                "email": "noah.patel@example.com",
                "phone": "(555) 318-2294",
                "session_count": 5,
                "armember_id": "arm_204"
            },
            {
                "id": 3,
                "name": "Emma Williams",
                "email": "emma.williams@example.com",
                "phone": "(555) 442-1180",
                "session_count": 2,
                "armember_id": -1
            },
            {
                "id": 4,
                "name": "Lucas Nguyen",
                "email": "lucas.nguyen@example.com",
                "phone": "(555) 109-7732",
                "session_count": 4,
                "armember_id": "arm_318"
            },
            {
                "id": 5,
                "name": "Sophia Martinez",
                "email": "sophia.martinez@example.com",
                "phone": "(555) 667-9043",
                "session_count": 1,
                "armember_id": -1
            },
            {
                "id": 6,
                "name": "James Walker",
                "email": "james.walker@example.com",
                "phone": "(555) 580-3316",
                "session_count": 6,
                "armember_id": "arm_122"
            },
            {
                "id": 7,
                "name": "Mia Robinson",
                "email": "mia.robinson@example.com",
                "phone": "(555) 724-8105",
                "session_count": 3,
                "armember_id": -1
            },
            {
                "id": 8,
                "name": "Daniel Scott",
                "email": "daniel.scott@example.com",
                "phone": "(555) 936-2257",
                "session_count": 7,
                "armember_id": "arm_441"
            }
        ]
    } ;


    async get (resource, search) {
        if (typeof resource !== "string" || resource.trim() === "") {
            return undefined ;
        }

        const value = resource.split(".").reduce((currentValue, key) => {
            if (currentValue === null || currentValue === undefined) {
                return undefined ;
            }

            return currentValue[key] ;
        }, db_connection.data) ;

        if (resource !== "presenters" || !Array.isArray(value)) {
            return value ;
        }

        const query = String(search ?? "").trim().toLowerCase() ;
        if (query === "") {
            return value ;
        }

        return value.filter((presenter) => {
            const name = String(presenter?.name ?? "").toLowerCase() ;
            const email = String(presenter?.email ?? "").toLowerCase() ;
            const phone = String(presenter?.phone ?? "").toLowerCase() ;
            const armemberId = String(presenter?.armember_id ?? "").toLowerCase() ;

            return (
                name.includes(query) ||
                email.includes(query) ||
                phone.includes(query) ||
                armemberId.includes(query)
            ) ;
        }) ;
    }

}
