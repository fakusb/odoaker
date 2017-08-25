export function assert(b:boolean,text?:string){
    if(!b){
        let stack = new Error().stack;
        let msg = "Assert failed: "+(text?text:"")+"\n"+stack;
        console.log(msg);
        Game.notify(msg,60);
    }
}

export function freeCapacity(creep:Creep){
    return creep.carryCapacity-_.sum(creep.carry);
}

export function freshIncrementalNameFor(dict:{[name:string]:any}, prefix?:string):string{
    if(!prefix)
        prefix = '';
    for(let i = 1;i++;true){
        let name = prefix+i;
        if(Memory.bases[name]!==undefined)
            break;
    }
    assert(dict[name]===undefined);
    return name;
}


export function randomId():string{
    return Math.random().toString(36).substr(2, 5);
}
