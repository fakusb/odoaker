
import {assert, freshIncrementalNameFor} from "./utils";
import {roomNameInMemory, idInMemory, idArrayInMemory} from "./decorators";
import energyManager = require('./resourceManager');


declare global{
    interface Memory{
        bases: {
            [name: string]: BaseMemory;
        };
    }
    interface SourceMemory {
        [id:string] : {
            curMiner : string,
            remoteRoom?: string
            //curTruck : string,
        }
    }
    interface CreepMemory {
        base : string
    }
    interface Game {
        bases : { [id:string] : Base}
    }
}


interface BaseMemory{
    //mainRoom : string,
    //sources: SourceMemory,
    //creeps: string[],
    //notice?: string
}

export class Base {
    name : string;
    memory : BaseMemory;
    @roomNameInMemory
    mainRoom : Room;
    //@gameObjInMemory
    //spawn : Spawn;
    constructor(name:string){
        this.name = name;
        if(!Memory.bases[name]) {
            console.log("Base has no memory. Create new base with other methode: "+name);
        }
        this.memory = Memory.bases[name];
    }

    static createFresh(spawn:Spawn,name?:string) : Base{
        if(!name)
            name = freshIncrementalNameFor(Memory.bases,"Base");
        Memory.bases[name]={};
        let base = new Base(name);
        base.mainRoom=spawn.room;
        Game.bases[name]=base;
        return base;
    }

    runWithoutInteraction(){
    }

    storedOrOnPile():StoreDefinition{
        this.mainRoom.find<>(FIND_MY_STRUCTURES)
    }

    // requestRoleSpawn(body:BodyPartConstant[],roleMem:RoleMemory) : string | ScreepsReturnCode{
    //     //console.log("Fix auto-respawn..."+mem!.role.name);
    //     return this.spawn.createCreep(body,name,{role : roleMem,base:this.name})
    // }
}

export function initTick() {
    if (!Memory.bases)
        Memory.bases = {};
    Game.bases = {};
    for(let baseName in Memory.bases){
        let base = new Base(baseName);
        Game.bases[base.name]=base;
    }
    if(Game.bases.Base1===undefined)
        Base.createFresh(Game.spawns.Spawn1,"Base1");
    let base = Game.bases.Base1 as Base;
}

export function runIsolated(){
    for(let name in Game.bases){
        let base = Game.bases[name];
        base.runWithoutInteraction();
    }
}




