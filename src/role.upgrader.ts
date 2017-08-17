import _ = require('lodash');

import {ManagedRole} from './roleManager'
import taskFindEnergy = require('./task.findEnergy');

declare global{
    interface CreepMemory {
        started? : boolean;
        upgrading? : boolean;
    }
}

export const roleUpgrader = new ManagedRole(
    'upgrader',
    function(creep) {
        const controller = creep.room.controller;
        if(!controller){
            console.log("Upgrader error: no controller");
            return;
        }
        if (!creep.memory.started) {
         if (!creep.pos.inRangeTo(controller, 8)) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
            else {
                creep.memory.started = true;
            }
        }
        if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }
        if (creep.memory.upgrading) {
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            taskFindEnergy.run(creep,false);
        }
    },
    function(spawn:StructureSpawn) {
        let newCreep = spawn.createCreep(
            [CARRY, CARRY, MOVE].concat(new Array(_.max([2, _.floor((spawn.room.energyAvailable - BODYPART_COST.move - 2 * BODYPART_COST.carry) / (BODYPART_COST.work + BODYPART_COST.move))])).fill(MOVE))
                .concat(new Array(_.max([2, _.floor((spawn.room.energyAvailable - BODYPART_COST.move - 2 * BODYPART_COST.carry) / (BODYPART_COST.work + BODYPART_COST.move))])).fill(WORK)), undefined, {role: roleUpgrader.name});
        if (_.isString(newCreep)) {
            console.log("Spawning " + roleUpgrader.name);
        }
    });