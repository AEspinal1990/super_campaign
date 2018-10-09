import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class TalkPoint{
    @PrimaryColumn({name: "campaignID"})
    private _campaignID:number;
    @PrimaryColumn({name: "talk"})
    private _talk:string;
    
    constructor (campaignID:number, talk:string){
        this._campaignID = campaignID;
        this._talk = talk;
    }

    public get campaignID(){
        return this._campaignID;
    }
    public get talk(){
        return this._talk;
    }
    public set campaignID(campaignID:number){
        this._campaignID = campaignID;
    }
    public set talk(talk:string){
        this._talk = talk;
    }
}