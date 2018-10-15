import {Entity, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinColumn, OneToMany, Column, JoinTable} from "typeorm"
import { Locations } from "./Locations";
import { Task } from "./Task";

@Entity()
export class RemainingLocation{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!:number;
    @ManyToMany(type => Locations, {primary: true})
    @JoinTable({name: "remaining_locations_mapping"})
    private _locationID!:Locations[];
    @OneToOne(type => Task)
    @JoinColumn()
    private _taskID!: Task;

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
    public set task(task:Task){
        this._taskID = task;
    }
}