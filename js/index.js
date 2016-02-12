// Modules
import $ from 'jquery';
import Email from './email';
import Modal from './modal';
import StaticKit from './statickit';

// Constants
let SOURCE = StaticKit.query.source;
let SOURCE_CLEANED = StaticKit.query.cleanedSource;
let FEEDBACK_TOOL_URL = 'https://dp-feedback-tool.herokuapp.com/api/v1/feedback?callback=?';
let CALL_TOOL_URL = 'https://call-congress.fightforthefuture.org/create?callback=?';
let CALL_TOOL_COUNT_URL = 'https://dp-call-tool-meta.herokuapp.com/api/count/sunsetthepatriotact?callback=?';
let DOMAIN = 'presidentobamaslegacy.org';
let EMAIL_SUBJECT = 'Sign this petition: Tell Obama to fight secret money in politics right away';
let EMAIL_BODY = `Hi,

I just signed a petition at PresidentObamasLegacy.org telling President Obama to immediately act to fight the secret money corroding our political system.

Nearly 6 years after Citizens United, President Obama still hasn't used any of the tools he has to reduce secret money spent by billionaires and wealthy special interests in our elections

The petition is integrated with the White House We The People petition platform – so if we get to 100,000 signatures, Obama will publicly respond. Could you help us get there?

http://${DOMAIN}/?source=${SOURCE_CLEANED}-emailshare

Thanks!`;
let TWEET_TEXT = `Join me: Tell @POTUS that he must fight secret money in politics right away. PresidentObamasLegacy.org/?source=${SOURCE_CLEANED}-twittershare #ObamaMustAct`;
let REQUIRED_FIELDS = [
    'first_name',
    'last_name',
    'email',
    'postcode',
];
let NON_SWAP_SOURCES = [
    'dk',
    'dk1',
    'dk2',
    'dk3',
    'dk4',
    'dkns',
    'la',
    'lans',
    'lans1',
    'lans2',
    'lans3',
    'lans4',
    'mj',
    'mjns',
    'rsns',
];
let NON_SWAP_3RD_PARTY_SOURCES = {
    maydayns: 'MAYDAY.US',
};

