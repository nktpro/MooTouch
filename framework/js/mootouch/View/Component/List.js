(function(){

var MV = Namespace.use('MooTouch.View');

new Namespace('MooTouch.View.Component.List', {

    Requires: 'MooTouch.View.Tappable',

    Extends: 'MooTouch.Core.Element',

    options: {
        tappable: {
            timeBeforePress: 200
        },

        onItemPress: function(el) {
            el.addClass('pressed');
        },

        onItemRelease: function(el) {
            el.removeClass.delay(0, el, ['pressed']);
        },

        onItemTap: function(el) {
            el.addClass('pressed');
            el.removeClass.delay(500, el, ['pressed']);
        }
    },

    _items: [],

    initialize: function() {
        this.parent.apply(this, arguments);

        this._tappable = new MV.Tappable(this.element, this.options.tappable);

        var delegateCheck = function(el) {
            return this._items.contains(el);

        }.bind(this);
        var me = this;

        ['press', 'release', 'tap'].each(function(evt) {
            this._tappable
                .delegateEvent(evt, delegateCheck, function() {
                    var args = Array.from(arguments);
                    args.unshift(this);

                    me.fireEvent('item' + evt.capitalize(), args);
                });
        }, this);

        return this;
    },

    getItems: function() {
        return this._items;
    },

    setItems: function(items) {
        this._items = Array.from(items);
    }
}, function(Cls) {
    Cls.extend({
        fromDom: function(dom) {
            dom = $(dom);

            var list = new Cls(dom);
            
            list.setItems(dom.getElements('>'));

            return list;
        }
    });
});

})();
