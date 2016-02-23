import $ from 'jquery';
import commafy from './commafy';
import Constants from './constants';
import Modal from './modal';
import StaticKit from './static-kit';


let campaign = {
    callCampaign : 'ecpa-goodlatte',
    twitterId    : 'RepGoodlatte',
    twitterText  : 'stop blocking email privacy! It’s time to pass the most popular bill in Congress! #EmailPrivacyAct https://savethefourth.net',
};

async function start() {
    // Update campaign
    let zip = getSavedZip();
    await updateCampaignWithZip(zip);

    // Update forms
    $('.sample-tweet .handle').text('@' + campaign.twitterId);

    // Show forms
    $('.options').addClass('ready');
    $('.tweet-prompt').addClass('ready');

    // Call form logic
    $('.call-wrapper form').on('submit', onCallFormSubmit);

    // Tweet form logic
    $('.tweet-wrapper form').on('submit', onTweetFormSubmit);

    // Feedback form logic
    $('.calling-wrapper form').on('submit', onFeedbackFormSubmit);
}

function onFeedbackFormSubmit(e) {
    e.preventDefault();

    let $feedbackForm = $(e.target);
    let message = '';
    let fields = $feedbackForm.serializeArray();
    fields.forEach((field) => {
        message += `${field.name}:\n${field.value}\n\n`;
    });

    $.getJSON(Constants.FEEDBACK_TOOL_URL, {
        campaign: 'save-the-fourth',
        subject: 'Feedback from Save the Fourth',
        text: message,
    });

    $feedbackForm.addClass('sent');
}

function onTweetFormSubmit(e) {
    e.preventDefault();

    let tweet = `.@${campaign.twitterId} ${campaign.twitterText}`;

    let url =
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(tweet);

    window.open(url);

    // Show thanks
    let $submit = $('.tweet-wrapper button');
    $submit.addClass('thanks');
    $submit.text('Thanks!');
}

async function onCallFormSubmit(e) {
    e.preventDefault();

    let $phone = $('input[name=phone]');

    let phone = $phone.val().replace(/[^\d]/g, '');

    if (phone.length < 10) {
        return alert('Please enter your 10 digit phone number.');
    }

    Modal.show('.calling');

    $phone.val('');

    // Send call
    $.getJSON(Constants.CALL_TOOL_URL, {
        campaignId: campaign.callCampaign,
        source_id: StaticKit.query.cleanedSource,
        userPhone: phone,
        zipcode: getSavedZip(),
    });

    // Deselect input
    document.activeElement.blur();

    // Show thanks
    let $submit = $('.call-wrapper button');
    $submit.addClass('thanks');
    $submit.attr('disabled', true);
    $submit.text('Thanks!');

    $('.call-wrapper form input').remove();
    $('.call-wrapper h2').remove();
}

function getSavedZip() {
    try {
        return sessionStorage.zip;
    } catch (e) {
        return null;
    }
}

async function updateCampaignWithZip(zip) {
    if (!zip) {
        return;
    }

    let res = await $.getJSON(Constants.SUNLIGHT_LOCATE_URL, {
        apikey: '3779f52f552743d999b2c5fe1cda70b6',
        zip: zip || $('#postcode').val(),
    });

    // Search for a committee member who represents the visitor
    for (let representative of res.results) {
        if (representative.chamber !== 'house') {
            continue;
        }

        for (let committeeMember of Constants.COMMITTEE_MEMBERS) {
            if (
                (committeeMember.district === representative.district) &&
                (committeeMember.state === representative.state)
            ) {
                campaign = {
                    callCampaign : 'ecpa-zip',
                    twitterId    : representative.twitter_id,
                    twitterText  : 'it’s time to pass the most popular bill in Congress, with no weakening amendments #EmailPrivacyAct https://savethefourth.net',
                };

                // Update copy
                $('body').removeClass('chairman-goodlatte').addClass('your-rep');
                $('.tweet-content').html(campaign.twitterText.replace('#', '<span class="link">#') + '</span>');

                break;
            }
        }
    }
}

export default {
    start: start,
};
