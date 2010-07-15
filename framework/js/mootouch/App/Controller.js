(function(){

var MT = Namespace.use("MooTouch");
var MTA = Namespace.use("MooTouch.App");

new Namespace("MooTouch.App.Controller", {

    Extends: "MooTouch.Core.Base",

    Exposes: {
        application: 3
    },

    initialize: function() {
        this.parent.apply(this, arguments);

        return this;
    },

    getApplication: function() {
        if (!this._application) {
            if (MT.getApplication() == null)
                throw new Error("No application instance found");

            this.setApplication(MT.getApplication());
        }

        return this._application;
    },

    setApplication: function(application) {
        if ((!application instanceof MTA.Application))
            throw new Error("application must be an instance of MooTouch.App.Application");

        this._application = application;
    },

    getView: function() {
        return this.application.view;
    },

    getViewScreen: function(id) {
        return this.getView().getScreen(id);
    },

    getController: function(id) {
        return this.application.getController(id);
    },

    getLocationHashManager: function() {
        return this.application.locationHashManager;
    },

    _getNewFnPassingComponent: function(component, fn) {
        var self = this;
        return function() {
            var args = $A(arguments);
            args.push(component);

            return fn.run(args, self);
        };
    },

    intercept: function(component, eventName, fn, prepend) {
        this.when(component, eventName, fn, true, prepend);
    },

    before: function(component, eventName, fn, intercept) {
        this.when(component, eventName, fn, intercept, true);
    },

    interceptBefore: function(component, eventName, fn) {
        this.when(component, eventName, fn, true, true);
    },

    when: function(component, eventName, fn, intercept, prepend) {
        Array.from(eventName).each(function(name) {
            Array.from(fn).each(function(f) {
                component.addEvent(name, this._getNewFnPassingComponent(component, f), intercept, prepend);
            }, this);
        }, this);
    },

    after: function(component, eventName, fn) {
        eventName = 'after' + eventName.capitalize();
        this.when(component, eventName, fn);
    }
});

})();
