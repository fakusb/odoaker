
import {assert} from "./utils";

export type EnergyManaged = StructureSpawn | StructureExtension | StructureContainer | StructureStorage | Resource;

interface energyManagerState {
    reservedEnergy : {[targetId:string]:{[claimerId:string]:number}};
}
function getState() : energyManagerState{
    if(!Memory.energyManager){
        Memory.energyManager = {reservedEnergy : {}};
    }
    return Memory.energyManager;
}

// Supports virtual energy levels so that creeps can 'reserve' energy from remote location

export function reserveEnergy(claimer : Creep, target : EnergyManaged,amount : number){
    assert(amount >= 0 );
    if(!getState().reservedEnergy[target.id]){
        getState().reservedEnergy[target.id]={}
    }
    getState().reservedEnergy[target.id][claimer.id]=amount;
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

export function availableEnergy(target : EnergyManaged) : number{
    return totalEnergy(target)-_.sum(getState().reservedEnergy[target.id]);
}

export function garbageCollect(){
    let state = getState();
    _.forOwn(state.reservedEnergy,(reservations,targetId)=>{
        if(!Game.getObjectById(targetId!)){
            delete state.reservedEnergy[targetId!];
            console.log('GC energy source:'+targetId);
        }
        else{
            _.forOwn(reservations,(amount,claimerId)=> {
                if(!Game.getObjectById(claimerId)){
                    delete reservations[claimerId!];
                    console.log('GC energy claim by:'+claimerId);
                }
            });
        }
    });
}

export function cancelReservation(claimer:Creep,target:EnergyManaged){
    delete getState().reservedEnergy[target.id][claimer.id];
}