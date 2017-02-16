
module.exports = Structure;

function Structure(onDisplay) {
    var self = this;
    this.onDisplay = onDisplay;
    this.frame = null;
    this.content = null;
    this.contentCursor = null;
    this.contentCursorParent = null;
    this.carry = '';
    this.p = false;
    this.br = false;
}

Structure.prototype.write = function write(lift, text, drop) {
    lift = this.carry || lift;
    if (this.p) {
        this.contentCursor = {
            type: "p",
            children: [],
        };
        this.contentCursorParent.children.push(this.contentCursor);
        this.p = false;
        this.br = false;
        lift = '';
    }
    if (this.br) {
        this.contentCursor.children.push({
            type: "br",
        });
        this.br = false;
        lift = '';
    }
    var cc = this.contentCursor;
    var lastChild = cc.children[cc.children.length - 1];
    if (lastChild && lastChild === "text") {
        lastChild.value = lastChild.value + lift + text;
    } else {
        cc.children.push({
            type: "text",
            value: lift + text
        });
    }
    this.carry = drop;
};

Structure.prototype.break = function _break() {
    this.br = true;
};

Structure.prototype.paragraph = function paragraph() {
    this.p = true;
};

Structure.prototype.startOption = function startOption() {
    var option = {
        children: [],
    };
    this.contentCursor = option;
    this.contentCursorParent = option;
    this.content.options.push(option);
    this.p = false;
    this.br = false;
    this.carry = '';
};

Structure.prototype.stopOption = function stopOption() {
    this.p = false;
    this.br = false;
};

Structure.prototype.flush = function flush() {
    // No-op (for console only)
};

Structure.prototype.pardon = function pardon() {
    // No-op (for console only)
};

Structure.prototype.display = function display() {
    this.onDisplay(this.content);
};

Structure.prototype.clear = function clear() {
    this.createPage();
    this.br = false;
    this.p = true;
    this.carry = '';
};

Structure.prototype.createPage = function createPage() {
    this.content = {
        body: {
            children: [],
        },
        options: [],
    };
    this.contentCursorParent = this.content.body;
    this.contentCursor = null;
};

Structure.prototype.ask = function ask() {
};

Structure.prototype.close = function close() {
};
