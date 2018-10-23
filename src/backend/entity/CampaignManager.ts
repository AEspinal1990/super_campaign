import {OneToOne, JoinColumn, Entity} from "typeorm";
import { User } from "./User";
import { Locations } from "./Locations";
import { Assignment } from "./Assignment";

@Entity({name: "Manager"})
export class CampaignManager {
    @OneToOne(type => User, {primary: true, cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn()
    private _ID!: User;
    private _currentCampaigns!: number[];

    public get ID(): User {
        return this._ID;
    }
    public get currentCampaigns(): number[] {
        return this._currentCampaigns;
    }
    public set ID(value: User) {
        this._ID = value;
    }
    public set currentCampaigns(value: number[]) {
        this._currentCampaigns = value;
    }
    
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