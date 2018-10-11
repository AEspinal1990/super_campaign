import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { Locations } from "./Locations";
import { Canvasser } from "./Canvasser";
import { CompletedLocation } from "./CompletedLocation";

@Entity()
export class Results{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @ManyToMany(type => Locations)
    @JoinTable()
    private _locationID!: Locations;
    // @ManyToOne(type => Canvasser, can => can.results)
    // @JoinColumn()
    // private _canvasserID!: Canvasser;
    @Column({name: "result"})
    private _answer!:boolean;
    @Column({name: "resultNum"})
    private _answerNumber!:number;
    private _answers!: boolean[];
    @Column({name: "rating"})
    private _rating!: number;
    @ManyToOne(type => CompletedLocation, cl => cl.resultID, {nullable: true})
    private _completedLocation!: CompletedLocation;

    // constructor (ID:number, location:Locations, canvasser:Canvasser, answer:boolean, 
    //     answerNumber:number, answers:boolean[], rating:number){
    //     this._ID = ID;
    //     this._locationID = location;
    //     this._canvasserID = canvasser;
    //     this._answer = answer;
    //     this._answerNumber = answerNumber;
    //     this._answers = answers;
    //     this._rating = rating;
    // }

    public get ID(): number {
        return this._ID;
    }
    public get location(): Locations {
        return this._locationID;
    }
    // public get canvasserID(): Canvasser {
    //     return this._canvasserID;
    // }
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
    public set ID(value: number) {
        this._ID = value;
    }
    public set location(value: Locations) {
        this._locationID = value;
    }
    // public set canvasserID(value: Canvasser) {
    //     this._canvasserID = value;
    // }
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