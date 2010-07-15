(function(){

new Namespace("MooTouch.View.Component.TappableElement", {

    Extends: "MooTouch.View.Tappable",

    options: {
        disabledClassName: 'disabled',
        pressedClassName: 'pressed',
        moveThreshold: {
            x: 30,
            y: 20
        }
    },

    initialize: function() {
        this.parent.apply(this, arguments);

        this.addEvent('press', this.becomePressed);
        this.addEvent('release', this.becomeReleased);

        return this;
    },

    becomePressed: function() {
        if (this.element.disabled !== true && !this.element.hasClass(this.options.disabledClassName))
            this.element.addClass(this.options.pressedClassName);
    },

    becomeReleased: function() {
        this.element.removeClass(this.options.pressedClassName);
    },

    disable: function() {
        this.parent.apply(this, arguments);
        this.element.addClass(this.options.disabledClassName);
    },

    enable: function() {
        this.parent.apply(this, arguments);
        this.element.removeClass(this.options.disabledClassName);
    }
});

})();
