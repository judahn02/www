

export class new_member {

    clearForm () {
        $(".pdt-add-new-member #f_name").val("") ;
        $(".pdt-add-new-member #l_name").val("") ;
        $(".pdt-add-new-member #email").val("") ;
        $(".pdt-add-new-member #p_number").val("") ;
    }

    async init (db, refreshTable) {
        this.db = db ;
        this.refreshTable = refreshTable ;

        const nMemberShadow = $("#pdt-shadow-new-member") ;
        const nMemberModal = $("#pdt-n-member-modal") ;

        const closeModal = () => {
            nMemberShadow.prop("hidden", true) ;
            nMemberModal.prop("hidden", true) ;
            this.clearForm() ;
        } ;

        $(".pdt-main #add-member").off("click.pdtNewMember").on("click.pdtNewMember", () => {
            nMemberShadow.prop("hidden", false) ;
            nMemberModal.prop("hidden", false) ;
        }) ;

        $(".pdt-add-new-member #n-member-cancel").off("click.pdtNewMember").on("click.pdtNewMember", () => {
            closeModal() ;
        }) ;

        nMemberShadow.off("click.pdtNewMember").on("click.pdtNewMember", (event) => {
            const clickedInsideModal = nMemberModal.is(event.target) || nMemberModal.has(event.target).length > 0 ;
            if (clickedInsideModal) {
                return ;
            }

            closeModal() ;
        }) ;

        $(".pdt-add-new-member #n-member-submit").off("click.pdtNewMember").on("click.pdtNewMember", async () => {
            const firstName = $(".pdt-add-new-member #f_name").val()?.toString().trim() ?? "" ;
            const lastNameInput = $(".pdt-add-new-member #l_name") ;
            const emailInput = $(".pdt-add-new-member #email") ;
            const phone = $(".pdt-add-new-member #p_number").val()?.toString().trim() ?? "" ;
            const lastName = lastNameInput.val()?.toString().trim() ?? "" ;
            const email = emailInput.val()?.toString().trim() ?? "" ;

            if (!lastName || !email) {
                alert("Last name and email are required.") ;
                (!lastName ? lastNameInput : emailInput).trigger("focus") ;
                return ;
            }

            const presenterName = [firstName, lastName].filter(Boolean).join(" ") ;

            await this.db.set("presenters", {
                name: presenterName,
                email,
                phone,
                session_count: 0,
                armember_id: -1
            }) ;

            if (typeof this.refreshTable === "function") {
                await this.refreshTable() ;
            }

            closeModal() ;
        }) ;
    }
}
