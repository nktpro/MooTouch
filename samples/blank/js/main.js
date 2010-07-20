(function(){

Namespace.require({
    'MooTouch': [
        'App.Application',
        'View.DoubleTappable'
    ]
},
function() {
    var application = new MooTouch.App.Application();

    application.addEvent('action', function(action, params) {
        console.log(action);
    });

    var testButton = new MooTouch.View.DoubleTappable('testButton', {
        touchAndHoldable: true
    });
    
    ['press', 'release', 'tap', 'doubleTap', 'touchAndHold'].each(function(name) {
        testButton.addEvent(name, function() {
            console.log(name);
        });
    });
    // Your code here

    application.run();
});

})();