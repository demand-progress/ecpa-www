// Modules
import $ from 'jquery';
import Constants from './constants';
import HomePage from './home-page';
import Modal from './modal';
import Polyfill from 'babel-polyfill';
import StaticKit from './static-kit';
import ThanksPage from './thanks-page';


// Check for outdated browsers
var isIE = navigator.userAgent.match(/MSIE (\d+)\./);
if (isIE) {
    var version = +isIE[1];
    if (version < 9) {
        alert('Unfortunately your browser, Internet Explorer ' + version + ', is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
        location.href = 'https://www.mozilla.org/en-US/firefox/';
    }
}

if (navigator.userAgent.match(/Android 2\.3/)) {
    alert('Unfortunately your browser, Android 2.3, is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
}

// After the page loads
$(() => {
    // Set up modals
    Modal.setup();

    // Animated scrolls
    $('.animated-scroll').on('click', (e) => {
        let target = $(e.target).data('target');
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top,
        }, 640);
    });

    // Social links for Facebook
    $('a.facebook').on('click', (e) => {
        e.preventDefault();

        let url =
            'https://www.facebook.com/sharer/sharer.php?u=' +
            encodeURIComponent(`${Constants.DOMAIN}/?source=${StaticKit.query.cleanedSource}-fbshare`);
        window.open(url);
    });

    // Social links for Twitter
    $('a.twitter').on('click', (e) => {
        e.preventDefault();

        let url =
            'https://twitter.com/intent/tweet?text=' +
            encodeURIComponent(Constants.TWEET_TEXT);
        window.open(url);
    });

    // Social links for Email
    $('a.email').on('click', (e) => {
        e.preventDefault();

        let url =
            'mailto:?subject=' + encodeURIComponent(Constants.EMAIL_SUBJECT) +
            '&body=' + encodeURIComponent(Constants.EMAIL_BODY);
        window.location.href = url;
    });

    // Page specific code
    let pageKey = $('body').data('page');
    switch (pageKey) {
        case 'home':
            HomePage.start();
            break;

        case 'thanks':
            ThanksPage.start();
            break;
    }
});
