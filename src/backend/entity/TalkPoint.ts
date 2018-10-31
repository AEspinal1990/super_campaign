import {Entity, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm";
import { Campaign } from "./Campaign";

@Entity()
export class TalkPoint{
    @ManyToOne(type => Campaign, {primary: true, eager: true})
    private _campaign!:Campaign;
    @PrimaryColumn({name: "talk"})
    private _talk!:string;

    public get campaign(){
        return this._campaign;
    }
    public get talk(){
        return this._talk;
    }
    public set campaign(campaign:Campaign){
        this._campaign = campaign;
    }
    public set talk(talk:string){
        this._talk = talk;
    }
}