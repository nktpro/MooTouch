(function(){

var MT = Namespace.use('MooTouch');

new Namespace('MooTouch.Fx.Transition', {

    Extends: 'MooTouch.Core.Element',

    Binds: ['_onTransitionEnd', 'run'],

    options: {
//      onStart: function(){},
//      onStop: function(){},
//      onEnd: function(){},
        storeKeyName: 'mootouch.fx.transition',
        easing: 'ease-in-out',
        duration: 1234,
        transitions: [],
        restoreOnEnd: true
    },

    _transitionEndTimer: null,
    
    _isRunning: false,

    _styleSetTimer: null,

    _endFn: null,

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

    setTransitions: function(transitions) {
        this.from = {};
        this.to = {};
        
        this.mixin(transitions);
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
        
        this.stopRunningTransition();

        this.element.store(this.options.storeKeyName, this);
        
        this.fireEvent('start', [], function() {
            this._endFn = fn;

            this._isRunning = true;

            var properties = [];

            Object.each(this.from, function(value, name) {
                this.change(name, value);
                properties.push(MT.getRealStylePropertyName(name));
            }, this);

            this.set('timing-function', this.options.easing)
                .set('property', properties.join(', '))
                .set('duration', this.getDurationAsString(), 1);
            
            Object.each(this.to, function(value, name) {
                this.change(name, value, 1);
            }, this);

            this._transitionEndTimer = this._onTransitionEnd.delay(this.options.duration, this);
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
            if (name == 'transform' && value != '')
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

    getDurationAsString: function() {
        var duration = parseInt(this.options.duration);

        if (duration < 1000)
            return duration + 'ms';

        duration /= 1000;

        return duration + 's';
    },

    stop: function() {
        if (this._isRunning) {
            this.fireEvent('stop', [], function() {
                this._endFn = null;

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

            clearTimeout(this._transitionEndTimer);

            ['duration', 'property', 'timing-function'].each(function(name) {
                this.set(name, '');
            }, this);

            if (this.options.restoreOnEnd) {
                this.restore();
            }

            this.element.eliminate(this.options.storeKeyName);

            this.fireEvent('end', [], Function.from(this._endFn));
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

        zoomIn: {
            from: { transform: { scale: 0.01 } },
            to: { transform: { scale: 1 } }
        },

        zoomOut: {
            from: { transform: { scale: 1 } },
            to: { transform: { scale: 0.01 } }
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

    Element.implement({
        transition: function(transitions, options, endFn) {
            new Cls(this, Object.merge({ transitions: transitions }, options)).run(Function.from(endFn));
            
            return this;
        }
    });
}); // End Class

})();