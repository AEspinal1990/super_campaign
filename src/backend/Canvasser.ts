
class Canvasser{
    private _ID: number;
    private _tasksRemaining: number[];
    private _tasksCompleted: number[];
    private _datesAvailable: Date[];
    private _datesAssigned: Date[];

    constructor (ID:number, tasksRemaining:number[], tasksCompleted:number[], 
        datesAvailable:Date[], datesAssigned:Date[]){
            this._ID = ID;
            this._tasksRemaining = tasksRemaining;
            this._tasksCompleted = tasksCompleted;
            this._datesAvailable = datesAvailable;
            this._datesAssigned = datesAssigned;
        }

    public get ID(): number {
        return this._ID;
    }
    public get tasksRemaining(): number[] {
        return this._tasksRemaining;
    }
    public get tasksCompleted(): number[] {
        return this._tasksCompleted;
    }
    public get datesAvailable(): Date[] {
        return this._datesAvailable;
    }
    public get datesAssigned(): Date[] {
        return this._datesAssigned;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set tasksRemaining(value: number[]) {
        this._tasksRemaining = value;
    }
    public set tasksCompleted(value: number[]) {
        this._tasksCompleted = value;
    }
    public set datesAvailable(value: Date[]) {
        this._datesAvailable = value;
    }
    public set datesAssigned(value: Date[]) {
        this._datesAssigned = value;
    }

    public editAvailability(date:Date){

    }

    // public isAvailable(sDate:Date, eDate:Date):Date[]{

    // }
}