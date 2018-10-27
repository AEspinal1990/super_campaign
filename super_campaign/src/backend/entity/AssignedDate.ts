import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { Canvasser } from "./Canvasser";

@Entity()
export class AssignedDate{
    @PrimaryGeneratedColumn({ name: "ID" })
    private _ID: number;
    @ManyToOne(type => Canvasser, can => can.ID)
    @JoinColumn()
    private _canvasserID!:Canvasser;
    @Column({name: "assignedDate"})
    private _assignedDate!:Date;

    public get canvasserID(): Canvasser{
        return this._canvasserID;
    }
    public get assignedDate(): Date{
        return this._assignedDate;
    }
    public get ID(): number {
        return this._ID;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set canvasserID(canvasserID:Canvasser){
        this._canvasserID = canvasserID;
    }
    public set assignedDate(assignedDate:Date){
        this._assignedDate = assignedDate;
    }
}