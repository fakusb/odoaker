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
        if(!_.isUndefined(roleName))
            Role.byName[roleName].run(creep);
        else {
            console.log("Unassigned creep:" + creep.name)
        }
    };
}

module.exports = Role;