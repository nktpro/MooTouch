(function(){

var MTC = Namespace.use("MooTouch.Core");

new Namespace("MooTouch.Core.Base", {
    
    Implements: [Options, "MooTouch.Core.Events"],

    Exposes: [],

    options: {},

    initialize: function(options, dependencies) {
        if (typeOf(dependencies) == 'object')
            this._initializeDependencies(dependencies);

        options = Object.merge({}, this.options, options || {});

        this.options = {};

        this.setOptions(options);

        return this;
    },

    _initializeDependencies: function(instances) {
        Object.each(instances, function(instance, name) {
            var setterMethodName = 'set' + name.capitalize();

            if (typeOf(this[setterMethodName]) == 'function')
                this[setterMethodName](instance);
        }, this);
    }
}); // End Class

})();
