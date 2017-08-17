import {Role} from './roleManager'
import _ = require('lodash');

function miningPower(creep:Creep) {
    return 2*creep.getActiveBodyparts(WORK);
}

/**
 * @param {Creep} creep
 */
function freeSpace(creep:Creep) {
    return creep.carryCapacity-_.sum(creep.carry);
}

declare global{
    interface CreepMemory {
        source? : string;
    }
}

export const miner = new Role(
    'miner',
    function(creep:Creep) {
        /** @type Source*/
        const source:(Source|null)= Game.getObjectById(creep.memory.source);
        if(!source){
            console.log("ERROR for miner: no source in same room");
            return;
        }
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else {
            //CPU
            const container = _.first(source.pos.findInRange(FIND_STRUCTURES,1,{filter :{structureType:STRUCTURE_CONTAINER}}) as StructureContainer[]);
            if(container && !_.isEqual(creep.pos,container.pos)){
                creep.moveTo(container);
            }
            //CPU: can save by dropping in bursts
            //harvested; drop exactly what we can not carry anymore
            let toDrop = _.max([0, miningPower(creep) - freeSpace(creep)]);
            if (toDrop || 0 > 0) {
                creep.drop(RESOURCE_ENERGY, toDrop);
            }
        }
    }
);
export function createMiner(spawn:StructureSpawn,toMine:Source) {
    let newCreep = spawn.createCreep([MOVE, MOVE].concat(new Array(_.max([2, _.min([6, _.floor((spawn.room.energyAvailable - 2 * BODYPART_COST.move) / BODYPART_COST.work)])])).fill(WORK)), undefined, {
        role: miner.name,
        source: toMine.id
    });
    if (_.isString(newCreep)) {
        console.log("Spawning " + miner.name);
        if (!Memory.sources) {
            Memory.sources = {};
        }
        Memory.sources[toMine.id] = newCreep;
    }
    else {
        console.log("Spawn error: " + newCreep);
    }
}
export function createMinersForSpawn(spawn:StructureSpawn){
    let sources = spawn.room.find(FIND_SOURCES);
    _.forEach(sources,
        /**
         * @param {Source} source
         */
        function(source:Source){
            if(!Memory.sources) {
                Memory.sources = {};
            }
            let creep = Memory.sources[source.id];
            if(!creep || !Game.creeps[creep]){
                createMiner(spawn,source);
                console.log('Miner Needed!');
            }
        })
}
