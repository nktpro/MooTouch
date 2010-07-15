(function(){

var MTC = Namespace.use("MooTouch.Core");

new Namespace("MooTouch.Core.Element", {
    Extends: "MooTouch.Core.Base",

    Exposes: ['element'],

    _originalDisplayValue: null,

    initialize: function(element, options, dependencies) {
        if (typeOf(element) == 'object') {
            options = element.options;
            element = element.element;
        }

        if (typeof element != 'undefined' && element != null) {
            if ($(element) == null)
                throw new Error("element argument ["+element+"] is neither a valid element id nor an existing Element");
            
            this.setElement($(element));
        }

        this.parent.run([options, dependencies], this);

        if(typeOf(this.options.className) == 'string' && this.options.className.length > 0)
            this.element.addClass(this.options.className);

        return this;
    },

    getElement: function() {
        if (!(this._element instanceof Element)) {
            this._element = new Element('div');
        }

        return this._element;
    },

    setElement: function(el) {
        if (!(el instanceof Element)) {
            throw new Error('element must be an instance of Element');
        }

        this._element = el;

        return this;
    },

    getChildWithRole: function(role, errorIfNotFound) {
        if (typeof errorIfNotFound == 'undefined')
            errorIfNotFound = true;

        var selector = "[role="+role+"]";

        var element = this.element.getElement(selector);

        if (errorIfNotFound && element == null)
            throw new Error("No child element found with role: " + role);

        return element;
    },

    toElement: function() {
		return this.element;
	},

    show: function() {
        if (this._originalDisplayValue == null)
            this._originalDisplayValue = this.element.style.display;
        
        this.fireEvent('show', [], function() {
            this.element.style.display = (this._originalDisplayValue !== null && this._originalDisplayValue != 'none') ? this._originalDisplayValue : 'block';
        }, true);

        return this;
    },

    hide: function() {
        if (this._originalDisplayValue == null)
            this._originalDisplayValue = this.element.style.display;

        this.fireEvent('hide', [], function() {
            this.element.style.display = 'none';
        }, true);

        return this;
    },

    delegateEvent: function(type, selector, fn) {
        var newFn = function(e) {
            if ((!e instanceof MouseEvent) && (!e instanceof TouchEvent))
                throw new Error("Fired callback from delegated event type " + type + " does not contain a valid event object as the first parameter");

            var target = e.target;

            if (target instanceof Text)
                target = target.parentNode;

            target = $(target);
                
            do {
                if ((typeOf(selector) == 'function' && selector(target) == true) || target.match(selector)) {
                    fn.run(Array.from(arguments), target);
                    break;
                }

                target = target.getParent();
            } while (target && target != this.element);
        };

        this.addEvent(type, newFn);
        
		return this;
    },

    delegateEvents: function(selector, delegates) {
        Object.each(delegates, function(fn, name) {
            this.delegateEvent(name, selector, fn);
        }, this);
    }
}); // End Class

})();
