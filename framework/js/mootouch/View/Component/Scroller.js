(function(){

var MT  = Namespace.use('MooTouch');
var MTC = Namespace.use('MooTouch.Core');

new Namespace('MooTouch.View.Component.Scroller', {

    Requires: ['MooTouch.Core.Point', 'MooTouch.Core.Offset'],

    Extends: 'MooTouch.View.Draggable',

    Binds: ['onOrientationChange'],

    options: {
//      onScrollStart: function(event){},
//      onScroll: function(position){},
//      onScrollEnd: function(){},
//      onDecelerationAnimationStart: function(){},
//      onDecelerationAnimationEnd: function(){},
//      onDecelerationVelocityChange: function(){},
        outOfBoundRestrictFactor: 0.5,
        momentumEnabled: true,
        acceleration: 10,
        decelerationFactor: 0.965,
        animationFrameRate: 10,
        maxTrackingTime: 350,
        outOfBoundDeceleration: 0.03,
        snappingBackAcceleration: 0.08,
        minVelocityForDeceleration: 1,
        minVelocityForAnimation: 0.01,
        axis: 'y'
    },

    initialize: function() {
        this.parent.apply(this, arguments);

        window.addEvent(Browser.Events.ORIENTATION_CHANGE, this.onOrientationChange);

        this.addEvent('dragStart', function() {
            this.fireEvent('scrollStart', Array.from(arguments));
        }.bind(this));

        this.refresh();

        return this;
    },

    setOffset: function() {
        this.parent.apply(this, arguments);
        
        this.fireEvent('scroll', [this.offset]);
    },

    refresh: function() {
        this.parent.apply(this, arguments);

        return this;
    },

    onOrientationChange: function() {
        (function() {
            this.refresh();
            this.snapToBounds();
        }).delay(1, this);
    },

    onTouchStart: function(e) {
        if (this.parent.apply(this, arguments) !== true)
            return;

        this.stopDecelerationAnimation();
        this.snapToBounds();

        this.startTime = e.timeStamp;
        this.startTimeOffset = this.offset.copy();
    },

    onTouchMove: function(e) {
        if (this.parent.apply(this, arguments) !== true)
            return;

        this.lastEventTime = e.timeStamp;

        if (this.lastEventTime - this.startTime > this.options.maxTrackingTime) {
            this.startTime = this.lastEventTime;
            this.startTimeOffset = this.offset.copy();
        }
    },

    onTouchEnd: function(e) {
        if (this.parent.apply(this, arguments) !== true)
            return;

        if (this.options.momentumEnabled && e.timeStamp - this.lastEventTime <= this.options.maxTrackingTime) {
            this.startDecelerationAnimation(e);
        }

        if (!this._isDecelerating) {
            this.snapToBounds(true);
            this.fireEvent('scrollEnd');
        }
    },

    snapToBounds: function() {
        var validOffset = this.offset.copy();

        if (this.offsetBoundary != null)
            this.offsetBoundary.restrict(validOffset);

        if (!this.offset.equals(validOffset))
            this.offset = validOffset;
    },

    startDecelerationAnimation: function(e) {
        var a = new MTC.Offset(this.offset.x - this.startTimeOffset.x,
            this.offset.y - this.startTimeOffset.y);

        var b = (e.timeStamp - this.startTime) / this.options.acceleration;

        this.decelerationVelocity = {x:a.x / b, y:a.y / b};

        var c = this.options.minVelocityForDeceleration;

        if (Math.abs(this.decelerationVelocity.x) > c || Math.abs(this.decelerationVelocity.y) > c) {
            this._isDecelerating = true;
            this._decelerationTimer = this.stepThroughDecelerationAnimation.delay(this.options.animationFrameRate, this);

            this._lastFrameTime = Date.now();
        }

        this.fireEvent('decelerationAnimationStart');
    },

    stopDecelerationAnimation: function() {
        clearTimeout(this._decelerationTimer);

        if (this._isDecelerating) {
            this._isDecelerating = false;
            this.fireEvent('decelerationAnimationEnd');
            this.fireEvent('scrollEnd');
        }
    },

    stepThroughDecelerationAnimation: function(f) {
        if (!this._isDecelerating)
            return;

        var currentTime = Date.now();
        var timeDiff = currentTime - this._lastFrameTime;
        var l = f ? 0 : (Math.round(timeDiff / this.options.animationFrameRate) - 1);
        var currentOffset = this.offset;

        for (var j = 0; j < l; j++) {
            this.stepThroughDecelerationAnimation(true);
        }

        var newOffset = currentOffset.copy();
        newOffset.x += this.decelerationVelocity.x;
        newOffset.y += this.decelerationVelocity.y;

        if (f)
            currentOffset.copyFrom(newOffset);
        else
            this.offset = newOffset;

        this.decelerationVelocity.x *= this.options.decelerationFactor;
        this.decelerationVelocity.y *= this.options.decelerationFactor;

        if(!f)
            this.fireEvent('decelerationVelocityChange', [this.decelerationVelocity]);

        if (!f && Math.abs(this.decelerationVelocity.x) <= this.options.minVelocityForAnimation
            && Math.abs(this.decelerationVelocity.y) <= this.options.minVelocityForAnimation) {
            this.stopDecelerationAnimation();
            return;
        }

        if (!f)
            this._decelerationTimer = this.stepThroughDecelerationAnimation.delay(this.options.animationFrameRate, this);

        var distances = this.offsetBoundary.getOutOfBoundDistance(newOffset);

        ['x', 'y'].each(function(a) {
            if (distances[a] != 0) {
                if (distances[a] * this.decelerationVelocity[a] <= 0)
                    this.decelerationVelocity[a] += distances[a] * this.options.outOfBoundDeceleration;
                else
                    this.decelerationVelocity[a] = distances[a] * this.options.snappingBackAcceleration;
            }
        }, this);

        if (!f)
            this._lastFrameTime = currentTime;
    }
}); // End Class

})();