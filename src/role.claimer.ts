import {CreepBlueprint,ManagedRole} from './roleManager'
import {assert} from "./utils";

let blueprint = new CreepBlueprint({},{claim:1,move:1});

declare global {
    interface ClaimerMemory extends RoleMemory {
        name: "claimer",
        toClaim: string
    }
}



export let claimer = new ManagedRole(
    'claimer',
    function(creep:Creep) {
        const roleMem = creep.memory.role as ClaimerMemory;
        let controller = Game.rooms[roleMem.toClaim].controller;
        if(!controller) {
            console.log("TODO: claim invisible room. May do this with an external function?");
            return;
        }
        let reserveRes = creep.reserveController(controller);
        if(reserveRes == ERR_NOT_IN_RANGE){
            let moveRes = creep.moveTo(controller);
            if(moveRes != OK)
                console.log("Claimer move error: "+moveRes);
        }
        else if(reserveRes != OK)
            console.log("Claimer reserve error: "+reserveRes);
    },
    function(spawn){
        let newCreep = requestSpawn(spawn,blueprint.getBodyForLevel(2), undefined, {role: {name: "claimer", toClaim: "W18S21"} as RoleMemory});
            if (_.isString(newCreep)) {
                console.log("Spawning " + claimer.name);
            }
            else{
                console.log("Spawn error: "+newCreep);
            }
    }
);