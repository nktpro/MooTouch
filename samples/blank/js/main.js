(function(){

Namespace.require({
    'MooTouch': [
        'App.Application'
    ]
},
function() {
    var application = new MooTouch.App.Application();

    application.addEvent('action', function(action, params) {
        console.log(action);
    });

    // Your code here

    application.run();
});

})();