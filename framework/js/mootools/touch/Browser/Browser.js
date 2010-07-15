(function(){

var isTouch = ('ontouchstart' in window);

var Browser = this.Browser;

Object.merge(Browser.Features, {
    touch: isTouch,
    orientation: (typeof window.orientation != 'undefined') || window.hasOwnProperty('orientation'),
    hashChange: (typeof window.onhashchange != 'undefined') || window.hasOwnProperty('onhashchange'),
    fullScreen: (!isTouch || (window.navigator.standalone == true) || !!window.PhoneGap),
    cssTransforms: (typeof WebKitCSSMatrix != 'undefined'),
    css3dTransforms: (typeof WebKitCSSMatrix != 'undefined' && new WebKitCSSMatrix().hasOwnProperty('m41'))
});

Browser.extend({
    Events: {
        TOUCH_START: (isTouch) ? 'touchstart' : 'mousedown',
        TOUCH_MOVE: (isTouch) ? 'touchmove' : 'mousemove',
        TOUCH_END: (isTouch) ? 'touchend' : 'mouseup',
        ORIENTATION_CHANGE: (Browser.Features.orientation) ? 'orientationchange' : 'resize',
        TRANSITION_END: 'webkitTransitionEnd'
    },

    Orientation: {
        PROFILE: 'profile',
        LANDSCAPE: 'landscape'
    },

    getOrientation: function() {
        if (Browser.Features.orientation) {
            return (window.orientation == 0) ? Browser.Orientation.PROFILE : Browser.Orientation.LANDSCAPE;
        } else {
            var windowSize = window.getSize();
            return (windowSize.x < windowSize.y) ? Browser.Orientation.PROFILE : Browser.Orientation.LANDSCAPE;
        }
    }
});

})();