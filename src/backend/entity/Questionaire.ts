import {Entity, PrimaryColumn, ManyToOne} from "typeorm";
import { Campaign } from "./Campaign";

@Entity()
export class Questionaire{
    @ManyToOne(type => Campaign, {primary: true, eager: true})
    private _campaign!:Campaign;
    @PrimaryColumn({name: "question"})
    private _question!:string;

    public get campaign(){
        return this._campaign;
    }
    public get question(){
        return this._question;
    }
    public set campaign(campaign:Campaign){
        this._campaign = campaign;
    }
    public set question(question:string){
        this._question = question;
    }
}