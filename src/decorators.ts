// src/decorators.ts
export function idInMemory<T extends {id:string}>(target: any, key: string): any | void {
    let memKey = '_'+key;
    Object.defineProperty(target, key, {
        configurable: true,  // this defaults to false if you don't set it
        enumerable: true,   // this too
        set: function(this : {memory : any},val: T) : void {
            this.memory[memKey] = val.id;
        },
        get: function(this : {memory : any}) : T | null{
            return Game.getObjectById<T>(this.memory[memKey]);
        }
    });
}

export function roomNameInMemory(target: any, key: string): void {

    let memKey = '_'+key;
    Object.defineProperty(target, key, {
        configurable: true,  // this defaults to false if you don't set it
        enumerable: true,   // this too
        set: function(this : {memory : any},val:Room) : void{
            this.memory[memKey] = val.name;
        },
        get: function(this : {memory : any}) : Room {
            return Game.rooms[this.memory[memKey]];
        }
    });
}


export function idArrayInMemory<T extends {id:string}>(target: any, key: string): void {

    let memKey = '_'+key;
    Object.defineProperty(target, key, {
        configurable: true,  // this defaults to false if you don't set it
        enumerable: true,   // this too
        set: function(this : {memory : any},A:T[]){
            this.memory[memKey] = A.map((o)=>o.id);
        },
        get: function(this : {memory : any}) : (T|null)[] {
            return (this.memory[memKey] as string[]).map((id)=>Game.getObjectById<T>(id));
        }
    });
}