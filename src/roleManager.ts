import {assert} from "./utils";
/**
 * Callback for role execution
 *
 * @callback runRole
 * @param {Creep} creep
 */



declare global {
    interface CreepMemory {
        roleMem: RoleMemory,
        role: string
    }
    interface RoleMemory {
        name : string
    }
}

export let RoleManager = {
    byName : {} as {[name:string]:Role},
    register(role:Role){
        this.byName[role.name]=role;
    },
    run (creep:Creep) {
        let roleName = creep.memory.role.name;
        if (!_.isUndefined(roleName) && this.byName[roleName]) {
            if (!creep.spawning) {
                this.byName[roleName].run(creep);
            }
        }
        else {
            console.log("Unassigned creep:" + creep.name + "(Don't know role '"+roleName+"')")
        }
    }
};

export class Role<T extends RoleMemory> {
    name: string;
    run: (x: Creep) => void;
    constructor(name:string,run:(x: Creep) => void) {
        this.name = name;
        this.run = run;
        RoleManager.register(this);
    }
}

export class ManagedRole<T extends RoleMemory> extends Role<T> {
    create:(x:StructureSpawn) => void;
    constructor(name:string,run:(x: Creep) => void,create:(x: StructureSpawn) => void) {
        super(name,run);
        this.create = create;
    }
}

type BodyPartMap = {[part in BodyPartConstant]?: number | void}
export class CreepBlueprint {
    baseParts : BodyPartMap;
    repeatParts :BodyPartMap;
    constructor(baseParts : BodyPartMap, repeatParts : BodyPartMap) {
        this.baseParts = baseParts;
        this.repeatParts = repeatParts;
    }

    /**
     *
     * @param {Creep} creep
     * @returns {number} -1 if not applicable, level otherwise
     */
    getCreepLevel(creep:Creep):number {
        let partLevels = BODYPARTS_ALL.map((part:BodyPartConstant) =>{
            let acc = creep.getActiveBodyparts(part);
            acc -= this.baseParts[part] || 0;
            if(acc<0){
                return -1;
            }

            if(!this.repeatParts[part]){
                return Infinity;
            }
            return Math.floor(acc/(this.repeatParts[part] || 0));
        });
        return Math.min(...partLevels);
    }
    getMaxLevelForEnergy(e:number){
        const getCost = (arg : BodyPartMap) => _.sum(BODYPARTS_ALL,(part)=>(BODYPART_COST[part]*(arg[part] as number)));
        const baseCost = getCost(this.baseParts);
        const repeatCosts = getCost(this.repeatParts);
        //console.log("getMaxLevel: "+e+" "+baseCost+" "+repeatCosts);
        return e < baseCost? -1 : Math.floor((e - baseCost)/repeatCosts);
    }
    getBodyForLevel(i:number):BodyPartConstant[]{
        assert (i>=0);
        let res = [] as BodyPartConstant[];
        BODYPARTS_ALL.forEach((part) => {
            let size = Math.floor(((this.baseParts[part] ||0)+i*(this.repeatParts[part] ||0)));
            res = res.concat(new Array(size).fill(part))});
        return res;
    }
}