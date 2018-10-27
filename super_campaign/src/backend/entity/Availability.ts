import {Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable} from "typeorm";
import { Canvasser } from "./Canvasser";

@Entity()
export class Availability{
    @Column({name: "availableDate", primary: true})
    private _availableDate!:Date;
    @ManyToMany(type => Canvasser, can => can.availableDate, {cascade: true})
    private _canvasser!:Canvasser[];

    // constructor (canvasserID:Canvasser, availableDate:Date){
    //     this._canvasserID = canvasserID;
    //     this._availableDate = availableDate;
    // }

    public get canvasserID(): Canvasser[]{
        return this._canvasser;
    }
    public get availableDate(){
        return this._availableDate;
    }
    public set canvasserID(canvasserID:Canvasser[]){
        this._canvasser = canvasserID;
    }
    public set availableDate(availableDate:Date){
        this._availableDate = availableDate;
    }
}