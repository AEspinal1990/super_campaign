import {Entity, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm";
import { Campaign } from "./Campaign";

@Entity()
export class TalkPoint{
    @ManyToOne(type => Campaign, {primary: true})
    private _campaignID!:Campaign;
    @PrimaryColumn({name: "talk"})
    private _talk!:string;
    
    // constructor (campaignID:Campaign, talk:string){
    //     this._campaignID = campaignID;
    //     this._talk = talk;
    // }

    public get campaignID(){
        return this._campaignID;
    }
    public get talk(){
        return this._talk;
    }
    public set campaignID(campaignID:Campaign){
        this._campaignID = campaignID;
    }
    public set talk(talk:string){
        this._talk = talk;
    }
}