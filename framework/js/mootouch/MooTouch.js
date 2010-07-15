(function(){

if(!window.hasOwnProperty('MooTouch')) {
    var isSupported = {
        touch: ('ontouchstart' in window),
        orientationChange: ('onorientationchange' in window)
    };

    var testProperty = function(p) {
        return document.body.style.hasOwnProperty(p);
    };

    var isTouch = isSupported['touch'] = ('ontouchstart' in window);
    isSupported['orientationchange'] = ('onorientationchange' in window);
    isSupported['fullscreen'] = (typeof !isSupported['touch'] || (window.navigator.standalone == true) || window.PhoneGap != 'undefined');

    window.addEvent('domready', function() {
        isSupported['3dcsstransforms'] = testProperty('WebkitPerspective');
        isSupported['csstransforms'] = testProperty('WebkitTransform');
    });

    var applicationInstance = null;

    var MT = window.MooTouch = {
        VERSION: '1.0 alpha',

        EVENT_TOUCHSTART: (isTouch) ? 'touchstart' : 'mousedown',
        EVENT_TOUCHMOVE: (isTouch) ? 'touchmove' : 'mousemove',
        EVENT_TOUCHEND: (isTouch) ? 'touchend' : 'mouseup',
        EVENT_ORIENTATIONCHANGE: (isSupported['orientationchange']) ? 'orientationchange' : 'resize',
        EVENT_TRANSITIONEND: 'webkitTransitionEnd',
        
        ORIENTATION_PROFILE: 'profile',
        ORIENTATION_LANDSCAPE: 'landscape',

        DEVICE_IPHONE: 'iphone',
        DEVICE_IPAD: 'ipad',
        DEVICE_ANDROID: 'android',
        DEVICE_OTHER: 'other',

        isTouchDevice: isTouch,

        isFullScreen: isSupported['fullscreen'],

        stylePropertyMappings: {},

        getApplication: function() {
            return applicationInstance;
        },

        getDeviceType: function() {
            var userAgent = window.navigator.userAgent.toLowerCase();

            if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipod') !== -1)
                return MT.DEVICE_IPHONE;
            else if (userAgent.indexOf('ipad') !== -1)
                return MT.DEVICE_IPAD;
            else if (userAgent.indexOf('android') !== -1)
                return MT.DEVICE_ANDROID;
            else
                return MT.DEVICE_OTHER;
        },

        isSupported: function(feature) {
            return (isSupported.hasOwnProperty(feature)) ? isSupported[feature] : false;
        },

        supportsTranslate3d: function() {
            return isSupported['3dcsstransforms'];
        },

        stopEvent: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },

        setApplication: function(application) {
            applicationInstance = application;
        },

        getCurrentOrientation: function() {
            if (window.orientation != undefined) {
                return (window.orientation == 0) ? MT.ORIENTATION_PROFILE : MT.ORIENTATION_LANDSCAPE;
            } else {
                var windowSize = window.getSize();
                return (windowSize.x < windowSize.y) ? MT.ORIENTATION_PROFILE : MT.ORIENTATION_LANDSCAPE;
            }
        },

        createEvent: function() {
            if(isTouch)
                return MT.createTouchEvent.run(arguments);
            else
                return MT.createMouseEvent.run(arguments);
        },

        createTouchEvent: function(name, e) {
            var evt = document.createEvent("TouchEvent");
            evt.initTouchEvent(name, e.bubbles, e.cancelable, window, e.detail, e.screenX, e.screenY, e.clientX, e.clientY,
                                     e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.touches, e.targetTouches, e.changedTouches,
                                     e.scale, e.rotation);
            evt.isManufactured = true;
            return evt;
        },

        createMouseEvent: function(name, e) {
            var evt = document.createEvent("MouseEvent");
            evt.initMouseEvent(name, e.bubbles, e.cancelable, document.defaultView, e.detail, e.screenX, e.screenY, e.clientX,
                                     e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.metaKey, e.button, e.relatedTarget);
            evt.isManufactured = true;
            return evt;
        },

        getComputedOffset: function(el) {
            var cssMatrix = new WebKitCSSMatrix(window.getComputedStyle(el).webkitTransform);

            if (typeof cssMatrix.m41 != 'undefined') {
                return new MooTouch.Core.Offset(cssMatrix.m41, cssMatrix.m42);
            } else if (typeof cssMatrix.d != 'undefined') {
                return new MooTouch.Core.Offset(cssMatrix.d, cssMatrix.e);
            }

            return new MooTouch.Core.Offset(0, 0);
        },

        cssTransform: function(el, transforms) {
            var m = new WebKitCSSMatrix();

            Object.each(transforms, function(v, n) {
                m = m[n].apply(m, Array.from(v));
            });

            // el.style.webkitTransform = matrix;
            // To enable hardware accelerated transforms on iPhones we have to do this way...
            if (isSupported['3dcsstransforms']) {
//                var params = [];
//
//                for (var i = 1; i <= 4; i++) {
//                    for (var j = 1; j <= 4; j++) {
//                        params.push(matrix['m' + i + j]);
//                    }
//                }
//
//                el.style.webkitTransform = 'matrix3d('+params.join(',')+')';
                el.style.webkitTransform = 'matrix3d(' +
                                                m.m11+', '+m.m12+', '+m.m13+', '+m.m14+', '+
                                                m.m21+', '+m.m22+', '+m.m23+', '+m.m24+', '+
                                                m.m31+', '+m.m32+', '+m.m33+', '+m.m34+', '+
                                                m.m41+', '+m.m42+', '+m.m43+', '+m.m44+
                                           ')';
            } else
                el.style.webkitTransform = m;
        },

        getRealStylePropertyName: function(name) {
            if (!MT.stylePropertyMappings.hasOwnProperty(name)) {
                switch (name) {
                    case 'transform':
                    case 'transform-origin':
                    case 'transition-property':
                    case 'transition-duration':
                    case 'transition-delay':
                        MT.stylePropertyMappings[name] = '-webkit-' + name;

                        break;
                    default:
                        MT.stylePropertyMappings[name] = name;
                }
            }

            return MT.stylePropertyMappings[name];
        }
    };

}

})();