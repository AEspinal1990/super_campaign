import {OneToOne, Entity, JoinColumn} from "typeorm";
import { User } from "./User";

@Entity()
export class SystemAdmin{
    @OneToOne(type => User, {primary: true, cascade: true, onDelete: "CASCADE"})
    @JoinColumn()
    private _ID:User;

    constructor (){
    }

    public get ID():User {
        return this._ID;
    }
    public set ID(user:User){
        this._ID = user;
    }
}