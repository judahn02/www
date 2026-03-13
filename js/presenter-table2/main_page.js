

export class main_page {

    constructor (db, host, lModal, nMember, aCheck) {
        this.db = db ;
        this.host = host ;
        this.linkModal = lModal ;
        this.newMember = nMember ;
        this.attendeeCheck = aCheck ;
    } ;

    async init (params) {
        // pull in data
        const presenters = await this.db.get("presenters") ;

        // load up table
        const tableBody = $("#presenter-table tbody") ;
        if (tableBody.length === 0 || !Array.isArray(presenters)) {
            return ;
        }

        tableBody.empty() ;

        for (const presenter of presenters) {
            const armemberCell = presenter.armember_id === -1 ?
                `<input type="button" value="Link Account">` :
                presenter.armember_id ;

            const row = `
                <td>${presenter.name ?? ""}</td>
                <td>${presenter.email ?? ""}</td>
                <td>${presenter.phone ?? ""}</td>
                <td>${presenter.session_count ?? 0}</td>
                <td>${armemberCell}</td>
                <td><input type="button" value="↓ Details"></td>
            ` ;

            tableBody.append(`<tr>${row}</tr>`) ;
        }


        
        return ;
    }
}
