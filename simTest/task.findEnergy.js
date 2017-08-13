//let Role = require('role');
//let _ = require('lodash');
let Miner =  require('role.miner');
let taskFindEnergy = {
    /**
     *
     * @param {Creep} creep
     */
    run(creep){
        //TODO: pickup all nearby resources on floor?
        let canPickup = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter : function(res){return res.resourceType===RESOURCE_ENERGY}});

        creep.pickup(canPickup[0]);

        //TODO: more intelligent replaning, maybe a treshhold in both directions (hysteris?)
        if(!creep.memory.target) {
            let targets = [];
            //TODO: do mot drop miner resources
            //TODO: may store target in some way
            //either find full resource piles
            targets = targets.concat(creep.room.find(FIND_DROPPED_RESOURCES, {
                /**@param {Resource} res */
                filter: function (res) {
                    return res.resourceType === RESOURCE_ENERGY && res.amount >= _.max([50,creep.carryCapacity - _.sum(creep.carry)]);
                }
            }));
            //or container
            targets = targets.concat(creep.room.find(FIND_STRUCTURES, {
                 /**@param {StructureContainer} structure */
                filter: function (structure) {
                    return structure.structureType===STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 50;// >= creep.carryCapacity;
                }}));

            //or miners (miners drop...)
            // targets = targets.concat(creep.room.find(FIND_MY_CREEPS, {
            //     /**@param {Creep} miner */
            //     filter: function (miner) {
            //         return miner.memory.role === Miner.name && miner.carry[RESOURCE_ENERGY] > 0;// >= creep.carryCapacity;
            //     }
            // }));
            //CPU: do not use path
            let target = creep.pos.findClosestByPath(targets);
            if(target) {
                creep.memory.target = target.id;
            }
        }
        let target = Game.getObjectById(creep.memory.target);
        if(target){
            if (target instanceof Resource) {
                let res = creep.pickup(target);
                if (res === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else if (res !== OK) {
                    console.log("unexpected error in task.findEnergy.run: could not move to resource pile");
                }
                delete creep.memory.target;
            }
            else if (target instanceof StructureContainer){
                let res = creep.withdraw(target,RESOURCE_ENERGY);
                if(res===ERR_NOT_IN_RANGE){//|| res===ERR_NOT_ENOUGH_ENERGY){
                    res=creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else if(res!==OK){
                    console.log("unexpected error in task.findEnergy.run: could not withdraw from Structure: "+res+JSON.stringify(target));
                }
                delete creep.memory.target;
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
module.exports = taskFindEnergy;