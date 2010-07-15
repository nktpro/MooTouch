(function(){

new Namespace("MooTouch.Util.EventRecorder", {

    Requires: "MooTouch.Util.EventSimulator",

    Implements: Options,

    options: {
        storage: {
            type: 'remoteHttp',
            options: {

            }
        }
    },
    
    _eventCollection: null,
    _currentEventSetName: null,

    initialize: function() {
        this._eventSets = new Hash();

        return this;
    },

    getEventSet: function(name) {
        if (typeOf(name) != 'string') {
            if (this._currentEventSetName == null)
                throw new Error('No EventSet is currently used');

            name = this._currentEventSetName;
        }

        if (typeof this._eventSets[name] == 'undefined')
            this._eventSets[name] = new Array;

        return this._eventSets[name];
    },

    start: function(name) {
        this._currentEventSetName = name;
    },

    record: function(name, event) {
        if (typeOf(name) != 'string') {
            // Not being recorded since either it's not started or is already ended
            if (this._currentEventSetName == null)
                return;

            event = name;
            name = this._currentEventSetName;
        }

        var eventData = this.getEventSimulator().createEventData(event);

        this.getEventSet(name).push(eventData);
    },

    erase: function(name) {
        this.getEventSet(name).empty();
    },

    replay: function(name) {
        var simulator = this.getEventSimulator();
        var events = this.getEventSet(name);

        var delay = 0,
            index = 0,
            numEvents = events.length,
            event;

        if (numEvents > 0) {
            setTimeout(function() {
                event = events[index];
                simulator.fire(event.type, event.target, event);

                if (++index < numEvents) {
                    setTimeout(arguments.callee, events[index].timeStamp - event.timeStamp);
                }
            }, delay);
        }
    },

    end: function() {
        this._currentEventSetName = null;
    },

    getEventSimulator: function() {
        if (!this._eventSimulator) {
            this._eventSimulator = new MooTouch.Util.EventSimulator();
        }

        return this._eventSimulator;
    },

    setEventSimulator: function(eventSimulator) {
        if (!(eventSimulator instanceof MooTouch.EventSimulator))
            throw new Error('eventSimulator must be an instance of MooTouch.EventSimulator');
        
        this._eventSimulator = eventSimulator;
    },

    // TODO
    save: function(name) {
        if (typeof name == 'undefined') {
            if (typeof this._currentEventSetName == null && name == 'undefined')
                throw new Error('No EventSet is currently used');

            name = this._currentEventSetName;
        }

        // TODO
    }
});

})();