import type { Equals } from '../internal/equals.ts'
import type { Inspectable } from '../internal/inspectable.ts'

function format(x: unknown): string {
	return JSON.stringify(x, null, 2)
}

/**
 * Represents optional values. Instances of `Option` are either an instance of {@linkcode Some} or the  {@linkcode None},  where  Some holds a value, and None is empty.
 *
 * The most idiomatic way to use an Option instance is to treat it as  monad and use `map`,`flatMap`,` filter`, or `foreach`:
 * These are useful methods that exist for both Some and None:
 * - [ ] `isDefined` : True if not empty
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
 *  -[ ] `unzip3`: Split an optional triple to three optional values
 *  -[ ] `toList`: Unary list of optional value, otherwise the empty list
 * A less-idiomatic way to use Option values is via pattern matching method `match`:
 */
export abstract class Option<out A = unknown> implements Inspectable, Equals {
	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	public abstract readonly _tag: 'None' | 'Some'

	protected constructor() {
		if (new.target === Option) {
			throw new Error('Option is not meant to be instantiated directly')
		}
	}

	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	public get [Symbol.toStringTag](): string {
		return `${this.constructor.name}.${this._tag}`
	}

	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	public abstract toJSON(): unknown

	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	public toString(): string {
		return format(this.toJSON())
	}

	/**
	 * Creates a new `Option` that represents the absence of a value.
	 *
	 * @category constructors
	 */
	public static None(): None | Some<never> {
		return None.getInstance()
	}

	/**
	 * Creates a new `Option` that wraps the given value.
	 *
	 * @param value - The value to wrap.
	 *
	 * @category constructors
	 */
	public static Some<T>(value: T): None | Some<T> {
		return new Some(value)
	}

	/**
	 * Constructs a new `Option` from a nullable type. If the value is `null` or
	 * `undefined`, returns `None`, otherwise returns the value wrapped in a `Some`
	 *
	 * @category Constructors
	 * @example
	 *   assert.deepStrictEqual(Option.fromNullable(undefined), Option.None())
	 *   assert.deepStrictEqual(Option.fromNullable(null), Option.None())
	 *   assert.deepStrictEqual(Option.fromNullable(1), Option.Some(1))
	 *
	 * @param value - An nullable value
	 */
	public static fromNullable<T>(value: T): None | Some<NonNullable<T>> {
		return value === undefined || value === null ? None.getInstance() : new Some(value)
	}

	/**
	 * Determine if a `Option` is a `None`.
	 *
	 * @param self - The `Option` to check.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from '@std/assert'
	 *
	 * assertStrictEquals(Option.isNone(Option.Some(1)), false)
	 * assertStrictEquals(Option.isNone(Option.None()), true)
	 * ```
	 * @category guards
	 */
	public static isNone<T>(self: None | Some<T>): self is None {
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
	 * import { assertStrictEquals } from '@std/assert'
	 *
	 * assertStrictEquals(Option.isOption(Option.Some(1)), true)
	 * assertStrictEquals(Option.isOption(Option.None()), true)
	 * assertStrictEquals(Option.isOption({}), false)
	 * ```
	 * @category guards
	 */
	public static isOption(input: unknown): input is None | Some<unknown> {
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
	 * import { assertStrictEquals } from '@std/assert'
	 *
	 * assertStrictEquals(Option.isSome(Option.Some(1)), true)
	 * assertStrictEquals(Option.isSome(Option.None()), false)
	 * ```
	 * @category guards
	 */
	public static isSome<T>(self: None | Some<T>): self is Some<T> {
		return self instanceof Some
	}

	/**
	 *  FIXME: exported symbol is missing JSDoc documentation
	 */
	public equals<That>(
		this: Some<A> | None,
		that: That,
		predicateStrategy: (self: A, that: That) => boolean = Object.is,
	): boolean {
		return this.isSome()
			? Option.isOption(that) &&
				Option.isSome(that) &&
				predicateStrategy(this.value, that.value as That)
			: Option.isOption(that) && Option.isNone(that)
	}

	/**
	 * Determine if an `Option` instance is a `None`.
	 * @category guards
	 */
	public isNone(this: None | Some<A>): this is None {
		return Option.isNone(this)
	}

	/**
	 * Determine if an `Option` instance  is a `Some`.
	 * @category guards
	 */
	public isSome(this: None | Some<A>): this is Some<A> {
		return Option.isSome(this)
	}
}

/** Case class representing the absence of a value. */
class None extends Option {
	static #instance: undefined | None = undefined

	public readonly _tag = 'None' as const

	public toJSON() {
		return {
			_id: 'Option',
			_tag: this._tag,
		}
	}

	private constructor() {
		super()
		Object.freeze(this)
	}

	public static getInstance(): None {
		if (!None.#instance) {
			None.#instance = new None()
		}
		return None.#instance
	}
}

/** Case class representing the presence of a value. */
class Some<out A> extends Option {
	public readonly _tag = 'Some' as const

	public toJSON() {
		return {
			_id: 'Option',
			_tag: this._tag,
			value: this.value,
		}
	}

	readonly #value: A

	public constructor(value: A) {
		super()
		this.#value = value
		Object.freeze(this)
	}

	public get value(): A {
		return this.#value
	}
}
