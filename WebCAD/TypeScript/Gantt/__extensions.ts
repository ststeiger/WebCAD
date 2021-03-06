
interface SVGElement {
    getX: () => number;
    getY: () => number;
    getWidth: () => number;
    getHeight: () => number;
    getEndX: () => number;
}


interface DOMRect {
    x2: number;
}



interface Event {
    eventName: string;
}


// interface ArrayConstructor  { includes(key:string):boolean; }
interface Array<T> {
    includes(key: T): boolean;
    find(predicate: (value: T) => boolean, thisArg?: T);
}


// str.includes(key)
interface String
{
    includes(key:string):boolean;
    endsWith(key:string):boolean;
    repeat(count: number): string
    // substr(from: number, length?: number): string
}


// https://stackoverflow.com/questions/37007524/export-a-union-type-alias-in-typescript
// type TypeAB = string | number;
type DateComponents = [number, number, number, number, number, number, number] | [number, number, number, number, number, number] | [number, number, number, number, number] | [number, number, number, number] | [number, number, number] | [number, number];


/*
[...this.$svg.querySelectorAll('.bar-wrapper')]
//  this.$svg.querySelectorAll('.bar-wrapper').slice().forEach(function (el) {
Array.prototype.slice.call(this.$svg.querySelectorAll('.bar-wrapper'))
    .forEach(function (el) {
        el.classList.remove('active');
    });
*/






//interface DateConstructor {
//    new(): Date;
//    new(value: number | string): Date;
//    new(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): Date;
//    (): string;
//}


// https://github.com/Microsoft/TypeScript/issues/27920
interface DateConstructor
{
    // new(...args: number[]): Date; // for new Date(...[a,b, etc]), predefined-constructor requires at least two numbers, so doesn't work with spread since that could be 0 arguments...
    // The above allows for 0 arguments, so use DateComponents instead
    new(...args: DateComponents): Date;
}


// const dateFields: [number, number, number, number, number, number] = [2018, 5, 14, 14, 41, 11];
// const date = new Date(...dateFields);



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
