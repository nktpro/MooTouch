(function(){

var MTC = Namespace.use("MooTouch.Core");

new Namespace("MooTouch.Core.Boundary", {
    
    Requires: "MooTouch.Core.Offset",
    
    initialize: function(x1, x2, y1, y2) {
        if (typeOf(x1) == 'object') {
            x2 = x1.x2;
            y1 = x1.y1;
            y2 = x1.y2;
            x1 = x1.x1;
        }
        
        this.x1 = (x1 != null && !isNaN(x1)) ? x1 : 0;
        this.y1 = (y1 != null && !isNaN(y1)) ? y1 : 0;
        this.x2 = (x2 != null && !isNaN(x2)) ? x2 : 0;
        this.y2 = (y2 != null && !isNaN(y2)) ? y2 : 0;

        return this;
    },

    contains: function(p) {
        return (p.x > this.x1 && p.x < this.x2 && p.y > this.y1 && p.y < this.y2);
    },

    getOutOfBoundDistance: function(p) {
        var d = new MTC.Offset();

        if (p.x <= this.x1)
            d.x = this.x1 - p.x;
        else if (p.x >= this.x2)
            d.x = this.x2 - p.x;

        if (p.y <= this.y1)
            d.y = this.y1 - p.y;
        else if (p.y >= this.y2)
            d.y = this.y2 - p.y;

        return d;
    },

    restrict: function(b, factor) {
        if (!factor)
            factor = 1;
        
        if (b.x <= this.x1)
            b.x -= (b.x - this.x1) * factor;
        else if (b.x >= this.x2)
            b.x -= (b.x - this.x2) * factor;

        if (b.y <= this.y1)
            b.y -= (b.y - this.y1) * factor;
        else if (b.y >= this.y2)
            b.y -= (b.y - this.y2) * factor;
    },

    copy: function() {
        return new this.constructor(this.x1, this.x2, this.y1, this.y2);
    },

    toString: function() {
        return "Boundary[" + this.x1 + "," + this.x2 + "|" + this.y1 + "," + this.y2 + "]";
    }
}, function(Cls) {

    Cls.extend({
        fromElement: function(el, relative) {
            relative = (typeof relative != 'undefined') ? relative : null;

            var p = el.getCoordinates((relative) ? relative : el.getParent());

            return new Cls(
                p.left, p.left + p.width, p.top, p.top + p.height);
        }
    });
    
});


})();