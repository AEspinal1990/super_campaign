import {Entity, ManyToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, Column, OneToMany, JoinTable} from "typeorm";
import { Locations } from "./Locations";
import { Results } from "./Results";
import { Task } from "./Task";

@Entity()
export class CompletedLocation {
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!:number;
    @ManyToMany(type => Locations)
    @JoinTable({name: "completed_locations_mapping"})
    private _locationID!:Locations[];
    @OneToMany(type => Results, res => res.completedLocation)
    private _resultID!:Results[];
    @ManyToOne(type => Task, tas => tas.completedLocations, {primary: true, cascade: true})
    @JoinColumn({name: "taskID"})
    private _task!:Task;

    public get ID(): number{
        return this._ID;
    }
    public get locationID(): Locations[]{
        return this._locationID;
    }
    public get resultID(): Results[]{
        return this._resultID;
    }
    public get task():Task{
        return this._task;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set locationID(locationID:Locations[]){
        this._locationID = locationID;
    }
    public set resultID(resultID:Results[]){
        this._resultID = resultID;
    }
    public set task(task:Task){
        this._task = task;
    }
}