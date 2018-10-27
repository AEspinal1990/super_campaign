import {Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from "typeorm"
import { Canvasser } from "./Canvasser";
import { RemainingLocation } from "./RemainingLocation";
import { CompletedLocation } from "./CompletedLocation";
import { Assignment } from "./Assignment";

@Entity()
export class Task{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @ManyToOne(type => Canvasser, can => can.task)
    private _canvaserID!:Canvasser;
    @Column({name: "campaignID"})
    private _campaignID!:number;
    @OneToOne(type => RemainingLocation, {nullable: true, cascade: true})
    @JoinColumn()
    private _remainingLocations!:RemainingLocation;
    @OneToOne(type => CompletedLocation, {nullable: true, cascade: true})
    @JoinColumn()
    private _completedLocations!:CompletedLocation;
    @Column({name: "currentLocation", nullable: true})
    private _currentLocation!:number;
    private _recommendedRoute!:number[];
    @Column({name: "ofDate"})
    private _scheduledOn!:Date;
    @Column({name: "taskStatus"})
    private _status!:boolean;
    @ManyToOne(type => Assignment, as => as.tasks)
    private _assignment!:Assignment;

    public get ID():number{
        return this._ID;
    }
    public get canvasserID():Canvasser{
        return this._canvaserID;
    }
    public get campaignID():number{
        return this._campaignID;
    }
    public get remainingLocations(): RemainingLocation{
        return this._remainingLocations;
    }
    public get completedLocations():CompletedLocation{
        return this._completedLocations;
    }
    public get currentLocation():number{
        return this._currentLocation;
    }
    public get recommendedRoute():number[]{
        return this._recommendedRoute;
    }
    public get scheduledOn():Date{
        return this._scheduledOn;
    }
    public get status():boolean{
        return this._status;
    }
    public get assignment():Assignment{
        return this._assignment;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set canvasserID(canvasserID:Canvasser){
        this._canvaserID = canvasserID;
    }
    public set campaignID(campaignId:number){
        this._campaignID = campaignId;
    }
    public set remainingLocations(value:RemainingLocation){
        this._remainingLocations = value;
    }
    public set completedLocations(value:CompletedLocation){
        this._completedLocations = value;
    }
    public set currentLocation(location:number){
        this._currentLocation = location;
    }
    public set recommendedRoute(route:number[]){
        this._recommendedRoute = route;
    }
    public set scheduledOn(date:Date){
        this._scheduledOn = date;
    }
    public set status(stat:boolean){
        this._status = stat;
    }
    public set assignment(value:Assignment){
        this._assignment = value;
    }

    /*
        returns: -1 for invalid locationID, 0 for successfully marking complete, 1 for completed task
    */
    // public markCompleted(locationID:Locations):number{
    //     var index = this._remainingLocation.indexOf(locationID);
    //     if (index != -1){
    //         this._remainingLocation.splice(index, 1);
    //         this._completedLocation.push(locationID);
    //     }else {
    //         return -1;
    //     }

    //     if (this._remainingLocation.length == 0){
    //         this._status = true;
    //         return 1;
    //     }

    //     return 0;
    // }
}