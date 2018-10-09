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
let Assignment = class Assignment {
    constructor(ID, taskID, campaignID, task) {
        this._ID = ID;
        this._taskID = taskID;
        this._campaignID = campaignID;
        this._task = task;
    }
    get ID() {
        return this._ID;
    }
    get taskID() {
        return this._taskID;
    }
    get campaignID() {
        return this._campaignID;
    }
    get task() {
        return this._task;
    }
    set ID(value) {
        this._ID = value;
    }
    set taskID(taskID) {
        this._taskID = taskID;
    }
    set campaignID(value) {
        this._campaignID = value;
    }
    set task(value) {
        this._task = value;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Assignment.prototype, "_ID", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Assignment.prototype, "_taskID", void 0);
__decorate([
    typeorm_1.Column({ name: "campaignID" }),
    __metadata("design:type", Number)
], Assignment.prototype, "_campaignID", void 0);
Assignment = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, Number, Number, Array])
], Assignment);
exports.Assignment = Assignment;
//# sourceMappingURL=Assignment.js.map