(function(){

var MT = Namespace.use('MooTouch');

new Namespace('MooTouch.Fx.Transition', {

    Extends: 'MooTouch.Core.Element',

    Binds: ['_onTransitionEnd', 'run'],

    options: {
//      onStart: $empty,
//      onEnd: $empty,
        storeKeyName: 'mootouch.fx.transition',
        easing: 'ease-in-out',
        duration: '600ms',
        transitions: [],
        restoreOnEnd: true
    },

    _transitionEndTimer: null,
    
    _isRunning: false,

    _styleSetTimer: null,

    from: {},

    to: {},

    initialize: function() {
        this.parent.apply(this, arguments);

        this._changedProperties = [];

        this.mixin(this.options.transitions);

        this._styleSetTimer = {};

        return this;
    },

    mixin: function(transitions) {
        transitions = Array.from(transitions);

        transitions.each(function(transition) {
            ['from', 'to'].each(function(a) {
                this[a] = Object.merge(this[a], (typeOf(transition[a]) == 'function') ? transition[a].bind(this)() : transition[a]);
            }, this);
        }, this);

        return this;
    },

    stopRunningTransition: function() {
        var runningTransition = this.element.retrieve(this.options.storeKeyName);

        if (runningTransition) {
            runningTransition.stop();
            this.element.eliminate(this.options.storeKeyName);
            delete runningTransition;
        }

        return this;
    },

    run: function(fn) {
        fn = Function.from(fn);
        
        this.stopRunningTransition();

        this.element.store(this.options.storeKeyName, this);
        
        this.fireEvent('start', this.from, function() {
            this._isRunning = true;

            var properties = [];

            Object.each(this.from, function(value, name) {
                this.change(name, value);
                properties.push(MT.getRealStylePropertyName(name));
            }, this);

            this.change('timing-function', this.options.easing)
                .change('property', properties.join(', '))
                .change('duration', this.options.duration, 1);
            
            Object.each(this.to, function(value, name) {
                this.change(name, value, 1);
            }, this);

            this.oneEvent('end', fn);
            this._transitionEndTimer = this._onTransitionEnd.delay(this.getDurationInMs(), this);
        }, true);

        return this;
    },

    change: function(name) {
        if (!this._changedProperties.contains(name))
            this._changedProperties.unshift(name);

        this.set.apply(this, arguments);

        return this;
    },

    restore: function() {
        this._changedProperties.each(function(name) {
            this.set(name, '');
        }, this);

        this._changedProperties.empty();

        return this;
    },

    set: function(name, value, delay) {
        if (!delay)
            delay = 0;

        switch (name) {
            case 'duration':
            case 'timing-function':
            case 'property':
                name = 'transition-' + name;
                break;

            default:
        }

         var doSetStyleValue = function() {
            if (name == 'transform')
                MT.cssTransform(this.element, value);
            else
                this.element.style[MT.getRealStylePropertyName(name)] = value;
            
            if (this._styleSetTimer.hasOwnProperty(name))
                delete this._styleSetTimer[name];
        }.bind(this);

        if (delay != 0)
            this._styleSetTimer[name] = doSetStyleValue.delay(delay);
        else
            doSetStyleValue();

        return this;
    },

    get: function(name) {
        return this._properties.get(name);
    },

    getDurationInMs: function() {
        var duration = this.options.duration;
        
        if (!duration)
            return 0;

        duration = duration.replace('ms', '');

        if (duration.indexOf('s') == duration.length - 1)
            return parseInt(duration.substring(0, duration.length - 1)) * 1000;
        else
            return parseInt(duration);
    },

    stop: function() {
        if (this._isRunning) {
            this.fireEvent('stop', null, function() {
                Object.each(this._styleSetTimer, function(v, n) {
                    clearTimeout(v);
                    delete this._styleSetTimer[n];
                }, this);

                this._onTransitionEnd();
            });
        }

        return this;
    },

    _onTransitionEnd: function() {
        if (this._isRunning) {
            this._isRunning = false;

            this.element.removeEvent(Browser.Events.TRANSITION_END, this._onTransitionEnd);

            clearTimeout(this._transitionEndTimer);

            if (this.options.restoreOnEnd) {
                this.restore();
            }

            this.element.eliminate(this.options.storeKeyName);

            this.fireEvent('end');
        }
    }

}, function(Cls) {
    Cls.extend({
        fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 }
        },

        fadeOut: {
            from: { opacity: 1 },
            to: { opacity: 0 }
        },

        slideLeftIn : {
            from: function() { return { transform: { translate: [this.element.getSize().x] } } },
            to: { transform: {} }
        },

        slideLeftOut : {
            from: { transform: {} },
            to: function() { return { transform: { translate: [-this.element.getSize().x] } } }
        },

        slideRightIn : {
            from: function() { return { transform: { translate: [-this.element.getSize().x] } } },
            to: { transform: {} }
        },

        slideRightOut : {
            from: { transform: {} },
            to: function() { return { transform: { translate: [this.element.getSize().x] } } }
        },

        slideDownIn : {
            from: function() { return { transform: { translate: [0, -this.element.getSize().y] } } },
            to: { transform: {} }
        },

        slideDownOut : {
            from: { transform: {} },
            to: function() { return { transform: { translate: [0, this.element.getSize().y] } } }
        },

        slideUpOut : {
            from: { transform: {} },
            to: function() { return { transform: { translate: [0, -this.element.getSize().y] } } }
        },

        slideUpIn : {
            from: function() { return { transform: { translate: [0, this.element.getSize().y] } } },
            to: { transform: {} }
        }

    });
}); // End Class

})();