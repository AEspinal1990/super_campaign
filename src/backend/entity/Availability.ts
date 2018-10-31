import {Entity, Column, OneToMany, JoinColumn, ManyToMany, JoinTable, PrimaryGeneratedColumn} from "typeorm";
import { Canvasser } from "./Canvasser";

@Entity()
export class Availability{
    @PrimaryGeneratedColumn({ name: "ID" })
    private _ID!: number;
    @Column({name: "availableDate"})
    private _availableDate!:Date;
    // @ManyToMany(type => Canvasser, {cascade: true})
    // @JoinTable({name: "canvasser_availability_mapping"})
    // private _canvasser!:Canvasser[];

    // public get canvasserID(): Canvasser[]{
    //     return this._canvasser;
    // }
    public get availableDate(){
        return this._availableDate;
    }
    public get ID(): number {
        return this._ID;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    // public set canvasserID(canvasserID:Canvasser[]){
    //     this._canvasser = canvasserID;
    // }
    public set availableDate(availableDate:Date){
        this._availableDate = availableDate;
    }
}