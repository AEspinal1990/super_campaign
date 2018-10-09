class Result {
    constructor(ID, location, canvasser, answers, rating) {
        this._ID = ID;
        this._location = location;
        this._canvasserID = canvasser;
        this._answers = answers;
        this._rating = rating;
    }
    get ID() {
        return this._ID;
    }
    get location() {
        return this._location;
    }
    get canvasserID() {
        return this._canvasserID;
    }
    get answers() {
        return this._answers;
    }
    get rating() {
        return this._rating;
    }
    set ID(value) {
        this._ID = value;
    }
    set location(value) {
        this._location = value;
    }
    set canvasserID(value) {
        this._canvasserID = value;
    }
    set answers(value) {
        this._answers = value;
    }
    set rating(value) {
        this._rating = value;
    }
}
//# sourceMappingURL=Result.js.map