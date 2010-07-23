(function(){

Namespace.setBasePath('Calculator', 'js/calculator');

Namespace.require([
    'MooTouch.App.Application',
    'MooTouch.View.Tappable',
    'Calculator.Display'
],
function() {
    var MV = Namespace.use('MooTouch.View');

    var application = new MooTouch.App.Application(),
        container = new MV.Tappable('calculator'),
        display = new Calculator.Display('result'),
        operation = false,
        buffer = [];

    container.delegateEvents('.button', {
        press: function() {
            this.addClass('pressed');
        },
        release: function() {
            this.removeClass.delay(0, this, ['pressed']);
        },
        tap: function() {
           handleInput(this.get('text'));
        }
    });

    var handleInput = function(input) {
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'].contains(input)) {
            if (operation) {
                operation = false;
                display.clear();
            }

            display.pushDigit(input);
        } else {
            switch (input) {
                case 'C':
                    display.clear();
                    buffer.empty();
                    break;

                case 'π':
                    display.setDisplay(Math.PI);
                    break;

                case '√':
                    display.setDisplay(Math.sqrt(display.getValue()));
                    break;

                default:
                    operation = true;

                    buffer.push(display.getValue());

                    if (input == '=') {
                        var toCalculate = buffer.join('');
                        var result = 0;
                        eval('result = ' + toCalculate);

                        display.setDisplay(result);
                        buffer.empty();
                    } else {
                        switch (input) {
                            case '÷':
                                buffer.push('/');
                                break;
                            case '×':
                                buffer.push('*');
                                break;
                            case '+':
                                buffer.push('+');
                                break;
                            case '–':
                                buffer.push('-');
                                break;
                        }
                    }
               break;
            }
        }
    }

    application.run();
});

})();