(function(){

var MV = Namespace.use('MooTouch.View');
var MVC = Namespace.use('MooTouch.View.Component');
var Fx = Namespace.use('MooTouch.Fx');

new Namespace('MooTouch.View.Component.NavigationBar', {

    Requires: ['MooTouch.View.Container', 'MooTouch.View.Component.TappableElement', 'MooTouch.Fx.Transition'],

    Extends: 'MooTouch.Core.Element',

    Implements: 'MooTouch.Core.ObservableOptions',

    Exposes: ['backControl', 'titleElement', 'rightControls'],

    Binds: ['adjustDisplay'],

    options: {
        initialState: {},
        transitionFx: true,
        backControlMinWidth: 0
    },

    _initialState: null,

    _currentState: null,

    _inited: false,

    initialize: function() {
        this.addEvent('optionChange', this._onOptionChange);

        this.parent.apply(this, arguments);

        window.addEvent(Browser.Events.ORIENTATION_CHANGE, this.adjustDisplay);
        
        this.addEvent('afterStateChange', this.adjustDisplay);

        this._currentState = { back: null, title: null, control: null };

        this._initialState = Object.merge({
            back: false,
            title: this.titleElement.get('html'),
            control: this.rightControls.getActive()
        }, this.options.initialState);

        this.initialState();

        this._inited = true;

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
                    this.addEvent('rightControlChange', this._rightControlChangeFx, true);
                } else {
                    this.removeEvent('backControlChange', this._backControlChangeFx);
                    this.removeEvent('titleChange', this._titleChangeFx);
                    this.removeEvent('rightControlChange', this._rightControlChangeFx);
                }
                break;
        }
    },

    _cloneForFx: function(el) {
        return el.clone().addClass('clone').inject(el.getParent(), 'top');
    },

    _backControlChangeFx: function(from, to, isPrevious, resumeFn) {
        if (!this._inited)
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
        if (!this._inited)
            return;

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

    _rightControlChangeFx: function(fromElement, toElement, isPrevious, resumeFn) {
        if (!this._inited)
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

            this.oneEvent('afterRightControlChange', function() {
                new Fx.Transition(toElement, {transitions: Fx.Transition.fadeIn}).run(cleanUpCloneFn);
            });
        }
    },

    adjustDisplay: function() {
        var back = $(this.backControl),
            title = this.titleElement,
            controls = $(this.rightControls);

        back.setStyle('width', '');
        title.setStyle('width', '');

        var availableWidth = this.element.getSize().x - 10 - controls.getSize().x,
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
        else {
            var rightControlPos = controls.getPosition(this.element);

            if (titleCoords.right > rightControlPos.x)
                titleTranslateX -= titleCoords.right - rightControlPos.x;
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

    setRightControls: function(container) {
        this._rightControls = container;
    },

    getRightControls: function() {
        if (!this._rightControls) {
            this.setRightControls(new MV.Container(this.getChildWithRole('rightControls')));
        }

        return this._rightControls;
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

    setBackControlState: function(value, isPrevious) {
        if (this._currentState.back !== value) {
            this._currentState.back = value;

            this.fireEvent('backControlChange', [this._currentState.back, value, isPrevious], function() {
                $(this.backControl)[(value) ? 'show' : 'hide']();

                if (typeOf(value) != 'boolean')
                    $(this.backControl).set('html', value);
            }, true);
        }
    },

    setTitle: function(value, isPrevious) {
        if (this._currentState.title !== value) {
            this._currentState.title = value;

            this.fireEvent('titleChange', [this._currentState.title, value, isPrevious], function() {
                this.titleElement.set('html', value);

            }, true);
        }
    },

    setRightControl: function(value, isPrevious) {
        if (this._currentState.control !== value) {
            this._currentState.control = value;
            
            this.fireEvent('rightControlChange', [this._currentState.control, value, isPrevious], function() {
                this.rightControls.setActive(value);

            }, true);
        }
    },

    setState: function(back, title, control, isPrevious) {
        var newState;

        if (isPrevious == undefined)
            isPrevious = false;

        newState = {
            back: (typeof back != 'undefined') ? back : false,
            title: (typeof title != 'undefined') ? title : null,
            control: (typeof control != 'undefined') ? control : null
        };

        this.fireEvent('stateChange', [this._currentState, newState, isPrevious], function() {
            this.setBackControlState(newState.back, isPrevious);
            this.setTitle(newState.title, isPrevious);
            this.setRightControl(newState.control, isPrevious);
        }, true);

        return this;
    }
});

})();
