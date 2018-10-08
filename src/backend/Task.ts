
class Task{
    private _ID: number;
    private _canvaserID:number;
    private _remainingLocations:number[];
    private _completedLocations:number[];
    private _currentLocation:Locations;
    private _recommendedRoute:number[];
    private _scheduledOn:Date;
    private _status:boolean;

    constructor(ID:number, canvasserID:number, remainingLocations:number[], completedLocations:number[],
        currentLocation:Locations, recommendedRoute:number[], scheduledOn:Date, status:boolean){
            this._ID = ID;
            this._canvaserID = canvasserID;
            this._remainingLocations = remainingLocations;
            this._completedLocations = completedLocations;
            this._currentLocation = currentLocation;
            this._recommendedRoute = recommendedRoute;
            this._scheduledOn = scheduledOn;
            this._status = status;
    }

    public get ID():number{
        return this._ID;
    }
    public get canvasserID():number{
        return this._canvaserID;
    }
    public get remainingLocations():number[]{
        return this._remainingLocations;
    }
    public get completedLocations():number[]{
        return this._completedLocations;
    }
    public get currentLocation():Locations{
        return this._currentLocation;
    }
    public get recommendedRoute():number[]{
        return this._recommendedRoute;
    }
    public get scheduledOn():Date{
        return this._scheduledOn;
    }
    public get status():boolean{
        return this._status;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set canvasserID(canvasserID:number){
        this._canvaserID = canvasserID;
    }
    public set remainingLocations(locations:number[]){
        this._remainingLocations = locations;
    }
    public set completedLocations(locations:number[]){
        this._completedLocations = locations;
    }
    public set currentLocation(location:Locations){
        this._currentLocation = location;
    }
    public set recommendedRoute(route:number[]){
        this._recommendedRoute = route;
    }
    public set scheduledOn(date:Date){
        this._scheduledOn = date;
    }
    public set status(stat:boolean){
        this._status = stat;
    }

    /*
        returns: -1 for invalid locationID, 0 for successfully marking complete, 1 for completed task
    */
    public markCompleted(locationID:number):number{
        var index = this._remainingLocations.indexOf(locationID);
        if (index != -1){
            this._remainingLocations.splice(index, 1);
            this._completedLocations.push(locationID);
        }else {
            return -1;
        }

        if (this._remainingLocations.length == 0){
            this._status = true;
            return 1;
        }

        return 0;
    }
}