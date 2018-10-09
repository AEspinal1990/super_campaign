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
let CampaignManager = class CampaignManager {
    constructor(ID, campaignID, currentCampaigns) {
        this._ID = ID;
        this._campaignID = campaignID;
        this._currentCampaigns = currentCampaigns;
    }
    get ID() {
        return this._ID;
    }
    get campaignID() {
        return this._campaignID;
    }
    get currentCampaigns() {
        return this._currentCampaigns;
    }
    set ID(value) {
        this._ID = value;
    }
    set campaignID(value) {
        this._campaignID = value;
    }
    set currentCampaigns(value) {
        this._currentCampaigns = value;
    }
    // public createCampaign():Campaign{
    // }
    deleteCampaign(campaignID) {
        var index = this._currentCampaigns.indexOf(campaignID);
        if (index != -1) {
            this._currentCampaigns.splice(index, 1);
            // delete from DB
        }
    }
    // public editCampaign(campaign:Campaign):Campaign{
    // }
    // public createAssignment():Assignment{
    // }
    editAssignment(assignment) {
    }
    addManager(managerID, campaignID) {
    }
    removeManager(managerID, campaignID) {
    }
    addCanvasser(canvasserID, campaignID) {
    }
    removeCanvasser(canvasserID, campaignID) {
    }
    addLocation(location, campaignID) {
    }
    removeLocation(locationID, campaignID) {
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "ID" }),
    __metadata("design:type", Number)
], CampaignManager.prototype, "_ID", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: "campaignID" }),
    __metadata("design:type", Number)
], CampaignManager.prototype, "_campaignID", void 0);
CampaignManager = __decorate([
    typeorm_1.Entity({ name: "Manager" }),
    __metadata("design:paramtypes", [Number, Number, Array])
], CampaignManager);
//# sourceMappingURL=CampaignManager.js.map