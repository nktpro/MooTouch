(function(){

var MV = Namespace.use('MooTouch.View');
var MVC = Namespace.use('MooTouch.View.Component');
var Fx = Namespace.use('MooTouch.Fx');

new Namespace('MooTouch.View.Component.NavigationBar', {

    Requires: ['MooTouch.View.Container', 'MooTouch.View.Component.TappableElement', 'MooTouch.Fx.Transition'],

    Extends: 'MooTouch.Core.Element',

    Implements: 'MooTouch.Core.ObservableOptions',

    Exposes: ['backControl', 'titleElement', 'controlsContainer'],

    Binds: ['adjustDisplay'],

    options: {
        initialState: {},
        transitionFx: true,
        backControlMinWidth: 0
    },

    _initialState: null,

    _currentState: null,

    initialize: function() {
        this.addEvent('optionChange', this._onOptionChange);

        this.parent.apply(this, arguments);

        window.addEvent(Browser.Events.ORIENTATION_CHANGE, this.adjustDisplay);
        
        this.addEvent('afterStateChange', this.adjustDisplay);

        this._initialState = Object.merge({
            back: false,
            title: this.titleElement.get('html'),
            control: this.controlsContainer.getActive()
        }, this.options.initialState);

        this.initialState();


        return this;
    },

    _onOptionChange: function(name, value) {
        switch (name) {
            case 'backControlMinWidth':
                if (typeOf(value) != 'number' && value !== 'fit') {
                    this.options[name] = Number(value) || 0
                }
                
                this.adjustDisplay();
                break;

            case 'transitionFx':
                if (value) {
                    this.addEvent('backControlChange', this._backControlChangeFx, true);
                    this.addEvent('titleChange', this._titleChangeFx);
                    this.addEvent('activeControlChange', this._activeControlChangeFx, true);
                } else {
                    this.removeEvent('backControlChange', this._backControlChangeFx);
                    this.removeEvent('titleChange', this._titleChangeFx);
                    this.removeEvent('activeControlChange', this._activeControlChangeFx);
                }
                break;
        }
    },

    _cloneForFx: function(el) {
        var parent = el.getParent();
        var pos = el.getPosition(parent);
        return el.clone().setStyles({
            position: 'absolute',
            left: pos.x + 'px',
            top: pos.y + 'px'
        }).inject(parent, 'top');
    },

    _backControlChangeFx: function(from, to, isPrevious, resumeFn) {
        if (!this._currentState)
            return;

        var element = $(this.backControl);

        if (to === false) {
            new Fx.Transition(
                element, {
                    transitions: [Fx.Transition.fadeOut, Fx.Transition[(isPrevious) ? 'slideRightOut' : 'slideLeftOut']]
                }).run(resumeFn);

            return false;
        } else {
            var clone, cloneTransition, cleanUpCloneFn;

            if (from) {
                var runningTransition = element.retrieve('mootouch.fx.transition');
                if (runningTransition)
                    runningTransition.stop();

                clone = this._cloneForFx(element);
                cloneTransition = new Fx.Transition(clone, {
                    transitions: [Fx.Transition.fadeOut, Fx.Transition[(isPrevious) ? 'slideRightOut' : 'slideLeftOut']],
                    restoreOnEnd: false
                }).run();

                cleanUpCloneFn = function() {
                    cloneTransition.stop();
                    clone.destroy();
                };
            }

            this.oneEvent('afterBackControlChange', function() {
                new Fx.Transition(element, {
                    transitions:[Fx.Transition.fadeIn, Fx.Transition[(isPrevious) ? 'slideRightIn' : 'slideLeftIn']]
                }).run(cleanUpCloneFn);
            });
        }
    },

    _titleChangeFx: function(from, to, isPrevious) {
        if (!this._currentState)
            return;

        if (to) {
            var element = this.titleElement.getParent();
            var clone, cloneTransition;

            new Fx.Transition(element, {
                transitions: [Fx.Transition[(isPrevious) ? 'slideRightIn' : 'slideLeftIn']],
                
                onStart: function() {
                    clone = this._cloneForFx(element);
                    cloneTransition = new Fx.Transition(clone, {
                        transitions: [Fx.Transition[(isPrevious) ? 'slideRightOut' : 'slideLeftOut']],
                        restoreOnEnd: false
                    }).run();
                }.bind(this),

                onEnd: function() {
                    if (clone) {
                        cloneTransition.stop();
                        clone.destroy();
                    }
                }
            }).run();
        }
    },

    _activeControlChangeFx: function(fromElement, toElement, isPrevious, resumeFn) {
        if (!this._currentState)
            return;
        
        fromElement = $(fromElement);
        toElement = $(toElement);

        if (!toElement) {
            new Fx.Transition(fromElement, {transitions: Fx.Transition.fadeOut}).run(resumeFn);

            return false;
        } else {
            var clone, cloneTransition, cleanUpCloneFn;

            if (fromElement) {
                var runningTransition = fromElement.retrieve('mootouch.fx.transition');
                if (runningTransition)
                    runningTransition.stop();

                clone = this._cloneForFx(fromElement);
                cloneTransition = new Fx.Transition(clone, {
                    transitions: Fx.Transition.fadeOut,
                    restoreOnEnd: false
                }).run();
                cleanUpCloneFn = function() {
                    cloneTransition.stop();
                    clone.destroy();
                };
            }

            this.oneEvent('afterActiveControlChange', function() {
                new Fx.Transition(toElement, {transitions: Fx.Transition.fadeIn}).run(cleanUpCloneFn);
            });
        }
    },

    adjustDisplay: function() {
        var back = $(this.backControl),
            title = this.titleElement,
            activeControl = this.controlsContainer.getActive();

        back.setStyle('width', '');
        title.setStyle('width', '');

        var availableWidth = this.element.getSize().x - 10 - ((activeControl) ? activeControl.getSize().x : 0),
            backWidth = back.getSize().x,
            titleWidth = title.getSize().x;

        var totalWidth = backWidth + titleWidth;

        if (totalWidth > availableWidth) {
            if (this.options.backControlMinWidth != 'fit') {
                backWidth = Math.min(
                                Math.max(
                                    this.options.backControlMinWidth,
                                    (backWidth / totalWidth) * availableWidth
                                ),
                                availableWidth
                            );
                                
                back.setStyle('width', backWidth);
            }
                            
            titleWidth = availableWidth - backWidth;
            title.setStyle('width', titleWidth);
        }
        
        var backCoords = back.getCoordinates(this.element),
            titleCoords = title.getCoordinates(this.element),
            titleTranslateX = 0;

        if (titleCoords.left < backCoords.right)
            titleTranslateX = backCoords.right - titleCoords.left;
        else if (activeControl) {
            var activeControlPos = activeControl.getPosition(this.element);

            if (titleCoords.right > activeControlPos.x)
                titleTranslateX -= titleCoords.right - activeControlPos.x;
        }

        MooTouch.cssTransform(title, { translate: [titleTranslateX] });
    },

    setBackControl: function(control) {
        this._backControl = control;

        return this;
    },

    getBackControl: function() {
        if (!this._backControl) {
            this.setBackControl(new MVC.TappableElement(this.getChildWithRole('backControl')));
        }

        return this._backControl;
    },

    setTitleElement: function(el) {
        this._titleElement = el;

        return this;
    },

    getTitleElement: function() {
        if (!this._titleElement) {
            this.setTitleElement(this.getChildWithRole('title'));
        }

        return this._titleElement;
    },

    setControlsContainer: function(container) {
        this._controlsContainer = container;
    },

    getControlsContainer: function() {
        if (!this._controlsContainer) {
            this.setControlsContainer(new MV.Container(this.getChildWithRole('controlsContainer')));
        }

        return this._controlsContainer;
    },

    getCurrentState: function() {
        return this._currentState;
    },

    _setState: function(state, isPrevious) {
        this.setState(state.back, state.title, state.control, isPrevious);

        return this;
    },

    initialState: function() {
        this._setState(this._initialState, true);
    },

    setState: function(back, title, control, isPrevious) {
        var currentState, newState;

        if (isPrevious == undefined)
            isPrevious = false;

        currentState = this.getCurrentState();

        newState = {
            back: (typeof back != 'undefined') ? back : false,
            title: (typeof title != 'undefined') ? title : null,
            control: (typeof control != 'undefined') ? control : null
        };

        if (currentState == null)
            currentState = { back: null, title: null, control: null };

        this.fireEvent('stateChange', [currentState, newState, isPrevious], function() {
            if (currentState.back !== back) {
                this.fireEvent('backControlChange', [currentState.back, back, isPrevious], function() {
                    $(this.backControl)[(back) ? 'show' : 'hide']();

                    if (typeOf(back) != 'boolean')
                        $(this.backControl).set('html', back);
                }, true);
            }

            if (currentState.title !== title) {
                this.fireEvent('titleChange', [currentState.title, title, isPrevious], function() {
                    this.titleElement.set('html', title);
                }, true);
            }

            if (currentState.control !== control) {
                this.fireEvent('activeControlChange', [currentState.control, control, isPrevious], function() {
                    this.controlsContainer.setActive(control);
                }, true);
            }

//            if (back !== false && isPrevious === false)
//                this._states.push(newState);

            this._currentState = newState;
        }, true);

        return this;
    }
});

})();
