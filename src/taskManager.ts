
interface task {
    id:string
}

export class TaskManager {
    private _tasks : {prio : number, task:task}[];
    constructor(){
        this._tasks = [];
    }
    add(prio:number,task:task){
        this._tasks.concat({prio:prio,task:task});
    }
    public getSortedTasks() {
        this._tasks = _.sortBy(this._tasks,"prio");
    }
}
