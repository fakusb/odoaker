
export function saveStats() {
    if (Memory.stats == undefined) {
        Memory.stats = {}
    }

    let rooms = Game.rooms;
    let spawns = Game.spawns;
    for (let roomKey in rooms) {
        let room = Game.rooms[roomKey];
        let isMyRoom = (room.controller ? room.controller.my : 0);
        if (isMyRoom) {
            Memory.stats['room.' + room.name + '.myRoom'] = 1;
            Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
            Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable;
            Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller!.progress;
            Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller!.progressTotal;
            let stored = 0;
            let storedTotal = 0;

            if (room.storage) {
                stored = room.storage.store[RESOURCE_ENERGY];
                storedTotal = room.storage.storeCapacity;
            } else {
                stored = 0;
                storedTotal = 0;
            }

            Memory.stats['room.' + room.name + '.storedEnergy'] = stored;

            let creepsPerRole = _.countBy(Game.creeps,'memory.role.name');
            Memory.stats['room.' + room.name + '.creeps'] = creepsPerRole;

            let spawns = room.find(FIND_MY_STRUCTURES,{filter: {structureType : STRUCTURE_SPAWN}});
            Memory.stats['room.' + room.name + '.spawnsInactive'] = spawns.filter(function(spawn:Spawn){return !spawn.isActive();}).length;
        } else {
            Memory.stats['room.' + room.name + '.myRoom'] = undefined;
        }
    }
    Memory.stats['gcl.progress'] = Game.gcl.progress;
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
    Memory.stats['gcl.level'] = Game.gcl.level;
// for (let spawnKey in spawns) {
//   let spawn = Game.spawns[spawnKey];
//   Memory.stats['spawn.' + spawn.name + '.defenderIndex'] = spawn.memory['defenderIndex'];
// }

    // Memory.stats['cpu.CreepManagers'] = creepManagement;
    // Memory.stats['cpu.Towers'] = towersRunning;
    // Memory.stats['cpu.Links'] = linksRunning;
    // Memory.stats['cpu.SetupRoles'] = roleSetup;
    // Memory.stats['cpu.Creeps'] = functionsExecutedFromCreeps;
    // Memory.stats['cpu.SumProfiling'] = sumOfProfiller;
    // Memory.stats['cpu.Start'] = startOfMain;
    Memory.stats['cpu.bucket'] = Game.cpu.bucket;
    Memory.stats['cpu.limit'] = Game.cpu.limit;
    //Memory.stats['cpu.stats'] = Game.cpu.getUsed() - lastTick;
    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();
}