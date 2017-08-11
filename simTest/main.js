const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const Role = require('role');
// loglevel = 0;


module.exports.loop = function() {
    // executed every tick

    //free Memory
    _.forEach(Memory.creeps,function (creep,name) {
        if (_.isUndefined(Game.creeps[name])) {
            console.log("Memory garbage collect: " + name);
            delete Memory.creeps[name];
        }
    });


    //ensure creeps get spawned
    let creepsWant = {};
    creepsWant[harvester.name]=1;
    creepsWant[upgrader.name]=1;

    /** @type {StructureSpawn} */
    const spawn = Game.spawns.Spawn1;
    let creepsPerRole = _.groupBy(Game.creeps,'memory.role');
    _.forEach(creepsWant, function (want, roleName) {
        if (_.size(creepsPerRole[roleName]) < want) {
            Role.byName[roleName].create(spawn);
        }
    });


    for(let name in Game.creeps)
        Role.run(Game.creeps[name]);
};
