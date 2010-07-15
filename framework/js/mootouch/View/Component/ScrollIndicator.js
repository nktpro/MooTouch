(function(){
    
var MT = Namespace.use('MooTouch');

new Namespace('MooTouch.View.Component.ScrollIndicator', {

    Extends: 'MooTouch.Core.Element',

    Implements: ['MooTouch.View.Mixin.Translatable', 'MooTouch.View.Mixin.Resizable'],

    Exposes: [
        'isVisible',
        'elementTop',
        'elementMiddle',
        'elementEnd'
    ],

    options: {
        className: 'scrollIndicator',
        thickness: 7,
        endSize: 3,
        type: 'horizontal',
        elementTopClass: 'top',
        elementMiddleClass: 'middle',
        elementEndClass: 'end'
    },

    initialize: function(){
        this.parent.apply(this, arguments);

        this.element.addClass(this.options.type);

        this.elementTop.addClass(this.options.elementTopClass);
        this.elementMiddle.addClass(this.options.elementMiddleClass);
        this.elementEnd.addClass(this.options.elementEndClass);

        return this;
    },

    getElementTop: function() {
        if (!(this._elementTop instanceof Element)) {
            this._elementTop = (new Element('div')).inject(this.element);
        }

        return this._elementTop;
    },

    getElementMiddle: function() {
        if (!(this._elementMiddle instanceof Element)) {
            var dataUrl = 'iVBORw0KGgoAAAANSUhEUgAAAAcAAAABCAYAAAASC7TOAAAAFUlEQVQI12P4//+/OgMDQwM6BokDAH45CMlP8sGXAAAAAElFTkSuQmCC';

            if (this.options.type == 'horizontal')
                dataUrl = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAAHCAYAAADJTCeUAAAAG0lEQVQI12P4//+/GgMTE1MdAxA0IBFgMZAsAJkPCM/MdNkZAAAAAElFTkSuQmCC';

            this._elementMiddle = (new Element('img').set('src', 'data:image/png;base64,' + dataUrl)).inject(this.element);
        }

        return this._elementMiddle;
    },

    getElementEnd: function() {
        if (!(this._elementEnd instanceof Element)) {
            this._elementEnd = (new Element('div')).inject(this.element);
        }

        return this._elementEnd;
    },

    setElementTop: function(el) {
        this._elementTop = el;
    },

    setElementMiddle: function(el) {
        this._elementMiddle = el;
    },

    setElementEnd: function(el) {
        this._elementEnd = el;
    },

    setWidth: function(w) {
        if (w != this._width) {
            
            MT.cssTransform(this.elementMiddle, {
                scale: [(w - this.options.endSize * 2), 1]
            });

            MT.cssTransform(this.elementEnd, {
                translate: [(w - this.options.endSize), 1]
            });
//            if (!MT.supportsTranslate3d()) {
//                this.elementMiddle.style.webkitTransform = "translate(0,0) scale(" + (w - this.options.endSize * 2) + ",1)";
//                this.elementEnd.style.webkitTransform = "translate(" + (w - this.options.endSize) + "px,0)";
//            } else {
//                this.elementMiddle.style.webkitTransform = "translate3d(0,0,0) scale(" + (w - this.options.endSize * 2) + ",1)";
//                this.elementEnd.style.webkitTransform = "translate3d(" + (w - this.options.endSize) + "px,0,0)";
//            }

            this._width = w;
        }

        return this;
    },

    getWidth: function() {
        if (typeof this._width == 'undefined') {
            this._width = 0;
        }

        return this._width;
    },

    setHeight: function(h) {
        if (h != this._height) {
            MT.cssTransform(this.elementMiddle, {
                scale: [1, (h - this.options.endSize * 2)]
            });

            MT.cssTransform(this.elementEnd, {
                translate: [0, (h - this.options.endSize)]
            });

//            if (!MT.supportsTranslate3d()) {
//                this.elementMiddle.style.webkitTransform = "translate(0,0) scale(1," + (h - this.options.endSize * 2) + ")";
//                this.elementEnd.style.webkitTransform = "translate(0," + (h - this.options.endSize) + "px)";
//            } else {
//                this.elementMiddle.style.webkitTransform = "translate3d(0,0,0) scale(1," + (h - this.options.endSize * 2) + ")";
//                this.elementEnd.style.webkitTransform = "translate3d(0," + (h - this.options.endSize) + "px,0)";
//            }

            this._height = h;
        }

        return this;
    },

    getHeight: function() {
        if (typeof this._height == 'undefined') {
            this._height = 0;
        }

        return this._height;
    },

    setIsVisible: function(isVisible) {
        this.element.style.opacity = (isVisible) ? 1 : 0;
        this._isVisible = isVisible;

        return this;
    },

    getIsVisible: function(isVisible) {
        if (typeof this._isVisible == 'undefined') {
            this._isVisible = false;
        }

        return this._isVisible;
    }
});

})();
