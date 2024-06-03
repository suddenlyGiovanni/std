import type { Equals } from '../internal/equals.ts'
import type * as F from '../internal/function.ts'
import type { Inspectable } from '../internal/inspectable.ts'

function format(x: unknown): string {
	return JSON.stringify(x, null, 2)
}

/**
 * Represents optional values. Instances of `Option` are either an instance of {@linkcode Some} or the  {@linkcode None},  where  Some holds a value, and None is empty.
 *
 * The most idiomatic way to use an Option instance is to treat it as  monad and use `map`,`flatMap`,` filter`, or `foreach`:
 * These are useful methods that exist for both Some and None:
 * -[ ] `isDefined` : True if not empty
 * -[ ] `isEmpty` : True if empty
 * -[ ] `nonEmpty`: True if not empty
 * -[ ] `orElse`: Evaluate and return alternate optional value if empty
 * -[ ] `getOrElse`: Evaluate and return alternate value if empty
 * -[ ] `get`: Return value, throw exception if empty
 * -[ ] `fold`: Apply function on optional value, return default if empty
 * -[ ] `map`: Apply a function on the optional value
 * -[ ] `flatMap`: Same as map but function must return an optional value
 * -[ ] `foreach`: Apply a procedure on option value
 * -[ ] `collect`: Apply partial pattern match on optional value
 * -[ ] `filter`: An optional value satisfies predicate
 * -[ ] `filterNot`: An optional value doesn't satisfy predicate
 * -[ ] `exists`: Apply predicate on optional value, or false if empty
 * -[ ] `forall`: Apply predicate on optional value, or true if empty
 * -[ ] `contains`: Checks if value equals optional value, or false if empty
 * -[ ] `zip`: Combine two optional values to make a paired optional value
 * -[ ] `unzip`: Split an optional pair to two optional values
 * -[ ] `unzip3`: Split an optional triple to three optional values
 * -[ ] `toList`: Unary list of optional value, otherwise the empty list
 * A less-idiomatic way to use Option values is via pattern matching method `match`:
 */
export abstract class Option<out A> implements Inspectable, Equals {
	/**
	 * The discriminant property that identifies the type of the `Option` instance.
	 */
	public abstract readonly _tag: 'None' | 'Some'

	/**
	 * Option is an abstract class and should not be instantiated directly.
	 * @throws Error - Option is not meant to be instantiated directly.
	 *
	 * @see Option.None - to create an empty Option
	 * @see Option.Some - to create an Option with a value
	 * @see Option.fromNullable - to create an Option from a nullable value
	 *
	 * @hideconstructor
	 */
	protected constructor() {
		if (new.target === Option) {
			throw new Error('Option is not meant to be instantiated directly')
		}
	}

	/**
	 * Overloads default {@linkcode Object#[Symbol#toStringTag]} getter allowing Option to return a custom string
	 */
	public get [Symbol.toStringTag](): string {
		return `Option.${this._tag}`
	}

	/**
	 * Overloads default serialization behavior when using JSON stringify method
	 * @override
	 */
	public toJSON(this: Option.Type<A>): {
		_id: 'Option'
		_tag: 'None' | 'Some'
		value?: A
	} {
		return {
			_id: 'Option',
			_tag: this._tag,
			...(this.isSome() ? { value: this.get() } : {}),
		}
	}

	/**
	 * Overloads default {@linkcode Object#prototype#toString} method allowing Option to return a custom string representation of the boxed value
	 * @override
	 */
	public toString(this: Option.Type<A>): string {
		return format(this.toJSON())
	}

	/**
	 * Creates a new `Option` that represents the absence of a value.
	 *
	 * @category constructors
	 */
	public static None<A>(): Option.Type<A> {
		return None.getSingletonInstance<A>()
	}

	/**
	 * Creates a new `Option` that wraps the given value.
	 *
	 * @param value - The value to wrap.
	 * @returns An instance of {@linkcode Some(1)} containing the value.
	 */
	public static Some<T>(value: T): Option.Type<T> {
		return new Some(value)
	}

