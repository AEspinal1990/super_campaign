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
    @ManyToOne(type => Assignment, as => as.tasks)
    private _assignment!:Assignment;
    @Column({name: "ofDate"})
    private _scheduledOn!:Date;
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
    public get scheduledOn():Date{
        return this._scheduledOn;
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
    public set scheduledOn(date:Date){
        this._scheduledOn = date;
    }
    public set assignment(value:Assignment){
        this._assignment = value;
    }
}