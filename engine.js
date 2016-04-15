'use strict';

var readline = require('readline');

module.exports = ReadlineEngine;

function ReadlineEngine(story, state) {
    var self = this;
    this.story = story;
    this.state = state || {};
    this.blocks = [[]];
    this.options = [];
    this.keywords = {};
    this.instruction = this.story.start;
    this.readline = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    this.boundCommand = command;
    function command(answer) {
        self.command(answer);
    }
}

ReadlineEngine.prototype.continue = function _continue() {
    var _continue;
    do {
        if (!this['$' + this.instruction.type]) {
            throw new Error('Unexpected instruction type: ' + this.instruction.type);
        }
        _continue = this['$' + this.instruction.type](this.instruction);
    } while (_continue);
};

ReadlineEngine.prototype.$end = function end() {
    this.display();
    this.readline.close();
    return false;
};

ReadlineEngine.prototype.$text = function text() {
    this.blocks[this.blocks.length - 1].push(this.instruction.text);
    this.next();
    return true;
};

ReadlineEngine.prototype.$break = function $break() {
    this.blocks.push([]);
    this.next();
    return true;
};

ReadlineEngine.prototype.$option = function option() {
    this.options.push(this.instruction);
    for (var i = 0; i < this.instruction.keywords.length; i++) {
        var keyword = this.instruction.keywords[i];
        this.keywords[keyword] = this.instruction.branch;
    }
    this.next();
    return true;
};

ReadlineEngine.prototype.$prompt = function prompt() {
    this.prompt();
    return false;
};

ReadlineEngine.prototype.$inc = function inc() {
    if (this.state[this.instruction.name] == null) {
        this.state[this.instruction.name] = 0;
    }
    this.state[this.instruction.name]++;
    return true;
};

ReadlineEngine.prototype.$branch = function branch() {
    if (this.state[this.instruction.name]) {
        this.instruction = this.story[this.instruction.branch];
    } else {
        this.next();
    }
    return true;
};

ReadlineEngine.prototype.next = function next() {
    var next = this.story[this.instruction.next];
    if (!next) {
        throw new Error('Story missing knot for label: ' + this.instruction.next);
    }
    this.instruction = next;
};

ReadlineEngine.prototype.command = function command(command) {
    if (command === 'quit') {
        this.readline.close();
    }
    var n = +command;
    if (n >= 0 && n < this.options.length) {
        this.instruction = this.story[this.options[n].branch];
        this.flush();
    } else if (this.keywords[command]) {
        this.instruction = this.story[this.keywords[command]];
        this.flush();
    } else {
        console.log('?');
        this.prompt();
    }
};

ReadlineEngine.prototype.display = function display() {
    var blocks = this.blocks.filter(getLength);
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        // TODO line wrap at min of termios width or 60
        console.log(block.join(' '));
    }
};

function getLength(array) {
    return array.length;
}

ReadlineEngine.prototype.prompt = function prompt() {
    this.display();
    for (var i = 0; i < this.options.length; i++) {
        var option = this.options[i];
        console.log(i + '. ' + option.label);
    }
    this.readline.question('> ', this.boundCommand);
};

ReadlineEngine.prototype.flush = function flush() {
    this.options.length = 0;
    this.keywords = {};
    this.blocks = [[]];
    this.continue();
};

function main() {
    var story = require('./hello.json');
    var engine = new ReadlineEngine(story);
    engine.continue();
}

if (require.main === module) {
    main();
}
