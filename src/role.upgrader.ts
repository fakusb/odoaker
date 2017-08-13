import _ = require('lodash');

import {Role} from './roleManager'
import taskFindEnergy = require('./task.findEnergy');


export const roleUpgrader = new Role(
    'upgrader',
    function(creep) {
        if (!creep.memory.started) {
            if (!creep.pos.inRangeTo(creep.room.controller, 8)) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
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
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            taskFindEnergy.run(creep);
        }
    },
    function(spawn:StructureSpawn) {
        let newCreep = spawn.createCreep(
            [CARRY, CARRY, MOVE].concat(new Array(_.max([2, _.floor((spawn.room.energyAvailable - BODYPART_COST.move - 2 * BODYPART_COST.carry) / (BODYPART_COST.work + BODYPART_COST.move))])).fill(MOVE))
                .concat(new Array(_.max([2, _.floor((spawn.room.energyAvailable - BODYPART_COST.move - 2 * BODYPART_COST.carry) / (BODYPART_COST.work + BODYPART_COST.move))])).fill(WORK)), undefined, {role: this.name});
        if (_.isString(newCreep)) {
            console.log("Spawning " + this.name);
        }
    });