import {saveStats} from "./stats";

if((Game as any).shard.name != 'sim'){
    console.log("In-developement-version only for simulator");
    throw "ERROR";
}

// import harvester = require('./role.harvester')
// import upgrader = require('./role.upgrader')
// import miner = require('./role.miner')
// import builder = require('./role.builder')
// import {ManagedRole, RoleManager} from './roleManager'
// import creepManager = require('./creepManager')
import energyManager = require('./resourceManager')
// import {ensureRefillingAllSpawns} from "./refillManager";
import baseManager = require('./baseManager');
// import {saveStats} from "./stats";
// import {claimer} from "./role.claimer";

// loglevel = 0;

let managers : {initTick:()=>void}[] = [energyManager,baseManager];

import profiler = require('screeps-profiler');
profiler.enable();

// noinspection JSUnusedGlobalSymbols
function mloop() {

    // // executed every tick
    for(let man of managers)
        if(man.initTick)
            man.initTick();

    baseManager.runIsolated();

    // creepManager.buryDeadCreeps();
    // energyManager.garbageCollect();
    //
    // // for(let creepName in Game.creeps){
    // //     let creep = Game.creeps[creepName];
    // //     creep.memory.role = {name:"NOT ASSIGNED"};
    // //     delete creep.memory.roleOld;
    // // }
    //
    // const tower = Game.getObjectById('598ee13af1af831393cd76f7') as StructureTower;
    // if(tower) {
    //     const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure:Structure) => {
    //             let limit = structure.hitsMax;
    //             if(structure.structureType===STRUCTURE_CONTAINER){
    //                 limit *=0.5;
    //             }
    //             return structure.hits < limit;
    //         }}) as Structure;
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }
    //
    //     const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    //     const closestDemagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS,
    //         {filter:
    //             function(creep:Creep){
    //                 return creep.hits<creep.hitsMax;
    //             }}) as Creep;
    //     if(closestDemagedCreep) {
    //         tower.heal(closestDemagedCreep);
    //     }
    // }
    //
    //
    // //ensure creeps get spawned
    // const spawn = Game.spawns.Spawn1 as StructureSpawn;
    //
    // //TODO: Priority (harvester over upgrader) and simple spawn-control
    // let creepsWant : {[name:string]:number} = {};
    // creepsWant[harvester.harvester.name]=3;
    // creepsWant[upgrader.roleUpgrader.name]=
    //     spawn.room.storage!.store.energy >100000?(spawn.room.storage!.store.energy>200000?5:3):1;
    // creepsWant[builder.builder.name]=Math.min(3,Object.getOwnPropertyNames(Game.constructionSites).length);
    // creepsWant[claimer.name]=1;
    //
    //
    // let creepsPerRole = _.groupBy(Game.creeps,'memory.role.name');
    // _.forEach(creepsWant, function (want, roleName:string) {
    //     if (_.size(creepsPerRole[roleName]) < want) {
    //         (RoleManager.byName[roleName] as ManagedRole).create(spawn);
    //     }
    //     //if(_.size(creepsPerRole[roleName]) > want)
    //         //console.log("'Too much' "+roleName);
    // });
    // miner.createMinersUsingSpawn(spawn);
    // ensureRefillingAllSpawns();
    //
    // creepManager.runAllCreeps();
    // //console.log("Limit: "+Game.cpu.tickLimit+"/"+Game.cpu.limit+', Bucket: '+Game.cpu.bucket);
    saveStats();
}

export const loop = function() {
    profiler.wrap(function() {
        mloop()
    })
};