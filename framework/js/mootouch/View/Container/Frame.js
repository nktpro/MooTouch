(function(){

new Namespace('MooTouch.View.Container.Frame', {

    Extends: 'MooTouch.View.Container',

    options: {
        activeItemClassName: 'top'
    },

    initialize: function(){
        this.parent.apply(this, arguments);

        return this;
    }
});

})();
