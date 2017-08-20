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
