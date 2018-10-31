import {Entity, Column, OneToMany, JoinColumn, ManyToMany, JoinTable, PrimaryGeneratedColumn} from "typeorm";
import { Canvasser } from "./Canvasser";

@Entity()
export class Availability{
    @PrimaryGeneratedColumn({ name: "ID" })
    private _ID!: number;
    @Column({name: "availableDate"})
    private _availableDate!:Date;
    public get availableDate(){
        return this._availableDate;
    }
    public get ID(): number {
        return this._ID;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set availableDate(availableDate:Date){
        this._availableDate = availableDate;
    }
}