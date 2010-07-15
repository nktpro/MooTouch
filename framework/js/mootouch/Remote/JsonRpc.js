(function(){

new Namespace("MooTouch.Remote.JsonRpc", {

    Extends: "MooTouch.Remote.Rpc",

    options: {
        version: 2,
        smd: null
    },

    _smd: null,

    _sequence: 1,

    initialize: function() {
        this.parent.apply(this, arguments);

        return this;
    },

    getRequest: function() {
        return new Request.JSON(this.options.request);
    },
    
    _getMethodDefinitions: function() {
        if (!this._smd && !this.options.smd) {
            var onSuccess = function(smd) {
                this._smd = smd;
                this.getRequest().removeEvent('success', onSuccess);
            }.bind(this);

            this.getRequest()
                .setOptions({
                    async: false
                })
                .addEvent('success', onSuccess)
                .send({
                    method: 'get'
                });
        } else if (this.options.smd != null)
            this._smd = this.options.smd;

        return this._smd.services;
    },

    getSmd: function() {
        return this._smd;
    },

    callMethod: function(name, args) {
        var id = this._sequence++;

        var data = {method: name, params: args, id: id};

        if (this.options.version == 2)
            data.jsonrpc = '2.0';

        this.fireEvent('call', [name, data], function() {
            this.fireEvent('call:' + name, [data], function() {
                var onSuccess = function(responseData, responseText) {
                    this.getRequest().removeEvent('success', onSuccess);

                    if (responseData == null) {
                        this.fireEvent('error', ['MALFORMED_RESPONSE', responseText]);
                        return;
                    }
                    
                    this.fireEvent('afterCall', [name, data, responseData], function() {
                        this.fireEvent('afterCall:' + name, [data, responseData]);
                        this.fireEvent('afterCall:' + id, [responseData]);
//                        this.fireAndRememberEvent('afterCall:' + id, [responseData]);
                    });
                }.bind(this);

                this.getRequest()
                    .addEvent('success', onSuccess)
                    .send({
                        data: JSON.encode(data),
                        method: 'post'
                    });
            }.bind(this));
        }.bind(this));

        return id;
    }
});

})();