(function(){

var MVC = Namespace.use('MooTouch.View.Component');

new Namespace('MooTouch.View.Component.Form', {

    Extends: 'MooTouch.Core.Element',

    Binds: ['_onSubmit'],

    initialize: function() {
        this.parent.apply(this, arguments);
        
        this.addEvent('submit', this._onSubmit);

        return this;
    },

    _onSubmit: function() {
        this.fireEvent('submit', Array.from(arguments));
    },

    getValues: function() {
        var values = {};

        this.element.getElements('input, select, textarea').each(function(el){
            var type = el.type;
            if (!el.name || el.disabled || type == 'submit' || type == 'reset' || type == 'file' || type == 'image') return;

            var value = (el.get('tag') == 'select') ? el.getSelected().map(function(opt){
                // IE
                return document.id(opt).get('value');
            }) : ((type == 'radio' || type == 'checkbox') && !el.checked) ? null : el.get('value');

            Array.from(value).each(function(val){
                if (typeof val != 'undefined')
                    values[el.name] = val;
            });
        });

        return values;
    }
});

})();