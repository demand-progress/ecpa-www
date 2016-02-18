// Modules
import $ from 'jquery';
import Constants from './constants';
import Email from './email';
import Modal from './modal';
import SignatureCounter from './counter';
import StaticKit from './static-kit';


function start() {
    // Letter modal link
    $('a.the-letter').on('click', (e) => {
        e.preventDefault();
        Modal.show('#letter');
    });

    // Update counter
    SignatureCounter.update(Constants.ACTIONKIT_CAMPAIGN);

    // Populate special form fields
    $('[name=action_user_agent]').val(navigator.userAgent);
    $('[name=source]').val(StaticKit.query.cleanedSource);
    $('[name=url]').val(location.href);

    // Setup signature form
    let readyToSubmit = false;
    let $signatureForm = $('.action form');
    $signatureForm.on('submit', (e) => {
        if (readyToSubmit) {
            return;
        }

        e.preventDefault();
        let valid = true;

        Constants.REQUIRED_FIELDS.forEach((field) => {
            if (!valid) {
                return;
            }

            let $field = $('#' + field);
            let value  = $field.val() && $field.val().trim();
            if (!value) {
                alert('Please enter your ' + $field.attr('placeholder'));
                $field.focus();

                valid = false;
            }
        });

        if (!valid) {
            return false;
        }

        let email = $('#email').val().trim().toLowerCase();

        if (!Email.validate(email)) {
            $('#email').focus();
            alert('Please enter your valid email');
            return false;
        }

        let zip = $('#postcode').val().trim();
        try {
            sessionStorage.zip = zip;
        } catch (e) {}

        // Thanking user, and disabling form
        $('form button').attr('disabled', true);
        $('#thanks').css({
            display : 'block',
            opacity : 1,
        });

        readyToSubmit = true;
        $signatureForm.submit();
    });
}

export default {
    start: start,
};
