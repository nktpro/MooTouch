(function(){

var MT  = Namespace.use("MooTouch");
var MTC = Namespace.use("MooTouch.Core");

new Namespace("MooTouch.View.Draggable", {

    Requires: ["MooTouch.Core.Boundary", "MooTouch.Core.Offset"],

    Extends: "MooTouch.View.Touchable",

    Implements: ["MooTouch.Core.ObservableOptions", "MooTouch.View.Mixin.Translatable"],

    options: {
//      onDragStart: $empty,
//      onDrag: $empty,
//      onDragEnd: $empty,
        outOfBoundRestrictFactor: 1,
        containment: 'parent', // Element, 'parent', null
        axis: null // 'x', 'y', null
    },

    offsetBoundary: null,

    initialize: function() {
        this.addEvent('optionChange', this.onOptionChange);

        this.parent.apply(this, arguments);

        return this;
    },

    refresh: function() {
        this.offsetBoundary = null;

        if (this.options.containment == 'parent') {
            this.boundingElement = this.element.getParent();
        } else if (this.options.containment instanceof Element) {
            this.boundingElement = this.options.containment;
        }

        if (this.boundingElement != null) {
            this.elementCoordinates = this.element.getCoordinates(this.boundingElement);
            this.boundingElementSize = this.boundingElement.getSize();

            var x1 = 0,
                x2 = 0,
                y1 = 0,
                y2 = 0;

            if (this.elementCoordinates.left < 0)
                x2 -= this.elementCoordinates.left;
            else
                x1 -= this.elementCoordinates.left;

            if (this.elementCoordinates.right > this.boundingElementSize.x)
                x1 -= this.elementCoordinates.right - this.boundingElementSize.x;
            else
                x2 -= this.elementCoordinates.right - this.boundingElementSize.x;

            if (this.elementCoordinates.top < 0)
                y2 -= this.elementCoordinates.top;
            else
                y1 -= this.elementCoordinates.top;

            if (this.elementCoordinates.bottom > this.boundingElementSize.y)
                y1 -= this.elementCoordinates.bottom - this.boundingElementSize.y;
            else
                y2 -= this.elementCoordinates.bottom - this.boundingElementSize.y;

            this.offsetBoundary = new MTC.Boundary(x1, x2, y1, y2);
        }

        var currentComputedOffset = MT.getComputedOffset(this.element);

        if(!this.offset.equals(currentComputedOffset))
            this.offset = currentComputedOffset;

        return this;
    },

    onOptionChange: function(name, value) {
        switch (name) {
            case 'containment':
                this.refresh();
                
                break;

            case 'axis':
                if (value == 'x') {
                    this.setOption('horizontalEnabled', true);
                    this.setOption('verticalEnabled', false);
                } else if (value == 'y') {
                    this.setOption('horizontalEnabled', false);
                    this.setOption('verticalEnabled', true);
                } else {
                    this.setOption('horizontalEnabled', true);
                    this.setOption('verticalEnabled', true);
                }
                
                break;
        }
    },

    onTouchStart: function(e) {
        this.parent.apply(this, arguments);

        if (this._isDragging) {
            this.onTouchEnd(e);
        }

        this._isDragging = false;

        if (e.targetTouches && e.targetTouches.length != 1)
            return;

        this.startTouchPoint = MTC.Point.fromEvent(e);
        this.startOffset = this.offset.copy();

        this._startMonitoring();
        
        return true;
    },

    _getNewOffsetFromTouchPoint: function(touchPoint) {
        var xDelta = touchPoint.x - this.startTouchPoint.x,
            yDelta = touchPoint.y - this.startTouchPoint.y;

        var newOffset = this.offset.copy();

        if(xDelta == 0 && yDelta == 0)
            return newOffset;

        if (this.options.horizontalEnabled)
            newOffset.x = this.startOffset.x + xDelta;

        if (this.options.verticalEnabled)
            newOffset.y = this.startOffset.y + yDelta;

        return newOffset;
    },

    onTouchMove: function(e) {
        this.parent.apply(this, arguments);

        if(e.targetTouches && e.targetTouches.length != 1)
            return;

        if (!this._isDragging) {
            this.refresh();
            this._isDragging = true;
            this.fireEvent('dragStart', e);
        } else {
            this.fireEvent('drag', e);
        }

        var touchPoint = MTC.Point.fromEvent(e);
        var newOffset = this._getNewOffsetFromTouchPoint(touchPoint);

        if (this.offsetBoundary != null)
            this.offsetBoundary.restrict(newOffset, this.options.outOfBoundRestrictFactor);

        this.offset = newOffset;

        return true;
    },

    onTouchEnd: function(e) {
        this.parent.apply(this, arguments);
        
        this._endMonitoring(e);

        this._isDragging = false;
        
        this.fireEvent('dragEnd', e);

        return true;
    }
}); // End Class

})();
