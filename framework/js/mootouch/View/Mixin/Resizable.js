(function(){

new Namespace("MooTouch.View.Mixin.Resizable", {
    Exposes: ['width', 'height'],

    setWidth: function(w) {
        if (w != this._width) {
            this.element.style.width = w;
            this._width = w;
        }

        return this;
    },

    getWidth: function() {
        if (typeof this._width == 'undefined') {
            this._width = 0;
        }

        return this._width;
    },

    setHeight: function(h) {
        if (h != this._height) {
            this.element.style.height = h;
            this._height = h;
        }

        return this;
    },

    getHeight: function() {
        if (typeof this._height == 'undefined') {
            this._height = 0;
        }

        return this._height;
    }
}); // End Class

})();
