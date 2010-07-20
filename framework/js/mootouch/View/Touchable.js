(function(){

var MT = Namespace.use("MooTouch");

new Namespace("MooTouch.View.Touchable", {
    
    Extends: "MooTouch.Core.Element",

    Binds: ['onTouchStart', 'onTouchMove', 'onTouchEnd'],

    options: {
        enabled: true
    },

    initialize: function(){
        this.parent.apply(this, arguments);

        if (this.options.enabled)
            this.enable();

        return this;
    },

    enable: function() {
        this.element.addEvent(Browser.Events.TOUCH_START, this.onTouchStart);
    },

    disable: function() {
        this.element.removeEvent(Browser.Events.TOUCH_START, this.onTouchStart);
    },

    _startMonitoring: function() {
        this.element.addEvent(Browser.Events.TOUCH_MOVE, this.onTouchMove);
        this.element.addEvent(Browser.Events.TOUCH_END, this.onTouchEnd);
    },

    _endMonitoring: function() {
        this.element.removeEvent(Browser.Events.TOUCH_MOVE, this.onTouchMove);
        this.element.removeEvent(Browser.Events.TOUCH_END, this.onTouchEnd);
    },

    onTouchStart: function(e) {},

    onTouchMove: function(e) {},

    onTouchEnd: function(e) {}
});

})();
