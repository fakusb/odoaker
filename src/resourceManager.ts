
import {assert} from "./utils";

export type EnergyManaged = StructureSpawn | StructureExtension | StructureContainer | StructureStorage | StructureTower | Resource;

interface energyManagerState {
    reservedEnergy : {[targetId:string]:{[claimerId:string]:number}};
}
function getState() : energyManagerState{
    return Memory.energyManager = Memory.energyManager || {};
}

// Supports virtual energy levels so that creeps can 'reserve' energy from remote location

export function reserveEnergy(claimer : Creep, target : EnergyManaged,amount : number){
    assert(amount >= 0 );
    if(!getState().reservedEnergy[target.id]){
        getState().reservedEnergy[target.id]={}
    }
    assert((getState().reservedEnergy[target.id][claimer.id]||0)>=0);
    getState().reservedEnergy[target.id][claimer.id]=amount;
}

export function announceEnergyDelivery(deliverer : Creep, target : EnergyManaged,amount : number){
    assert(amount >= 0 );
    if(!getState().reservedEnergy[target.id]){
        getState().reservedEnergy[target.id]={}
    }
    assert((getState().reservedEnergy[target.id][deliverer.id]||0)<=0);
    getState().reservedEnergy[target.id][deliverer.id]=-amount;
}

export function totalEnergy(target : EnergyManaged) : number{
    if(target instanceof StructureStorage || target instanceof StructureContainer){
        return target.store.energy;
    }
    if (target instanceof Resource){
        return target.amount
    }
    return target.energy;
}

export function availableInRoom(room:Room){
    let stores = room.find<StructureStorage|StructureContainer>(FIND_STRUCTURES,{filter:(o:Structure)=>(_.contains([STRUCTURE_CONTAINER,STRUCTURE_STORAGE],o.structureType)) });
    let piles = room.find()
}

/**
 * Energy not yet claimed but on the way/reserved
 * @param {EnergyManaged} target
 * @returns {number}
 */
export function availableEnergy(target : EnergyManaged) : number{
    return totalEnergy(target)-_.sum(getState().reservedEnergy[target.id]);
}
export function availableEnergyAtFor(target : EnergyManaged,creep:Creep) : number{
    let ownReserved = getState().reservedEnergy[target.id][creep.id];
    assert(ownReserved as any,"No reservation by "+creep.id+" at "+target.id);
    return Math.min(totalEnergy(target),availableEnergy(target)+ownReserved,ownReserved);
}

function garbageCollect(){
    let state = getState();
    _.forOwn(state.reservedEnergy,(reservations,targetId)=>{
        if(!Game.getObjectById(targetId!)){
            delete state.reservedEnergy[targetId!];
            //console.log('GC energy source:'+targetId);
        }
        else{
            _.forOwn(reservations,(amount,claimerId)=> {
                if(!Game.getObjectById(claimerId)){
                    delete reservations[claimerId!];
                    //console.log('GC energy claim by:'+claimerId);
                }
            });
        }
    });
    for(let id in state.reservedEnergy){
        let reservations = state.reservedEnergy[id];
        if(Object.getOwnPropertyNames(reservations).length==0)
            delete state.reservedEnergy[id];
    }
}

export function initTick(){
    garbageCollect();
}


/**
 * Cancels an aborted or completed delivery
 * @param {Creep} deliverer
 * @param {EnergyManaged} target
 */
export function cancelDelivery(deliverer:Creep,target:EnergyManaged){
    delete getState().reservedEnergy[target.id][deliverer.id];
}

/**
 * Cancels an aborted or completed reservation
 * @param {Creep} claimer
 * @param {EnergyManaged} target
 */
export function cancelReservation(claimer:Creep,target:EnergyManaged){
    delete getState().reservedEnergy[target.id][claimer.id];
}