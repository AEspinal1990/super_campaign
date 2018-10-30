import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { Locations } from "./Locations";
import { Canvasser } from "./Canvasser";
import { CompletedLocation } from "./CompletedLocation";

@Entity()
export class Results{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    // add campaign name parameter
    @Column({ name: "campaignID" })
    private _campaignID!: number;
    @ManyToMany(type => Locations)
    @JoinTable({name: "results_locations_mapping"})
    private _locationID!: Locations;
    @Column({name: "result"})
    private _answer!:boolean;
    @Column({name: "resultNum"})
    private _answerNumber!:number;
    private _answers!: boolean[];
    @Column({name: "rating"})
    private _rating!: number;
    @ManyToOne(type => CompletedLocation, cl => cl.resultID, {nullable: true})
    private _completedLocation!: CompletedLocation;

    public get ID(): number {
        return this._ID;
    }
    public get location(): Locations {
        return this._locationID;
    }
    public get answer(): boolean {
        return this._answer;
    }
    public get answerNumber(): number {
        return this._answerNumber;
    }
    public get answers(): boolean[] {
        return this._answers;
    }
    public get rating(): number {
        return this._rating;
    }
    public get completedLocation(): CompletedLocation {
        return this._completedLocation;
    }
    public get campaignID(): number {
        return this._campaignID;
    }
    public set campaignID(value: number) {
        this._campaignID = value;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set location(value: Locations) {
        this._locationID = value;
    }
    public set answer(answer:boolean) {
        this._answer = answer;
    }
    public set answerNumber(answerNumber:number) {
        this._answerNumber = answerNumber;
    }
    public set answers(value: boolean[]) {
        this._answers = value;
    }
    public set rating(value: number) {
        this._rating = value;
    }
    public set completedLocation(value: CompletedLocation) {
        this._completedLocation = value;
    }
}