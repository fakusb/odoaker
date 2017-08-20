

export function requestSpawn(spawn:Spawn,body:BodyPartConstant[],name?:string,mem?:CreepMemory) : string | ScreepsReturnCode{
    //console.log("Fix auto-respawn..."+mem!.role.name);
    return spawn.createCreep(body,name,mem)
}