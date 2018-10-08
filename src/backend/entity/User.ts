import {Column, Entity, PrimaryColumn, JoinColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn({name: "username"})
    private _username: string;
    @Column({name: "fullName"})
    private _name: string;
    @Column({name: "permission"})
    private _permission: number;
    @Column({name: "employeeID"})
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