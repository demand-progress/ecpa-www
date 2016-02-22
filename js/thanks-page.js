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

let callToolURL;

async function start() {
    // Update campaign
    let zip = getSavedZip();
    await updateCampaignWithZip(zip);

    // Update call tool URL
    callToolURL =
        'https://dp-call-congress.herokuapp.com/create' +
        '?campaignId=' + campaign.callCampaign +
        '?source_id='  + StaticKit.query.cleanedSource;

    if (zip) {
        callToolURL += '&zipcode=' + zip;
    }

    // Update forms
    $('.sample-tweet .handle').text('@' + campaign.twitterId);

    // Show forms
    $('.options').addClass('ready');

    // Call form logic
    $('.call-wrapper form').on('submit', onCallFormSubmit);

    // Tweet form logic
    $('.tweet-wrapper form').on('submit', onTweetFormSubmit);

    window.$ = $;
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

    let $phone = $('input[type=tel]');
    let phone = $phone.val().replace(/[^\d]/g, '');

    if (phone.length < 10) {
        return alert('Please enter your 10 digit phone number.');
    }

    Modal.show('.calling');

    $phone.val('');

    // Send call
    $.ajax({
        url: callToolURL + '&userPhone='  + phone,
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

    Modal.show('calling');
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

    let res = await $.ajax({
        url: 'https://congress.api.sunlightfoundation.com/legislators/locate',
        data: {
            apikey: '3779f52f552743d999b2c5fe1cda70b6',
            zip: zip || $('#postcode').val(),
        },
        dataType: 'json',
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