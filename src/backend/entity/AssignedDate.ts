import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class AssignedDate{
    @PrimaryColumn({name: "canvasserID"})
    private _canvasserID:number;
    @PrimaryColumn({name: "assignedDate"})
    private _assignedDate:Date;

    constructor (canvasserID:number, assignedDate:Date){
        this._canvasserID = canvasserID;
        this._assignedDate = assignedDate;
    }

    public get canvasserID(){
        return this._canvasserID;
    }
    public get assignedDate(){
        return this._assignedDate;
    }
    public set canvasserID(canvasserID:number){
        this._canvasserID = canvasserID;
    }
    public set assignedDate(assignedDate:Date){
        this._assignedDate = assignedDate;
    }
}