import {Entity, ManyToMany, OneToOne, JoinColumn, OneToMany, JoinTable} from "typeorm"
import { User } from "./User";
import { Availability } from "./Availability";
import { AssignedDate } from "./AssignedDate";
import { Task } from "./Task";
import { Results } from "./Results";
import { Campaign } from "./Campaign";

@Entity()
export class Canvasser{
    @OneToOne(type => User, {primary: true, eager: true, cascade: true, onDelete: "CASCADE"})
    @JoinColumn()
    private _ID!: User;
    @ManyToMany(type => Campaign, {cascade: true, eager: true, nullable: true})
    @JoinTable({name: "campaign_canvasser_mapping"})
    private _campaignID!: Campaign[];
    @ManyToMany(type => Task,  {cascade: true})
    @JoinTable({name: "canvasser_task_mapping"})
    private _task!:Task[];
    @ManyToMany(type => Availability, av => av.canvasserID, {cascade: true, nullable: true})
    @JoinTable({name: "canvasser_availability_mapping"})
    private _availableDate!: Availability[];
    @ManyToMany(type => AssignedDate)
    @JoinTable({name: "canvasser_assignedDate_mapping"})
    private _assignedDate!:AssignedDate[];
    @ManyToMany(type => Results)
    @JoinTable({name: "canvasser_results_mapping"})
    private _results!: Results[];
 
    public get ID(): User {
        return this._ID;
    }
    public get campaignID(): Campaign[] {
        return this._campaignID;
    }
    public get task():Task[] {
        return this._task;
    }
    public get availableDate():Availability[]{
        return this._availableDate;
    }
    public get assignedDate(): AssignedDate[]{
        return this._assignedDate;
    }
    public get results(): Results[] {
        return this._results;
    }
    public set ID(value: User) {
        this._ID = value;
    }
    public set campaignID(value: Campaign[]) {
        this._campaignID = value;
    }
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