//let Role = require('role');
import _ = require('lodash');
//import Miner =  require('./role.miner');
import EnergyManager = require('./energyManager');
import {assert, freeCapacity} from "./utils";
import {EnergyManaged, totalEnergy} from "./energyManager";
let taskFindEnergy = {

    run(creep:Creep,useStorage:boolean){
        let didPickup = 0;
        //TODO: pickup all nearby resources on floor?
        let pile = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter : function(res:Resource){return res.resourceType===RESOURCE_ENERGY}})[0] as (Resource|undefined);
        //
        if(pile) {
             creep.pickup(pile);
             didPickup += pile.amount;
        }

        //TODO: more intelligent replaning, maybe a treshhold in both directions (hysteris?)
        if(!creep.memory.target) {
            let targets : (StructureContainer | StructureStorage | Resource)[]= [];
            //TODO: do mot drop miner resources
            //TODO: may store target in some way
            //either find full resource piles
            targets = targets.concat(creep.room.find(FIND_DROPPED_RESOURCES, {
                /**@param {Resource} res */
                filter: function (res:Resource) {
                    return res.resourceType === RESOURCE_ENERGY && EnergyManager.availableEnergy(res) > 50;
                }
            }));
            //or container or storage
            targets = targets.concat(creep.room.find(FIND_STRUCTURES, {
                 /**@param {StructureContainer} structure */
                filter: function (structure:Structure) {
                    return (structure.structureType===STRUCTURE_CONTAINER || (useStorage && structure.structureType===STRUCTURE_STORAGE))
                        && EnergyManager.availableEnergy(structure as (StructureContainer | StructureContainer)) > 50;
                }}));


            //CPU: do not use path
            let target = creep.pos.findClosestByPath(targets);
            if(target) {
                creep.memory.target = target.id;
            }
            else{
                console.log('no energy...');
            }
        }
        let target = Game.getObjectById(creep.memory.target);
        if(target){
            EnergyManager.reserveEnergy(creep,target as EnergyManaged ,freeCapacity(creep));
            //TODO: may renew reservation...
            if (target instanceof Resource) {
                let res = creep.pickup(target);
                if (res === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else{
                    assert(res===OK);
                    EnergyManager.cancelReservation(creep,target);
                    delete creep.memory.target;
                }
            }
            else if (target instanceof StructureContainer || target instanceof StructureStorage){
                const amount = _.min([freeCapacity(creep)-didPickup,totalEnergy(target)]);
                let res = creep.withdraw(target,RESOURCE_ENERGY,amount);
                if(res===ERR_NOT_IN_RANGE){//|| res===ERR_NOT_ENOUGH_ENERGY){
                    res=creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else{
                    assert(res===OK,"withdraw returned "+res);
                    EnergyManager.cancelReservation(creep,target);
                    delete creep.memory.target;
                }
            }
            // else if (target instanceof Creep){
            //     let res = target.transfer(creep,RESOURCE_ENERGY);
            //     if(res===ERR_NOT_IN_RANGE){//|| res===ERR_NOT_ENOUGH_ENERGY){
            //         res=creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            //     }
            //     else if(res!==OK){
            //         console.log("unexpected error in task.findEnergy.run: could not move to miner: "+res+JSON.stringify(target));
            //     }
            //     delete creep.memory.target;
            // }
            else {
                console.log("task.findEnergy: missing case");
            }
        }
    }
};
export = taskFindEnergy;