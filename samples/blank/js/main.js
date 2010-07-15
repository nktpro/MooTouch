(function(){

Namespace.require({
    'MooTouch': [
        'App.Application'
    ]
},
function() {
    var App = Namespace.use('MooTouch.App');
    var application = new App.Application();

    // Your code here

    application.run();
});

})();