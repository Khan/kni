'use strict';
var Engine = require('./engine');
var story = require('./examples/archery.json');
var Document = require('./document');
var doc = new Document(document.getElementById('body'));
var engine = new Engine(story, 'start', doc, doc);
doc.clear();
engine.continue();

window.onkeypress = function onkeypress(event) {
    var key = event.code;
    var match = /^Digit(\d+)$/.exec(key);
    if (match) {
        engine.answer(match[1]);
    }
};