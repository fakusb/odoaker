import {CreepBlueprint, Role} from './roleManager'
import {assert} from "./utils";
import {Base} from "./baseManager";

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
    interface MinerMemory extends RoleMemory {
        name : "miner",
        source? : string;
    }
}

export const miner = new Role(
    'miner',
    function(creep:Creep) {
        /** @type Source*/

        const source:(Source|null)= Game.getObjectById(creep.memory.role.source);
        if(!source){
            const room = Memory.sources[creep.memory.source!].remoteRoom || "";
            /*const direction = Game.map.findExit(creep.room,room);
            if(direction==ERR_NO_PATH || direction == ERR_INVALID_ARGS) {
                console.log("ERROR for miner " + creep.name + ": no idea how to find source" + creep.memory.source + room?"with room hint"+room:"");
                return;
            }*/
            const target = Game.flags.Miner; //creep.pos.findClosestByPath(direction as any);
            if(target){
                creep.moveTo(target);
            }
            return;
        }
        let retHarvest = creep.harvest(source);
        if (retHarvest === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else {
            //CPU
            const container = _.first(source.pos.findInRange(FIND_STRUCTURES,1,{filter :{structureType:STRUCTURE_CONTAINER}}) as StructureContainer[]);
            if(container){
                if(_.isEqual(creep.pos,container.pos)) {
                    if(container.hits<container.hitsMax){
                        let res = creep.repair(container);
                        if(res!=OK && res !=ERR_NOT_ENOUGH_RESOURCES)
                            console.log('miner repair: '+res);
                    }
                }
                else
                    creep.moveTo(container);

            }
            else {
                let constructionSite = _.first(source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {filter: {structureType: STRUCTURE_CONTAINER}}) as ConstructionSite[]);
                if (!constructionSite)
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
                if (constructionSite) {
                    if (creep.build(constructionSite) != OK) {
                        let resources = creep.pos.lookFor(LOOK_RESOURCES);
                        if (resources.length > 0)
                            creep.pickup(resources[0] as Resource);
                    }
                    return;
                }
            }

            if(retHarvest == OK) {
                //CPU: can save by dropping in bursts
                //harvested; drop exactly what we can not carry anymore
                let toDrop = _.max([0, miningPower(creep) - freeSpace(creep)]);
                if (toDrop || 0 > 0) {
                    creep.drop(RESOURCE_ENERGY, toDrop);
                }
            }
        }
    }
);

let blueprint = new CreepBlueprint({carry:1,work:1,move:1},{work:1,move:1});

function createMiner(base:Base,sourceID:string) {
    let maxLevel = Math.min(5,blueprint.getMaxLevelForEnergy(spawn.room.energyAvailable));
    let body =  blueprint.getBodyForLevel(maxLevel);
    //console.log(body);
    let newCreep = base.requestRoleSpawn(body, {
        role: {name :miner.name},
        source: sourceID
    });
    if (_.isString(newCreep)) {
        console.log("Spawning " + miner.name);
        sources[sourceID].curMiner = newCreep;
    }
    else {
        console.log("Spawn error: " + newCreep);
    }
}

export function createMinersForBase(base:Base){
    let sources = base.memory.sources;
    for (let sourceId in sources){
        let sourceMem = sources[sourceId];
        let source = Game.getObjectById(sourceId) as Source;
        if(!source && !sourceMem.remoteRoom) {
          console.log("memory.sources containes invalid (non-visible?) source-id: " + sourceId);
          continue;
        }
        let minerName = sources[sourceId].curMiner;
        //console.log("sourceId:"+sourceId+"\nminerName: "+minerName);
        let creep = Game.creeps[minerName];
        if(!creep){
            createMiner(base,sourceId);
            //console.log('Miner Needed!');
        }
    }
}
