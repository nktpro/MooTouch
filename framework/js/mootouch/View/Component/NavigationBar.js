(function(){

var MV = Namespace.use('MooTouch.View');
var MVC = Namespace.use('MooTouch.View.Component');
var Fx = Namespace.use('MooTouch.Fx');

new Namespace('MooTouch.View.Component.NavigationBar', {

    Requires: ['MooTouch.View.Component.TappableElement', 'MooTouch.Fx.Transition'],

    Extends: 'MooTouch.Core.Element',

    Exposes: ['backControl', 'titleElement', 'controlsContainer'],

    options: {
        initialState: {},
        transitionFx: true
    },

    _states: [],

    _initialState: null,

    initialize: function() {
        this.parent.apply(this, arguments);

        this._initialState = Object.merge({
            back: false,
            title: this.titleElement.get('html'),
            control: this.controlsContainer.getActive()
        }, this.options.initialState);

        this._setState(this._initialState);

        this.addEvent('afterBackControlChange', function() {
//            console.log(this.backControl.element.getSize().x);
        });

        this.addEvent('afterTitleChange', function() {
//            console.log(this.titleElement.getSize().x);
        });

        this.addEvent('afterActiveControlChange', function() {
//            if (this.controlsContainer.getActive())
//                console.log(this.controlsContainer.getActive().getSize().x);
        });

        if (this.options.transitionFx) {
            this.addEvent('backControlChange', this._backControlChangeFx, true);
            this.addEvent('titleChange', this._titleChangeFx);
            this.addEvent('activeControlChange', this._activeControlChangeFx, true);
        }

        return this;
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
        var element = this.backControl.element;

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

    _titleChangeFx: function(from, to, isPrevious, resumeFn) {
        if (to) {
            var element = this.titleElement.getParent();
            var clone, cloneTransition;

            new Fx.Transition(element, {
                transitions: [Fx.Transition.fadeIn, Fx.Transition[(isPrevious) ? 'slideRightIn' : 'slideLeftIn']],
                onStart: function() {
                    clone = this._cloneForFx(element);
                    cloneTransition = new Fx.Transition(clone, {
                        transitions: [Fx.Transition.fadeOut, Fx.Transition[(isPrevious) ? 'slideRightOut' : 'slideLeftOut']],
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
        var left = this.backControl.element, title = this.titleElement;
        left.setStyle('width', '');
        title.setStyle('width', '');

        var dynamicWidth = this.element.getSize().x - this.controlsContainer.element.getSize().x,
            leftWidth = left.getSize().x,
            centerWidth = title.getSize().x;

        console.log('dynamicWidth' + dynamicWidth);
        console.log('leftWidth' + leftWidth);
        console.log('centerWidth' + centerWidth);

        if (leftWidth + centerWidth > dynamicWidth) {
            var reduceWidth = ((leftWidth + centerWidth) - dynamicWidth) / 2;
            console.log(reduceWidth);
            left.setStyle('width', leftWidth - reduceWidth);
            title.setStyle('width', centerWidth - reduceWidth);
        }
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
        return this._states.getLast();
    },

    previousState: function() {
        var previousState = this._states.pop();
        var state = this.getCurrentState();

        if (state != null)
            this._setState(state, previousState);
        else if (previousState)
            this._setState(this._initialState, previousState);

        return this;
    },

    _setState: function(state, isPrevious) {
        this.setState(state.back, state.title, state.control, isPrevious);

        return this;
    },

    setState: function(back, title, control, previousState) {
        var currentState, newState, isPrevious;

        if (previousState) {
            isPrevious = true;
            currentState = previousState;
        } else {
            isPrevious = false;
            currentState = this.getCurrentState();
        }

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
                    this.backControl[(back) ? 'show' : 'hide']();

                    if (typeOf(back) != 'boolean')
                        this.backControl.element.set('html', back);
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

            if (back !== false && isPrevious === false)
                this._states.push(newState);
        }, true);

        return this;
    }
});

})();
