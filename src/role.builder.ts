import _ = require('lodash');
import {Role} from './roleManager'
import findEnergy = require('./task.findEnergy')

export let builder = new Role(
    'builder',
    function(creep) {
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
        else if (creep.carry.energy>0){
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },
    function(spawn){
        let newCreep = spawn.createCreep([CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],undefined,{role:this.name});
        if(_.isString(newCreep)) {
            console.log("Spawning " + this.name);
        }
    }
);