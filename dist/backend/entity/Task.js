"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Locations_1 = require("./Locations");
let Task = class Task {
    constructor(ID, canvasserID, campaignID, remainingLocations, completedLocations, currentLocation, recommendedRoute, scheduledOn, status) {
        this._ID = ID;
        this._canvaserID = canvasserID;
        this._campaignID = campaignID;
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
    get campaignID() {
        return this._campaignID;
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
    set campaignID(campaignId) {
        this._campaignID = campaignId;
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
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Task.prototype, "_ID", void 0);
__decorate([
    typeorm_1.Column({ name: "canvasserID" }),
    __metadata("design:type", Number)
], Task.prototype, "_canvaserID", void 0);
__decorate([
    typeorm_1.Column({ name: "campaignID" }),
    __metadata("design:type", Number)
], Task.prototype, "_campaignID", void 0);
__decorate([
    typeorm_1.Column({ name: "ofDate" }),
    __metadata("design:type", Date)
], Task.prototype, "_scheduledOn", void 0);
__decorate([
    typeorm_1.Column({ name: "taskStatus" }),
    __metadata("design:type", Boolean)
], Task.prototype, "_status", void 0);
Task = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, Number, Number, Array, Array, Locations_1.Locations, Array, Date, Boolean])
], Task);
exports.Task = Task;
//# sourceMappingURL=Task.js.map