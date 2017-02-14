'use strict';
var equals = require('pop-equals.js');
var Scanner = require('./scanner.js');
var OutlineLexer = require('./outline-lexer.js');
var InlineLexer = require('./inline-lexer.js');
var Parser = require('./parser.js');
var Expression = require('./expression.js');

function test(text, expected, rule) {
    var actual;
    var remainder;
    var end = {
        next: function (type, space, text) {
            return this;
        }
    };
    var parent = {
        return: function _return(expression) {
            actual = expression;
            return end;
        }
    };
    var p = new Parser(rule(null, parent));
    var il = new InlineLexer(p);
    var ol = new OutlineLexer(il);
    var s = new Scanner(ol);
    s.next(text);
    s.return();
    // istanbul ignore next
    if (!equals(actual, expected)) {
        console.log('ERROR');
        console.log('input   ', text);
        console.log('expected', expected);
        console.log('actual  ', actual);
        global.fail = true;
    }
}

function testVar(text, expected) {
    test(text, expected, Expression.variable);
}

function testExp(text, expected) {
    test(text, expected, Expression);
}

testVar('x', ['get', 'x']);
testVar('x.y', ['get', 'x.y']);
testVar('x.1', ['get', 'x.1']);
testVar('{x}', ['var', ['', ''], [['get', 'x']]]);
testVar('{x}.', ['var', ['', '.'], [['get', 'x']]]);
testVar('{x}.y', ['var', ['', '.y'], [['get', 'x']]]);
testVar('{x}.{y}', ['var', ['', '.', ''], [['get', 'x'], ['get', 'y']]]);
testVar('{x}.{y}.{z}', ['var', ['', '.', '.', ''], [['get', 'x'], ['get', 'y'], ['get', 'z']]]);
testVar('x.{y}', ['var', ['x.', ''], [['get', 'y']]]);
testVar('x x', ['get', 'x']);
testExp('x/20*10', ['*', ['/', ['get', 'x'], ['val', 20]], ['val', 10]]);
testExp('x+20*10', ['+', ['get', 'x'], ['*', ['val', 20], ['val', 10]]]);
testExp('x+20**2*10', ['+', ['get', 'x'], ['*', ['**', ['val', 20], ['val', 2]], ['val', 10]]]);
testExp('x*20+10', ['+', ['*', ['get', 'x'], ['val', 20]], ['val', 10]]);
testExp('x-20+10', ['+', ['-', ['get', 'x'], ['val', 20]], ['val', 10]]);
