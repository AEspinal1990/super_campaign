class Canvasser {
    constructor(ID, tasksRemaining, tasksCompleted, datesAvailable, datesAssigned) {
        this._ID = ID;
        this._tasksRemaining = tasksRemaining;
        this._tasksCompleted = tasksCompleted;
        this._datesAvailable = datesAvailable;
        this._datesAssigned = datesAssigned;
    }
    get ID() {
        return this._ID;
    }
    get tasksRemaining() {
        return this._tasksRemaining;
    }
    get tasksCompleted() {
        return this._tasksCompleted;
    }
    get datesAvailable() {
        return this._datesAvailable;
    }
    get datesAssigned() {
        return this._datesAssigned;
    }
    set ID(value) {
        this._ID = value;
    }
    set tasksRemaining(value) {
        this._tasksRemaining = value;
    }
    set tasksCompleted(value) {
        this._tasksCompleted = value;
    }
    set datesAvailable(value) {
        this._datesAvailable = value;
    }
    set datesAssigned(value) {
        this._datesAssigned = value;
    }
    editAvailability(date) {
    }
}
//# sourceMappingURL=Canvasser.js.map