import harvester = require('./role.harvester')
import upgrader = require('./role.upgrader')
import miner = require('./miningManager')
import builder = require('./role.builder')
import {ManagedRole, RoleManager} from './roleManager'
import creepManager = require('./creepManager')
import energyManager = require('./energyManager')
import _ = require('lodash')
// loglevel = 0;

//console.log('uploaded');

// noinspection JSUnusedGlobalSymbols
function mloop() {
    // executed every tick

    creepManager.buryDeadCreeps();
    energyManager.garbageCollect();

    const tower = Game.getObjectById('598ee13af1af831393cd76f7') as StructureTower;
    if(tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure:Structure) => {
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
    const spawn = Game.spawns.Spawn1 as StructureSpawn;

    //TODO: Priority (harvester over upgrader) and simple spawn-control
    let creepsWant : {[name:string]:number} = {};
    creepsWant[harvester.harvester.name]=3;
    creepsWant[upgrader.roleUpgrader.name]=5;
    creepsWant[builder.builder.name]=Math.min(6,3*(Object.getOwnPropertyNames(Game.constructionSites).length));


    let creepsPerRole = _.groupBy(Game.creeps,'memory.role');
    _.forEach(creepsWant, function (want, roleName:string) {
        if (_.size(creepsPerRole[roleName]) < want) {
            (RoleManager.byName[roleName] as ManagedRole).create(spawn);
        }
    });
    miner.createMinersForSpawn(spawn);

    creepManager.runAllCreeps();
    //console.log("Limit: "+Game.cpu.tickLimit+"/"+Game.cpu.limit+', Bucket: '+Game.cpu.bucket);
}

export const loop = mloop();