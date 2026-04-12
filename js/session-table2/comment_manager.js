export class comment_manager {
    constructor(db = null) {
        this.db = db;
        this.activeCommentContext = null;
    }

    init(commentFields, tableBody) {
        this.bindModalEvents(commentFields);
        this.bindOpenTriggers(commentFields, tableBody);
    }

    bindModalEvents(commentFields) {
        commentFields.close.off("click.pdtComment").on("click.pdtComment", () => {
            this.close(commentFields);
        });

        commentFields.wrapper.off("click.pdtComment").on("click.pdtComment", (event) => {
            if (event.target !== commentFields.wrapper[0]) {
                return;
            }

            this.close(commentFields);
        });

        commentFields.submit.off("click.pdtComment").on("click.pdtComment", async () => {
            await this.saveComments(commentFields);
        });
    }

    bindOpenTriggers(commentFields, tableBody) {
        tableBody.off("click.pdtComment", ".pdt-person-card__icon").on("click.pdtComment", ".pdt-person-card__icon", async (event) => {
            const icon = $(event.currentTarget);
            if (icon.attr("data-session-locked") === "1") {
                return;
            }

            const personCard = icon.closest(".pdt-person-card");
            const personName = String(personCard.find("p").first().text() ?? "").trim();
            const sessionID = Number(icon.attr("data-session-id"));
            const personID = Number(icon.attr("data-person-id"));

            if (!Number.isFinite(sessionID) || !Number.isFinite(personID)) {
                return;
            }

            await this.open(commentFields, {
                sessionID,
                personID,
                personName
            });
        });
    }

    async open(commentFields, context) {
        this.activeCommentContext = context;
        commentFields.titleName.text(context.personName);
        await this.loadComments(commentFields, context);
        commentFields.wrapper.prop("hidden", false);
        commentFields.admin.trigger("focus");
    }

    async loadComments(commentFields, context) {
        const commentData = typeof context?.loadComments === "function"
            ? await context.loadComments()
            : await this.db.get("comments", {
                sessionID: context.sessionID,
                personID: context.personID
            });

        commentFields.admin.val(String(commentData?.adminComment ?? ""));
        commentFields.member.val(String(commentData?.memberComment ?? ""));
    }

    async saveComments(commentFields) {
        if (this.activeCommentContext === null) {
            return;
        }

        const onSave = this.activeCommentContext?.onSave;
        const nextCommentData = {
            adminComment: String(commentFields.admin.val() ?? ""),
            memberComment: String(commentFields.member.val() ?? "")
        };

        if (typeof this.activeCommentContext?.saveComments === "function") {
            await this.activeCommentContext.saveComments(nextCommentData);
        } else {
            await this.db.set("comments", {
                sessionID: this.activeCommentContext.sessionID,
                personID: this.activeCommentContext.personID,
                adminComment: nextCommentData.adminComment,
                memberComment: nextCommentData.memberComment
            });
        }

        this.close(commentFields);

        if (typeof onSave === "function") {
            await onSave(nextCommentData);
        }
    }

    close(commentFields) {
        commentFields.wrapper.prop("hidden", true);
        this.reset(commentFields);
    }

    reset(commentFields) {
        commentFields.titleName.text("");
        commentFields.admin.val("");
        commentFields.member.val("");
        this.activeCommentContext = null;
    }
}
