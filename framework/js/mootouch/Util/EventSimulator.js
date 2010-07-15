(function(){

new Namespace("MooTouch.Util.EventSimulator", {
    initialize: function() {

        return this;
    },

    _supportedEvents: {
        touch: ['touchstart', 'touchmove', 'touchend'],
        mouse: ['mousedown', 'mousemove', 'mouseup']
    },

    getEventTypeByName: function(name) {
        var ret = null;

        this._supportedEvents.each(function(events, type) {
            if (events.contains(name)) {
                ret = type;
                return false;
            }
        });

        return ret;
    },

    fire: function(type) {
        type = type.toLowerCase();

        switch(this.getEventTypeByName(type)) {
            case 'touch':
                this.fireTouchEvent.apply(this, arguments);
                break;

            case 'mouse':
                this.fireMouseEvent.apply(this, arguments);
                break;

            default:
                throw new Error("Event type " + type + " is currently not supported");
        }
    },

    createEventData: function(event) {
        switch(this.getEventTypeByName(event.type)) {
            case 'touch':
                return this.createTouchEventData(event.target, event);
                break;

            case 'mouse':
                return this.createMouseEventData(event.type, event.target, event);
                break;

            default:
                throw new Error("Event type " + event.type + " is currently not supported");
        }
    },

    /* Touch events ========================================================================== */

    fireTouchEvent: function(type, target, options){
        var touchEventData = this.createTouchEventData(target, options);
        
        var touchEvent = this.createTouchEvent(type, touchEventData);
        
        return target.dispatchEvent(touchEvent);
    },

    createTouchEventData: function(target, options) {
        var touchEventData = {
            target: target,
            bubbles: true,
            cancelable: true,
            view: document.defaultView,
            detail: 1,  // Not sure what this does in "touch" event.
            screenX: 0,
            screenY: 0,
            pageX: 0,
            pageY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            scale: 1,
            rotation: 0
        };

        touchEventData = Object.merge(touchEventData, options || {});

        ['touches', 'targetTouches', 'changedTouches'].each(function(touchListName) {
            if (typeof options[touchListName] != 'undefined')
                touchEventData[touchListName] = this.createTouchList(options[touchListName]);
            else
                touchEventData[touchListName] = this.createTouchList(touchEventData);
        }, this);

        return touchEventData;
    },
    
    createTouchEvent: function(type, data) {
        if (typeOf(type) != 'string') {
            data = type;
            type = type.type;
        }

        var touchEvent = document.createEvent('TouchEvent');
        
        touchEvent.initTouchEvent(type, data.bubbles, data.cancelable, data.view,
            data.detail, data.screenX, data.screenY, data.pageX, data.pageY, data.ctrlKey,
            data.altKey, data.shiftKey, data.metaKey, data.touches, data.targetTouches,
            data.changedTouches, data.scale, data.rotation);
            
        return touchEvent;
    },

    createTouch: function(target, options) {
        return document.createTouch(
            document.defaultView,
            target,
            +options.identifier || 0,
            +options.pageX || 0,
            +options.pageY || 0,
            +options.screenX || 0,
            +options.screenY || 0);
    },

    createTouchList: function(data) {
        var touch,
            touches = [];

        if (typeof typeOf(data) == 'object' && data.target != 'undefined') {
            data = [data];
        }

        for (var i = 0; i < data.length; i++) {
            touch = this.createTouch(data[i].target, data[i]);
            touches.push(touch);
        }

        return document.createTouchList.run(touches, document);
    },

    /* Mouse events ======================================================================================= */
    
    fireMouseEvent: function(type, target, options) {
        var eventData = this.createMouseEventData(type, target, options);

        var event = this.createMouseEvent(type, eventData);

        return target.dispatchEvent(event);
    },

    createMouseEventData: function(type, target, options) {
        var mouseEventData = {
            target: target,
            bubbles: true, // all mouse events bubble
            cancelable: (type != 'mousemove'), // mousemove is the only event type that can't be cancelled
            view: window,
            detail: 1, // number of mouse clicks must be at least one
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            relatedTarget: null
        };
        
        return Object.merge(mouseEventData, options);
    },

    createMouseEvent: function(type, data) {
        var mouseEvent = document.createEvent("MouseEvents");

        mouseEvent.initMouseEvent(
            type, data.bubbles, data.cancelable, data.view, data.detail,
            data.screenX, data.screenY, data.clientX, data.clientY,
            data.ctrlKey, data.altKey, data.shiftKey, data.metaKey,
            data.button, data.relatedTarget);

        return mouseEvent;
    }

});

})();