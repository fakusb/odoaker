
interface MoveMemory {
    target : string;
}

declare global {
    interface CreepMemory {
        move?: MoveMemory;
    }
}

export function moveTo(creep:Creep,targetId:string){

}