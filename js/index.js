// Modules
import $ from 'jquery';
import { addGoogleAnalytics } from './analytics';
import Constants from './constants';
import FastClick from 'fastclick';
import HomePage from './home-page';
import Modal from './modal';
import Polyfill from 'babel-polyfill';
import StaticKit from './static-kit';
import ThanksPage from './thanks-page';
import ThanksSenatePage from './thanks-senate-page';


// FastClick for mobile
FastClick.attach(document.body);


// After the page loads
$(() => {
    // Set up modals
    Modal.setup();

    // Animated scrolls
    $('.animated-scroll').on('click', (e) => {
        e.preventDefault();

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

        case 'thanks-senate':
            ThanksSenatePage.start();
            break;
    }

    // Google Analytics
    addGoogleAnalytics();
});
