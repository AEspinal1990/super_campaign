import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Availability{
    @PrimaryColumn({name: "canvasserID"})
    private _canvasserID:number;
    @PrimaryColumn({name: "availableDate"})
    private _availableDate:Date;

    constructor (canvasserID:number, availableDate:Date){
        this._canvasserID = canvasserID;
        this._availableDate = availableDate;
    }

    public get canvasserID(){
        return this._canvasserID;
    }
    public get availableDate(){
        return this._availableDate;
    }
    public set canvasserID(canvasserID:number){
        this._canvasserID = canvasserID;
    }
    public set availableDate(availableDate:Date){
        this._availableDate = availableDate;
    }
}