
declare global{
    interface Memory{
        bases: {
            [name: string]: BaseMemory;
        };
    }
    interface SourceMemory {
        [id:string] : {
            curMiner : string,
            //curTruck : string,
        }
    }
}


interface BaseMemory{
    mainRoom : string,
    sources: SourceMemory,
    creeps: string[]
}

function initOncePerGame(){
    console.log("Initialize Base Manager");
    Memory.bases = {};
}

export function initTick(){
    if(!Memory.bases)
        initOncePerGame();
    Memory.bases["Base1"] = {mainRoom:Game.spawns.Spawn1.room.name,sources:Memory.sources,creeps:Object.getOwnPropertyNames(Game.creeps)};
}

export function runTick(){

}

export function endTick(){

}

