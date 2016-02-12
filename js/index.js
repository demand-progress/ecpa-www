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
let NON_SWAP_SOURCES = [];
let NON_SWAP_3RD_PARTY_SOURCES = {};
let committeeMembers = [{
    state: 'VA',
    district: 6
}, {
    state: 'WI',
    district: 5
}, {
    state: 'TX',
    district: 21
}, {
    state: 'OH',
    district: 1
}, {
    state: 'CA',
    district: 49
}, {
    state: 'VA',
    district: 4
}, {
    state: 'IA',
    district: 4
}, {
    state: 'AZ',
    district: 8
}, {
    state: 'TX',
    district: 1
}, {
    state: 'OH',
    district: 4
}, {
    state: 'TX',
    district: 2
}, {
    state: 'UT',
    district: 3
}, {
    state: 'PA',
    district: 10
}, {
    state: 'SC',
    district: 4
}, {
    state: 'ID',
    district: 1
}, {
    state: 'TX',
    district: 27
}, {
    state: 'GA',
    district: 9
}, {
    state: 'FL',
    district: 6
}, {
    state: 'CA',
    district: 45
}, {
    state: 'CO',
    district: 4
}, {
    state: 'TX',
    district: 4
}, {
    state: 'MI',
    district: 11
}, {
    state: 'MI',
    district: 8
}, {
    state: 'MI',
    district: 13
}, {
    state: 'NY',
    district: 10
}, {
    state: 'CA',
    district: 19
}, {
    state: 'TX',
    district: 18
}, {
    state: 'TN',
    district: 9
}, {
    state: 'GA',
    district: 4
}, {
    state: 'PR',
    district: 0
}, {
    state: 'CA',
    district: 27
}, {
    state: 'FL',
    district: 21
}, {
    state: 'IL',
    district: 4
}, {
    state: 'CA',
    district: 37
}, {
    state: 'LA',
    district: 2
}, {
    state: 'WA',
    district: 1
}, {
    state: 'NY',
    district: 8
}, {
    state: 'RI',
    district: 1
}, {
    state: 'CA',
    district: 52
}];

// Campaign
let campaign = {
    actionKitPage : 'sample1',
    callCampaign  : 'sample1',
    twitterId     : 'RepGoodlatte',
};

// After the page loads
$(() => {
    // Wire up modals
    Modal.wireAll();

    // Populate special form fields
    $('[name=action_user_agent]').val(navigator.userAgent);
    $('[name=source]').val(SOURCE_CLEANED);
    $('[name=url]').val(location.href);

    let $signatureForm = $('.home-page .action form');
    let zipWasFetched  = false;
    $signatureForm.on('submit', (e) => {
        if (zipWasFetched) {
            return true;
        }

        e.preventDefault();
        let valid = true;

        REQUIRED_FIELDS.forEach((field) => {
            if (!valid) {
                return;
            }

            let $field = $('#' + field);
            let value = $field.val() && $field.val().trim();
            if (!value) {
                alert('Please enter your ' + $field.attr('placeholder'));
                $field.focus();

                valid = false;
            }
        });

        if (!valid) {
            return;
        }

        let email = $('#email').val().trim().toLowerCase();

        if (!Email.validate(email)) {
            $('#email').focus();
            alert('Please enter your valid email');
            return;
        }

        $.ajax({
            data: {
                apikey: '3779f52f552743d999b2c5fe1cda70b6',
                zip: $('#postcode').val(),
            },
            dataType: 'json',
            success: (res) => {
                // We can submit to AK after this
                zipWasFetched = true;

                // Search for a committee member who represents the visitor
                for (let representative of res.results) {
                    if (representative.chamber !== 'house') {
                        continue;
                    }

                    for (let committeeMember of committeeMembers) {
                        if (
                            (committeeMember.district === representative.district)
                            &&
                            (committeeMember.state === representative.state)
                        ) {
                            campaign = {
                                actionKitPage : 'sample2',
                                callCampaign  : 'sample2',
                                twitterId     : representative.twitter_id,
                            };

                            break;
                        }
                    }
                }

                $signatureForm.submit();
            },
            url: 'https://congress.api.sunlightfoundation.com/legislators/locate',
        });

        // Thanking user, and disabling form
        showThanks();
    });

    let $callForm = $('.call-page .action form');
    $callForm.on('submit', (e) => {
        e.preventDefault();

        let phone = $('#phone').val().replace(/[^\d]/g, '');

        if (phone.length < 10) {
            $('#phone').focus();
            return alert('Please enter your 10 digit phone number.');
        }

        $.getJSON(CALL_TOOL_URL, {
            campaignId   : 'president-obamas-legacy',
            fftfCampaign : 'president-obamas-legacy',
            fftfReferer  : SOURCE,
            fftfSession  : '' + Date.now() + Math.floor(Math.random(9999)),
            source_id    : SOURCE,
            userPhone    : phone,
            zipcode      : 90210,
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

    let $feedbackForm = $('.calling-wrapper form');
    $feedbackForm.on('submit', (e) => {
        e.preventDefault();

        let message = '';
        let fields = $feedbackForm.serializeArray();
        fields.forEach((field) => {
            message += `${field.name}:\n${field.value}\n\n`;
        });

        $.getJSON(FEEDBACK_TOOL_URL, {
            campaign : 'president-obamas-legacy',
            subject  : 'Feedback from President Obama\'s Legacy',
            text     : message,
        });

        $feedbackForm.addClass('sent');
    });

    $('.animated-scroll').on('click', (e) => {
        let target = $(e.target).data('target');
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top,
        }, 640);
    });

    $('a.facebook').on('click', (e) => {
        e.preventDefault();

        let url =
            'https://www.facebook.com/sharer/sharer.php?u=' +
            encodeURIComponent(`${DOMAIN}/?source=${SOURCE_CLEANED}-fbshare`);
        window.open(url);
    });

    $('a.twitter').on('click', (e) => {
        e.preventDefault();

        let url =
            'https://twitter.com/intent/tweet?text=' +
            encodeURIComponent(TWEET_TEXT);
        window.open(url);
    });

    $('a.email').on('click', (e) => {
        e.preventDefault();

        let url =
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
            display : 'block',
            opacity : 1,
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
        let $prompt = $('.check-your-email-prompt');
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
