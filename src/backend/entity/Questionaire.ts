import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Questionaire{
    @PrimaryColumn({name: "campaignID"})
    private _campaignID:number;
    @PrimaryColumn({name: "question"})
    private _question:string;
    
    constructor (campaignID:number, question:string){
        this._campaignID = campaignID;
        this._question = question;
    }

    public get campaignID(){
        return this._campaignID;
    }
    public get question(){
        return this._question;
    }
    public set campaignID(campaignID:number){
        this._campaignID = campaignID;
    }
    public set question(question:string){
        this._question = question;
    }
}