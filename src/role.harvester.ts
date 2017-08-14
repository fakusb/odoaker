import _ = require('lodash');
import {ManagedRole} from './roleManager'
import findEnergy = require('./task.findEnergy')

const harvestFilter = {
    filter: (structure:OwnedStructure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER)
            && (tower => tower.energy<tower.energyCapacity)(structure as Tower);
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
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
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

