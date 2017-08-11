let Role = require('role');

let roleUpgrader = new Role(
    'upgrader',
    function(creep) {
        if(creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    });

    /** @param {StructureSpawn} spawn**/
roleUpgrader.create = function(spawn){
        let newCreep = spawn.createCreep([WORK,CARRY,MOVE,MOVE],undefined,{role:this.name});
        if(_.isString(newCreep))
            console.log("Spawning upgrader "+newCreep.name);
};

module.exports = roleUpgrader;