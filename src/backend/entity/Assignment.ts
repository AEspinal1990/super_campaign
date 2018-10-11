import {Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne} from "typeorm"
import { Task } from "./Task";
import { Campaign } from "./Campaign";

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @OneToMany(type => Task, task => task.assignment, {cascade: true})
    private _taskID!:Task[];
    @OneToOne(type => Campaign, {cascade: true})
    private _campaignID!:Campaign;
    private _task!: number[];

    // constructor (ID:number, taskID:Task, campaignID:Campaign, task:number[]){
    //     this._ID = ID;
    //     this._taskID = taskID;
    //     this._campaignID = campaignID;
    //     this._task = task;
    // }

    public get ID(): number {
        return this._ID;
    }
    public get taskID(): Task[] {
        return this._taskID;
    }
    public get campaignID(): Campaign {
        return this._campaignID;
    }
    public get task(): number[] {
        return this._task;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set taskID(taskID:Task[]){
        this._taskID = taskID;
    }
    public set campaignID(value: Campaign){
        this._campaignID = value;
    }
    public set task(value: number[]) {
        this._task = value;
    }
}