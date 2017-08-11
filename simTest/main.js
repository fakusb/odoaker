const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const Role = require('role');
// loglevel = 0;

let creepsWant = {};
creepsWant[harvester.name]=1;
creepsWant[upgrader.name]=1;

module.exports.loop = function() {
    // executed every tick
    /** @type {StructureSpawn} */
    const spawn = Game.spawns.Spawn1;
    //console.log(Object.getOwnPropertyNames(spawn));



    let creepsPerRole = _.groupBy(Game.creeps,'memory.role');

    _.forEach(creepsWant, function (want, roleName) {
        if (_.size(creepsPerRole[roleName]) < want) {
            Role.byName[roleName].create(spawn);
        }
    });


    for(let name in Game.creeps)
        Role.run(Game.creeps[name]);
};