// After the page loads
$(() => {
    // Wire up modals
    Modal.wireAll();

    // Populate special form fields
    $('[name=action_user_agent]').val(navigator.userAgent);
    $('[name=source]').val(SOURCE_CLEANED);
    $('[name=url]').val(location.href);

    let petitionWasSentToWH = false;
    const $signatureForm = $('.home-page .action form');
    $signatureForm.on('submit', (e) => {
        if (petitionWasSentToWH) {
            return true;
        }

        e.preventDefault();

        let valid = true;

        REQUIRED_FIELDS.forEach((field) => {
            if (!valid) {
                return;
            }

            const $field = $('#' + field);
            const value = $field.val() && $field.val().trim();
            if (!value) {
                alert('Please enter your ' + $field.attr('placeholder'));
                $field.focus();

                valid = false;
            }
        });

        if (!valid) {
            return;
        }

        const email = $('#email').val().trim().toLowerCase();

        if (!Email.validate(email)) {
            $('#email').focus();
            alert('Please enter your valid email');
            return;
        }

        // Thanking user
        showThanks();

        // Sending request to WH API
        $.getJSON(WTP_API_SIGN_URL, {
            email: email,
            key: WTP_API_SIGN_KEY,
            first_name: $('#first_name').val().trim(),
            last_name: $('#last_name').val().trim(),
            petition_id: WTP_PETITION_ID,
        }, (res) => {
            if (res.success) {
                petitionWasSentToWH = true;
                $signatureForm.submit();
            } else {
                alert('Sorry, something went wrong with your submission. The servers might be overloaded. Please try again later.')
            }
        });
    });

    const $callForm = $('.call-page .action form');
    $callForm.on('submit', (e) => {
        e.preventDefault();

        const phone = $('#phone').val().replace(/[^\d]/g, '');

        if (phone.length < 10) {
            $('#phone').focus();
            return alert('Please enter your 10 digit phone number.');
        }

        $.getJSON(CALL_TOOL_URL, {
            campaignId: 'president-obamas-legacy',
            fftfCampaign: 'president-obamas-legacy',
            fftfReferer: SOURCE,
            fftfSession: '' + Date.now() + Math.floor(Math.random(9999)),
            source_id: SOURCE,
            userPhone: phone,
            zipcode: 90210,
        }, (res) => {
            if (res.message !== 'queued') {
                alert('Sorry, something went wrong with your submission. The servers might be overloaded. Please try again later.')
            }
        });

        showCallingScript();
    });

    // Special URLs
    if ($callForm.length) {
        if (StaticKit.query.after === 'signing-petition') {
            $('body').addClass('coming-from-petition');
        }

        if (StaticKit.query.test === 'calling') {
            showCallingScript();
        }
    }

    const $feedbackForm = $('.calling-wrapper form');
    $feedbackForm.on('submit', (e) => {
        e.preventDefault();

        let message = '';
        const fields = $feedbackForm.serializeArray();
        fields.forEach((field) => {
            message += `${field.name}:\n${field.value}\n\n`;
        });

        $.getJSON(FEEDBACK_TOOL_URL, {
            campaign: 'president-obamas-legacy',
            subject: 'Feedback from President Obama\'s Legacy',
            text: message,
        });

        $feedbackForm.addClass('sent');
    });

    $('.animated-scroll').on('click', (e) => {
        const target = $(e.target).data('target');
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top,
        }, 640);
    });

    $('a.facebook').on('click', (e) => {
        e.preventDefault();

        const url =
            'https://www.facebook.com/sharer/sharer.php?u=' +
            encodeURIComponent(`${DOMAIN}/?source=${SOURCE_CLEANED}-fbshare`);
        window.open(url);
    });

    $('a.twitter').on('click', (e) => {
        e.preventDefault();

        const url =
            'https://twitter.com/intent/tweet?text=' +
            encodeURIComponent(TWEET_TEXT);
        window.open(url);
    });

    $('a.email').on('click', (e) => {
        e.preventDefault();

        const url =
            'mailto:?subject=' + encodeURIComponent(EMAIL_SUBJECT) +
            '&body=' + encodeURIComponent(EMAIL_BODY);
        window.location.href = url;
    });

    $('a.the-letter').on('click', (e) => {
        e.preventDefault();
        Modal.show('#letter');
    });

    $('button.add-your-name').on('click', (e) => {
        e.preventDefault();
        location.hash = 'add-your-name';
    });

    var resizeTimeout = false;
    $(window).on('resize', (e) => {
        resizeTimeout = setTimeout(onResize, 300);
    }, false);

    function onResize() {
        $('.modal').css({
            'max-height': innerHeight + 'px',
        });
    }

    // Hashes
    if (
        location.hash === '#sent' ||
        StaticKit.query.sent
    ) {
        showCheckYourEmailPrompt();
        showThanks();
        location.hash = '';
        setTimeout(() => {
            location.href = './call?after=signing-petition';
        }, 30 * 1000);
    }

    function showThanks() {
        $('form button').attr('disabled', true);

        $('#thanks').css({
            display: 'block',
            opacity: 1,
        });
    }

    function fetchPetitionCount() {
        $.ajax({
            cache   : false,
            url     : './data/combined-signatures.html',
            success : (res) => {
                if (res) {
                    res = res.replace(/[^\d]/g, '');

                    $('.counter').addClass('loaded');
                    $('.counter .number-of-signatures').text(numberWithCommas(res));
                }
            },
        });
    }

    function fetchCallCount() {
        $.getJSON(CALL_TOOL_COUNT_URL, (res) => {
            if (res.count) {
                $('.counter').addClass('loaded');
                $('.counter .number-of-signatures').text(numberWithCommas(res.count));
            }
        });
    }

    if ($('body.home-page').length) {
        fetchPetitionCount();
    }

    // if ($('body.call-page').length) {
    //     fetchCallCount();
    // }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function showCheckYourEmailPrompt() {
        const $prompt = $('.check-your-email-prompt');
        $prompt.addClass('visible');
        $prompt[0].offsetHeight; // Reflow
        $prompt.css({
            opacity: 1,
        });
    }

    function showCallingScript() {
        $('body').addClass('calling');
        document.body.offsetHeight; // Reflow
        $('html, body').stop().animate({
            scrollTop: $('.calling-wrapper').offset().top - 16,
        }, 640);
    }

});
