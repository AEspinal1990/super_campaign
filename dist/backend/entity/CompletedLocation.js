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
let CompletedLocation = class CompletedLocation {
    constructor(ID, locationID, resultID) {
        this._ID = ID;
        this._locationID = locationID;
        this._resultID = resultID;
    }
    get ID() {
        return this._ID;
    }
    get locationID() {
        return this._locationID;
    }
    get resultID() {
        return this._resultID;
    }
    set ID(ID) {
        this._ID = ID;
    }
    set locationID(locationID) {
        this._locationID = locationID;
    }
    set resultID(resultID) {
        this._resultID = resultID;
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "ID" }),
    __metadata("design:type", Number)
], CompletedLocation.prototype, "_ID", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: "locationID" }),
    __metadata("design:type", Number)
], CompletedLocation.prototype, "_locationID", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: "resultID" }),
    __metadata("design:type", Number)
], CompletedLocation.prototype, "_resultID", void 0);
CompletedLocation = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, Number, Number])
], CompletedLocation);
exports.CompletedLocation = CompletedLocation;
//# sourceMappingURL=CompletedLocation.js.map