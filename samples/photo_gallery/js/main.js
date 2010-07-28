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

    window.nav = navigationBar;

    application.addEvent('action:viewPhotos', function(params, history) {
        var album = params.album;

        navigationBar.setState('Albums', album.capitalize());

        mainContentView.oneEvent('itemBecomeInactive', function(item, resumeFn) {
            item.transition(Fx.Transition.slideLeftOut, {}, resumeFn);

            return false;
        }, true);

        mainContentView.oneEvent('afterItemBecomeActive', function(item) {
            item.transition(Fx.Transition.slideLeftIn);
        });

        photoListContainer.setActive('photoList-' + album);

        mainContentView.setActive('photoListView');
    });

    application.addEvent('action:viewAlbums', function() {
        navigationBar.initialState();

        mainContentView.oneEvent('itemBecomeInactive', function(item, resumeFn) {
            item.transition(Fx.Transition.slideRightOut, {}, resumeFn);

            return false;
        }, true);

        mainContentView.oneEvent('afterItemBecomeActive', function(item) {
            item.transition(Fx.Transition.slideRightIn);
        });

        mainContentView.setActive('albumListView');
    });

    application.run();
});

})();