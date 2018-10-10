import {Entity, ManyToMany, OneToOne, JoinColumn, OneToMany, JoinTable} from "typeorm"
import { User } from "./User";
import { Campaign } from "./Campaign";
import { Availability } from "./Availability";
import { AssignedDate } from "./AssignedDate";
import { Task } from "./Task";
import { Results } from "./Results";

@Entity()
export class Canvasser{
    @OneToOne(type => User, {primary: true})
    @JoinColumn()
    private _ID!: User;
    // @ManyToMany(type => Campaign)

    // Issue with Canvasser and Campaign relations
    private _campaignID!:number[];
    @OneToMany(type => Task, task => task.canvasserID, {nullable: true})
    private _task!:Task[];
    // private _tasksRemaining!: number[];
    // private _tasksCompleted!: number[];
    @OneToMany(type => Availability, av => av.canvasserID, {nullable: true})
    private _availableDate!: Availability[];
    private _datesAvailable!: Date[];
    @OneToMany(type => AssignedDate, ad => ad.canvasserID, {nullable:true})
    private _assignedDate!:AssignedDate[];
    private _datesAssigned!: Date[];
    @OneToMany(type => Results, rs => rs.canvasserID)
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
    public get campaignID(): number[] {
        return this._campaignID;
    }
    // public get tasksRemaining(): number[] {
    //     return this._tasksRemaining;
    // }
    // public get tasksCompleted(): number[] {
    //     return this._tasksCompleted;
    // }
    public get task():Task[] {
        return this._task;
    }
    public get availableDate():Availability[]{
        return this._availableDate;
    }
    public get datesAvailable(): Date[] {
        return this._datesAvailable;
    }
    public get assignedDate(): AssignedDate[]{
        return this._assignedDate;
    }
    public get datesAssigned(): Date[] {
        return this._datesAssigned;
    }
    public get results(): Results[] {
        return this._results;
    }
    public set ID(value: User) {
        this._ID = value;
    }
    public set campaignID(value: number[]) {
        this._campaignID = value;
    }
    // public set tasksRemaining(value: number[]) {
    //     this._tasksRemaining = value;
    // }
    // public set tasksCompleted(value: number[]) {
    //     this._tasksCompleted = value;
    // }
    public set task(value:Task[]){
        this._task = value;
    }
    public set availableDate(value:Availability[]){
        this._availableDate = value;
    }
    public set datesAvailable(value: Date[]) {
        this._datesAvailable = value;
    }
    public set assignedDate(value:AssignedDate[]){
        this._assignedDate = value;
    }
    public set datesAssigned(value: Date[]) {
        this._datesAssigned = value;
    }
    public set results(value: Results[]) {
        this._results = value;
    }

    public editAvailability(date:Date){

    }

    // public isAvailable(sDate:Date, eDate:Date):Date[]{

    // }
}