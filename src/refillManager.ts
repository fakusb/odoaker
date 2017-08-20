/**
 *
 * @param {T[]} A
 * @param {T[]} B
 * @returns {T[]} The multiset difference A - B or undefined, if B is no subset of A
 */
import {assert} from "./utils";
import _ = require('lodash');
import {maySpawnFillerFor} from "./role.filler";

/*function tryMultisetSubstract<T>(A : T[], B : T[]) : (T[] | undefined){
    let res =  Array.from(A);
    for (let a in B){
        let i = _.findIndex(res,a);
        if (i<0) {
            return undefined
        }
        delete res[i];
    }
    return _.compact(res);
}*/



declare global {
    interface SpawnMemory {
        fillerName : string[];
    }
}



function ensureRefilling(spawn:Spawn){
    if(!spawn.memory.fillerName){
        spawn.memory.fillerName=[];
    }
    spawn.memory.fillerName = spawn.memory.fillerName.filter((name)=>(Game.creeps[name] != undefined));
    let fillerList = spawn.memory.fillerName.map((name)=>Game.creeps[name] as Creep);
    maySpawnFillerFor(spawn,spawn,fillerList);
}



export function ensureRefillingAllSpawns(){
    for (let id in Game.spawns){
        let spawn = Game.spawns[id];
        ensureRefilling(spawn);
    }
}



/*
interface spawnQueueItem {
    body : BodyPartConstant[],
    name? : string | undefined,
    mem : CreepMemory | undefined
}

export function addToSpawnQueue(spawn:Spawn, toSpawn: spawnQueueItem){
    spawn.createCreep
}*/