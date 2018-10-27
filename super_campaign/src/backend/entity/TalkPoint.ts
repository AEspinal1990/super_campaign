import {Entity, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm";
import { Campaign } from "./Campaign";

@Entity()
export class TalkPoint{
    @ManyToOne(type => Campaign, {primary: true})
    private _campaignID!:Campaign;
    @PrimaryColumn({name: "talk"})
    private _talk!:string;

    public get campaignID(){
        return this._campaignID;
    }
    public get talk(){
        return this._talk;
    }
    public set campaignID(campaign:Campaign){
        this._campaignID = campaign;
    }
    public set talk(talk:string){
        this._talk = talk;
    }
}