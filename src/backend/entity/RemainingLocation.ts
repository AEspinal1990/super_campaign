import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class RemainingLocation{
    @PrimaryColumn({name: "ID"})
    private _ID:number;
    @PrimaryColumn({name: "locationID"})
    private _locationID:number;

    constructor (ID:number, locationID:number){
        this._ID = ID;
        this._locationID = locationID;
    }

    public get ID(){
        return this._ID;
    }
    public get locationID(){
        return this._locationID;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set locationID(locationID:number){
        this._locationID = locationID;
    }
}