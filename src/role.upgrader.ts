import {CreepBlueprint, ManagedRole} from './roleManager'
import {findEnergy, moveOrTakeEnergyFrom} from './task.findEnergy';
import {availableEnergy, EnergyManaged, totalEnergy} from "./energyManager";
import {requestSpawn} from "./spawnManager";


declare global{
    interface CreepMemory {
        upgrader? : {
            upgrading? : boolean;
            takeFrom? : string; //take only from there?
            controller? : string;
        }
    }
}

let blueprint = new CreepBlueprint({},{carry:1,work:1,move:2});

export const roleUpgrader = new ManagedRole(
    'upgrader',
    function(creep) {
        if(!creep.memory.upgrader){
            console.log("Broken Upgrader Memory: "+creep.name);
            creep.memory.upgrader = {};
        }
        if(!creep.memory.upgrader.controller){
            console.log("TODO:Upgrader shall have controllers from start...");
            creep.memory.upgrader.controller = creep.room.controller!.id;
        }
        const controller = Game.getObjectById(creep.memory.upgrader.controller) as StructureController;

        let takeFrom : EnergyManaged | null = null;
        if(creep.memory.upgrader.takeFrom){
            takeFrom = Game.getObjectById(creep.memory.upgrader.takeFrom);
        }

        if (creep.memory.upgrader.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrader.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrader.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrader.upgrading = true;
            creep.say('⚡ upgrade');
        }
        if (creep.memory.upgrader.upgrading) {
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            findEnergy(creep,true);
            // if(takeFrom){
            //     if(0.1<availableEnergy(takeFrom)/totalEnergy(takeFrom))
            //         moveOrTakeEnergyFrom(creep,takeFrom);
            //     else{
            //         creep.moveTo(controller);
            //         console.log("Upgrader stops at 10 %");
            //     }
            // }
            // else
            //     findEnergy(creep,true);
        }
    },
    function(spawn:StructureSpawn) {
        let maxLevel = Math.min(10,blueprint.getMaxLevelForEnergy(spawn.room.energyAvailable));
        let body = blueprint.getBodyForLevel(maxLevel);
        let newCreep = requestSpawn(spawn,body,undefined,
            {
                role: {name : roleUpgrader.name},
                upgrader:{
                    takeFrom:  '599199090ceab76d9ad4185d', //storage
                    controller:'5982fd3eb097071b4adbef10'
                }
            });
        if (_.isString(newCreep)) {
            console.log("Spawning " + roleUpgrader.name);
        }
    });