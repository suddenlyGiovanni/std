/**
 * # Option Module
 * The Option Module is inspired by the Scala 3 Option type. This module primarily solves one of the common problems in programming - avoiding null and undefined values.
 *
 * The Option type is a container that encapsulates an optional value, i.e., it stores some value or none. It's a safer alternative to using null or undefined. By using Option, you can avoid null reference errors. The main advantage of using an `Option` type is that you're explicitly dealing with something that may or may not be there.
 *
 * ## How it works
 * This module exports a base abstract class `Option` and two concrete subclasses `Some` and `None`. An `Option` object encapsulates a value that may or may not be present. A `Some` object represents an `Option` that contains a value, and `None` represents an `Option` that has no value.
 *
 * ## How to use it
 * When you have a value that you want to lift into a boxed `Option`, you create an object of type `Some`, as follows:
 *
 * ```ts
 * import { Option } from './option.ts'
 *
 * const value = Option.Some("Hello, world!");
 * ```
 *
 * If there isn't a value to lift, you create a `None` object, as follows:
 *
 * ```ts
 * import { Option } from './option.ts'
 *
 * const value = Option.None();
 * ```
 *
 * To check the contents of an `Option`, use the `isSome` and `isNone` methods and extract the value when it is `Some`:
 *
 * ```ts
 * import { Option } from './option.ts'
 *
 * const value = Option.None();
 *
 * if (value.isSome()) {
 *   console.log(value.value);
 * } else {
 *   console.log("Value is None");
 * }
 * ```
 *
 * @module
 */

export { Option } from './option.ts'
