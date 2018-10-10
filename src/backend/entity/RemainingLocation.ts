import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Column} from "typeorm"
import { Locations } from "./Locations";
import { Task } from "./Task";

@Entity()
export class RemainingLocation{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!:number;
    @OneToMany(type => Locations, loc => loc.remainingLocation)
    private _locationID!:Locations[];
    @OneToOne(type => Task)
    private _taskID!: number;

    // constructor (ID:number, locationID:Locations, task:Task){
    //     this._ID = ID;
    //     this._locationID = locationID;
    //     this._task = task;
    // }

    public get ID(){
        return this._ID;
    }
    public get locationID(){
        return this._locationID;
    }
    public get task(){
        return this._taskID;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set locationID(locationID:Locations[]){
        this._locationID = locationID;
    }
    public set task(task:number){
        this._taskID = task;
    }
}