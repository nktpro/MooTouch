(function(){

var MTC = Namespace.use("MooTouch.Core");

new Namespace("MooTouch.Core.Offset", {
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
        return "Offset[" + this.x + "," + this.y + "]";
    },

    equals: function(offset) {
        if(!(offset instanceof MTC.Offset))
            throw new Error('offset must be an instance of MooTouch.Core.Offset');

        return (this.x == offset.x && this.y == offset.y);
    }
}); // End class

})();