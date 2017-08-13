import _ = require('lodash');
/**
 * Callback for role execution
 *
 * @callback runRole
 * @param {Creep} creep
 */
export let RoleManager = {
    byName : {},
    register(role:Role){
        this.byName[role.name]=role;
    },
    run (creep) {
        let roleName = creep.memory.role;
        if (!_.isUndefined(roleName)) {
            if (!creep.spawning) {
                this.byName[roleName].run(creep);
            }
        }
        else {
            console.log("Unassigned creep:" + creep.name)
        }
    }
};

export class Role {
    name: string;
    run: (x: Creep) => void;
    create?:(Spawn) => void;
    constructor(name,run,create?) {
        this.name = name;
        this.run = run;
        if(create) {
            this.create = create;
        }
        RoleManager.register(this);
    }
}

    /**
     *  @type {Object<string,Role>} roles
     */
    // static get roleByName(){ return roleByName; };

    /**
     *
     * @param {string} name
     * @param {runRole} run
     */
    // constructor(name,run){
    //     this.name = name;
    //     this.run = run;
    //     Role.roleByName[name]=this;
    // };



    // /**
    //  *
    //  * @param {Creep} creep
    //  */
    // static
//}
