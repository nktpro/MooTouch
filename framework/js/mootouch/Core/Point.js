(function(){

var MTC = Namespace.use("MooTouch.Core");

new Namespace("MooTouch.Core.Point", {
    initialize: function(x, y) {
        this.x = (x != null && !isNaN(x)) ? x : 0;
        this.y = (y != null && !isNaN(y)) ? y : 0;

        return this;
    },

    copy: function() {
        return new this.constructor(this.x, this.y);
    },

    copyFrom: function(p) {
        this.x = p.x;
        this.y = p.y;
    },

    toString: function() {
        return "Point[" + this.x + "," + this.y + "]";
    },

    equals: function(p) {
        if(!(p instanceof this.constructor))
            throw new Error('p must be an instance of MooTouch.Core.Point');

        return (this.x == p.x && this.y == p.y);
    },

    isWithin: function(p, threshold) {
        if(!(p instanceof this.constructor))
            throw new Error('p must be an instance of MooTouch.Core.Point');

        return (this.x <= p.x + threshold.x && this.x >= p.x - threshold.x &&
                this.y <= p.y + threshold.y && this.y >= p.y - threshold.y);
    },

    translate: function(x, y) {
        if (x != null && !isNaN(x))
            this.x += x;

        if (y != null && !isNaN(y))
            this.y += y;
    },

    roundedEquals: function(p) {
        return (Math.round(this.x) == Math.round(p.x) && Math.round(this.y) == Math.round(p.y));
    }
    
}, function(Cls) {
    Cls.extend({
        fromEvent: function(e) {
            var a = (e.touches && e.touches.length > 0) ? e.touches[0] : e;
            return new MTC.Point(a.screenX, a.screenY);
        }
    });
});


})();