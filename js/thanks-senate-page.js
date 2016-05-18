import $ from 'jquery';
import commafy from './commafy';
import Constants from './constants';
import Modal from './modal';
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import StaticKit from './static-kit';


let state = {
    bioguideIDs  : [],
    callCampaign : 'ecpa-goodlatte',
    twitterIDs   : [],
    twitterText  : 'Pass the most popular bill in Congress! #EmailPrivacyAct https://savethefourth.net',
};

async function start() {
    // Debug
    debug();

    // Update campaign
    let zip = getSavedZip();
    await updateCampaignWithZip(zip);
    tweetToAdditionalMember();

    // Update suggested Tweet
    $('.tweet-content').html(state.twitterText.replace('#', '<span class="link">#') + '</span>');

    // Update forms
    $('.sample-tweet .handle').text('@' + state.twitterIDs.join(' @'));

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

    let tweet = `.@${state.twitterIDs.join(' @')} ${state.twitterText}`;

    let url =
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(tweet);

    window.open(url);

    // Show thanks
    let $submit = $('.tweet-wrapper button');
    $submit.addClass('thanks');
    $submit.text('Thanks!');

    // Send event
    ga('send', {
        hitType       : 'event',
        eventCategory : 'ThanksPageTweet',
        eventAction   : 'sent',
        eventLabel    : state.campaignId,
    });
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
    let callParams = {
        campaignId: state.callCampaign,
        source_id: StaticKit.query.cleanedSource,
        userPhone: phone,
        repIds: state.bioguideIDs,
    };

    $.getJSON(Constants.CALL_TOOL_URL, callParams);

    // Deselect input
    document.activeElement.blur();

    // Show thanks
    showCallFormThanks();

    // Send event
    ga('send', {
        hitType       : 'event',
        eventCategory : 'ThanksPageCall',
        eventAction   : 'sent',
        eventLabel    : callParams.campaignId,
    });
}

function showCallFormThanks() {
    let $callWrapper = $('.call-wrapper');
    $callWrapper.addClass('thanks');
    let $submit = $('.call-wrapper button');
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
    let res = await $.getJSON(Constants.SUNLIGHT_LOCATE_URL, {
        apikey: '3779f52f552743d999b2c5fe1cda70b6',
        zip: zip || 50316,
    });

    // Search for committee members who represents the visitor
    var senators = [];
    var senatorsWithinCommittee = [];
    for (let representative of res.results) {
        if (representative.chamber !== 'senate') {
            continue;
        }

        senators.push(representative);

        for (let bioguideID of Constants.COMMITTEE_MEMBERS_SENATE) {
            if (representative.bioguide_id === bioguideID) {
                senatorsWithinCommittee.push(representative);
            }
        }
    }

    if (zip && senatorsWithinCommittee.length > 0) {
        senators = senatorsWithinCommittee;

        // Update page
        state.callCampaign = 'savethefourthnet-senate-specific';
        state.twitterText = 'it’s time to pass the most popular bill in Congress, with no weakening amendments #EmailPrivacyAct https://savethefourth.net';
        $('body')
            .removeClass('variation-default')
            .addClass('variation-specific');
    }

    for (let senator of senators) {
        state.bioguideIDs.push(senator.bioguide_id);
        state.twitterIDs.push(senator.twitter_id);
    }

    state.bioguideIDs = shuffle(state.bioguideIDs);
    state.twitterIDs = shuffle(state.twitterIDs);
}

function tweetToAdditionalMember() {
    let chair = 'RepGoodlatte';

    // Only add to default tweets
    if (state.twitterIDs[0] !== chair) {
        return;
    }

    // Find additional members
    while (state.twitterIDs.join(' @').length <= 40) {
        let member = sample(Constants.COMMITTEE_MEMBERS).twitter;

        if (state.twitterIDs.indexOf(member) > -1) {
            continue;
        }

        state.twitterIDs.push(member);
    }
}

function debug() {
    switch (StaticKit.query.debug) {
        case 'default':
            sessionStorage.zip = '33880';
            break;

        case 'match':
            sessionStorage.zip = '90210';
            break;

        case 'matches':
            sessionStorage.zip = '84622';
            break;

        case 'default-calling':
            sessionStorage.zip = '33880';
            Modal.show('.calling');
            break;

        case 'match-calling':
            sessionStorage.zip = '90210';
            Modal.show('.calling');
            break;

        case 'matches-calling':
            sessionStorage.zip = '84622';
            Modal.show('.calling');
            break;
    }
}

export default {
    start: start,
};
