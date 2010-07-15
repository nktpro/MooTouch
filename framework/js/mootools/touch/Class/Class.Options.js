(function(){

this.Options.implement({

	setOptions: function(){
		var options = this.options = Object.merge.run([{}, this.options].append(arguments));
		if (!this.addEvent) return this;
		for (var option in options){
			if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
			this.addEvent(Events.removeOn(option), options[option]);
			delete options[option];
		}
		return this;
	}

});

})();
