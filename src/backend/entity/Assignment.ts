
class Assignment {
    private _ID: number;
    private _task: number[];

    constructor (ID:number, task:number[]){
        this._ID = ID;
        this._task = task;
    }

    public get ID(): number {
        return this._ID;
    }
    public get task(): number[] {
        return this._task;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set task(value: number[]) {
        this._task = value;
    }
}