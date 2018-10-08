
class Campaign {
    private _ID: number;
    private _name:string;
    private _managers:number[];
    private _canvassers: number[];
    private _assignment: Assignment;
    private _locations:number[];
    private _startDate:Date;
    private _endDate:Date;
    private _avgDuration:number;
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