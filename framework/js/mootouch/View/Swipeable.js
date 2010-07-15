(function(){

var MTC = Namespace.use("MooTouch.Core");
var MTV = Namespace.use("MooTouch.View");

new Namespace("MooTouch.View.Swipeable", {

    Extends: "MooTouch.View.Touchable",

    Implements: "MooTouch.Core.ObservableOptions",

    options: {
//      onSwipe: $empty,
        minDistance: 80,
        maxOffset: 50,
        maxTime: 600,
        axis: null // No constraint
    },

    initialize: function() {
        this.addEvent('optionChange', this.onOptionChange);
        
        this.parent.apply(this, arguments);
    },

    onOptionChange: function(name, value) {
        if (name == 'axis') {
            switch (value) {
                case 'x':
                    this.options.horizontalEnabled = true;
                    this.options.verticalEnabled = false;
                break;

                case 'y':
                    this.options.horizontalEnabled = false;
                    this.options.verticalEnabled = true;
                    break;
                    
                default:
                    this.options.horizontalEnabled = true;
                    this.options.verticalEnabled = true;
            }
        }
    },

    onTouchStart: function(e) {
        this.parent.apply(this, arguments);

        e.preventDefault();
        
        this._startTime = Date.now();
        this._isMoved = false;
        this._isHorizontalSwipe = false;
        this._isVerticalSwipe = false;

        this._startPoint = MTC.Point.fromEvent(e);

        this._offsetThreshold = {};

        if (this.options.horizontalEnabled) {
            this._isHorizontalSwipe = true;

            this._offsetThreshold.horizontal = {
                max: this._startPoint.y + this.options.maxOffset,
                min: this._startPoint.y - this.options.maxOffset
            };
        }

        if (this.options.verticalEnabled) {
            this._isVerticalSwipe = true;

            this._offsetThreshold.vertical = {
                max: this._startPoint.x + this.options.maxOffset,
                min: this._startPoint.x - this.options.maxOffset
            };
        }

        this._startMonitoring();
    },

    onTouchMove: function(e) {
        this.parent.apply(this, arguments);

        e.preventDefault();

        if (!this._isMoved)
            this._isMoved = true;

        this._newPoint = MTC.Point.fromEvent(e);

        if (this.options.horizontalEnabled && this._isHorizontalSwipe) {
            if(this._newPoint.y > this._offsetThreshold.horizontal.max || this._newPoint.y < this._offsetThreshold.horizontal.min) {
                this._isHorizontalSwipe = false;
            }
        }

        if (this.options.verticalEnabled && this._isVerticalSwipe) {
            if(this._newPoint.x > this._offsetThreshold.vertical.max || this._newPoint.x < this._offsetThreshold.vertical.min) {
                this._isVerticalSwipe = false;
            }
        }

        if (!this._isHorizontalSwipe && !this._isVerticalSwipe)
            this._endMonitoring();
    },

    onTouchEnd: function(e) {
        this.parent.apply(this, arguments);

        e.preventDefault();
        
        this._endMonitoring();

        if(!this._isMoved)
            return;

        var timeDuration = Date.now() - this._startTime;

        // Total time more than threshold, it's not a swipe
        if(timeDuration > this.options.maxTime) {
            return;
        }

        if (this._isHorizontalSwipe) {
            var horizontalDistance = this._startPoint.x - this._newPoint.x;

            if (horizontalDistance > this.options.minDistance) {
                this.fireSwipeEvent([e, MTV.Swipeable.LEFT, horizontalDistance, timeDuration]);
            } else if (horizontalDistance < -this.options.minDistance) {
                this.fireSwipeEvent([e, MTV.Swipeable.RIGHT, -horizontalDistance, timeDuration]);
            }
        }

        if (this._isVerticalSwipe) {
            var verticalDistance = this._startPoint.y - this._newPoint.y;

            if (verticalDistance > this.options.minDistance) {
                this.fireSwipeEvent([e, MTV.Swipeable.UP, verticalDistance, timeDuration]);
            } else if (verticalDistance < -this.options.minDistance) {
                this.fireSwipeEvent([e, MTV.Swipeable.DOWN, -verticalDistance, timeDuration]);
            }
        }
    },

    fireSwipeEvent: function(info) {
        this.fireEvent('swipe', info);
    }
    
}, function(Cls) {
    Cls.extend({
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right'
    });
}); // End Class


})();
