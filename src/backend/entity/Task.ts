import {Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm"
import { RemainingLocation } from "./RemainingLocation";
import { CompletedLocation } from "./CompletedLocation";
import { Assignment } from "./Assignment";

@Entity()
export class Task{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @Column({name: "campaignID"})
    private _campaignID!:number;
    @OneToOne(type => RemainingLocation, {nullable: true, cascade: true})
    @JoinColumn({name: "remainingLocation"})
    private _remainingLocation!:RemainingLocation;
    @OneToOne(type => CompletedLocation, {nullable: true, cascade: true})
    @JoinColumn({name: "completedLocation"})
    private _completedLocation!:CompletedLocation;
    @Column({name: "currentLocation", nullable: true})
    private _currentLocation!:number;
    @Column({name: "ofDate"})
    private _scheduledOn!:Date;
    @Column({name: "taskStatus"})
    private _status!:boolean;
    @ManyToOne(type => Assignment, as => as.tasks)
    private _assignment!:Assignment;
    @Column({ name: "duration" })
    private _duration!: number;
    @Column({ name: "canvasserName", nullable: true })
    private _canvasser!: string;
    @Column({ name: "numLocations" })
    private _numLocations!: number;

    public get ID():number{
        return this._ID;
    }
    public get campaignID():number{
        return this._campaignID;
    }
    public get remainingLocation(): RemainingLocation{
        return this._remainingLocation;
    }
    public get completedLocation():CompletedLocation{
        return this._completedLocation;
    }
    public get currentLocation():number{
        return this._currentLocation;
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
    public get duration(): number {
        return this._duration;
    }
    public get canvasser(): string {
        return this._canvasser;
    }
    public get numLocations(): number {
        return this._numLocations;
    }
    public set numLocations(value: number) {
        this._numLocations = value;
    }
    public set canvasser(value: string) {
        this._canvasser = value;
    }
    public set duration(value: number) {
        this._duration = value;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set campaignID(campaignId:number){
        this._campaignID = campaignId;
    }
    public set remainingLocation(value:RemainingLocation){
        this._remainingLocation = value;
    }
    public set completedLocation(value:CompletedLocation){
        this._completedLocation = value;
    }
    public set currentLocation(location:number){
        this._currentLocation = location;
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
}