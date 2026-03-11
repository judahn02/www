import { data } from "./from-endpoint.js";

export function event_hookups() {

    {
        // load up the table. 

        const datas = data.get("attendees");
        if (!Array.isArray(datas)) return;

        if (datas.length !== 0) load_Attendees_Table(datas);

        // link all buttons to this function: link_account_btn
        document.querySelectorAll(".link_account_btn").forEach((button) => {
            button.addEventListener("click", () => link_account_btn($(button)));
        });

    }
    const new_member_modal = $('.pdt-add-new-member');
    const new_member_modal_wrapper = $('#pdt-modal-wrapper-for-add-new-member');
    // new_member_modal_wrapper.prop('hidden', true);

    const registered_modal = $('.pdt-presenter-check')
    const registered_modal_wrapper = $("#pdt-modal-wrapper-for-registered-presenter")
    {
        // Add Member modal
        $('#pdt-add-member').on('click', function () {
            new_member_modal.prop('hidden', false);
            new_member_modal_wrapper.prop('hidden', false);
        });

        new_member_modal_wrapper.on("click", function (event) {
            if (event.target !== this) { return; }
            new_member_modal.prop('hidden', true);
            new_member_modal_wrapper.prop('hidden', true);
        });

        // Check if registed Presenter
        $("#pdt-is-presenter-btn").on("click", function () {
            // load up the next modal
            registered_modal.prop('hidden', false);
            registered_modal_wrapper.prop('hidden', false);


            // deload the current modal
            new_member_modal.prop('hidden', true);
            new_member_modal_wrapper.prop('hidden', true);

        });

        // Cancel button
        $('#pdt-new-member-cancel').click(function (e) {
            e.preventDefault();
            new_member_modal.prop('hidden', true);
            new_member_modal_wrapper.prop('hidden', true);
        });

        // Mark as Attendee
        $('#pdt-new-member-submit').click(function () {

            // collect inputs
            let f_name = String($('#pdt-f_name').val() ?? '').trim();
            let l_name = String($('#pdt-l_name').val() ?? '').trim();
            let email = String($('#pdt-email').val() ?? '').trim();
            let ph_number = String($('#pdt-ph_number').val() ?? '').trim();

            // validate inputs
            const errors = [];
            const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phone_pattern = /^\+?[0-9()\-\s.]{7,20}$/;

            if (l_name === '') {
                errors.push('Last name is required.');
            }

            if (email === '' || !email_pattern.test(email)) {
                errors.push('A valid email is required.');
            }

            if (ph_number !== '') {
                const digit_count = ph_number.replace(/\D/g, '').length;
                if (!phone_pattern.test(ph_number) || digit_count < 7) {
                    errors.push('Phone number is invalid.');
                }
            }

            if (errors.length > 0) {
                alert(`Form data is incorrect:\n- ${errors.join('\n- ')}`);
                return;
            }

            // save attendee and reload table
            data.post("attendees", { "first-n": f_name, "last-n": l_name, "email": email, "number": ph_number });
            load_Attendees_Table(data.get("attendees"));

            // clear inputs
            $('#pdt-f_name').val('');
            $('#pdt-l_name').val('');
            $('#pdt-email').val('');
            $('#pdt-ph_number').val('');

            // close modal
            new_member_modal.prop('hidden', true);
            new_member_modal_wrapper.prop('hidden', true);

        });
    }
    {
        // check registered modal
        // Cancel button - goes back to new attendee modal.
        $('#pdt-registered-cancel').click(function () {
            // load up the prior modal
            new_member_modal.prop('hidden', false);
            new_member_modal_wrapper.prop('hidden', false);


            // deload the current modal
            registered_modal.prop('hidden', true);
            registered_modal_wrapper.prop('hidden', true);
        });

        // The dropdown of presenters name.
        let presenterSearchCooldown;
        let selectedPresenterId = -1;

        $('#pdt-p_name').keyup(function (e) {
            let value = $(this).val();
            let dropdown = $("#pdt-presenter-options");
            selectedPresenterId = -1;
            dropdown.empty().prop("hidden", true);

            // Debounce works by canceling the previous scheduled callback on each key press.
            // `clearTimeout` stops the earlier pending run, and `setTimeout` schedules a new one 300ms later.
            // The callback only runs after typing pauses long enough, so logic is not triggered for every key.
            clearTimeout(presenterSearchCooldown);
            presenterSearchCooldown = setTimeout(function () {
                let results = data.get("attendees", value);
                if (!Array.isArray(results) || value.trim() === "") {
                    return;
                }

                if (results.length === 0) {
                    dropdown.append('<button type="button" class="pdt-presenter-option" data-id="-1">No Results</button>');
                    dropdown.prop("hidden", false);
                    return;
                }

                for (const result of results) {
                    let fullName = `${result["first-n"]} ${result["last-n"]}`.trim();
                    let option = `<button type="button" class="pdt-presenter-option" data-id="${result.id}" data-name="${fullName}">${fullName}</button>`;
                    dropdown.append(option);
                }
                dropdown.prop("hidden", false);
            }, 300);
        });

        $('#pdt-presenter-options').on('click', '.pdt-presenter-option', function () {
            selectedPresenterId = Number($(this).attr('data-id') ?? -1);
            if (selectedPresenterId === -1) {
                return;
            }

            const selectedName = String($(this).attr('data-name') ?? '');
            $('#pdt-p_name').val(selectedName);
            $('#pdt-presenter-options').empty().prop('hidden', true);
        });

    }
    const linkARMemerModal = $('#pdt-link-armember')
    {
        // Link ARMember Account logic here
        // Cancel button
        $("#pdt-link-armember-btn").click(function () {
            linkARMemerModal.prop("hidden", true) ;
        }) ;
    }
}


function load_Attendees_Table(datas) {
    // Takes in data and formats it to the table body.
    const table_body = $("#pdt-attendee-table tbody");
    table_body.empty();

    for (const row_data of datas) {
        let state = "Link Account";
        let wpId = Number(row_data["WP-id"]);
        // WP-id is in two states at generated
        if (wpId !== -1) {
            state = "WP #" + row_data["WP-id"];
        }
        let row = `
                <tr class="pdt-attendee-table__row">
                            <td class="pdt-attendee-table__cell">${row_data["first-n"]}</td>
                            <td class="pdt-attendee-table__cell">${row_data["last-n"]}</td>
                            <td class="pdt-attendee-table__cell">${row_data["email"]}</td>
                            <td class="pdt-attendee-table__cell">
                                <button data-id=${row_data["id"]} class="pdt-attendee-table__link-button link_account_btn pdt-button" type="button">${state}</button>
                            </td>
                            <td class="pdt-attendee-table__cell">${row_data["t_hours"]}</td>
                            <td class="pdt-attendee-table__cell">${row_data["t_ceus"]}</td>
                        </tr>
            ` ;
        table_body.append(row);
    }
}

function link_account_btn(button) {

    let person = button.data("id");
    console.log(person);

    $('#pdt-link-armember').prop("hidden", false) ;


}
