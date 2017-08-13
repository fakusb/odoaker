import _ = require('lodash');
import {Role} from './roleManager'
import findEnergy = require('./task.findEnergy')

let harvestFilter = {
    filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
    }
};



export const harvester =
    new Role("harvester",
        function(creep) {
            let targetInRange = _.first(creep.pos.findInRange(FIND_MY_STRUCTURES, 1, harvestFilter));

            if (creep.carry.energy > 0 && targetInRange) {
                let res = creep.transfer(targetInRange, RESOURCE_ENERGY);
                if (res !== OK) {
                    console.log("harvest: unexpected case");
                }
            }
            else if (creep.carry.energy === 0) {
                findEnergy.run(creep);
            }
            else {
                let targets = creep.room.find(FIND_MY_STRUCTURES, harvestFilter);
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        },
    function (spawn:StructureSpawn){
        let newCreep = spawn.createCreep([CARRY,CARRY,MOVE,MOVE],undefined,{role:this.name});
        if(_.isString(newCreep)) {
            console.log("Spawning " + this.name);
        }
    }
    );

