import $ from 'jquery';


let Modal = {
    show: function(modal) {
        var $modal = $(modal);

        $modal.css({
            display: 'table',
        });

        setTimeout(function() {
            $modal.removeClass('invisible');
        }, 50);
    },

    hide: function(modal) {
        var $modal = $(modal);

        $modal.addClass('invisible');

        setTimeout(function() {
            $modal.css({
                display: 'none',
            });
        }, 400);
    },

    wire: function(modal) {
        var $modal = $(modal);

        if ($modal.length === 0) {
            return;
        }

        $modal.find('.close').on('click', function(e) {
            e.preventDefault();

            Modal.hide(modal);
        });

        $modal.find('.gutter').on('click', function(e) {
            if (e.target !== e.currentTarget) {
                return;
            }

            e.preventDefault();

            Modal.hide(modal);
        });
    },

    resizeTimeout: null,

    onResize: function() {
        clearTimeout(Modal.resizeTimeout);
        Modal.resizeTimeout = setTimeout(Modal.updateMaxHeight, 300);
    },

    updateMaxHeight: function() {
        $('.modal').css({
            'max-height': innerHeight + 'px',
        });
    },

    setup: function() {
        // Wire all modals
        $('.overlay').each(function(i, el) {
            Modal.wire(el);
        });

        // Update max-height on resize
        $(window).off('resize', Modal.onResize).on('resize', Modal.onResize);
    },
};

module.exports = Modal;
