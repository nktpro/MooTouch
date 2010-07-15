(function() {

new Namespace("MooTouch.Core.Events", {

	Implements: Events,

    $rememberedEvents: {},

    oneEvent : function(type, fn, intercept, prepend) {
        return this.addEvent(type, function() {
            this.removeEvent(type, arguments.callee);
            return fn.apply(this, arguments);
        }, intercept, prepend);
    },

    addEvent: function(type, fn, intercept, prepend){
		type = Events.removeOn(type);

        if (this.$rememberedEvents[type])
            fn.run(Array.from(this.$rememberedEvents[type]), this);
        
		else {
			this.$events[type] = this.$events[type] || [];
			if (intercept) fn.intercept = true;
            
            if (!prepend)
                this.$events[type].include(fn);
            else {
                if (!this.$events[type].contains(fn))
                    this.$events[type].unshift(fn);
            }
		}
		return this;
	},

	addEvents: function(events, intercept, prepend){
		for (var type in events) this.addEvent(type, events[type], intercept, prepend);
		return this;
	},

    fireAndRememberEvent: function(type, args) {
        type = Events.removeOn(type);

        this.$rememberedEvents[type] = args;

        this.fireEvent.apply(this, arguments);
    },

    fireEvent: function(type, args, lastFn, fireAfter){
        type = Events.removeOn(type);
        args = Array.from(args);

        if (typeof fireAfter == 'undefined')
            fireAfter = false;

        var listeners;

        if (/*!this.$events || */!this.$events[type])
            listeners = [];
        else
            listeners = this.$events[type].slice();

        if (typeOf(lastFn) == 'function')
            listeners.push(lastFn);

        if (fireAfter) {
            listeners.push(function() {
                this.fireEvent('after' + type.capitalize(), args);
            });
        }

        if (listeners.length > 0) {
            this._notifyListeners(listeners, args);
        }

        return this;
    },

    _notifyListeners: function(listeners, args) {
        var continuePropagation = true, fn, newArgs;

        for (var i=0; i<listeners.length; i++) {
            if(!continuePropagation)
                break;

            fn = listeners[i];

            if (fn.intercept) {
                var restOfListeners = listeners.slice(i+1);
                var resumeFn = arguments.callee.bind(this, [restOfListeners, args]);

                newArgs = args.slice();
                newArgs.push(resumeFn);
            }

            continuePropagation = fn.run((fn.intercept) ? newArgs : args, this);

            if (continuePropagation !== false)
                continuePropagation = true;
        }

        return continuePropagation;
    }
});

})();