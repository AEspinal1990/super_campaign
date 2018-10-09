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
const Assignment_1 = require("./Assignment");
let Campaign = class Campaign {
    constructor(ID, name, managers, canvassers, assignment, locations, startDate, endDate, avgDuration, questionaire, talkingPoints) {
        this._ID = ID;
        this._name = name;
        this._managers = managers;
        this._canvassers = canvassers;
        this._assignment = assignment;
        this._locations = locations;
        this._startDate = startDate;
        this._endDate = endDate;
        this._avgDuration = avgDuration;
        this._questionaire = questionaire;
        this._talkingPoints = talkingPoints;
    }
    get ID() {
        return this._ID;
    }
    get name() {
        return this._name;
    }
    get managers() {
        return this._managers;
    }
    get canvassers() {
        return this._canvassers;
    }
    get assignment() {
        return this._assignment;
    }
    get locations() {
        return this._locations;
    }
    get startDate() {
        return this._startDate;
    }
    get EndDate() {
        return this._endDate;
    }
    get avgDuration() {
        return this._avgDuration;
    }
    get questionaire() {
        return this._questionaire;
    }
    get talkingPoints() {
        return this._talkingPoints;
    }
    set ID(ID) {
        this._ID = ID;
    }
    set name(name) {
        this._name = name;
    }
    set managers(managers) {
        this._managers = managers;
    }
    set canvassers(canvassers) {
        this._canvassers = canvassers;
    }
    set assignment(assignemnt) {
        this._assignment = assignemnt;
    }
    set locations(locations) {
        this._locations = locations;
    }
    set startDate(startDate) {
        this._startDate = startDate;
    }
    set endDate(endDate) {
        this._endDate = endDate;
    }
    set avgDuration(avgDuration) {
        this._avgDuration = avgDuration;
    }
    set questionaire(questionaire) {
        this._questionaire = questionaire;
    }
    set talkingPoints(talkingPoints) {
        this._talkingPoints = talkingPoints;
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Campaign.prototype, "_ID", void 0);
__decorate([
    typeorm_1.Column({ name: "campaignName" }),
    __metadata("design:type", String)
], Campaign.prototype, "_name", void 0);
__decorate([
    typeorm_1.Column({ name: "startDate" }),
    __metadata("design:type", Date)
], Campaign.prototype, "_startDate", void 0);
__decorate([
    typeorm_1.Column({ name: "endDate" }),
    __metadata("design:type", Date)
], Campaign.prototype, "_endDate", void 0);
__decorate([
    typeorm_1.Column({ name: "avgDuration" }),
    __metadata("design:type", Number)
], Campaign.prototype, "_avgDuration", void 0);
Campaign = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, String, Array, Array, Assignment_1.Assignment, Array, Date, Date, Number, Array, Array])
], Campaign);
exports.Campaign = Campaign;
//# sourceMappingURL=Campaign.js.map