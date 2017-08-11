/**
 * Callback for role execution
 *
 * @callback runRole
 * @param {Creep} creep
 */
let byName = {};
class Role{
    /**
     *  @type {Object<string,Role>} roles
     */
    static get byName(){ return byName; };

    /**
     *
     * @param {string} name
     * @param {runRole} run
     */
    constructor(name,run){
        this.name = name;
        this.run = run;
        Role.byName[name]=this;
    };



    /**
     *
     * @param {Creep} creep
     */
    static run (creep){
        let roleName = creep.memory.role;
        Role.byName[roleName].run(creep);
    };
}

module.exports = Role;