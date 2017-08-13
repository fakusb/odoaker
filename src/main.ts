import harvester = require('./role.harvester')
import upgrader = require('./role.upgrader')
import miner = require('./role.miner')
import builder = require('./role.builder')
import {RoleManager} from './roleManager'
import _ = require('lodash');
// loglevel = 0;

//console.log('uploaded');

export function loop() {
    // executed every tick
    //free Memory
    _.forEach(Memory.creeps,function (creep,name) {
        if (_.isUndefined(Game.creeps[name])) {
            console.log("Memory garbage collect: " + name);
            delete Memory.creeps[name];
        }
    });

    const tower = Game.getObjectById('598ee13af1af831393cd76f7') as StructureTower;
    if(tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                let limit = structure.hitsMax;
                return structure.hits < limit;
            }}) as Structure;
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }


    //ensure creeps get spawned
    //TODO: Priority (harvester over upgrader) and simple spawn-control
    let creepsWant = {};
    creepsWant[harvester.harvester.name]=3;
    creepsWant[upgrader.roleUpgrader.name]=6;
    creepsWant[builder.builder.name]=2;

    const spawn = Game.spawns.Spawn1 as StructureSpawn;

    let creepsPerRole = _.groupBy(Game.creeps,'memory.role');
    _.forEach(creepsWant, function (want, roleName) {
        if (_.size(creepsPerRole[roleName]) < want) {
            RoleManager.byName[roleName].create(spawn);
        }
    });
    miner.createMinersForSpawn(spawn);

    _.forEach(Game.creeps,function(creep){
        RoleManager.run(creep)});


    //console.log("Limit: "+Game.cpu.tickLimit+"/"+Game.cpu.limit+', Bucket: '+Game.cpu.bucket);

}
