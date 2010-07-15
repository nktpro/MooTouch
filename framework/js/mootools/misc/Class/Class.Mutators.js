Class.Mutators.Binds = function(binds){
    return Array.from(binds).combine(Array.from(this.prototype.Binds));
};

Class.Mutators.Exposes = function(exposes){
    return Array.from(exposes).combine(Array.from(this.prototype.Exposes));
};

Class.Mutators.initialize = function(initialize){
	return function() {
		Array.from(this.Binds).each(function(name){
			var original = this[name];
			if (original) this[name] = original.bind(this);
		}, this);

		Array.from(this.Exposes).each(function(name){
			var method, nameCapitalized = name.capitalize();

            method = 'get' + nameCapitalized;
            if (this[method])
                this.__defineGetter__(name, this[method]);

            method = 'set' + nameCapitalized;
            if (this[method])
                this.__defineSetter__(name, this[method]);
		}, this);

		return initialize.apply(this, arguments);
	};
};