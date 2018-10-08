"use strict";
class CampaignManager {
    constructor(ID, currentCampaigns) {
        this._ID = ID;
        this._currentCampaigns = currentCampaigns;
    }
    get ID() {
        return this._ID;
    }
    get currentCampaigns() {
        return this._currentCampaigns;
    }
    set ID(value) {
        this._ID = value;
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
}
//# sourceMappingURL=CampaignManager.js.map