(function(){

new Namespace("Calculator.Display", {

    Extends: "MooTouch.Core.Element",

    initialize: function(){
        this.parent.apply(this, arguments);

        this.clear();

        return this;
    },

    clear: function() {
        this.setDisplay('0');
    },

    pushDigit: function(digit) {
        var currentDisplay = this.getDisplay();

        if (currentDisplay == '0' && digit != '.')
            currentDisplay = '';
        
        this.setDisplay(currentDisplay + digit);
    },

    setDisplay: function(display) {
        var value = Number(display);

        if (!isNaN(value)) {
            this.element.set('text', display);
        }

        return this;
    },

    getDisplay: function() {
        return this.element.get('text');
    },

    getValue: function() {
        return Number(this.getDisplay());
    }
});

})();
