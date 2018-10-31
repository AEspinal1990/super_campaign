import {Entity, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Task } from "./Task";

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @OneToMany(type => Task, task => task.assignment, {cascade: true})
    private _tasks!:Task[];

    public get ID(): number {
        return this._ID;
    }
    public get tasks(): Task[] {
        return this._tasks;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set tasks(taskID:Task[]){
        this._tasks = taskID;
    }
}