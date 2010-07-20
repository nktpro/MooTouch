(function(){

Namespace.require([
    'MooTouch.App.Application',
    'MooTouch.View.Tappable',
    'MooTouch.View.DoubleTappable',
    'MooTouch.View.Swipeable',
    'MooTouch.View.Draggable',
],
function() {
    var application = new MooTouch.App.Application();

    var testTappable = new MooTouch.View.Tappable('testTappable', {
        onPress: function() { this.element.addClass('pressed') },
        onRelease: function() { this.element.removeClass('pressed') },
        onTap: function() { this.element.set('text', 'Tapped!') }
    });

    application.run();
});

})();