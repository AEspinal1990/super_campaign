import {Entity, Column, ManyToOne} from "typeorm";
import { Campaign } from "./Campaign";

@Entity()
export class Questionaire{
    @ManyToOne(type => Campaign, {primary: true, eager: true})
    private _campaignID!:Campaign;
    @Column({name: "question"})
    private _question!:string;
    
    // constructor (campaignID:Campaign, question:string){
    //     this._campaignID = campaignID;
    //     this._question = question;
    // }

    public get campaignID(){
        return this._campaignID;
    }
    public get question(){
        return this._question;
    }
    public set campaignID(campaignID:Campaign){
        this._campaignID = campaignID;
    }
    public set question(question:string){
        this._question = question;
    }
}