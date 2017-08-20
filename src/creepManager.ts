import {RoleManager} from "./roleManager";
export function buryDeadCreeps(){
    _.forEach(Memory.creeps,function (creep:Creep,name:string) {
        if (_.isUndefined(Game.creeps[name])) {
            console.log("Memory garbage collect: " + name);
            delete Memory.creeps[name];
        }
    });
}
export function runAllCreeps(){
    _.forEach(Game.creeps,function(creep){
        RoleManager.run(creep)});
}