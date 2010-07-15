(function(){

var MTC = Namespace.use('MooTouch.Core');
var MTV = Namespace.use('MooTouch.View');
var MTVC = Namespace.use('MooTouch.View.Component');

new Namespace('MooTouch.View.Component.ScrollView', {

    Requires: ['MooTouch.View.Component.Scroller', 'MooTouch.View.Component.ScrollIndicator'],

    Extends: 'MooTouch.Core.Element',

    Implements: ['MooTouch.View.Mixin.Translatable', 'MooTouch.Core.ObservableOptions'],

    Binds: ['onScroll', 'onScrollStart', 'onDecelerationVelocityChange', 'onScrollEnd', 'onScrollerAxisOptionChange'],

    Exposes: [
        'scroller',
        'horizontalScrollIndicator',
        'verticalScrollIndicator'
    ],

    options: {
        showHorizontalIndicator: true,
        showVerticalIndicator: true,
        minIndicatorLength: 34,
        minVelocityToHideScrollIndicators: 0.05,
        scroller: {
            element: null,
            options: {}
        },
        horizontalIndicator: {
            element: null,
            options: {
                type: 'horizontal'
            }
        },
        verticalIndicator: {
            element: null,
            options: {
                type: 'vertical'
            }
        }
    },

    _initTimeOptions: null,

    initialize: function(){
        this.parent.apply(this, arguments);

        this._initTimeOptions = Object.merge({}, this.options);

        if (this.scroller.options.horizontalEnabled == false)
            this.setOption('showHorizontalIndicator', false);

        if (this.scroller.options.verticalEnabled == false)
            this.setOption('showVerticalIndicator', false);

        return this;
    },

    setScroller: function(scroller) {
        if(!(scroller instanceof MTVC.Scroller))
            throw new Error('scroller must be an instance of MooTouch.View.Component.Scroller');

        var eventBindings = {
            scroll: this.onScroll,
            scrollStart: this.onScrollStart,
            decelerationVelocityChange: this.onDecelerationVelocityChange,
            scrollEnd: this.onScrollEnd,
            'optionChange:horizontalEnabled': this.onScrollerAxisOptionChange,
            'optionChange:verticalEnabled': this.onScrollerAxisOptionChange
        };

        if (this._scroller) {
            this.hideScrollIndicators();
            this._scroller.removeEvents(eventBindings);
        }
        
        this._scroller = scroller;
        this._scroller.addEvents(eventBindings)
                      .setOption('containment', this.element);
        
        return this;
    },

    setHorizontalScrollIndicator: function(indicator) {
        if(!(indicator instanceof MTVC.ScrollIndicator))
            throw new Error('indicator must be an instance of MooTouch.View.Component.ScrollIndicator');

        this._horizontalScrollIndicator = indicator;
    },

    setVerticalScrollIndicator: function(indicator) {
        if(!(indicator instanceof MTVC.ScrollIndicator))
            throw new Error('indicator must be an instance of MooTouch.View.Component.ScrollIndicator');

        this._verticalScrollIndicator = indicator;
    },

    getScroller: function() {
        if (!this._scroller) {
            if (this.options.scroller.element == null)
                this.options.scroller.element = this.element.getElement(':first-child');

            this.setScroller(new MTVC.Scroller(this.options.scroller));
        }

        return this._scroller;
    },

    getHorizontalScrollIndicator: function() {
        if (!this._horizontalScrollIndicator) {
            this._horizontalScrollIndicator = new MTVC.ScrollIndicator(this.options.horizontalIndicator);
            $(this._horizontalScrollIndicator).inject(this.element);
        }

        return this._horizontalScrollIndicator;
    },

    getVerticalScrollIndicator: function() {
        if (!this._verticalScrollIndicator) {
            this._verticalScrollIndicator = new MTVC.ScrollIndicator(this.options.verticalIndicator);
            $(this._verticalScrollIndicator).inject(this.element);
        }

        return this._verticalScrollIndicator;
    },

    onScrollerAxisOptionChange: function(value, name) {
        if (name == 'horizontalEnabled') {
            if (this._initTimeOptions.showHorizontalIndicator == true)
                this.setOption('showHorizontalIndicator', value);

        } else if (name == 'verticalEnabled') {
            if (this._initTimeOptions.showVerticalIndicator == true)
                this.setOption('showVerticalIndicator', value);
        }
    },

    onScroll: function(p) {
        if (this.scroller.offsetBoundary == null)
            return;
        
        var endSize = (this.options.showHorizontalIndicator) ? this.horizontalScrollIndicator.options.endSize * 2 : 1,
        thickness = this.verticalScrollIndicator.options.thickness,

        scrollerWidth = this.scroller.elementCoordinates.width,
        scrollerHeight = this.scroller.elementCoordinates.height,
        scrollerViewableWidth = this.scroller.boundingElementSize.x,
        scrollerViewableHeight = this.scroller.boundingElementSize.y,
        scrollerMinOffsetX = this.scroller.offsetBoundary.x1,
        scrollerMinOffsetY = this.scroller.offsetBoundary.y1;

        if (this.options.showVerticalIndicator) {
            (function() {
                var height = Math.max(
                    this.options.minIndicatorLength,
                    Math.round((scrollerViewableHeight / scrollerHeight) * (scrollerViewableHeight - endSize)));

                height = Math.min(scrollerViewableHeight, height);

                var x = scrollerViewableWidth - thickness - 1;

                var y = (p.y / scrollerMinOffsetY) * (scrollerViewableHeight - endSize - height);

                if (p.y > 0) {
                    height = Math.round(Math.max(height - p.y, thickness));
                    y = 1;
                } else {
                    if (p.y < scrollerMinOffsetY) {
                        height = Math.round(Math.max(
                            height - scrollerMinOffsetY + p.y,
                            thickness));

                        y = scrollerViewableHeight - height - endSize;
                    }
                }

                this.verticalScrollIndicator.offset = new MTC.Offset(x, y);
                this.verticalScrollIndicator.height = height;
            }).bind(this)();
        }

        if (this.options.showHorizontalIndicator) {
            (function() {
                var width = Math.max(
                    this.options.minIndicatorLength,
                    Math.round((scrollerViewableWidth / scrollerWidth) * (scrollerViewableWidth - endSize)));

                width = Math.min(scrollerViewableWidth, width);

                var y = scrollerViewableHeight - thickness - 1;

                var x = (p.x / scrollerMinOffsetX) * (scrollerViewableWidth - endSize - width);

                if (p.x > 0) {
                    width = Math.round(Math.max(width - p.x, thickness));
                    x = 1;
                } else {
                    if (p.x < scrollerMinOffsetX) {
                        width = Math.round(Math.max(
                            width - scrollerMinOffsetX + p.x,
                            thickness));

                        x = scrollerViewableWidth - width - endSize;
                    }
                }

                this.horizontalScrollIndicator.offset = new MTC.Offset(x, y);
                this.horizontalScrollIndicator.width = width;
            }).bind(this)();
        }
    },

    onScrollStart: function() {
        clearTimeout(this._hideScrollIndicatorsTimer);
        this.showScrollIndicators();
    },

    onScrollEnd: function() {
        this._hideScrollIndicatorsTimer = this.hideScrollIndicators.delay(200, this);
    },

    onDecelerationVelocityChange: function(v) {
        if (Math.abs(v.y) < this.options.minVelocityToHideScrollIndicators &&
            Math.abs(v.x) < this.options.minVelocityToHideScrollIndicators) {
            this.hideScrollIndicators();
        }
    },

    showScrollIndicators: function() {
        if (this.options.showVerticalIndicator)
            this.verticalScrollIndicator.isVisible = true;

        if (this.options.showHorizontalIndicator)
            this.horizontalScrollIndicator.isVisible = true;
    },

    hideScrollIndicators: function() {
        if (this.options.showVerticalIndicator)
            this.verticalScrollIndicator.isVisible = false;

        if (this.options.showHorizontalIndicator)
            this.horizontalScrollIndicator.isVisible = false;
    },

    scrollToTop: function() {
        this.scroller.offset = new MTC.Offset(0, 0);
    }
});

})();
