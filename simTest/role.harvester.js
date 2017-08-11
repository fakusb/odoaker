let Role = require('role');

let roleHarvester = new Role(
    'harvest',
    /**
     * @param {Creep} creep
     */
    function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            const sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    });

/**
 *
 * @param {StructureSpawn} spawn
 */
roleHarvester.create = function(spawn){
        let newCreep = spawn.createCreep([WORK,CARRY,MOVE,MOVE],undefined,{role:this.name});
        console.log("Spawning harvester"+newCreep.name);
};

module.exports = roleHarvester;