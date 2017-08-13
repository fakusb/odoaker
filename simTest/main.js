const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const miner = require('role.miner');
const builder = require('role.builder');
const Role = require('role');
const _ = require('lodash');
// loglevel = 0;

//console.log('uploaded');
module.exports.loop = function() {
    // executed every tick
    //free Memory
    _.forEach(Memory.creeps,function (creep,name) {
        if (_.isUndefined(Game.creeps[name])) {
            console.log("Memory garbage collect: " + name);
            delete Memory.creeps[name];
        }
    });

    var tower = Game.getObjectById('598ee13af1af831393cd76f7');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                let limit = structure.hitsMax;
                return structure.hits < limit;
            }});
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }


    //ensure creeps get spawned
    //TODO: Priority (harvester over upgrader) and simple spawn-control
    let creepsWant = {};
    creepsWant[harvester.name]=3;
    creepsWant[upgrader.name]=6;
    creepsWant[builder.name]=2;

    /** @type {StructureSpawn} */
    const spawn = Game.spawns.Spawn1;

    let creepsPerRole = _.groupBy(Game.creeps,'memory.role');
    _.forEach(creepsWant, function (want, roleName) {
        if (_.size(creepsPerRole[roleName]) < want) {
            Role.byName[roleName].create(spawn);
        }
    });
    miner.createForSpawn(spawn);

    _.forEach(Game.creeps,function(creep){
        Role.run(creep)});


    //console.log("Limit: "+Game.cpu.tickLimit+"/"+Game.cpu.limit+', Bucket: '+Game.cpu.bucket);

};
