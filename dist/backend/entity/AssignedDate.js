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
let AssignedDate = class AssignedDate {
    constructor(canvasserID, assignedDate) {
        this._canvasserID = canvasserID;
        this._assignedDate = assignedDate;
    }
    get canvasserID() {
        return this._canvasserID;
    }
    get assignedDate() {
        return this._assignedDate;
    }
    set canvasserID(canvasserID) {
        this._canvasserID = canvasserID;
    }
    set assignedDate(assignedDate) {
        this._assignedDate = assignedDate;
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "canvasserID" }),
    __metadata("design:type", Number)
], AssignedDate.prototype, "_canvasserID", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: "assignedDate" }),
    __metadata("design:type", Date)
], AssignedDate.prototype, "_assignedDate", void 0);
AssignedDate = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, Date])
], AssignedDate);
exports.AssignedDate = AssignedDate;
//# sourceMappingURL=AssignedDate.js.map