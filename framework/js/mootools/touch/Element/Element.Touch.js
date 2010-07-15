['touchstart', 'touchmove', 'touchend', 'gesturestart',
 'mousedown', 'mouseup', 'mousemove',
 'gesturechange', 'gestureend', 'webkitAnimationStart', 'orientationchange',
 'webkitAnimationEnd', 'webkitAnimationIteration', 'webkitTransitionEnd'].each(function(e){
    Element.NativeEvents[e] = 3;
});

Element.NativeEvents['hashchange'] = 1;

[Element, Window, Document].invoke('implement', {
    addEvent: function(type, fn){
		var events = this.retrieve('events', {});
		events[type] = events[type] || {'keys': [], 'values': []};
		if (events[type].keys.contains(fn)) return this;
		events[type].keys.push(fn);
		var realType = type, custom = Element.Events[type], condition = fn, self = this;
		if (custom){
			if (custom.onAdd) custom.onAdd.call(this, fn);
			if (custom.condition){
				condition = function(event){
					if (custom.condition.call(this, event)) return fn.call(this, event);
					return true;
				};
			}
			realType = custom.base || realType;
		}
		var defn = function(){
			return fn.call(self);
		};
		var nativeEvent = Element.NativeEvents[realType];
		if (nativeEvent){
			if (nativeEvent == 2){
				defn = function(event){
					event = new Event(event, self.getWindow());
					if (condition.call(self, event) === false) event.stop();
				};
            // CUSTOM: Add a new event handler for touch-base devices
            } else if (nativeEvent == 3){
                defn = function(event){
                    return fn.call(self, event);
                };
            }
			this.addListener(realType, defn);
		}
		events[type].values.push(defn);
		return this;
	}
});