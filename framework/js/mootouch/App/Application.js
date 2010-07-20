(function(){

var MT = Namespace.use('MooTouch');
var MTA = Namespace.use('MooTouch.App');

new Namespace('MooTouch.App.Application', {

    Requires: ['MooTouch.App.LocationHash'/*, 'MooTouch.App.Controller'*/],

    Extends: 'MooTouch.Core.Base',

    Implements: 'MooTouch.Core.ObservableOptions',

    Binds: ['onOrientationChange', 'onLocationHashChange', 'onOptionChange', 'focus'],

    Exposes: ['locationHash'],

    options: {
        disableDefaultPagePanning: true,
        disableDefaultGesture: true,
        autoFocusOnTouchStart: true,
        enableLocationHash: true,
        locationHash: {},
        bodyClassName: {
            profile: Browser.Orientation.PROFILE,
            landscape: Browser.Orientation.LANDSCAPE,
            fullscreen: 'fullscreen'
        }
    },

    initialize: function(){
        if (MT.getApplication() != null) {
            throw new Error("Application is singleton and was already initialized, " +
                            "please get the instance with MooTouch.getApplication()");
            return null;
        }

        this._controllers = {};

        this.addEvent('optionChange', this.onOptionChange);

        this.parent.apply(this, arguments);

        // Handle device rotating
        ['domready', Browser.Events.ORIENTATION_CHANGE].each(function(eventName){
            window.addEvent(eventName, this.onOrientationChange);
        }, this);

        // window onLoad fires after domready, so we need to make sure
        // the address bar is hidden
        window.addEvent('load', this.focus);

        document.body.addClass(Browser.Platform.name)
                     .addClass(Browser.Platform.deviceType);

        // Full-screen mode
        if(Browser.Features.fullScreen)
            document.body.addClass(this.options.bodyClassName.fullscreen);

        this.locationHash.addEvent('change', this.onLocationHashChange);

        MT.setApplication(this);

        return this;
    },

    run: function() {
        if (this.options.enableLocationHash)
            this.locationHash.enableChangeDetection();
    },

    stopEventIfTargetNotInput: function(e) {
       var inputTags = ['input', 'select', 'textarea'];

        if (typeOf(e.target) != 'element' || !inputTags.contains(e.target.get('tag'))) {
            e.preventDefault();
            e.stopPropagation();
        }
    },

    onOptionChange: function(name, value) {
        switch (name) {
            case 'disableDefaultPagePanning':
                document[(value) ? 'addEvent' : 'removeEvent'](Browser.Events.TOUCH_START, this.stopEventIfTargetNotInput);
                document[(value) ? 'addEvent' : 'removeEvent'](Browser.Events.TOUCH_MOVE, this.stopEventIfTargetNotInput);
                document[(value) ? 'addEvent' : 'removeEvent'](Browser.Events.TOUCH_END, this.stopEventIfTargetNotInput);
                break;

            case 'autoFocusOnTouchStart':
                document[(value) ? 'addEvent' : 'removeEvent'](Browser.Events.TOUCH_START, this.focus);
                break;

            case 'disableDefaultGesture':
                var stopEvent = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                };

                ['gesturestart', 'gesturechange', 'gestureend'].each(function(eventName){
                    window[(value) ? 'addEvent' : 'removeEvent'](eventName, stopEvent);
                }, this);
                break;
        }
    },

    onLocationHashChange: function(from, to, history) {
        var parts = to.split('/');
        var action = parts.shift();
        var params = {};

        for (var i=0; i<parts.length; i++) {
            params[parts[i]] = unescape(parts[++i]) || null;
        }

        this.fireEvent('action', [action, params, history], function() {
            this.fireEvent('action:' + action, [params, history]);
        });
    },

    getCurrentAction: function() {
        var parts = this.locationHash.get().split('/');
        return parts.shift();
    },

    onOrientationChange: function() {
        document.body.removeClass(this.options.bodyClassName.profile)
                     .removeClass(this.options.bodyClassName.landscape)
                     .addClass((Browser.getOrientation() == Browser.Orientation.PROFILE) ?
                                    this.options.bodyClassName.profile :
                                    this.options.bodyClassName.landscape);
        this.focus();
    },
    
    focus: function() {
        window.scrollTo.delay(100, null, [0, 1]);
        return this;
    },

    getLocationHash: function() {
        if (!this._locationHash)
            this._locationHash = new MTA.LocationHash(Object.merge({}, this.options.locationHash, {changeDetectionEnabled: false}));

        return this._locationHash;
    },

    setLocationHash: function(manager) {
        if(!(manager instanceof MTA.LocationHash))
            throw new Error('manager must be an instance of MooTouch.App.LocationHash');

        this._locationHash = manager;

        return this;
    }

//    getView: function() {
//        if (!this._view)
//            this.setView(new MTA.View(this.options.view));
//
//        return this._view;
//    },
//
//    setView: function(manager) {
//        if(!(manager instanceof MTA.View))
//            throw new Error('manager must be an instance of MooTouch.App.View');
//
//        this._view = manager;
//
//        return this;
//    },

//    registerController: function(id, controller) {
//        if (!(controller instanceof MTA.Controller))
//            throw new Error("controller must be an instance of MooTouch.App.Controller");
//
//        if (!this.hasController(id) || this.getController(id) != controller) {
//            controller.setApplication(this);
//            this._controllers.set(id, controller);
//        }
//
//        return this;
//    },
//
//    registerControllers: function(controllers) {
//        Object.each(controllers, function(controller, id) {
//            this.registerController(id, controller);
//        }, this);
//
//        return this;
//    },
//
//    getController: function(id) {
//        if (!this.hasController(id))
//            throw new Error("Controller with id " + id + " does not exist in the collection");
//
//        return this._controllers.get(id);
//    },
//
//    hasController: function(id) {
//        return this._controllers.has(id);
//    }

}, function() {
    var instance = null;

    Object.merge(MT, {
        getApplication: function() {
            return instance;
        },

        setApplication: function(app) {
            if (instance != null)
                throw new Error("Application is singleton and was already initialized");

            instance = app;
        }
    });
});

})();
