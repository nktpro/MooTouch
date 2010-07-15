(function(){

var MVC = Namespace.use('MooTouch.View.Component');

new Namespace('MooTouch.View.Component.PaginatedListView', {

    Requires: ['MooTouch.View.Component.PaginatedList', 'MooTouch.View.Component.TappableElement', 'MooTouch.View.Component.Scroller'],

    Extends: 'MooTouch.Core.Element',

    Binds: ['onListAfterRender', 'renderNextPage', 'renderPreviousPage', 'render'],

    Exposes: ['list', 'nextNavigator', 'previousNavigator'],

    options: {
        list: {
            element: '',
            options: {
                
            }
        },

        nextNavigator: '',
        previousNavigator: '',
        navigatorDisabledClassName: 'disabled',
        navigatorLoadingClassName: 'loading'
    },

    _nextNavigatorActivated: true,
    _previousNavigatorActivated: true,

    initialize: function() {
        this.parent.apply(this, arguments);
        
        this.list.addEvent('afterRender', this.onListAfterRender);

        return this;
    },

    onListAfterRender: function() {
        this.list.element.removeClass('loading');
        this.nextNavigator.element.removeClass(this.options.navigatorLoadingClassName);
        this.previousNavigator.element.removeClass(this.options.navigatorLoadingClassName);

        if (this.list.hasNextPage())
            this.activateNextNavigator();
        else
            this.disableNextNavigator();

        if (this.list.hasPreviousPage())
            this.activatePreviousNavigator();
        else
            this.disablePreviousNavigator();
    },

    getList: function() {
        if (typeof (this._list == 'undefined'))
            this.setList(new MVC.PaginatedList(this.options.list));

        return this._list;
    },

    setList: function(list) {
        if (!instanceOf(list, MVC.List))
            throw new Error("list must be an instance of MooTouch.View.Component.PaginatedList");

        this._list = list;
    },

    renderNextPage: function() {
        this.disableNextNavigator();
        this.nextNavigator.element.addClass(this.options.navigatorLoadingClassName);
        this.list.renderNextPage();
    },

    renderPreviousPage: function() {
        this.disablePreviousNavigator();
        this.previousNavigator.element.addClass(this.options.navigatorLoadingClassName);
        this.list.renderPreviousPage();
    },

    render: function(page, forced) {
        if (!this.list.rendered || forced == true) {
            this.list.element.addClass('loading');
            this.disableNextNavigator();
            this.disablePreviousNavigator();
        }

        this.list.render(page, forced);
    },

    activateNextNavigator: function() {
        if (!this._nextNavigatorActivated) {
            this._nextNavigatorActivated = true;
            this.nextNavigator.element.removeClass(this.options.navigatorDisabledClassName);
            this.nextNavigator.addEvent('tap', this.renderNextPage);
        }
    },

    disableNextNavigator: function() {
        if (this._nextNavigatorActivated) {
            this._nextNavigatorActivated = false;
            this.nextNavigator.element.addClass(this.options.navigatorDisabledClassName);
            this.nextNavigator.removeEvent('tap', this.renderNextPage);
        }
    },

    activatePreviousNavigator: function() {
        if (!this._previousNavigatorActivated) {
            this._previousNavigatorActivated = true;
            this.previousNavigator.element.removeClass(this.options.navigatorDisabledClassName);
            this.previousNavigator.addEvent('tap', this.renderPreviousPage);
        }
    },

    disablePreviousNavigator: function() {
        if (this._previousNavigatorActivated) {
            this._previousNavigatorActivated = false;
            this.previousNavigator.element.addClass(this.options.navigatorDisabledClassName);
            this.previousNavigator.removeEvent('tap', this.renderPreviousPage);
        }
    },

    getNextNavigator: function() {
        if (typeof (this._nextNavigator == 'undefined')) {
            var element = (this.options.nextNavigator != '') ? $(this.options.nextNavigator) : this.list.element.getNext();

            this.setNextNavigator(new MVC.TappableElement(element));
        }

        return this._nextNavigator;
    },

    setNextNavigator: function(nextNavigator) {
        if (!instanceOf(nextNavigator, MVC.TappableElement))
            throw new Error("nextNavigator must be an instance of MooTouch.View.Component.TappableElement");

        this._nextNavigator = nextNavigator;
    },
    
    getPreviousNavigator: function() {
        if (typeof (this._previousNavigator == 'undefined')) {
            var element = (this.options.previousNavigator != '') ? $(this.options.previousNavigator) : this.list.element.getPrevious();

            this.setPreviousNavigator(new MVC.TappableElement(element));
        }

        return this._previousNavigator;
    },

    setPreviousNavigator: function(previousNavigator) {
        if (!instanceOf(previousNavigator, MVC.TappableElement))
            throw new Error("previousNavigator must be an instance of MooTouch.View.Component.TappableElement");

        this._previousNavigator = previousNavigator;
    }
});

})();
