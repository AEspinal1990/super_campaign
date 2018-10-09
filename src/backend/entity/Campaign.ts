import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Campaign {

    @PrimaryColumn({name: "ID"})
    private _ID: number;
    
    @Column({name: "campaignName"})
    private _name:string;

    // We reference the managers table and look for all that have a this campaign id?
    private _managers:number[];

    // We reference the canvassers table and look for all that have a this campaign id?
    private _canvassers: number[];

    // We reference the assignment table and look for an assignment with this campaign id
    private _assignment: Assignment;

    // We reference the locations table and look for all locations with this campaign id
    private _locations:number[];
    
    @Column({name: "startDate"})
    private _startDate:Date;
    
    @Column({name: "endDate"})
    private _endDate:Date;
    
    @Column({name: "avgDuration"})
    private _avgDuration:number;

    // We reference the questionaire table and look for all questions with this campaign id.
    // Will they always come back in order? How do we ensure question1 matches with answer1 in result 
    private _questionaire:string[];
    private _talkingPoints:string[];

    constructor (ID:number, name:string, managers:number[], canvassers:number[],
        assignment:Assignment, locations:number[], startDate:Date, endDate:Date,
        avgDuration:number, questionaire:string[], talkingPoints:string[]) {
            this._ID = ID;
            this._name = name;
            this._managers = managers;
            this._canvassers = canvassers;
            this._assignment = assignment;
            this._locations = locations;
            this._startDate = startDate;
            this._endDate = endDate;
            this._avgDuration = avgDuration;
            this._questionaire = questionaire;
            this._talkingPoints = talkingPoints;
    }

    public get ID():number {
        return this._ID;
    }
    public get name():string {
        return this._name;
    }
    public get managers():number[] {
        return this._managers;
    }
    public get canvassers():number[] {
        return this._canvassers;
    }
    public get assignment():Assignment {
        return this._assignment;
    }
    public get locations():number[] {
        return this._locations;
    }
    public get startDate():Date {
        return this._startDate;
    }
    public get EndDate():Date {
        return this._endDate;
    }
    public get avgDuration():number {
        return this._avgDuration;
    }
    public get questionaire():string[] {
        return this._questionaire;
    }
    public get talkingPoints():string[] {
        return this._talkingPoints;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set name(name:string){
        this._name = name;
    }
    public set managers(managers:number[]){
        this._managers = managers;
    }
    public set canvassers(canvassers:number[]){
        this._canvassers = canvassers;
    }
    public set assignment(assignemnt:Assignment){
        this._assignment = assignemnt;
    }
    public set locations(locations:number[]){
        this._locations = locations;
    }
    public set startDate(startDate:Date){
        this._startDate = startDate;
    }
    public set endDate(endDate:Date){
        this._endDate = endDate;
    }
    public set avgDuration(avgDuration:number){
        this._avgDuration = avgDuration;
    }
    public set questionaire(questionaire:string[]){
        this._questionaire = questionaire;
    }
    public set talkingPoints(talkingPoints:string[]){
        this._talkingPoints = talkingPoints;
    }
}