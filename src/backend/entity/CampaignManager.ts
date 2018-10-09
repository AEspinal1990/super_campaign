import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({name: "Manager"})
class CampaignManager {
    @PrimaryColumn({name: "ID"})
    private _ID: number;
    @PrimaryColumn({name: "campaignID"})
    private _campaignID:number;
    private _currentCampaigns: number[];

    constructor (ID:number, campaignID:number, currentCampaigns:number[]){
        this._ID = ID;
        this._campaignID = campaignID;
        this._currentCampaigns = currentCampaigns;
    }

    public get ID(): number {
        return this._ID;
    }
    public get campaignID(): number {
        return this._campaignID;
    }
    public get currentCampaigns(): number[] {
        return this._currentCampaigns;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set campaignID(value: number) {
        this._campaignID = value;
    }
    public set currentCampaigns(value: number[]) {
        this._currentCampaigns = value;
    }

    // public createCampaign():Campaign{

    // }

    public deleteCampaign(campaignID:number){
        var index = this._currentCampaigns.indexOf(campaignID);
        if (index != -1){
            this._currentCampaigns.splice(index, 1);

            // delete from DB
        }
    }

    // public editCampaign(campaign:Campaign):Campaign{

    // }

    // public createAssignment():Assignment{

    // }

    public editAssignment(assignment:Assignment){

    }

    public addManager(managerID:number, campaignID:number){
        
    }

    public removeManager(managerID:number, campaignID:number){

    }

    public addCanvasser(canvasserID:number, campaignID:number){

    }

    public removeCanvasser(canvasserID:number, campaignID:number){

    }

    public addLocation(location:Locations, campaignID:number){

    }

    public removeLocation(locationID:number, campaignID:number){

    }
}