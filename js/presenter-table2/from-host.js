

export class host_connection {

    static data = {
        "presenters": [
            { id: "arm_110", name: "Isabella Davis", email: "isabella.davis@peakpoint.io" },
            { id: "arm_112", name: "Benjamin Lewis", email: "ben.lewis@emeraldtech.dev" },
            { id: "arm_113", name: "Charlotte Young", email: "charlotte.young@foundryhq.com" },
            { id: "arm_114", name: "Henry Clark", email: "henry.clark@lighthouse.ai" },
            { id: "arm_115", name: "Amelia Hall", email: "amelia.hall@oakridge.net" },
            { id: "arm_122", name: "James Walker", email: "james.walker@solaris.cloud" },
            { id: "arm_204", name: "Noah Patel", email: "noah.patel@atlasgroup.com" },
            { id: "arm_318", name: "Lucas Nguyen", email: "lucas.nguyen@cedarworks.com" },
            { id: "arm_404", name: "Judah J Nava", email: "judahnava02@gmail.com" },
            { id: "arm_441", name: "Daniel Scott", email: "daniel.scott@vectorworks.org" }
        ]
    };

    constructor() {
        this.collections = new Map(Object.entries(host_connection.data));
    }

    async get(resource, query = "") {
        // Simulate network latency for a realistic async workflow.
        await new Promise((resolve) => setTimeout(resolve, 250));

        const source = this.collections.get(resource) || [];
        const normalizedQuery = String(query ?? "").trim().toLowerCase();

        if (!normalizedQuery) return [];

        const matches = source.filter((item) => {
            const name = item.name.toLowerCase();
            const email = item.email.toLowerCase();
            const id = String(item.id).toLowerCase();
            return (
                name.includes(normalizedQuery) ||
                email.includes(normalizedQuery) ||
                id.includes(normalizedQuery)
            );
        });

        // In a real implementation, this is where an authenticated request would happen.
        // Example flow:
        // 1) Read JWT from your auth store
        // 2) Call backend endpoint with Authorization header
        // 3) Return parsed JSON results in the same shape

        return matches.slice(0, 12);
    }
}
