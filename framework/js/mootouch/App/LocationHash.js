(function(global){
    
var MTA = Namespace.use("MooTouch.App");

new Namespace("MooTouch.App.LocationHash", {

    Extends: "MooTouch.Core.Base",

    Implements: "MooTouch.Core.ObservableOptions",

    Binds: ['onHashChange'],

    options: {
//      onChange: function(from, to, history){},
        changeDetectionEnabled: false,
        checkInterval: 50
    },

    _history: [],

    initialize: function() {
        this.addEvent('optionChange', this.onOptionChange);

        this.parent.apply(this, arguments);

        return this;
    },

    onOptionChange: function(name, value) {
        switch (name) {
            case 'changeDetectionEnabled':
                if (value != false)
                    this.enableChangeDetection();
                else
                    this.disableChangeDetection();
                break;
        }
    },

    set: function(hash) {
        if(this._currentLocationHash != hash)
            global.location.hash = hash;

        return this;
    },

    previous: function() {
        this.set(this._history.getLast() || '');
        this._isBack = true;
    },

    updateCurrentData: function(){
        this._currentHistoryLength = global.history.length;
        this._currentLocationHash = this.get();

        return this;
    },

    fireHashChangeEvent: function() {
        this.fireEvent('change', Array.from(arguments));

        return this;
    },

    disableChangeDetection: function() {
        if (this._changeDetectionEnabled) {
            this._changeDetectionEnabled = false;

            if (Browser.Features.hashChange)
                window.removeEvent('hashchange', this.onHashChange);
        }

        return this;
    },

    enableChangeDetection: function() {
        if (!this._changeDetectionEnabled) {
            this._changeDetectionEnabled = true;

            if (typeof this._currentLocationHash == 'undefined') {
                this.updateCurrentData();

                this.fireHashChangeEvent(null, this._currentLocationHash, null);
            }

            if (!Browser.Features.hashChange) {
                var self = this;

                setTimeout(function() {
                    if (self._changeDetectionEnabled) {
                        var newLocationHash = self.get();

                        if (newLocationHash != self._currentLocationHash)
                            self.onHashChange(newLocationHash);

                        setTimeout(arguments.callee, self.options.checkInterval);
                    }
                }, this.options.checkInterval);
            } else {
                window.addEvent('hashchange', this.onHashChange);
            }

        }

        return this;
    },

    onHashChange: function(newLocationHash) {
        var history, from, to;

        if (typeof newLocationHash != 'string')
            newLocationHash = this.get();

        history = MTA.LocationHash.FORWARD;
        from = this._currentLocationHash;
        to = newLocationHash;

        //TODO: This works perfectly with all browsers EXCEPT Firefox!
        // Let's just skip supporting it for now (no mobile platform)
        if(global.history.length < this._currentHistoryLength || this._isBack == true) {
            // The browser's Back button was pressed
            history = MTA.LocationHash.BACK;
            this._history.pop();
            this._isBack = false;
        } else {
            if (!this._historyDisabled)
                this._history.push(this._currentLocationHash);
        }

        this.updateCurrentData();
        this.fireHashChangeEvent(from, to, history);
    },

    disableHistory: function() {
        this._historyDisabled = true;
    },

    enableHistory: function() {
        this._historyDisabled = false;
    },

    get: function() {
        var index = global.location.hash.indexOf('#');
        return (index == -1 ? '' : global.location.hash.substr(index + 1));
    }
    
}, function(Cls) {
    Cls.BACK = 'back';
    Cls.FORWARD = 'forward';
});

})(this);