import _ = require('lodash');
import {ManagedRole} from './roleManager'
import findEnergy = require('./task.findEnergy')

const harvestFilter = {
    filter: (structure:OwnedStructure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER)
            && (tower => tower.energy<tower.energyCapacity)(structure as (StructureExtension | StructureSpawn | StructureTower));
    }
};



export const harvester =
    new ManagedRole("harvester",
        function(creep:Creep) {
            let targetInRange : Structure = _.first(creep.pos.findInRange(FIND_MY_STRUCTURES, 1, harvestFilter));
            let energy = creep.carry.energy ? creep.carry.energy : 0;
            if (energy > 0 && targetInRange) {
                let res = creep.transfer(targetInRange, RESOURCE_ENERGY);
                if (res !== OK) {
                    console.log("harvest: unexpected case");
                }
            }
            else if (energy === 0) {
                findEnergy.run(creep);
            }
            else {
                let targets : Structure[] = creep.room.find(FIND_MY_STRUCTURES, harvestFilter);
                let target : Structure;
                if (targets.length > 0) {
                    target = targets[0];
                }
                else {
                    target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter: {structureType : STRUCTURE_STORAGE}});
                }
                if(target){
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        },
    function (spawn:StructureSpawn){
        let newCreep = spawn.createCreep([CARRY,CARRY,MOVE,MOVE],undefined,{role:harvester.name});
        if(_.isString(newCreep)) {
            console.log("Spawning " + harvester.name);
        }
    }
    );

