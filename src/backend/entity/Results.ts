import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { Locations } from "./Locations";
import { Canvasser } from "./Canvasser";
import { CompletedLocation } from "./CompletedLocation";
import { Campaign } from "./Campaign";

@Entity()
export class Results{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @ManyToOne(type => Campaign, camp => camp.results)
    private _campaign!: Campaign;
    @ManyToMany(type => Locations)
    @JoinTable({name: "results_locations_mapping"})
    private _location!: Locations;
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
        return this._location;
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
    public get campaign(): Campaign {
        return this._campaign;
    }
    public set campaign(value: Campaign) {
        this._campaign = value;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set location(value: Locations) {
        this._location = value;
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