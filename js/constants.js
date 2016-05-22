import StaticKit from './static-kit';


let constants = {};

constants.ACTIONKIT_CAMPAIGN = 'ecpa-www';
constants.ACTIONKIT_CAMPAIGN_SENATE = 'savethefourthnet-senate-www';
constants.CALL_TOOL_URL = 'https://dp-call-congress.herokuapp.com/create?callback=?';
constants.DOMAIN = 'savethefourth.net';
constants.FEEDBACK_TOOL_URL = 'https://dp-feedback-tool.herokuapp.com/api/v1/feedback?callback=?';
constants.SOURCE = StaticKit.query.source;
constants.SOURCE_CLEANED = StaticKit.query.cleanedSource;
constants.SUNLIGHT_LOCATE_URL = 'https://congress.api.sunlightfoundation.com/legislators/locate?callback=?';
constants.EMAIL_SUBJECT = 'Sign this petition: Tell the Senate to end warrantless snooping';
constants.EMAIL_BODY = `Hi,

I just signed a petition at SaveTheFourth.net telling the Senate to finally #ReformECPA and pass legislation to require the government to get a warrant if it wants to access our private email.

Right now, the law says the government can access emails without a warrant just because they’re over 180 days old. I know — it’s crazy.

However, there is a bill before the Senate Judiciary Committee that would require the government get a warrant for email, just like it needs a warrant to access postal mail. It’s a no-brainer, and the bill has already passed the House on a vote of 419-0, thanks to grassroots mobilization. Now, we need to let the Senate know that the public wants this commonsense reform passed. Will you take a moment to contact the Senate?

https://${constants.DOMAIN}/?source=${constants.SOURCE_CLEANED}-emailshare

Thanks!`;
constants.TWEET_TEXT      = `.@SenateMajLdr @ChuckGrassley it’s time to #ReformECPA & pass privacy legislation with no weakening amendments! https://savethefourth.net`;
constants.REQUIRED_FIELDS = [
    'name',
    'email',
    'address1',
    'postcode',
];
constants.NON_SWAP_SOURCES           = [];
constants.NON_SWAP_3RD_PARTY_SOURCES = {};
constants.COMMITTEE_MEMBERS_SENATE   = [
    'G000386', // Grassley
    'L000174', // Leahy
    'F000062', // Feinstein
    'S001141', // Sessions
    'S000148', // Schumer
    'G000359', // Graham
    'D000563', // Durbin
    'W000802', // Whitehouse
    'F000444', // Flake
    'C001088', // Coons
    'V000127', // Vitter
    'B001277', // Blumenthal
    'P000612', // Perdue
    'T000476', // Tillis
    'H000338', // Hatch
    'L000577', // Lee
    'C001056', // Cornyn
    'C001098', // Cruz
    'K000367', // Klobuchar
    'F000457', // Franken
];
constants.TWITTER_ID_BACKUPS = {
    'C001075': 'BillCassidy',
    'F000457': 'AlFranken',
    'K000367': 'AmyKlobuchar',
    'P000603': 'RandPaul',
    'V000127': 'DavidVitter',
};
constants.COMMITTEE_MEMBERS          = [{
    "state": "VA",
    "district": 6,
    "twitter": "RepGoodlatte"
}, {
    "state": "WI",
    "district": 5,
    "twitter": "JimPressOffice"
}, {
    "state": "TX",
    "district": 21,
    "twitter": "LamarSmithTX21"
}, {
    "state": "OH",
    "district": 1,
    "twitter": "RepSteveChabot"
}, {
    "state": "CA",
    "district": 49,
    "twitter": "DarrellIssa"
}, {
    "state": "VA",
    "district": 4,
    "twitter": "Randy_Forbes"
}, {
    "state": "IA",
    "district": 4,
    "twitter": "SteveKingIA"
}, {
    "state": "AZ",
    "district": 8,
    "twitter": "RepTrentFranks"
}, {
    "state": "TX",
    "district": 1,
    "twitter": "RepLouieGohmert"
}, {
    "state": "OH",
    "district": 4,
    "twitter": "Jim_Jordan"
}, {
    "state": "TX",
    "district": 2,
    "twitter": "JudgeTedPoe"
}, {
    "state": "UT",
    "district": 3,
    "twitter": "JasonInTheHouse"
}, {
    "state": "PA",
    "district": 10,
    "twitter": "RepTomMarino"
}, {
    "state": "SC",
    "district": 4,
    "twitter": "TGowdySC"
}, {
    "state": "ID",
    "district": 1,
    "twitter": "Raul_Labrador"
}, {
    "state": "TX",
    "district": 27,
    "twitter": "Farenthold"
}, {
    "state": "GA",
    "district": 9,
    "twitter": "RepDougCollins"
}, {
    "state": "FL",
    "district": 6,
    "twitter": "RepDeSantis"
}, {
    "state": "CA",
    "district": 45,
    "twitter": "RepMimiWalters"
}, {
    "state": "CO",
    "district": 4,
    "twitter": "RepKenBuck"
}, {
    "state": "TX",
    "district": 4,
    "twitter": "RepRatcliffe"
}, {
    "state": "MI",
    "district": 11,
    "twitter": "repdavetrott"
}, {
    "state": "MI",
    "district": 8,
    "twitter": "RepMikeBishop"
}, {
    "state": "MI",
    "district": 13,
    "twitter": "RepJohnConyers"
}, {
    "state": "NY",
    "district": 10,
    "twitter": "RepJerryNadler"
}, {
    "state": "CA",
    "district": 19,
    "twitter": "RepZoeLofgren"
}, {
    "state": "TX",
    "district": 18,
    "twitter": "JacksonLeeTX18"
}, {
    "state": "TN",
    "district": 9,
    "twitter": "RepCohen"
}, {
    "state": "GA",
    "district": 4,
    "twitter": "RepHankJohnson"
}, {
    "state": "PR",
    "district": 0,
    "twitter": "PedroPierluisi"
}, {
    "state": "CA",
    "district": 27,
    "twitter": "RepJudyChu"
}, {
    "state": "FL",
    "district": 21,
    "twitter": "RepTedDeutch"
}, {
    "state": "IL",
    "district": 4,
    "twitter": "LuisGutierrez"
}, {
    "state": "CA",
    "district": 37,
    "twitter": "RepKarenBass"
}, {
    "state": "LA",
    "district": 2,
    "twitter": "RepRichmond"
}, {
    "state": "WA",
    "district": 1,
    "twitter": "RepDelBene"
}, {
    "state": "NY",
    "district": 8,
    "twitter": "RepJeffries"
}, {
    "state": "RI",
    "district": 1,
    "twitter": "RepCicilline"
}, {
    "state": "CA",
    "district": 52,
    "twitter": "RepScottPeters"
}];

export default constants;
