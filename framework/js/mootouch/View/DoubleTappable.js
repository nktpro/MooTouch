(function(){

var MT = Namespace.use("MooTouch");

new Namespace("MooTouch.View.DoubleTappable", {

    Extends: "MooTouch.View.Tappable",

    options: {
//      onDoubleTap: $empty
        timeBeforeSecondTap: 300
    },
    
    _singleTapTimer: null,
    _tapCount: 0,

    initialize: function() {
        this.parent.apply(this, arguments);
        this._tapCount = 0;
    },

    onTouchStart: function(e) {
        this.parent.apply(this, arguments);

        if (this._tapCount == 0) {
            this.parent.apply(this, arguments);
        } else {
            this._secondStartTime = Date.now();

            // Not a single tap, potentially a double tap
            if (this._endTime - this._secondStartTime <= this.options.timeBeforeSecondTap) {
                clearTimeout(this._singleTapTimer);
            }
        }
    },

    _endMonitoring: function() {
        this.parent.apply(this, arguments);
        this._tapCount = 0;
    },

    onTouchEnd: function(e) {
        this.parent.apply(this, arguments);
        
        if (this._tapCount == 0) {
            this._endTime = Date.now();

            this._cleanUpPressEvent(e);

            if (this._isTouchAndHold) {
                this._endMonitoring();
                return;
            }

            this._singleTapTimer = function() {
                this._endMonitoring();
                this.fireTapEvent(e);
            }.delay(this.options.timeBeforeSecondTap, this);

            this._tapCount++;
        } else {
            this._endMonitoring();
            this._secondEndTime = Date.now();

            this.fireDoubleTapEvent(e);
        }
    },

    fireDoubleTapEvent: function(e) {
        this.fireEvent('doubleTap', e);
    }
}); // End Class

})();
