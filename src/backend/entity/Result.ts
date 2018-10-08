
class Result{
    private _ID: number;
    private _location: Locations;
    // not sure if we want the canvasser variable to be the object or a reference to the ID
    private _canvasserID: number;
    private _answers: boolean[];
    private _rating: number;

    constructor (ID:number, location:Locations, canvasser:number, answers:boolean[], rating:number){
        this._ID = ID;
        this._location = location;
        this._canvasserID = canvasser;
        this._answers = answers;
        this._rating = rating;
    }

    public get ID(): number {
        return this._ID;
    }
    public get location(): Locations {
        return this._location;
    }
    public get canvasserID(): number {
        return this._canvasserID;
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
    public set location(value: Locations) {
        this._location = value;
    }
    public set canvasserID(value: number) {
        this._canvasserID = value;
    }
    public set answers(value: boolean[]) {
        this._answers = value;
    }
    public set rating(value: number) {
        this._rating = value;
    }
    
}