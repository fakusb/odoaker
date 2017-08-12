let _ = require("lodash");

let Role = require('role');
let findEnergy = require('task.findEnergy');

function builderRun(creep) {
    let targetInRange = _.first(creep.pos.findInRange(FIND_CONSTRUCTION_SITES,3));

    if(creep.carry.energy > 0 && targetInRange){
        let res = creep.build(targetInRange);
        if(res !== OK){
            console.log("builder: unexpected case");
        }
    }
    else if(creep.carry.energy < creep.carryCapacity && (creep.room.energyAvailable/creep.room.energyCapacityAvailable >0.8)) {
        findEnergy.run(creep);
    }
    else {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length > 0) {
            if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}

let roleBuilder = new Role('builder',builderRun);

/**
 *
 * @param {StructureSpawn} spawn
 */
roleBuilder.create = function(spawn){
        let newCreep = spawn.createCreep([CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],undefined,{role:this.name});
        if(_.isString(newCreep)) {
            console.log("Spawning " + this.name);
        }
};

module.exports = roleBuilder;