import $ from 'jquery';
import commafy from './commafy';
import Constants from './constants';


let campaign = {
    callCampaign : 'ecpa-goodlatte',
    twitterId    : 'RepGoodlatte',
};

async function start() {
    console.log('Starting Thanks Page');

    // Update campaign
    let zip = getSavedZip();
    await updateCampaignWithZip(zip);

    // Update forms
    $('.sample-tweet .handle').text('@' + campaign.twitterId);

    // Show forms
    $('.options').addClass('ready');
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
                    callCampaign: 'ecpa-zip',
                    twitterId: representative.twitter_id,
                };

                break;
            }
        }
    }
}

export default {
    start: start,
};
