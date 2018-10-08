
class User {
    private _username: string;
    private _name: string;
    private _permission: number;
    private _employeeID: number;

    constructor (username:string, name:string, permission:number, employeeID:number){
        this._username = username;
        this._name = name;
        this._permission = permission;
        this._employeeID = employeeID;
    }

    public get username(): string {
        return this._username;
    }
    public get name(): string {
        return this._name;
    }
    public get permission(): number {
        return this._permission;
    }
    public get employeeID(): number {
        return this._employeeID;
    }
    public set username(value: string) {
        this._username = value;
    }
    public set name(value: string) {
        this._name = value;
    }
    public set permission(value: number) {
        this._permission = value;
    }
    public set employeeID(value: number) {
        this._employeeID = value;
    }
    
}