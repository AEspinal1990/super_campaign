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
let Canvasser = class Canvasser {
    constructor(ID, campaignID, tasksRemaining, tasksCompleted, datesAvailable, datesAssigned) {
        this._ID = ID;
        this._campaignID = campaignID;
        this._tasksRemaining = tasksRemaining;
        this._tasksCompleted = tasksCompleted;
        this._datesAvailable = datesAvailable;
        this._datesAssigned = datesAssigned;
    }
    get ID() {
        return this._ID;
    }
    get campaignID() {
        return this._campaignID;
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
    set campaignID(value) {
        this._campaignID = value;
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
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Canvasser.prototype, "_ID", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: "campaignID" }),
    __metadata("design:type", Number)
], Canvasser.prototype, "_campaignID", void 0);
Canvasser = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, Number, Array, Array, Array, Array])
], Canvasser);
exports.Canvasser = Canvasser;
//# sourceMappingURL=Canvasser.js.map