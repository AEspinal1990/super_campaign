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
let Result = class Result {
    constructor(ID, location, canvasser, answer, answerNumber, answers, rating) {
        this._ID = ID;
        this._locationID = location;
        this._canvasserID = canvasser;
        this._answer = answer;
        this._answerNumber = answerNumber;
        this._answers = answers;
        this._rating = rating;
    }
    get ID() {
        return this._ID;
    }
    get location() {
        return this._locationID;
    }
    get canvasserID() {
        return this._canvasserID;
    }
    get answer() {
        return this._answer;
    }
    get answerNumber() {
        return this._answerNumber;
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
        this._locationID = value;
    }
    set canvasserID(value) {
        this._canvasserID = value;
    }
    set answer(answer) {
        this._answer = answer;
    }
    set answerNumber(answerNumber) {
        this._answerNumber = answerNumber;
    }
    set answers(value) {
        this._answers = value;
    }
    set rating(value) {
        this._rating = value;
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Result.prototype, "_ID", void 0);
__decorate([
    typeorm_1.Column({ name: "locationID" }),
    __metadata("design:type", Number)
], Result.prototype, "_locationID", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: "canvasserID" }),
    __metadata("design:type", Number)
], Result.prototype, "_canvasserID", void 0);
__decorate([
    typeorm_1.Column({ name: "result" }),
    __metadata("design:type", Boolean)
], Result.prototype, "_answer", void 0);
__decorate([
    typeorm_1.Column({ name: "resultNum" }),
    __metadata("design:type", Number)
], Result.prototype, "_answerNumber", void 0);
__decorate([
    typeorm_1.Column({ name: "rating" }),
    __metadata("design:type", Number)
], Result.prototype, "_rating", void 0);
Result = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, Number, Number, Boolean, Number, Array, Number])
], Result);
//# sourceMappingURL=Result.js.map