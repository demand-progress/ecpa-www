import $ from 'jquery';
import commafy from './commafy';


let SignatureCounter = {
    update: (page) => {
        $.ajax({
            url: `https://act.demandprogress.org/progress/${page}?callback=?`,
            dataType: 'jsonp',
            success: (data) => {
                $('.counter').addClass('loaded');
                $('.counter .number-of-signatures').text(commafy(data.total.actions));
            },
        });
    },
};

export default SignatureCounter;
