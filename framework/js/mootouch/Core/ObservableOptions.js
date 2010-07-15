(function(){

new Namespace("MooTouch.Core.ObservableOptions", {

    setOptions: function(options){
        if (typeof(options) != 'object')
            throw new Error("options must be an object");

        Object.each(options, function(v, n) {
            this.setOption(n, v);
        }, this);

		return this;
	},

    setOption: function(name, value) {
        var changed = false;

        if (typeOf(value) == 'function' && (/^on[A-Z]/).test(name)) {
            this.addEvent(Events.removeOn(name), value);

        } else if (typeOf(value) == 'object') {
            if (!this.options[name] ||
                (typeOf(this.options[name]) == 'object' && 
                    (this.options[name].toSource == undefined || this.options[name].toSource() != value.toSource()))) {
                    changed = true;
                }

            this.options[name] = Object.merge({}, this.options[name] || {}, value);

        } else {
            if (!this.options[name] || this.options[name] != value)
                changed = true;

            this.options[name] = value;
        }

        if (changed) {
            this.fireEvent('optionChange', [name, value]);
            this.fireEvent('optionChange:' + name, [value, name]);
        }

        return this;
    }
});

})();