import $ from 'jquery';


let Counter = {
    update: (page) => {
        $.ajax({
            url: `https://act.demandprogress.org/progress/${page}?callback=?`,
            dataType: 'jsonp',
            success: (data) => {
                $('.counter').addClass('loaded');
                $('.counter .number-of-signatures').text(commafiy(data.total.actions));
            },
        });
    },
};

function commafiy(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default Counter;
