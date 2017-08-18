/**
 *
 * @param {T[]} A
 * @param {T[]} B
 * @returns {T[]} The multiset difference A - B or undefined, if B is no subset of A
 */
import {assert} from "./utils";
import _ = require('lodash');
function tryMultisetSubstract<T>(A : T[], B : T[]) : (T[] | undefined){
    let res =  Array.from(A);
    for (let a in B){
        let i = _.findIndex(res,a);
        if (i<0) {
            return undefined
        }
        delete res[i];
    }
    return _.compact(res);
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
        return Math.min.apply(BODYPARTS_ALL.map((part:BodyPartConstant) =>{
            let acc = creep.getActiveBodyparts(part);
            acc -= this.baseParts[part] as number;
            if(acc<0){
                return -1;
            }
            return Math.floor(acc/(this.repeatParts[part] as number));
        })) as number;
    }
    getMaxLevelForEnergy(e:number){
        const getCost = (arg : BodyPartMap) => _.sum(BODYPARTS_ALL,(part)=>(BODYPART_COST[part]*(arg[part] as number)));
        const baseCost = getCost(this.baseParts);
        const repeatCosts = getCost(this.repeatParts);
        console.log("getMaxLebel: "+e+" "+baseCost+" "+repeatCosts);
        return e < baseCost? -1 : Math.floor((e - baseCost)/repeatCosts);
    }
    getBodyForLevel(i:number):BodyPartConstant[]{
        assert (i>=0);
        let res = [] as BodyPartConstant[];
        BODYPARTS_ALL.forEach((part) => {
            let size = i*((this.baseParts[part] ||0)+(this.repeatParts[part] ||0));
            res = res.concat(new Array(size).fill(part))});
        return res;
    }
}