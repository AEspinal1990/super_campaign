"use strict";
class Assignment {
    constructor(ID, task) {
        this._ID = ID;
        this._task = task;
    }
    get ID() {
        return this._ID;
    }
    get task() {
        return this._task;
    }
    set ID(value) {
        this._ID = value;
    }
    set task(value) {
        this._task = value;
    }
}
//# sourceMappingURL=Assignment.js.map