	/**
	 * Returns the result of applying f to Option's value if the Option is nonempty. Otherwise, evaluates expression `ifEmpty`.
	 *
	 * @param self - The option to fold
	 * @param ifEmpty - The expression to evaluate if empty.
	 * @param f - The function to apply if nonempty.
	 * @returns The result of applying `f` to this Option's value if the Option is nonempty. Otherwise, evaluates expression `ifEmpty`.
	 *
	 * @remarks
	 * This is a curried function, so it can be partially applied.
	 * It is also known as `reduce` in other languages.
	 *
	 * @example
	 *  ( ( ) -> B,  (A) -> B ) -> Option.Type<A> -> B
	 * ```ts
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 * import type * as F from '../internal/function.ts'
	 *
	 * import { Option } from  './option.ts'
	 *
	 * // Define a function to execute if the option holds a value
	 * const increment: (x: number) => number = a => a + 1
	 * // Define function to be evaluated if the Option is empty
	 * const ifEmpty:F.Lazy<number> = () => 0
	 *
	 * // Define curry function
	 * const incrementOrZero = Option.fold(ifEmpty, increment)
	 *
	 * const two = incrementOrZero(Option.Some(1))
	 * //        ^? number
	 * assertStrictEquals(two, 2)
	 *
	 * const zero: number = incrementOrZero(Option.None())
	 * //        ^? number
	 * assertStrictEquals(zero, 0)
	 * ```
	 *
	 * @example
	 * ( ( ) -> B,  (A) -> C ) -> Option.Type<A> -> B | C
	 * ```ts
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 * import type * as F from '../internal/function.ts'
	 *
	 * import { Option } from  './option.ts'
	 *
	 * const fold = Option.fold(() => null, (a: number) => a + 1)
	 *
	 * const two: number | null = fold(Option.Some(1))
	 * // 			  ^? number | null
	 * assertStrictEquals(two, 2)
	 *
	 * const numberOrNull: number | null = fold(Option.None())
	 * // 			  ^? number | null
	 * assertStrictEquals(numberOrNull, null)
	 * ```
	 * @see match
	 * @category scala3-api
	 */
	public static fold<B, A, C = B>(
		ifEmpty: F.Lazy<B>,
		f: (a: A) => C,
	): (self: Option.Type<A>) => B | C {
		return (self) => (self.isEmpty() ? ifEmpty() : f(self.get()))
	}

	/**
	 * Constructs a new `Option` from a nullable type.
	 * @param nullableValue - An nullable nullableValue
	 * @returns An `Option` that is {@linkcode class None} if the nullableValue is `null` or `undefined`, otherwise a {@linkcode Some(1)} containing the nullableValue.
	 *
	 * @example
	 * ```ts
	 *  import { assertStrictEquals  } from 'jsr:@std/assert'
	 *  import { Option } from  './option.ts'
	 *
	 *  assertStrictEquals(Option.fromNullable(undefined), Option.None()) // None | Option.Some<never>
	 *  assertStrictEquals(Option.fromNullable(undefined as (undefined | string)), Option.None()) // None | Option.Some<string>
	 *  assertStrictEquals(Option.fromNullable(null), Option.None())  // None | Option.Some<never>
	 *  assertStrictEquals(Option.fromNullable(1), Option.Some(1)) // None | Option.Some<number>
	 * ```
	 *
	 * @category constructors
	 */
	public static fromNullable<T>(nullableValue: T): Option.Type<NonNullable<T>> {
		return nullableValue === undefined || nullableValue === null
			? None.getSingletonInstance<NonNullable<T>>()
			: Option.Some(nullableValue as NonNullable<T>)
	}

	/**
	 * Determine if a `Option` is a `None`.
	 *
	 * @param self - The `Option` to check.
	 *
	 * @example
	 * ```ts
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 * import { Option } from  './option.ts'
	 *
	 * assertStrictEquals(Option.isNone(Option.Some(1)), false)
	 * assertStrictEquals(Option.isNone(Option.None()), true)
	 * ```
	 * @category type-guards
	 */
	public static isNone<T>(self: Option.Type<T>): self is None<T> {
		return self instanceof None
	}

	/**
	 * Tests if a value is a `Option`; it does not check if the value is a `Some` or a `None`.
	 *
	 * @param input - The value to check.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 *
	 * assertStrictEquals(Option.isOption(Option.Some(1)), true)
	 * assertStrictEquals(Option.isOption(Option.None()), true)
	 * assertStrictEquals(Option.isOption({}), false)
	 * ```
	 * @category type-guards
	 */
	public static isOption(input: unknown): input is Option.Type<unknown> {
		return input instanceof None || input instanceof Some
	}

	/**
	 * Determine if a `Option` is a `Some`.
	 *
	 * @param self - The `Option` to check.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 *
	 * assertStrictEquals(Option.isSome(Option.Some(1)), true)
	 * assertStrictEquals(Option.isSome(Option.None()), false)
	 * ```
	 * @category type-guards
	 */
	public static isSome<T>(self: Option.Type<T>): self is Some<T> {
		return self instanceof Some
	}

