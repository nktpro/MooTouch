(function(){

new Namespace('MooTouch.View.Container', {

    Extends: 'MooTouch.Core.Element',

    options: {
        itemsSelector: '>',
        activeItemClassName: 'active',
        defaultActiveItem: null
    },

    _items: null,

    _activeItem: null,

    initialize: function(){
        this.parent.apply(this, arguments);

        var activeItem = this._getDefaultActiveItem();

        this.getItems().each(function(item) {
            if (item.hasClass(this.options.activeItemClassName)) {
                activeItem = item;
                item.removeClass(this.options.activeItemClassName);
            }
        }, this);

        if (activeItem)
            this.setActive(activeItem);

        return this;
    },

    _getDefaultActiveItem: function() {
        var activeItem = null;

        if (typeOf(this.options.defaultActiveItem) == 'number')
            activeItem = (this.getItems().length > 0) ? this.getItems()[0] : null;
        else if (typeOf(this.options.defaultActiveItem) == 'string')
            activeItem = $(this.options.defaultActiveItem);

        return activeItem;
    },

    getItems: function() {
        if (!this._items)
            this._items = this.element.getElements(this.options.itemsSelector);

        return this._items;
    },

    hasItem: function(item) {
        return this.getItems().contains($(item));
    },

    setActive: function(item) {
        item = $(item);

        if (item == null)
            item = this._getDefaultActiveItem();

        var currentActiveItem = this.getActive();

        if (item != currentActiveItem) {

            this.fireEvent('activeChange', [item, currentActiveItem], function() {
                this._activeItem = item;
                
                if (currentActiveItem != null) {
                    this.fireEvent('itemBecomeInactive', [currentActiveItem], function() {
                        currentActiveItem.removeClass(this.options.activeItemClassName);
                    }, true);
                }

                if (item != null) {
                    this.fireEvent('itemBecomeActive', [item], function() {
                        item.addClass(this.options.activeItemClassName);
                    }, true);
                }
            }, true);
        }

        return this;
    },

    getActive: function() {
        return this._activeItem;
    }
});

})();
