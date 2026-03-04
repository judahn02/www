import { data } from "./from-endpoint.js";
// if I set let variables here, can the functions use them?

export function event_hookups() {

    // set variables here

    const editPersonBtn = document.getElementById("pdt-edit-person-btn");
    if (!editPersonBtn) { console.error("can't connect pdt-edit-person-btn"); }
    else {
        editPersonBtn.addEventListener("click", () => {
            editPersonBtn_f(editPersonBtn);
        });
    }

    const adminServiceBtn = document.getElementById("pdt-admin-service-btn");
    if (!adminServiceBtn) { console.error("can't connect pdt-admin-service-btn"); }
    else {
        adminServiceBtn.addEventListener("click", () => {
            adminServiceBtn_f(adminServiceBtn)
        })
    }

    const yearsSpan = document.getElementById("pdt-years") ;
    yearsSpan.textContent = 1 ; // first value.

    const totalHoursSpan = document.getElementById("pdt-total-hours") ;
    totalHoursSpan.textContent = data.get("summary.total-hours") ;

    const recentSessionSpan = document.getElementById("pdt-recent_session") ;
    recentSessionSpan.textContent = data.get("summary.recent_session") ;

    const recentSessionDateSpan = document.getElementById("pdt-recent_session_date") ;
    recentSessionDateSpan.textContent = data.get("summary.recent_session_date") ;

    const ceuTotalSpan = document.getElementById("pdt-ceu-total") ;
    ceuTotalSpan.textContent = data.get("summary.train-n-conf")[0] + data.get("summary.admin-service")[0] ;

    const ceuTrainConfSpan = document.getElementById("pdt-ceu-trainConf") ;
    ceuTrainConfSpan.textContent = data.get("summary.train-n-conf")[0] ;

    const ceuAdminServSpan = document.getElementById("pdt-ceu-adminServ") ;
    ceuAdminServSpan.textContent = data.get("summary.admin-service")[0] ;

    const slider = document.getElementById("pdt-progress-years");
    slider.value = 1; // current value on load
    slider.addEventListener("input", (e) => {
        
        onYearsUpdated(ceuTotalSpan, ceuTrainConfSpan, ceuAdminServSpan, Number(e.target.value));
        yearsSpan.textContent = Number(e.target.value) ;
    });

}

function editPersonBtn_f(button) {
    console.log("pdt-edit-person-btn");
}

function adminServiceBtn_f(button) {
    console.log("pdt-admin-service-btn");
}

function onYearsUpdated(ceuTotal, ceuTrainConf, ceuAdminServ, value) {
    
    ceuTotal.textContent = data.get("summary.train-n-conf")[value-1] + data.get("summary.admin-service")[value-1] ;
    ceuTrainConf.textContent = data.get("summary.train-n-conf")[value-1] ;
    ceuAdminServ.textContent = data.get("summary.admin-service")[value-1] ;

}