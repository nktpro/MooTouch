(function(){

Namespace.require([
    'MooTouch.App.Application',
    'MooTouch.View.Component.NavigationBar',
    'MooTouch.View.Component.TappableElement'
],
function() {
    var application = new MooTouch.App.Application();
    var Comp = Namespace.use('MooTouch.View.Component');

    var nav = new Comp.NavigationBar('defaultNavigationBar');

    window.nav = nav;

    var forwardButton = new Comp.TappableElement('forwardButton', {
        onTap: function() {
            nav.setState(Math.round(Math.random()*1000000), ['Testing', 'Again', 'Long Long Text Very Long'].getRandom()+Math.round(Math.random()*100), 'testControl' + [1,2,3].getRandom());
        }
    });

    var backButton = new Comp.TappableElement('backButton', {
        onTap: function() {
            nav.setState(Math.round(Math.random()*1000000), ['Testing', 'Again', 'Long Long Text Very Long'].getRandom()+Math.round(Math.random()*100), 'testControl' + [1,2,3].getRandom(), true);
        }
    });

    application.run();
});

})();