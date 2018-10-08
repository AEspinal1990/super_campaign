"use strict";
class Task {
    constructor(ID, canvasserID, remainingLocations, completedLocations, currentLocation, recommendedRoute, scheduledOn, status) {
        this._ID = ID;
        this._canvaserID = canvasserID;
        this._remainingLocations = remainingLocations;
        this._completedLocations = completedLocations;
        this._currentLocation = currentLocation;
        this._recommendedRoute = recommendedRoute;
        this._scheduledOn = scheduledOn;
        this._status = status;
    }
    get ID() {
        return this._ID;
    }
    get canvasserID() {
        return this._canvaserID;
    }
    get remainingLocations() {
        return this._remainingLocations;
    }
    get completedLocations() {
        return this._completedLocations;
    }
    get currentLocation() {
        return this._currentLocation;
    }
    get recommendedRoute() {
        return this._recommendedRoute;
    }
    get scheduledOn() {
        return this._scheduledOn;
    }
    get status() {
        return this._status;
    }
    set ID(ID) {
        this._ID = ID;
    }
    set canvasserID(canvasserID) {
        this._canvaserID = canvasserID;
    }
    set remainingLocations(locations) {
        this._remainingLocations = locations;
    }
    set completedLocations(locations) {
        this._completedLocations = locations;
    }
    set currentLocation(location) {
        this._currentLocation = location;
    }
    set recommendedRoute(route) {
        this._recommendedRoute = route;
    }
    set scheduledOn(date) {
        this._scheduledOn = date;
    }
    set status(stat) {
        this._status = stat;
    }
    /*
        returns: -1 for invalid locationID, 0 for successfully marking complete, 1 for completed task
    */
    markCompleted(locationID) {
        var index = this._remainingLocations.indexOf(locationID);
        if (index != -1) {
            this._remainingLocations.splice(index, 1);
            this._completedLocations.push(locationID);
        }
        else {
            return -1;
        }
        if (this._remainingLocations.length == 0) {
            this._status = true;
            return 1;
        }
        return 0;
    }
}
//# sourceMappingURL=Task.js.map