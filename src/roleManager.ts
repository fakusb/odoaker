import _ = require('lodash');
/**
 * Callback for role execution
 *
 * @callback runRole
 * @param {Creep} creep
 */
export let RoleManager = {
    byName : {} as {[name:string]:Role},
    register(role:Role){
        this.byName[role.name]=role;
    },
    run (creep:Creep) {
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
    constructor(name:string,run:(x: Creep) => void) {
        this.name = name;
        this.run = run;
        RoleManager.register(this);
    }
}

export class ManagedRole extends Role {
    create:(x:StructureSpawn) => void;
    constructor(name:string,run:(x: Creep) => void,create:(x: StructureSpawn) => void) {
        super(name,run);
        this.create = create;
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
