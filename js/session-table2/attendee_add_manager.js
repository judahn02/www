export class attendee_add_manager {
    constructor(db = null) {
        this.db = db;
        this.attendeeSearchSelect = null;
        this.attendeeDirectory = [];
    }

    async init() {
        // await this.load();
    }

    // async load() {
    //     this.setDirectory(await this.db.get("attendeesDir"));
    // }

    setDirectory(attendeeDirectory = []) {
        this.attendeeDirectory = Array.isArray(attendeeDirectory) ? attendeeDirectory : [];
    }

    destroy() {
        if (!this.attendeeSearchSelect) {
            return;
        }

        this.attendeeSearchSelect.destroy();
        this.attendeeSearchSelect = null;
    }

    syncSearch(addAttendeeField, options = {}) {
        this.destroy();

        if (!addAttendeeField || addAttendeeField.length === 0 || typeof window.TomSelect === "undefined") {
            return;
        }

        const attendeeOptions = this.getAttendeeOptions(options?.excludedPersonIDs ?? []);
        const placeholder = attendeeOptions.length === 0
            ? "All attendees are already added"
            : "Add attendee: search attendees by name or email";

        this.attendeeSearchSelect = new TomSelect(addAttendeeField[0], {
            valueField: "id",
            labelField: "label",
            searchField: ["name", "email"],
            options: attendeeOptions,
            maxItems: 1,
            create: false,
            persist: false,
            placeholder,
            sortField: [
                { field: "name", direction: "asc" },
                { field: "email", direction: "asc" }
            ],
            render: {
                option: (optionData, escape) => {
                    return `
                        <div class="pdt-add-attendee-option">
                            <span class="pdt-add-attendee-option__name">${escape(optionData.name)}</span>
                            <span class="pdt-add-attendee-option__email">${escape(optionData.email)}</span>
                        </div>
                    `;
                },
                item: (optionData, escape) => {
                    return `<div>${escape(optionData.label)}</div>`;
                },
                no_results: () => {
                    return `<div class="no-results">No matching attendees found.</div>`;
                }
            },
            onItemAdd: (value) => {
                const selectedAttendee = attendeeOptions.find((attendeeOption) => {
                    return attendeeOption.id === Number(value);
                });
                if (!selectedAttendee) {
                    alert("That attendee could not be added. Please refresh the page and try again.");
                    this.attendeeSearchSelect?.clear();
                    return;
                }

                this.attendeeSearchSelect?.clear();
                const onAttendeeSelected = options?.onAttendeeSelected;
                if (typeof onAttendeeSelected === "function") {
                    void Promise.resolve(onAttendeeSelected(selectedAttendee));
                }
            }
        });

        if (attendeeOptions.length === 0) {
            this.attendeeSearchSelect.disable();
        }
    }

    getAttendeeOptions(excludedPersonIDs = []) {
        const excludedPersonIDSet = new Set(
            (Array.isArray(excludedPersonIDs) ? excludedPersonIDs : [])
                .map((personID) => Number(personID))
                .filter((personID) => Number.isFinite(personID))
        );

        return this.attendeeDirectory
            .filter((attendeeEntry) => {
                return !excludedPersonIDSet.has(Number(attendeeEntry?.personID));
            })
            .map((attendeeEntry) => ({
                id: Number(attendeeEntry?.personID),
                personID: Number(attendeeEntry?.personID),
                name: String(attendeeEntry?.name ?? "").trim(),
                email: String(attendeeEntry?.email ?? "").trim(),
                label: String(attendeeEntry?.label ?? `${String(attendeeEntry?.name ?? "").trim()} (${String(attendeeEntry?.email ?? "").trim()})`).trim()
            }))
            .filter((attendeeOption) => {
                return Number.isFinite(attendeeOption.id)
                    && attendeeOption.name !== ""
                    && attendeeOption.email !== ""
                    && attendeeOption.label !== "";
            });
    }
}
