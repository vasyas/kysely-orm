export declare type AnyFunction<A = any> = (...input: any[]) => A;
export declare type AnyConstructor<A = object> = new (...input: any[]) => A;
declare type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;
export default Mixin;
