import {Entity, Column, ManyToOne, JoinColumn} from "typeorm";
import { Canvasser } from "./Canvasser";

@Entity()
export class Availability{
    @ManyToOne(type => Canvasser, {primary: true})
    private _canvasserID!:Canvasser;
    @Column({name: "availableDate", primary: true})
    private _availableDate!:Date;

    // constructor (canvasserID:Canvasser, availableDate:Date){
    //     this._canvasserID = canvasserID;
    //     this._availableDate = availableDate;
    // }

    public get canvasserID(): Canvasser{
        return this._canvasserID;
    }
    public get availableDate(){
        return this._availableDate;
    }
    public set canvasserID(canvasserID:Canvasser){
        this._canvasserID = canvasserID;
    }
    public set availableDate(availableDate:Date){
        this._availableDate = availableDate;
    }
}