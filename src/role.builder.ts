import _ = require('lodash');
import {ManagedRole} from './roleManager'
import findEnergy = require('./task.findEnergy')
import {assert} from "./utils";
import {CreepBlueprint} from './spawnManager'

let blueprint = new CreepBlueprint({},{carry:1,move:2,work:1});
declare global {
    interface CreepMemory{
        //path?: PathFinderPath;
        builderTarget?:string;
    }
}

function noStructCollisionCostMatrix(roomName:string) : CostMatrix | boolean{
    let room = Game.rooms[roomName];
    if(!room){
        console.log('Cost Matrix: requested invisible room '+roomName);
        return true;
    }
    let res = new PathFinder.CostMatrix();
    for(let struct of room.find(FIND_STRUCTURES) as Structure[]){
        switch(struct.structureType){
            case STRUCTURE_SPAWN:
            case STRUCTURE_EXTENSION:
            case STRUCTURE_WALL:
            case STRUCTURE_KEEPER_LAIR:
            case STRUCTURE_CONTROLLER:
            case STRUCTURE_STORAGE:
            case STRUCTURE_TOWER:
            case STRUCTURE_OBSERVER:
            case STRUCTURE_POWER_BANK:
            case STRUCTURE_POWER_SPAWN:
            case STRUCTURE_EXTRACTOR:
            case STRUCTURE_LAB:
            case STRUCTURE_TERMINAL:
            case STRUCTURE_CONTAINER:
            case STRUCTURE_NUKER:
                res.set(struct.pos.x, struct.pos.y, 255);
                break;
            case STRUCTURE_RAMPART:
                if(!(struct as OwnedStructure).my) {
                    res.set(struct.pos.x, struct.pos.y, 255);
                }
                break;
            case STRUCTURE_PORTAL:
                console.log("Cost Matrix For Portal not decided...");
        }
    }
    return res;
}

export let builder = new ManagedRole(
    'builder',
    function(creep:Creep) {
        let targetInRange = _.first(creep.pos.findInRange(FIND_CONSTRUCTION_SITES,3)) as (ConstructionSite | undefined);
        const energy = creep.carry.energy?creep.carry.energy:0;

        if(energy > 0 && targetInRange){
            let res = creep.build(targetInRange);
            if(res !== OK){
                console.log("builder: unexpected case");
            }
            return;
        }
        if (energy < creep.carryCapacity) {
            findEnergy.run(creep,true);
            return;
        }
        if(!creep.memory.builderTarget) {
            /*
            let constructionSites =
                (_.values(Game.constructionSites) as ConstructionSite[]).map((site) => ({pos: site.pos, range: 0}));
            let res = PathFinder.search(creep.pos, constructionSites,{roomCallback : noStructCollisionCostMatrix});
            if (!res.incomplete) {
                let constructionSite = res.path[res.path.length-1].lookFor(LOOK_CONSTRUCTION_SITES)[0] as ConstructionSite;
                creep.memory.builderTarget = constructionSite.id;
            }*/
            let constrSites = Object.getOwnPropertyNames(Game.constructionSites);
            if(constrSites[0]) {
                creep.memory.builderTarget = constrSites[0];
            }
        }
        if(creep.memory.builderTarget){
            let target = Game.getObjectById(creep.memory.builderTarget)as ConstructionSite|void;
            if(!target){
                delete creep.memory.builderTarget;
                return;
            }
            let res = creep.moveTo(target);
            if (res!=OK){
                console.log("Builder Path Error: "+res);
            }
            //TODO: recalculate if no progress
        }
        else {
            let flag = Game.flags['BuilderParking'];
            if(!flag){
                console.log("Flag not found");
            }
            creep.moveTo(flag,{visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    function(spawn){
        let maxLevel = blueprint.getMaxLevelForEnergy(spawn.room.energyAvailable*0.7);
        if(maxLevel>0) {
            let newCreep = spawn.createCreep(blueprint.getBodyForLevel(maxLevel), undefined, {role: builder.name});
            if (_.isString(newCreep)) {
                console.log("Spawning " + builder.name);
            }
            else{
                console.log("Spawn error: "+newCreep);
            }
        }
    }
);