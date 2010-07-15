(function(){

var MVC = Namespace.use('MooTouch.View.Component');

new Namespace('MooTouch.View.Component.ScrollPaginatedListView', {

    Requires: 'MooTouch.View.Component.PaginatedListView',

    Extends: 'MooTouch.View.Component.ScrollView',

    Binds: ['onListViewBeforeRender', 'onListViewItemsRender', 'onListViewItemsDestroy', 'onListViewAfterRender'],
    
    Exposes: ['listView'],

    initialize: function() {
        this.parent.apply(this, arguments);

        if (this.listView) {
            this.listView.list.addEvent('beforeRender', this.onListViewBeforeRender);
            this.listView.list.addEvent('itemsRender', this.onListViewItemsRender);
            this.listView.list.addEvent('itemsDestroy', this.onListViewItemsDestroy);
            this.listView.list.addEvent('afterRender', this.onListViewAfterRender);
        }

        return this;
    },

    onListViewAfterRender: function(page, position) {
        if (!position)
            this.scrollToTop();
    },

    onListViewBeforeRender: function() {
        if (this.listView.list.element.hasClass('loading')) {
            this.scrollToTop();
        }
    },

    onListViewItemsRender: function(items, position) {
        if (position == 'top') {
            var newOffset = this.scroller.offset.copy();

            newOffset.y -= this._measureItemsTotalHeight(items);

            this.scroller.offset = newOffset;
        }
    },

    onListViewItemsDestroy: function(items, position) {
        if (position == 'top') {
            var newOffset = this.scroller.offset.copy();

            newOffset.y += this._measureItemsTotalHeight(items);

            this.scroller.offset = newOffset;
        }
    },

    _measureItemsTotalHeight: function(items) {
        var totalHeight = 0;

        if (items.length > 1) {
            var lastItemCords = items.getLast().getCoordinates();
            totalHeight = lastItemCords.top - items[0].getOffsets().y + lastItemCords.height;
        }

        return totalHeight;
    },

    setListView: function(listView) {
        if (!instanceOf(listView, MVC.PaginatedListView))
            throw new Error("listView must be an instance of MooTouch.View.Component.PaginatedListView");

        this._listView = listView;
    },

    getListView: function() {
        return this._listView;
    }
});

})();
