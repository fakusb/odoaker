var harvester = require('Harvester');

module.exports.loop = function() {
    // executed every tick
    console.log("Hello World");
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        harvester.run(creep);
    }
};
