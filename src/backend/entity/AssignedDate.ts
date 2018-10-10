import {Entity, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm";
import { Canvasser } from "./Canvasser";

@Entity()
export class AssignedDate{
    @ManyToOne(type => Canvasser, {primary: true})
    private _canvasserID!:Canvasser;
    @PrimaryColumn({name: "assignedDate"})
    private _assignedDate!:Date;

    // constructor (canvasserID:Canvasser, assignedDate:Date){
    //     this._canvasserID = canvasserID;
    //     this._assignedDate = assignedDate;
    // }

    public get canvasserID(): Canvasser{
        return this._canvasserID;
    }
    public get assignedDate(): Date{
        return this._assignedDate;
    }
    public set canvasserID(canvasserID:Canvasser){
        this._canvasserID = canvasserID;
    }
    public set assignedDate(assignedDate:Date){
        this._assignedDate = assignedDate;
    }
}