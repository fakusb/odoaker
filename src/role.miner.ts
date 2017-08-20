import {CreepBlueprint, Role} from './roleManager'
import {assert} from "./utils";
import {requestSpawn} from "./spawnManager";

/*function getSourcesToMine() : Source[]{
    let ids = ['5982fd3eb097071b4adbef0f','5982fd3eb097071b4adbef11'];
    return _.map(ids,Game.getObjectById as (id:string)=>Source);
}*/

function miningPower(creep:Creep) {
    return 2*creep.getActiveBodyparts(WORK);
}

/**
 * @param {Creep} creep
 */
function freeSpace(creep:Creep) {
    return creep.carryCapacity-_.sum(creep.carry);
}

declare global{
    interface CreepMemory {
        source? : string;
    }
}

export const miner = new Role(
    'miner',
    function(creep:Creep) {
        /** @type Source*/
        const source:(Source|null)= Game.getObjectById(creep.memory.source);
        if(!source){
            console.log("ERROR for miner "+creep.name+": can't see source"+creep.memory.source);
            return;
        }
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else {
            //CPU
            const container = _.first(source.pos.findInRange(FIND_STRUCTURES,1,{filter :{structureType:STRUCTURE_CONTAINER}}) as StructureContainer[]);
            if(container){
                if(_.isEqual(creep.pos,container.pos)) {
                    if(container.hits<container.hitsMax){
                        let res = creep.repair(container);
                        if(res!=OK)
                            console.log('miner repair: '+res);
                    }
                }
                else
                    creep.moveTo(container);

            }

            //CPU: can save by dropping in bursts
            //harvested; drop exactly what we can not carry anymore
            let toDrop = _.max([0, miningPower(creep) - freeSpace(creep)]);
            if (toDrop || 0 > 0) {
                creep.drop(RESOURCE_ENERGY, toDrop);
            }
        }
    }
);

let blueprint = new CreepBlueprint({carry:1,work:1,move:1},{work:1,move:1});

function createMiner(spawn:StructureSpawn,toMine:Source) {
    let maxLevel = Math.min(5,blueprint.getMaxLevelForEnergy(spawn.room.energyAvailable));
    let body =  blueprint.getBodyForLevel(maxLevel);
    //console.log(body);
    let newCreep = requestSpawn(spawn,body, undefined, {
        role: {name :miner.name},
        source: toMine.id
    });
    if (_.isString(newCreep)) {
        console.log("Spawning " + miner.name);
        if (!Memory.sources) {
            Memory.sources = {};
        }
        Memory.sources[toMine.id].curMiner = newCreep;
    }
    else {
        console.log("Spawn error: " + newCreep);
    }
}
interface miningManagerMemory {

}

interface SourceMemory {
    [id:string] : {
        curMiner : string,
        curTruck : string,
    }
}

declare global{
    interface Memory {
        sources :  SourceMemory
    }
}

export function createMinersUsingSpawn(spawn:StructureSpawn){
    let sources :SourceMemory= Memory.sources;
    for (let sourceId in sources){
        let source = Game.getObjectById(sourceId) as Source;
        if(!source) {
            console.log("memory.sources contained wrong source-id: "+sourceId);
            delete sources[sourceId];
            continue;
        }
        let minerName = sources[sourceId].curMiner;
        //console.log("sourceId:"+sourceId+"\nminerName: "+minerName);
        let creep = Game.creeps[minerName];
        if(!creep){
            createMiner(spawn,Game.getObjectById(sourceId) as Source);
            //console.log('Miner Needed!');
        }
    }
}
