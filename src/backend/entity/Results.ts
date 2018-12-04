import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { CompletedLocation } from "./CompletedLocation";
import { Campaign } from "./Campaign";

@Entity()
export class Results{
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @ManyToOne(type => Campaign, camp => camp.results)
    private _campaign!: Campaign;
    @Column({name: "result"})
    private _answer!:boolean;
    @Column({name: "resultNum"})
    private _answerNumber!:number;
    @Column({name: "rating"})
    private _rating!: number;
    @ManyToOne(type => CompletedLocation, cl => cl.results, {nullable: true})
    private _completedLocation!: CompletedLocation;

    public get ID(): number {
        return this._ID;
    }
    public get answer(): boolean {
        return this._answer;
    }
    public get answerNumber(): number {
        return this._answerNumber;
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
    public set answer(answer:boolean) {
        this._answer = answer;
    }
    public set answerNumber(answerNumber:number) {
        this._answerNumber = answerNumber;
    }
    public set rating(value: number) {
        this._rating = value;
    }
    public set completedLocation(value: CompletedLocation) {
        this._completedLocation = value;
    }
}