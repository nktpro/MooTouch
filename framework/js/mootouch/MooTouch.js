(function(){

if(!window.hasOwnProperty('MooTouch')) {
    var MT = window.MooTouch = {
        version: '1.0 alpha',

        stylePropertyMappings: {},

        stopEvent: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },

        createEvent: function() {
            if(Browser.Features.touch)
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
            // To enable hardware accelerated transforms on iOS (v3 only, fixed in v4?) we have to do this way...
            if (Browser.Features.css3dTransforms) {
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