
interface SVGElement {
    getX: () => number;
    getY: () => number;
    getWidth: () => number;
    getHeight: () => number;
    getEndX: () => number;
}


interface Event {
    eventName: string;
}



// str.includes(key)

interface String
{
    includes(key:string):boolean;
    endsWith(key:string):boolean;
}


interface DOMRect
{
    x2:number;
}

// interface ArrayConstructor  { includes(key:string):boolean; }

interface Array<T>
{
    includes(key:T):boolean;
}

interface DateConstructor
{
    new(value?: number): Date;
}


function foo(x?:number)
{
    
}

// return new Date(...vals);
let valyrian:number[];
foo( ...valyrian);


// part of ES6
interface ObjectConstructor {
    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source The source object from which to copy properties.
     */
    assign<T, U>(target: T, source: U): T & U;

    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source1 The first source object from which to copy properties.
     * @param source2 The second source object from which to copy properties.
     */
    assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;

    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source1 The first source object from which to copy properties.
     * @param source2 The second source object from which to copy properties.
     * @param source3 The third source object from which to copy properties.
     */
    assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;

    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param sources One or more source objects from which to copy properties
     */
    assign(target: object, ...sources: any[]): any;
}
