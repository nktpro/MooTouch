(function(){

new Namespace('MooTouch.View.Component.PaginatedList', {

    Extends: 'MooTouch.View.Component.List',

    options: {
        perPageLimit: 20,
        pagesDisplayLimit: 2,
        storeFetchArguments: {}
    },

    Exposes: ['store', 'nextPage', 'previousPage'],

    count: -1,

    rendered: false,

    initialize: function() {
        this.parent.apply(this, arguments);

        this.hasNextPage(true);
    },

    setStoreFetchArguments: function(args) {
        this.options.storeFetchArguments = Object.merge(this.options.storeFetchArguments, args);
    },

    setStore: function(store) {
        this._store = store;
    },

    getStore: function() {
        if (!this._store)
            throw new Error("No data store set for this list");

        return this._store;
    },

    _render: function(page, position, afterRenderFn) {
        var fetchOptions = Object.merge(this.options.storeFetchArguments, {
            offset: (page - 1) * this.options.perPageLimit,
            limit: this.options.perPageLimit
        });

        this.fireEvent('beforeRender', [page, position], function() {
            this.store.fetch(fetchOptions, function(itemsData) {
                this.fireEvent('render', [page, position, itemsData], function() {
                    if (itemsData.length < fetchOptions.limit || (this.count != -1 && (fetchOptions.offset + fetchOptions.limit) == this.count))
                        this.hasNextPage(false);

                    if (typeof position == 'undefined') {
                        this._items.empty();
                        this.element.empty();
                        position = 'bottom';
                    }

                    var items = this._renderItems(itemsData),
                        numDisplayItemsLimit = this.options.pagesDisplayLimit * this.options.perPageLimit,
                        toDestroy = [];

                    if (position == 'top') {
                        var temp = $A(items);

                        for(var i = temp.length-1; i >= 0; i--) {
                            this.element.grab(temp[i], 'top');
                        }

                        this.fireEvent('itemsRender', [temp, 'top']);

                        temp.extend(this._items);

                        toDestroy = temp.splice(numDisplayItemsLimit, temp.length - numDisplayItemsLimit);

                        this.fireEvent('itemsDestroy', [toDestroy, 'bottom']);

                        toDestroy.each(function(el) {
                            el.destroy();
                        });


                        this._items = temp;
                    } else if (position == 'bottom') {
                        this.element.adopt(items);

                        this.fireEvent('itemsRender', [items, 'bottom']);

                        this._items.append(items);

                        toDestroy = this._items.splice(0, this._items.length - numDisplayItemsLimit);

                        this.fireEvent('itemsDestroy', [toDestroy, 'top']);

                        toDestroy.each(function(el) {
                            el.destroy();
                        });

                    }

                    if (afterRenderFn)
                        afterRenderFn();
                }, true);

            }.bind(this));
        }.bind(this));
    },

    render: function(page, forced) {
        if (forced == true || !this.rendered) {
            if (typeof page == 'undefined')
                page = 1;

            this.hasNextPage(true);
//
//            this.store.count(function(count) {
//                this.count = count;
//            }.bind(this));
//
            this._render(page, null, function() {
                this.previousPage = Math.max((page - 1), 0);
                this.nextPage = page + 1;
                this.rendered = true;
            }.bind(this));
        }

        return this;
    },

    renderNextPage: function() {
        if (this.rendered && this.hasNextPage()) {
            this._render(this.nextPage, 'bottom', function() {
                this.nextPage++;
                if (this.nextPage > (this.previousPage + this.options.pagesDisplayLimit + 1))
                    this.previousPage++;
            }.bind(this));
        }

        return this;
    },

    renderPreviousPage: function() {
        if (this.rendered && this.hasPreviousPage()) {
            this._render(this.previousPage, 'top', function() {
                this.previousPage--;
                if (this.previousPage < (this.nextPage - this.options.pagesDisplayLimit - 1))
                    this.nextPage--;

                this.hasNextPage(true);
            }.bind(this));
        }

        return this;
    },

    setNextPage: function(value) {
        this._nextPage = value;
    },

    getNextPage: function() {
        if (typeof this._nextPage == 'undefined')
            this._nextPage = 2;

        return this._nextPage;
    },

    setPreviousPage: function(value) {
        this._previousPage = value;
    },

    getPreviousPage: function() {
        if (typeof this._previousPage == 'undefined')
            this._previousPage = 0;

        return this._previousPage;
    },

    hasNextPage: function(value) {
        if (typeof this._hasNextPage == 'undefined')
            this._hasNextPage = true;

        if (typeof value != 'undefined')
            this._hasNextPage = Boolean(value);

        return this._hasNextPage;
    },

    hasPreviousPage: function() {
        return this.previousPage > 0;
    },

    _renderItems: function(data) {
        return [];
    }
});

})();
