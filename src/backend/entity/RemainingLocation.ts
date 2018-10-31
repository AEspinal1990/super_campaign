import {Entity, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinColumn, JoinTable} from "typeorm"
import { Locations } from "./Locations";
import { Task } from "./Task";

@Entity()
export class RemainingLocation{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!:number;
    @ManyToMany(type => Locations, {eager: true, cascade: true})
    @JoinTable({name: "remaining_locations_mapping"})
    private _locationID!:Locations[];
    @OneToOne(type => Task)
    // @JoinColumn({name: "task"})
    private _task!: Task;

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