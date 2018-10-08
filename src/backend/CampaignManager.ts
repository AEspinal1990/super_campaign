
class CampaignManager {
    private _ID: number;
    private _currentCampaigns: number[];

    constructor (ID:number, currentCampaigns:number[]){
        this._ID = ID;
        this._currentCampaigns = currentCampaigns;
    }

    public get ID(): number {
        return this._ID;
    }
    public get currentCampaigns(): number[] {
        return this._currentCampaigns;
    }
    public set ID(value: number) {
        this._ID = value;
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

    public addLocation(location:Location, campaignID:number){

    }

    public removeLocation(locationID:number, campaignID:number){

    }
}