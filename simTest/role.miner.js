let Role = require('role');

/**
 * @param {Creep} creep
 */
function miningPower(creep) {
    return 2*creep.getActiveBodyparts('WORK');
}

/**
 * @param {Creep} creep
 */
function freeSpace(creep) {
    return creep.carryCapacity-_.sum(creep.carry);
}

/**
 * @param {Creep} creep
 */
function minerRun(creep) {
    /** @type Source*/
    const source = Game.getObjectById(creep.memory.source);
    if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    else{
        //CPU: can save by dropping in bursts
        //harvested; drop exactly what we can not carry anymore
        let toDrop = _.max([0,miningPower(creep)-freeSpace(creep)]);
        if(toDrop>0) {
            creep.drop(RESOURCE_ENERGY, toDrop);
        }
    }
}

let roleMiner = new Role('miner',minerRun);
/**
 *
 * @param {StructureSpawn} spawn
 */
roleMiner.createForSpawn = function(spawn){
    let sources = spawn.room.find(FIND_SOURCES);
    _.forEach(sources,
        /**
          * @param {Source} source
         */
        function(source){
            if(!Memory.sources) {
                Memory.sources = {};
            }
            let creep = Memory.sources[source.id];
            if(!creep || !Game.creeps[creep]){
                roleMiner.create(spawn,source);
                console.log('Miner Needed!');
            }
        })
};

/**
 *
 * @param {StructureSpawn} spawn
 * @param {Source} toMine
 */
roleMiner.create = function(spawn,toMine) {
    let newCreep = spawn.createCreep([MOVE,MOVE].concat(new Array(_.max([2,_.min([6,_.floor((spawn.room.energyAvailable-2*BODYPART_COST.move)/BODYPART_COST.work)])])).fill(WORK)), undefined, {role: this.name, source: toMine.id});
    if (_.isString(newCreep)) {
        console.log("Spawning " + this.name);
        if(!Memory.sources) {
            Memory.sources = {};
        }
        Memory.sources[toMine.id]=newCreep;
    }
    else{
        console.log("Spawn error: "+newCreep);
    }
};

module.exports = roleMiner;