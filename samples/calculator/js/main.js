(function(){

Namespace.require([
    'MooTouch.App.Application',
    'MooTouch.View.Tappable'
],
function() {
    var MV = Namespace.use('MooTouch.View');

    var application = new MooTouch.App.Application();

    var container = new MV.Tappable('calculatorContainer');
    
    container.delegateEvents('button', {
        press: function() {
            this.addClass('pressed');
        },
        release: function() {
            this.removeClass('pressed');
        },
        tap: function() {
            console.log('You tapped on number: ' + this.get('text'));
        }
    });

    application.run();
});

})();