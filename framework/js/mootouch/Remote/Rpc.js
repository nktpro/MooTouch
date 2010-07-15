(function(){

new Namespace("MooTouch.Remote.Rpc", {

    Extends: "MooTouch.Core.Base",

    Implements: "MooTouch.Core.ObservableOptions",

    Binds: ['onOptionChange'],

    options: {
        url: '',
        request: {
            onFailure: function(xhr) {
                console.error("XHR Failed");
                console.error(xhr);
            }
        },
        defaultCallSuccessHandler: function(){},
        defaultCallErrorHandler: function(){}
    },

    _request: null,

    _isReady: false,

    initialize: function() {
        this.addEvent('optionChange', this.onOptionChange);

        this.parent.apply(this, arguments);

        var methods = this._getMethodDefinitions();
        
        Object.each(methods, function(definition, name) {
            this._defineMethod(name, definition.parameters, definition.returns);
        }, this);

        return this;
    },

    onOptionChange: function(name, value) {
        if (name == 'url') {
            if (value.length == 0)
                throw new Error("url cannot be empty");

            this.options.request.url = value;
        }
    },

    getRequest: function() {
        return new Request(this.options.request);
    },

    _getMethodDefinitions: function(){},

    _defineMethod: function(name, parameters, returns) {
        var method = this;
        var self = this;

        name.split('.').each(function(n, i, parts) {
            if (i < parts.length - 1) {
                if (typeof method[n] == 'undefined')
                    method[n] = {};

            } else {
                if (method[n])
                    throw new Error("Method '"+name+"' already exists");

                method[n] = function() {
                    var args = Array.from(arguments);
                    
                    // Validation
                    parameters.each(function(paramDefinition, i) {
                        if (!paramDefinition.optional && !args[i]) {
                            throw new Error("Param name '"+paramDefinition.name+"' at index '"+i+"' is required");
                        }
                    }, this);

                    var id = this.callMethod(name, args);

                    var ret = {
                        success: function(f) {
                            self.addEvent('afterCall:' + id, function(responseData) {
                                if (responseData.error == null)
                                    f.run([responseData.result], this);
                            });

                            return ret;
                        },

                        error: function(f) {
                            self.addEvent('afterCall:' + id, function(responseData) {
                                if (responseData.error != null)
                                    f.run([responseData.error], this);
                            });

                            return ret;
                        }
                    };
                    
                    return ret;
                }.bind(this);
            }

            method = method[n];
        }, this);

        return this;
    },
    
    callMethod: function(name, args) {}
});

})();