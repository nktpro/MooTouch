(function(){

Namespace.require([
    'MooTouch.App.Application',
    'MooTouch.View.Component.NavigationBar',
    'MooTouch.View.Component.List',
    'MooTouch.View.Component.ScrollView',
    'MooTouch.View.Container',
    'MooTouch.View.Container.Frame',
    'MooTouch.Fx.Transition',
],
function() {
    var application = new MooTouch.App.Application();

    var Component = Namespace.use('MooTouch.View.Component'),
        Fx = Namespace.use('MooTouch.Fx');

    var navigationBar = new Component.NavigationBar('navigationBar'),
        mainContentView = new MooTouch.View.Container.Frame('mainContentView'),
        albumListScrollView = new Component.ScrollView('albumListView'),
        photoListScrollView = new Component.ScrollView('photoListView'),
        photoListContainer = new MooTouch.View.Container('photoListContainer');

    Component.List.fromDom('albumList');

    application.addEvent('action:viewPhotos', function(params, history) {
        var album = params.album;

        navigationBar.setState('Albums', album.capitalize());

        mainContentView.oneEvent('afterActiveChange', function(to, from) {
            from.addClass('visible');

            new Fx.Transition(from, {transitions: Fx.Transition.slideLeftOut}).addEvent('end', function() {
                from.removeClass('visible');
            }).run();

            new Fx.Transition(to, {transitions: Fx.Transition.slideLeftIn}).run();
        });

        mainContentView.setActive('photoListView');

        photoListContainer.setActive('photoList-' + album);
    });

    application.addEvent('action:viewAlbums', function() {
        navigationBar.initialState();

        mainContentView.oneEvent('afterActiveChange', function(to, from) {
            from.addClass('visible');

            new Fx.Transition(from, {transitions: Fx.Transition.slideRightOut}).addEvent('end', function() {
                from.removeClass('visible');
            }).run();

            new Fx.Transition(to, {transitions: Fx.Transition.slideRightIn}).run();
        });
        mainContentView.setActive('albumListView');
    });

    application.run();
});

})();