	/**
	 * Curried pattern matching for `Option` instances.
	 * Given a pattern matching object, it will return a function that will match the `Option` instance against the pattern.
	 *
	 * @param cases - The pattern matching object
	 * @param cases.onNone - The lazy value to be returned if the `Option` is `None`;
	 * @param cases.onSome - The function to be called if the `Option` is `Some`, it will be passed the `Option`'s value and its result will be returned
	 * @returns A function that will match the `Option` instance against the pattern.
	 *
	 * @example
	 * ```ts
	 *  import { assertStrictEquals  } from 'jsr:@std/assert'
	 * import { Option } from './option.ts'
	 * import { pipe } from '../internal/function.ts'
	 *
	 * assertStrictEquals(
	 *   pipe(
	 *    Option.Some(1),
	 *    Option.match({ onNone: () => 'a none', onSome: (a) => `a some containing ${a}` })
	 *   ),
	 *   'a some containing 1'
	 * )
	 *
	 * assertStrictEquals(
	 *   pipe(
	 *    Option.None(),
	 *    Option.match({ onNone: () => 'a none', onSome: (a) => `a some containing ${a}` })
	 *   ),
	 *   'a none'
	 * )
	 * ```
	 * @see fold
	 * @category pattern matching
	 */
	public static match<B, A, C = B>(cases: {
		readonly onNone: F.Lazy<B>
		readonly onSome: (a: A) => C
	}): (self: Option.Type<A>) => B | C {
		return Option.fold(cases.onNone, cases.onSome)
	}

	/**
	 * Implements the {@linkcode Equals} interface, providing a way to compare two this Option instance with another unknown value that may be an Option or not.
	 *
	 * @param that - the value to compare
	 * @param predicateStrategy - an optional predicate strategy to use when comparing the values. Defaults to `Object.is`.
	 * @returns `true` if the two values are equal, `false` otherwise.
	 * @remarks
	 * In its unary form, it uses referential equality (employing the Object.is algorithm). This behavior can be overridden by providing a custom predicate strategy as second argument.
	 *
	 * @example
	 * Using the default referential equality strategy on primitive types:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals, equal } from 'jsr:@std/assert'
	 *
	 * const some1 = Option.Some(1)
	 * const none = Option.None()
	 *
	 * // equality on primitive types
	 * assertStrictEquals(some1.equals(some1), true)
	 * assertStrictEquals(some1.equals(none), false)
	 * assertStrictEquals(none.equals(none), true)
	 * ```
	 *
	 * @example
	 * Using the default referential equality strategy on non-primitive types:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals, equal } from 'jsr:@std/assert'
	 *
	 * const some1 = Option.Some(1)
	 * const none = Option.None()
	 *
	 * // equality derive types
	 * assertStrictEquals(some1.equals(Option.Some(1)), true)
	 * const someRecord = Option.Some({ foo: 'bar' })
	 * assertStrictEquals(someRecord.equals(someRecord), true)
	 * assertStrictEquals(someRecord.equals(Option.Some({ foo: 'bar' })), false)
	 * ```
	 *
	 * @example
	 * Using a custom predicate strategy:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals, equal } from 'jsr:@std/assert'
	 *
	 * // equality with custom predicate strategy
	 * assertStrictEquals(
	 * 	Option.Some({ foo: 'bar' }).equals(
	 * 		Option.Some({ foo: 'bar' }),
	 * 		equal, // a custom deep equality strategy
	 * 	),
	 * 	true,
	 * )
	 * ```
	 */
	public equals<That>(
		this: Option.Type<A>,
		that: That,
		predicateStrategy: (self: A, that: That) => boolean = Object.is,
	): boolean {
		return this.isSome()
			? Option.isOption(that) &&
				Option.isSome(that) &&
				predicateStrategy(this.get(), that.get() as That)
			: Option.isOption(that) && Option.isNone(that)
	}

