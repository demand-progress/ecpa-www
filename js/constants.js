import StaticKit from './static-kit';


let constants = {};

constants.ACTIONKIT_CAMPAIGN  = 'ecpa-www';
constants.CALL_TOOL_URL       = 'https://call-congress.fightforthefuture.org/create?callback=?';
constants.DOMAIN              = 'savethefourth.net';
constants.SOURCE              = StaticKit.query.source;
constants.SOURCE_CLEANED      = StaticKit.query.cleanedSource;
constants.EMAIL_SUBJECT       = 'Sign this petition: Tell Obama to fight secret money in politics right away';
constants.EMAIL_BODY          = `Hi,

I just signed a petition at SaveTheFourth.net telling President Obama to immediately act to fight the secret money corroding our political system.

Nearly 6 years after Citizens United, President Obama still hasn't used any of the tools he has to reduce secret money spent by billionaires and wealthy special interests in our elections

The petition is integrated with the White House We The People petition platform – so if we get to 100,000 signatures, Obama will publicly respond. Could you help us get there?

https://${constants.DOMAIN}/?source=${StaticKit.query.cleanedSource}-emailshare

Thanks!`;
constants.TWEET_TEXT      = `Join me: Tell @POTUS that he must fight secret money in politics right away. SaveTheFourth.net/?source=${StaticKit.query.cleanedSource}-twittershare #ObamaMustAct`;
constants.REQUIRED_FIELDS = [
    'name',
    'email',
    'address1',
    'postcode',
];
constants.NON_SWAP_SOURCES           = [];
constants.NON_SWAP_3RD_PARTY_SOURCES = {};
constants.COMMITTEE_MEMBERS          = [{
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

export default constants;
