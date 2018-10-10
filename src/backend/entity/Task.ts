import {Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne} from "typeorm"
import { Canvasser } from "./Canvasser";
import { Locations } from "./Locations";
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
    // cannot get the relation working so leave it as a normal column
    @OneToMany(type => RemainingLocation, _remainingLocation => _remainingLocation.task)
    private _remainingLocation!:RemainingLocation[];
    private _remainingLocations!:number[];
    // again, cannot get the relation working
    @OneToMany(type => CompletedLocation, cL => cL.task)
    private _completedLocation!:CompletedLocation[];
    private _completedLocations!:number[];
    @OneToOne(type => Locations)
    private _currentLocation!:Locations;
    private _recommendedRoute!:number[];
    @Column({name: "ofDate"})
    private _scheduledOn!:Date;
    @Column({name: "taskStatus"})
    private _status!:boolean;
    @ManyToOne(type => Assignment, as => as.task)
    private _assignment!:Assignment;

    // constructor(ID:number, canvasserID:Canvasser, campaignID:number, rL:RemainingLocation,
    //      remainingLocations:number[], cL:CompletedLocation, completedLocations:number[],
    //     currentLocation:Locations, recommendedRoute:number[], scheduledOn:Date, status:boolean){
    //         this._ID = ID;
    //         this._canvaserID = canvasserID;
    //         this._campaignID = campaignID;
    //         this._remainingLocation = rL;
    //         this._remainingLocations = remainingLocations;
    //         this._completedLocation = cL;
    //         this._completedLocations = completedLocations;
    //         this._currentLocation = currentLocation;
    //         this._recommendedRoute = recommendedRoute;
    //         this._scheduledOn = scheduledOn;
    //         this._status = status;
    // }

    public get ID():number{
        return this._ID;
    }
    public get canvasserID():Canvasser{
        return this._canvaserID;
    }
    public get campaignID():number{
        return this._campaignID;
    }
    public get remainingLocation(): RemainingLocation[]{
        return this._remainingLocation;
    }
    public get remainingLocations():number[]{
        return this._remainingLocations;
    }
    public get completedLocation():CompletedLocation[]{
        return this._completedLocation;
    }
    public get completedLocations():number[]{
        return this._completedLocations;
    }
    public get currentLocation():Locations{
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
    public set remainingLocation(value:RemainingLocation[]){
        this._remainingLocation = value;
    }
    public set remainingLocations(locations:number[]){
        this._remainingLocations = locations;
    }
    public set completedLocation(value:CompletedLocation[]){
        this._completedLocation = value;
    }
    public set completedLocations(locations:number[]){
        this._completedLocations = locations;
    }
    public set currentLocation(location:Locations){
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
    public markCompleted(locationID:number):number{
        var index = this._remainingLocations.indexOf(locationID);
        if (index != -1){
            this._remainingLocations.splice(index, 1);
            this._completedLocations.push(locationID);
        }else {
            return -1;
        }

        if (this._remainingLocations.length == 0){
            this._status = true;
            return 1;
        }

        return 0;
    }
}