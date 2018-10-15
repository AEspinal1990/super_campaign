import {Entity, ManyToMany, OneToOne, JoinColumn, OneToMany, JoinTable} from "typeorm"
import { User } from "./User";
import { Availability } from "./Availability";
import { AssignedDate } from "./AssignedDate";
import { Task } from "./Task";
import { Results } from "./Results";
import { Campaign } from "./Campaign";

@Entity()
export class Canvasser{
    @OneToOne(type => User, {primary: true})
    @JoinColumn()
    private _ID!: User;
    // @ManyToMany(type => Campaign, {nullable: true, cascade: true})
    // private _campaignID!: Campaign[];
    @OneToMany(type => Task, task => task.canvasserID, {cascade: false})
    private _task!:Task[];
    @OneToMany(type => Availability, av => av.canvasserID)
    private _availableDate!: Availability[];
    @ManyToMany(type => AssignedDate)
    @JoinTable({name: "canvasser_assignedDate_mapping"})
    private _assignedDate!:AssignedDate[];
    @ManyToMany(type => Results)
    @JoinTable({name: "canvasser_results_mapping"})
    private _results!: Results[];

    // constructor (ID:User, campaignID:Campaign, tasksRemaining:number[], tasksCompleted:number[], 
    //     datesAvailable:Date[], datesAssigned:Date[]){
    //         this._ID = ID;
    //         this._campaignID = campaignID;
    //         this._tasksRemaining = tasksRemaining;
    //         this._tasksCompleted = tasksCompleted;
    //         this._datesAvailable = datesAvailable;
    //         this._datesAssigned = datesAssigned;
    //     }

    public get ID(): User {
        return this._ID;
    }
    // public get campaignID(): Campaign[] {
    //     return this._campaignID;
    // }
    public get task():Task[] {
        return this._task;
    }
    public get availableDate():Availability[]{
        return this._availableDate;
    }
    // public get datesAvailable(): Date[] {
    //     return this._datesAvailable;
    // }
    public get assignedDate(): AssignedDate[]{
        return this._assignedDate;
    }
    public get results(): Results[] {
        return this._results;
    }
    public set ID(value: User) {
        this._ID = value;
    }
    // public set campaignID(value: Campaign[]) {
    //     this._campaignID = value;
    // }
    public set task(value:Task[]){
        this._task = value;
    }
    public set availableDate(value:Availability[]){
        this._availableDate = value;
    }
    public set assignedDate(value:AssignedDate[]){
        this._assignedDate = value;
    }
    public set results(value: Results[]) {
        this._results = value;
    }

    public editAvailability(date:Date){

    }

    // public isAvailable(sDate:Date, eDate:Date):Date[]{

    // }
}