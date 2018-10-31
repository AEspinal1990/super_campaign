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
    private _locations!:Locations[];
    @OneToMany(type => Results, res => res.completedLocation)
    private _results!:Results[];
    @OneToOne(type => Task, {cascade: true})
    // @JoinColumn({name: "task"})
    private _task!:Task;

    public get ID(): number{
        return this._ID;
    }
    public get locations(): Locations[]{
        return this._locations;
    }
    public get results(): Results[]{
        return this._results;
    }
    public get task():Task{
        return this._task;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set locations(locationID:Locations[]){
        this._locations = locationID;
    }
    public set results(resultID:Results[]){
        this._results = resultID;
    }
    public set task(task:Task){
        this._task = task;
    }
}