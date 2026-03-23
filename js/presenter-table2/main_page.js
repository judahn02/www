

export class main_page {

    constructor (db, host, lModal, nMember, aCheck) {
        this.db = db ;
        this.host = host ;
        this.linkModal = lModal ;
        this.newMember = nMember ;
        this.attendeeCheck = aCheck ;
    } ;

    async renderTable (tableBody) {
        let presenters = await this.db.get("presenters") ;
        if (tableBody.length === 0 || !Array.isArray(presenters)) {
            return ;
        }

        tableBody.empty() ;

        for (const presenter of presenters) {
            const armemberCell = presenter.armember_id === -1 ?
                `<input type="button" class="link-button button" data-id="${presenter.id}" value="Link Account">` :
                `<input type="button" class="link-button button" data-id="${presenter.id}" value="${presenter.armember_id}">`;

            const row = `
                <td>${presenter.name ?? ""}</td>
                <td>${presenter.email ?? ""}</td>
                <td>${presenter.phone ?? ""}</td>
                <td>${presenter.session_count ?? 0}</td>
                <td>${armemberCell}</td>
                <td><input type="button" class="button" value="↓ Details" disabled></td>
            ` ;

            tableBody.append(`<tr>${row}</tr>`) ;
        }
    }

    async init (params) {
        const tableBody = $(".pdt-main #presenter-table tbody") ;
        if (tableBody.length === 0) {
            return ;
        }

        const refreshTable = async () => {
            await this.renderTable(tableBody) ;
        } ;

        await refreshTable() ;
        await this.linkModal.init(
            tableBody, 
            this.db, 
            this.host);
        await this.newMember.init(
            this.db,
            refreshTable
        ) ;
        await this.attendeeCheck.init(
            this.db,
            this.host,
            refreshTable
        ) ;
        return ;
    }
}
