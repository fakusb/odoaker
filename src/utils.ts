export function assert(b:boolean){
    if(!b){
        let stack = new Error().stack;
        console.log("Assert failed: "+stack);
    }
}

export function freeCapacity(creep:Creep){
    return creep.carryCapacity-_.sum(creep.carry);
}