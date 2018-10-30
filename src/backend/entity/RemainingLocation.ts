import {Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable} from "typeorm"
import { Locations } from "./Locations";
import { Task } from "./Task";

@Entity()
export class RemainingLocation{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!:number;
    @ManyToMany(type => Locations, {primary: true})
    @JoinTable({name: "remaining_locations_mapping"})
    private _locationID!:Locations[];
    @ManyToOne(type => Task, tas => tas.remainingLocations)
    @JoinColumn({name: "taskID"})
    private _task!: Task;

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
        return this._task;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set locationID(locationID:Locations[]){
        this._locationID = locationID;
    }
    public set task(task:Task){
        this._task = task;
    }
}