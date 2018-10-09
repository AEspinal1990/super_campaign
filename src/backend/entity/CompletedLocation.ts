import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class CompletedLocation {
    @PrimaryColumn({name: "ID"})
    private _ID:number;
    @PrimaryColumn({name: "locationID"})
    private _locationID:number;
    @PrimaryColumn({name: "resultID"})
    private _resultID:number;

    constructor (ID:number, locationID:number, resultID:number){
        this._ID = ID;
        this._locationID = locationID;
        this._resultID = resultID;
    }

    public get ID(){
        return this._ID;
    }
    public get locationID(){
        return this._locationID;
    }
    public get resultID(){
        return this._resultID;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set locationID(locationID:number){
        this._locationID = locationID;
    }
    public set resultID(resultID:number){
        this._resultID = resultID;
    }
}