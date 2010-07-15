(function(){

var MTV = Namespace.use("MooTouch.View");

new Namespace("MooTouch.View.Component.Tabs", {

    Requires: "MooTouch.View.Tappable",

    Extends: "MooTouch.View.Container",

    options: {
        tappable: {
            touchAndHoldable: true,
            timeBeforeTouchAndHold: 400,
            fireClickEventOnTap: false
        },
        defaultActiveItem: 0
    },

    initialize: function() {
        this.parent.apply(this, arguments);

        var tappable = this.tappable = new MTV.Tappable(this.element, this.options.tappable);

        var delegateCheck = function(el) {
            return this.hasItem(el);
        }.bind(this);

        var me = this;

        ['tap', 'touchAndHold'].each(function(eventName) {
            tappable.delegateEvent(eventName, delegateCheck, function(e) {
                var bind = tappable.fireClickEvent.pass([e], tappable);
                me.addEvent('activeChange', bind);
                me.setActive(this);
                me.removeEvent('activeChange', bind);
            });
        }, this);

        return this;
    }
});

})();