	/**
	 * Returns the result of applying f to this Option's value if the Option is
	 * nonempty. Otherwise, evaluates expression ifEmpty.
	 *
	 * @param ifEmpty - The expression to evaluate if empty.
	 * @param f - The function to apply if nonempty.
	 * @returns The result of applying `f` to this Option's value if the Option is nonempty. Otherwise, evaluates expression `ifEmpty`.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 *
	 * assertStrictEquals(Option.Some(1).fold(() => 0, (a) => a + 1), 2)
	 * assertStrictEquals(Option.Some(1).fold(() => 0, (a) => a + 1), 0)
	 * ```
	 * @category scala3-api
	 */
	public fold<A, B, C = B>(
		this: Option.Type<A>,
		ifEmpty: F.Lazy<B>,
		f: (a: NoInfer<A>) => C,
	): B | C {
		return Option.fold(ifEmpty, f)(this)
	}

	/**
	 * Returns the option's value.
	 * @throws Error - if the option is empty
	 * @remarks The option must be nonempty.
	 */
	public abstract get(): A

	/**
	 * Type guard that returns `true` if the option is None, `false` otherwise.
	 *
	 * @returns `true` if the option is None, `false` otherwise.
	 * @alias isNone
	 * @category type-guards, scala3-api
	 */
	isEmpty(this: Option.Type<A>): this is None<A> {
		return this.isNone()
	}

	/**
	 * Type guard that checks if the `Option` instance is a {@linkcode None}.
	 * @returns `true` if the `Option` instance is a {@linkcode None}, `false` otherwise.
	 *
	 * @category type-guards
	 */
	public isNone(this: Option.Type<A>): this is None<A> {
		return Option.isNone(this)
	}

	/**
	 * Determine if an `Option` instance  is a `Some`.
	 *
	 * @category type-guards
	 */
	public isSome(this: Option.Type<A>): this is Some<A> {
		return Option.isSome(this)
	}
}

/**
 * The type-level namespace for Option
 * @namespace Option
 * @since 0.0.1
 */
export declare namespace Option {
	/**
	 * Option is the sum type of {@linkcode None} and {@linkcode Some}.
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 *
	 * // ts-check
	 * const some: Option.Type<number> = Option.Some(1)
	 * const none: Option.Type<number> = Option.None()
	 * ```
	 *
	 * @category type-level
	 */
	export type Type<A> = None<A> | Some<A>

	/**
	 * Type utility to extract the type of the value from an Option.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 *
	 * const aNumber: number = 42
	 * const someOfNumber: Option.Type<number> = Option.Some(aNumber)
	 * const test1: Option.Value<typeof someOfNumber> = aNumber // ✅ no ts error!
	 * //       ^? number
	 *
	 * // @ts-expect-error Type 'string' is not assignable to type 'number'.
	 * const test2: Option.Value<typeof someOfNumber> = "42" // 💥ts error!
	 * ```
	 */
	export type Value<T extends Option.Type<unknown>> = [T] extends [Option.Type<infer _A>] ? _A
		: never
}

/**
 * Case class representing the absence of a value.
 * @class None
 * @extends Option
 * @public
 */
class None<out A> extends Option<A> {
	static #instance: undefined | None<unknown> = undefined
	public readonly _tag = 'None' as const

	/**
	 * @inheritDoc
	 */
	public get(): never {
		throw new Error('None.get')
	}

	/**
	 * Creates a new immutable `None` instance.
	 *
	 * @returns An instance of `None`
	 * @remaks
	 * We don't need multiple instances of `None` in memory, therefore we can save memory by using a singleton pattern.
	 * Do not call this constructor directly. Instead, use {@linkcode None#getSingletonInstance}.
	 * @hideconstructor
	 */
	private constructor() {
		super()
		Object.freeze(this)
	}

	/**
	 * Returns the singleton instance of `None`.
	 *
	 * @returns The singleton instance of `None`.
	 * @internal - use instead {@linkcode Option#None}
	 *
	 * @category constructors
	 */
	public static getSingletonInstance<B>(): None<B> {
		if (!None.#instance) {
			None.#instance = new None<B>()
		}
		return None.#instance as None<B>
	}
}

/**
 * Case class representing the presence of a value.
 * @class Some
 * @extends Option
 * @public
 */
class Some<out A> extends Option<A> {
	public readonly _tag = 'Some' as const

	/**
	 * @inheritDoc
	 */
	public get(): A {
		return this.#value
	}

	readonly #value: A

	/**
	 * Creates a new `Some` immutable instance that wraps the given value.
	 *
	 * @param value - The `value` to wrap.
	 * @returns An instance of `Some`
	 * @remarks Do not call this constructor directly. Instead, use the static  {@linkcode Option#Some}
	 * @hideconstructor
	 */
	public constructor(value: A) {
		super()
		this.#value = value
		Object.freeze(this)
	}
}
