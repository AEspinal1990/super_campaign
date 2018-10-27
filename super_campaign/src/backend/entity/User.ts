import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({name: "employeeID"})
    private _employeeID!: number;
    @Column({name: "username"})
    private _username!: string;
    @Column({name: "fullName"})
    private _name!: string;
    @Column({name: "permission"})
    private _permission!: number;
    @Column({ name: "passwd" })
    private _password!: string;

    // constructor (username:string, name:string, permission:number){
    //     this._username = username;
    //     this._name = name;
    //     this._permission = permission;
    // }

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
    public get password(): string {
        return this._password;
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
    public set password(value: string) {
        this._password = value;
    }
}