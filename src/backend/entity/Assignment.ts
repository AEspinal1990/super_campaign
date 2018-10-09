import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class Assignment {
    @PrimaryColumn()
    private _ID: number;
    @PrimaryColumn()
    private _taskID:number;
    @Column({name: "campaignID"})
    private _campaignID:number;
    private _task: number[];

    constructor (ID:number, taskID:number, campaignID:number, task:number[]){
        this._ID = ID;
        this._taskID = taskID;
        this._campaignID = campaignID;
        this._task = task;
    }

    public get ID(): number {
        return this._ID;
    }
    public get taskID(): number {
        return this._taskID;
    }
    public get campaignID(): number {
        return this._campaignID;
    }
    public get task(): number[] {
        return this._task;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set taskID(taskID:number){
        this._taskID = taskID;
    }
    public set campaignID(value: number){
        this._campaignID = value;
    }
    public set task(value: number[]) {
        this._task = value;
    }
}