(function(){

var MT = Namespace.use("MooTouch");
var MTC = Namespace.use("MooTouch.Core");

new Namespace("MooTouch.View.Tappable", {

    Requires: "MooTouch.Core.Point",

    Extends: "MooTouch.View.Touchable",

    Binds: ['_onPress', '_onTouchAndHold'],

    options: {
//      onTap: $empty,
//      onPress: $empty,
//      onTouchAndHold: $empty,
        moveThreshold: {
            x: 10,
            y: 10
        },
        timeBeforePress: 0,
        timeBeforeTouchAndHold: 1500,
        touchAndHoldable: false,
        fireClickEventOnTap: true
    },

    initialize: function(){
        this.parent.apply(this, arguments);

        if (!MT.isTouchDevice)
            this.element.addEvent('click', function(e) {
                if (!e.event.isManufactured) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

        this.addEvent('press', this._onPress);
        this.addEvent('touchAndHold', this._onTouchAndHold);

        return this;
    },

    _endMonitoring: function(e) {
        this.parent.apply(this, arguments);

        if (this._touchAndHoldTimer)
            clearTimeout(this._touchAndHoldTimer);
    },

    _cleanUpPressEvent: function(e) {
        if (this._pressEventTimer)
            clearTimeout(this._pressEventTimer);

        if (this._isPressEventFired)
            this.fireEvent('release', e);
    },

    _onPress: function() {
        this._isPressEventFired = true;
    },

    _onTouchAndHold: function() {
        this._isTouchAndHold = true;
    },

    onTouchStart: function(e) {
        e.preventDefault();

        this._startPoint = MTC.Point.fromEvent(e);
        this._startTime = Date.now();
        this._isMoved = false;
        this._isPressEventFired = false;
        this._isTouchAndHold = false;

        this._pressEventTimer = function() {
            this.fireEvent('press', e);
        }.delay(this.options.timeBeforePress, this);

        if (this.options.touchAndHoldable)
            this._touchAndHoldTimer = function() {
                this.fireEvent('touchAndHold', e);
            }.delay(this.options.timeBeforeTouchAndHold, this);

        this._startMonitoring();
    },

    onTouchMove: function(e) {
        e.preventDefault();

        this._newPoint = MTC.Point.fromEvent(e);

        if (!this._newPoint.isWithin(this._startPoint, this.options.moveThreshold)) {
            this._cleanUpPressEvent(e);
            this._endMonitoring(e);
        }
    },

    onTouchEnd: function(e) {
        this._cleanUpPressEvent(e);
        this._endMonitoring(e);

        if (!this._isTouchAndHold)
            this.fireTapEvent(e);
    },

    fireTapEvent: function(e) {
        this.fireEvent('tap', e, function() {
            if (this.options.fireClickEventOnTap)
                this.fireClickEvent(e);
        });
    },

    fireClickEvent: function(e) {
        var clickEvent = MT.createMouseEvent('click', e);
        return (e.changedTouches ? e.changedTouches[0] : e).target.dispatchEvent(clickEvent);
    }
}); // End Class


})();