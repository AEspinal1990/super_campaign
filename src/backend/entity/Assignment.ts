import {Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne} from "typeorm"
import { Task } from "./Task";
import { Campaign } from "./Campaign";

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @OneToMany(type => Task, task => task.assignment, {cascade: true})
    private _tasks!:Task[];
    // @OneToOne(type => Campaign, {cascade: true})
    // private _campaign!:Campaign

    public get ID(): number {
        return this._ID;
    }
    public get tasks(): Task[] {
        return this._tasks;
    }
    // public get campaign(): Campaign {
    //     return this._campaign;
    // }
    public set ID(value: number) {
        this._ID = value;
    }
    public set tasks(taskID:Task[]){
        this._tasks = taskID;
    }
    // public set campaign(value: Campaign){
    //     this._campaign = value;
    // }
}