import _ = require('lodash');
import {ManagedRole} from './roleManager'
import findEnergy = require('./task.findEnergy')

export let builder = new ManagedRole(
    'builder',
    function(creep:Creep) {
        let targetInRange = _.first(creep.pos.findInRange(FIND_CONSTRUCTION_SITES,3)) as (ConstructionSite | undefined);
        const energy = creep.carry.energy?creep.carry.energy:0;

        if(energy > 0 && targetInRange){
            let res = creep.build(targetInRange);
            if(res !== OK){
                console.log("builder: unexpected case");
            }
            return;
        }
        else if(energy < creep.carryCapacity && (creep.room.energyAvailable/creep.room.energyCapacityAvailable >0.8)) {
            findEnergy.run(creep,false);

        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) as ConstructionSite;
        if(target) {
            if (energy < creep.carryCapacity && (creep.room.energyAvailable / creep.room.energyCapacityAvailable > 0.8)) {
                findEnergy.run(creep);
            }
            else if (energy > 0) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            let flag = Game.flags['BuilderParking'];
            if(!flag){
                console.log("Flag not found");
            }
            creep.moveTo(flag,{visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    function(spawn){
        let newCreep = spawn.createCreep([CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],undefined,{role:builder.name});
        if(_.isString(newCreep)) {
            console.log("Spawning " + builder.name);
        }
    }
);