(function(){

Namespace.require({
    'MooTouch': [
        'App.Application',
        'View.Component.Tabs',
        'View.Component.NavigationBar',
        'View.Touchable',
        'View.Component.ScrollView'
    ]
},
function() {
    var View = Namespace.use('MooTouch.View'),
        Component = Namespace.use('MooTouch.View.Component'),
        App = Namespace.use('MooTouch.App');

    var application = new App.Application();

    var tabBar = new Component.Tabs('defaultTabBar');
    var navigationBar = new Component.NavigationBar('defaultNavigationBar');
    window.navigationBar = navigationBar;

    var nextState = new View.Touchable('nextState');

    nextState.addEvent('touchStart', function() {
         navigationBar.setState(Math.round(Math.random()*100000), ['Testing', 'Again', 'Long Long Text'].getRandom()+Math.round(Math.random()*100), 'testControl' + [1,2,3].getRandom())
    });
    $('previousState').addEvent(MooTouch.EVENT_TOUCHSTART, function() {
        navigationBar.previousState()
    });

    var testScrollView = new Component.ScrollView('testScrollView');
});

})();