import {CreepBlueprint, ManagedRole} from './roleManager'
import {findEnergy} from "./task.findEnergy"
import {availableEnergy} from "./energyManager";
import {requestSpawn} from "./spawnManager";

const deliverEnergyFilter = {
    filter: (structure:OwnedStructure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER)
            && (castStruct => availableEnergy(castStruct)<castStruct.energyCapacity)(structure as (StructureExtension | StructureSpawn | StructureTower));
    }
};

let blueprint = new CreepBlueprint({},{carry:1,move:1});

export const harvester =
    new ManagedRole("harvester",
        function(creep:Creep) {
            let targetInRange = _.first(creep.pos.findInRange(FIND_MY_STRUCTURES, 1, deliverEnergyFilter) as Structure[]);
            let energy = creep.carry.energy || 0;
            if (energy > 0 && targetInRange) {
                let res = creep.transfer(targetInRange, RESOURCE_ENERGY);
                if (res !== OK) {
                    console.log("harvest: unexpected case");
                }
            }
            else if (energy === 0) {
                findEnergy(creep,false);//creep.room.energyAvailable<creep.room.energyCapacityAvailable);
            }
            else {
                let targets : Structure[] = creep.room.find(FIND_MY_STRUCTURES, deliverEnergyFilter);
                let target : Structure | undefined;
                if (targets.length > 0) {
                    target = targets[0];
                }
                else {
                    target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter: {structureType : STRUCTURE_STORAGE}}) as StructureStorage | undefined;
                }
                if(target){
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        },
    function (spawn:StructureSpawn){
        let body = blueprint.getBodyForLevel(Math.min(10,0.5*blueprint.getMaxLevelForEnergy(spawn.room.energyAvailable)));
        let newCreep = requestSpawn(spawn,body,undefined,{role: {name: harvester.name}});
        if(_.isString(newCreep)) {
            console.log("Spawning " + harvester.name);
        }
    }
    );




