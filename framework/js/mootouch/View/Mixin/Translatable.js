(function(){

var MT = Namespace.use("MooTouch");
var MTC = Namespace.use("MooTouch.Core");

new Namespace("MooTouch.View.Mixin.Translatable", {
    Requires: "MooTouch.Core.Offset",
    
    Exposes: [
        'offset'
    ],

    getOffset: function() {
        if (!this._offset)
            this._offset = new MTC.Offset();

        return this._offset;
    },

    setOffset: function(p) {
        this._offset = p;

        MT.cssTransform(this.element, { translate: [p.x, p.y] });

//        if (MT.supportsTranslate3d())
//            this.element.style.webkitTransform = 'translate3d('+p.x+'px, '+p.y+'px, 0)';
//        else
//            this.element.style.webkitTransform = 'translate('+p.x+'px, '+p.y+'px)';

        return this;
    }
//
//    setTransitionDuration: function(duration) {
//        if(!duration)
//            duration = '0';
//
//        this.element.style.webkitTransitionDuration = duration;
//        this._transitionDuration = duration;
//
//        return this;
//    },
//
//    getTransitionDuration: function() {
//        if (!$define(this._transitionDuration))
//            this._transitionDuration = '0';
//
//        return this._transitionDuration;
//    }
}); // End class

})();
