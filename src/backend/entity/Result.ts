import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
class Result{
    @PrimaryColumn({name: "ID"})
    private _ID: number;
    @Column({name: "locationID"})
    private _locationID: number;
    @Column({name: "canvasserID"})
    private _canvasserID: number;
    @Column({name: "result"})
    private _answer:boolean;
    @PrimaryColumn({name: "resultNum"})
    private _answerNumber:number;
    private _answers: boolean[];
    @Column({name: "rating"})
    private _rating: number;

    constructor (ID:number, location:number, canvasser:number, answer:boolean, 
        answerNumber:number, answers:boolean[], rating:number){
        this._ID = ID;
        this._locationID = location;
        this._canvasserID = canvasser;
        this._answer = answer;
        this._answerNumber = answerNumber;
        this._answers = answers;
        this._rating = rating;
    }

    public get ID(): number {
        return this._ID;
    }
    public get location(): number {
        return this._locationID;
    }
    public get canvasserID(): number {
        return this._canvasserID;
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
    public set ID(value: number) {
        this._ID = value;
    }
    public set location(value: number) {
        this._locationID = value;
    }
    public set canvasserID(value: number) {
        this._canvasserID = value;
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
    
}