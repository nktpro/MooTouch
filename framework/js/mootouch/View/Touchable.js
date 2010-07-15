(function(){

var MT = Namespace.use("MooTouch");

new Namespace("MooTouch.View.Touchable", {
    
    Extends: "MooTouch.Core.Element",

    Binds: ['onTouchStart', 'onTouchMove', 'onTouchEnd'],

    options: {
//      onTouchStart: function(event) {},
//      onTouchMove: function(event) {},
//      onTouchEnd: function(event) {},
        enabled: true
    },

    initialize: function(){
        this.parent.apply(this, arguments);

        if (this.options.enabled)
            this.enable();

        return this;
    },

    enable: function() {
        this.element.addEvent(MT.EVENT_TOUCHSTART, this.onTouchStart);
    },

    disable: function() {
        this.element.removeEvent(MT.EVENT_TOUCHSTART, this.onTouchStart);
    },

    _startMonitoring: function() {
        this.element.addEvent(MT.EVENT_TOUCHMOVE, this.onTouchMove);
        this.element.addEvent(MT.EVENT_TOUCHEND, this.onTouchEnd);
    },

    _endMonitoring: function() {
        this.element.removeEvent(MT.EVENT_TOUCHMOVE, this.onTouchMove);
        this.element.removeEvent(MT.EVENT_TOUCHEND, this.onTouchEnd);
    },

    onTouchStart: function(e) {
        this.fireEvent('touchStart', [e]);
    },

    onTouchMove: function(e) {
        this.fireEvent('touchMove', [e]);
    },

    onTouchEnd: function(e) {
        this.fireEvent('touchEnd', [e]);
    }
});

})();
