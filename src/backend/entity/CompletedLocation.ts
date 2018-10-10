import {Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, Column, OneToMany} from "typeorm";
import { Locations } from "./Locations";
import { Results } from "./Results";
import { Task } from "./Task";

@Entity()
export class CompletedLocation {
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!:number;
    @OneToMany(type => Locations, loc => loc.completedLocation)
    private _locationID!:Locations[];
    @OneToMany(type => Results, res => res.completedLocation)
    private _resultID!:Results[];
    @ManyToOne(type => Task)
    private _task!:Task;

    // constructor (ID:number, locationID:Locations, resultID:Results, task:Task){
    //     this._ID = ID;
    //     this._locationID = locationID;
    //     this._resultID = resultID;
    //     this._task = task;
    // }

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