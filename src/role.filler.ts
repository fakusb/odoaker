import {CreepBlueprint, Role} from './roleManager'
import {findEnergy} from "./task.findEnergy"
import {announceEnergyDelivery, availableEnergy, cancelDelivery, EnergyManaged} from "./energyManager";
import {freeCapacity} from "./utils";
import {requestSpawn} from "./spawnManager";

declare global{
    interface CreepMemory{
        filler?:{
            baseSpawn:string,
            curTarget?:string
        }
    }
}

export const filler =
    new Role("filler",
        function(creep:Creep) {
            if(!creep.memory.filler){
                console.log("Broken filler:"+creep.name);
            }
            let baseSpawn = Game.getObjectById(creep.memory.filler!.baseSpawn) as StructureSpawn;

            if(creep.room.name!=baseSpawn.room.name){
                creep.moveTo(baseSpawn);
                return;
            }
            if(creep.carry.energy<50){
                delete creep.memory.filler!.curTarget;
                findEnergy(creep,true);
                return;
            }
            if(!creep.memory.filler!.curTarget){
                let res = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
                    {filter:(struct:StructureSpawn | StructureExtension) =>
                        _.include([STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER],struct.structureType)
                    && availableEnergy(struct) < struct.energyCapacity}) as EnergyManaged;
                if(res) {
                    announceEnergyDelivery(creep,res,creep.carry.energy);
                    creep.memory.filler!.curTarget = res.id;
                }
            }
            let curTarget = Game.getObjectById(creep.memory.filler!.curTarget) as StructureSpawn | StructureExtension | StructureTower | null;
            if (curTarget) {
                let res = creep.transfer(curTarget,RESOURCE_ENERGY);
                if(res == ERR_NOT_IN_RANGE)
                    creep.moveTo(curTarget);
                else {
                    cancelDelivery(creep, curTarget);
                    delete creep.memory.filler!.curTarget;
                    if(res!=OK)
                        console.log("Filler error: "+res+" for "+creep.name);
                }
            }
            else
                creep.moveTo(baseSpawn);
        }
    );

//for which amount of all capacity to build the fillers
const fillerPerSpawnCapacityFactor = 0.5;
const fillerMaxLevel = 6;


let blueprint = new CreepBlueprint({},{carry:1,move:1});
export function maySpawnFillerFor(spawnToUse:StructureSpawn, baseSpawn:StructureSpawn, aliveFillers:Creep[]){
    let totalLevelWanted = fillerPerSpawnCapacityFactor*blueprint.getMaxLevelForEnergy(baseSpawn.room.energyCapacityAvailable);
    let totalLevelHave = _.sum(aliveFillers,(creep)=>(blueprint.getCreepLevel(creep)));
    //console.log(totalLevelHave+"/"+totalLevelWanted);
    if(totalLevelWanted > totalLevelHave) {
        let toBuild = Math.min(fillerMaxLevel,totalLevelWanted,blueprint.getMaxLevelForEnergy(baseSpawn.room.energyAvailable));

        let body = blueprint.getBodyForLevel(toBuild);


        let newCreep = requestSpawn(spawnToUse,body, undefined, {role: {name: filler.name}, filler: {baseSpawn: baseSpawn.id}});
        if (_.isString(newCreep)) {
            baseSpawn.memory.fillerName = baseSpawn.memory.fillerName || [];
            baseSpawn.memory.fillerName.push(newCreep);
            console.log("Spawning " + filler.name + ' for ' + baseSpawn.id);
        }
    }
}


