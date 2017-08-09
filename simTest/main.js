var harvester = require('roles/Harvester.js');

module.exports.loop = function() {
    // executed every tick
    console.log("Hello World");
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        harvester.run(creep);
    }
};
