
class Locations{
    private _ID: number;
    private _streetNumber: number;
    private _street: string;
    private _unit: string;
    private _city: string;
    private _state: string;
    private _zipcode: number;

    constructor (ID:number, num:number, street:string, unit:string, city:string, state:string, zipcode:number){
        this._ID = ID;
        this._streetNumber = num;
        this._street = street;
        this._unit = unit;
        this._city = city;
        this._state = state;
        this._zipcode = zipcode;
    }

    public get ID(): number {
        return this._ID;
    }
    public get number(): number {
        return this._streetNumber;
    }
    public get street(): string {
        return this._street;
    }
    public get unit(): string {
        return this._unit;
    }
    public get city(): string {
        return this._city;
    }
    public get state(): string {
        return this._state;
    }
    public get zipcode(): number {
        return this._zipcode;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set streetNumber(value: number) {
        this._streetNumber = value;
    }
    public set street(value: string) {
        this._street = value;
    }
    public set unit(value: string) {
        this._unit = value;
    }
    public set city(value: string) {
        this._city = value;
    }
    public set state(value: string) {
        this._state = value;
    }
    public set zipcode(value: number) {
        this._zipcode = value;
    }

}