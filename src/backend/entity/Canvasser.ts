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
    private _campaigns!: Campaign[];

    @ManyToMany(type => Task,  {cascade: true})
    @JoinTable({name: "canvasser_task_mapping"})
    private _task!:Task[];
    @ManyToMany(type => Availability, {cascade: true, nullable: true})
    @JoinTable({name: "canvasser_availability_mapping"})
    private _availableDates!: Availability[];

    @ManyToMany(type => AssignedDate)
    @JoinTable({name: "canvasser_assignedDate_mapping"})
    private _assignedDates!:AssignedDate[];
    
    @ManyToMany(type => Results)
    @JoinTable({name: "canvasser_results_mapping"})
    private _results!: Results[];
 
    public get ID(): User {
        return this._ID;
    }
    public get campaigns(): Campaign[] {
        return this._campaigns;
    }
    public get task():Task[] {
        return this._task;
    }
    public get availableDates():Availability[]{
        return this._availableDates;
    }
    public get assignedDates(): AssignedDate[]{
        return this._assignedDates;
    }
    public get results(): Results[] {
        return this._results;
    }
    public set ID(value: User) {
        this._ID = value;
    }
    public set campaigns(value: Campaign[]) {
        this._campaigns = value;
    }
    public set task(value:Task[]){
        this._task = value;
    }
    public set availableDates(value:Availability[]){
        this._availableDates = value;
    }
    public set assignedDates(value:AssignedDate[]){
        this._assignedDates = value;
    }
    public set results(value: Results[]) {
        this._results = value;
    }

    public editAvailability(date:Date){

    }

    // public isAvailable(sDate:Date, eDate:Date):Date[]{

    // }
}