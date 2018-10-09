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
let User = class User {
    constructor(username, name, permission, employeeID) {
        this._username = username;
        this._name = name;
        this._permission = permission;
        this._employeeID = employeeID;
    }
    get username() {
        return this._username;
    }
    get name() {
        return this._name;
    }
    get permission() {
        return this._permission;
    }
    get employeeID() {
        return this._employeeID;
    }
    set username(value) {
        this._username = value;
    }
    set name(value) {
        this._name = value;
    }
    set permission(value) {
        this._permission = value;
    }
    set employeeID(value) {
        this._employeeID = value;
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "username" }),
    __metadata("design:type", String)
], User.prototype, "_username", void 0);
__decorate([
    typeorm_1.Column({ name: "fullName" }),
    __metadata("design:type", String)
], User.prototype, "_name", void 0);
__decorate([
    typeorm_1.Column({ name: "permission" }),
    __metadata("design:type", Number)
], User.prototype, "_permission", void 0);
__decorate([
    typeorm_1.Column({ name: "employeeID" }),
    __metadata("design:type", Number)
], User.prototype, "_employeeID", void 0);
User = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, String, Number, Number])
], User);
exports.User = User;
//# sourceMappingURL=User.js.map