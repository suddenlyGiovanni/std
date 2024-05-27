import type { Equals } from '../internal/equals.ts'
import type { Inspectable } from '../internal/inspectable.ts'

function format(x: unknown): string {
	return JSON.stringify(x, null, 2)
}

/**
 * Represents optional values. Instances of `Option` are either an instance of {@linkcode Some} or the  {@linkcode None},  where  Some holds a value, and None is empty.
 *
 * The most idiomatic way to use an Option instance is to treat it as  monad and use `map`,`flatMap`,` filter`, or `foreach`.
 * A less-idiomatic way to use Option values is via pattern matching method `match`:
 */
export abstract class Option<out A> implements Inspectable, Equals {
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
	public static None<T = never>(): None<T> | Some<T> {
		return None.getInstance()
	}

	/**
	 * Creates a new `Option` that wraps the given value.
	 *
	 * @param value - The value to wrap.
	 *
	 * @category constructors
	 */
	public static Some<T>(value: T): None<T> | Some<T> {
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
	public static fromNullable<T>(value: undefined | null | T): None<T> | Some<NonNullable<T>> {
		return value === undefined || value === null ? None.getInstance() : new Some(value)
	}

	/**
	 * Determine if a `Option` is a `None`.
	 *
	 * @param self - The `Option` to check.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  '@suddenly-giovanni/std/option'
	 * import { assertStrictEquals } from '@std/assert'
	 *
	 * assertStrictEquals(Option.isNone(Option.Some(1)), false)
	 * assertStrictEquals(Option.isNone(Option.None()), true)
	 * ```
	 * @category guards
	 */
	public static isNone<T>(self: Option<T>): self is None<T> {
		return self instanceof None || self._tag === 'None'
	}

	/**
	 * Tests if a value is a `Option`.
	 *
	 * @param input - The value to check.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  '@suddenly-giovanni/std/option'
	 * import { assertStrictEquals } from '@std/assert'
	 *
	 * assertStrictEquals(Option.isOption(Option.Some(1)), true)
	 * assertStrictEquals(Option.isOption(Option.None()), true)
	 * assertStrictEquals(Option.isOption({}), false)
	 * ```
	 * @category guards
	 */
	public static isOption(input: unknown): input is Option<unknown> {
		return input instanceof None || input instanceof Some
	}

	/**
	 * Determine if a `Option` is a `Some`.
	 *
	 * @param self - The `Option` to check.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  '@suddenly-giovanni/std/option'
	 * import { assertStrictEquals } from '@std/assert'
	 *
	 * assertStrictEquals(Option.isSome(Option.Some(1)), true)
	 * assertStrictEquals(Option.isSome(Option.None()), false)
	 * ```
	 * @category guards
	 */
	public static isSome<T>(self: Option<T>): self is Some<T> {
		return self instanceof Some || self._tag === 'Some'
	}

	/**
	 *  FIXME: exported symbol is missing JSDoc documentation
	 */
	public equals<That>(
		this: Some<A> | None<A>,
		that: That,
		predicateStrategy: (self: A, that: That) => boolean = Object.is,
	): boolean {
		switch (this._tag) {
			case 'Some':
				return (
					Option.isOption(that) &&
					Option.isSome(that) &&
					predicateStrategy(this.value, that.value as That)
				)
			case 'None':
				return Option.isOption(that) && Option.isNone(that)
		}
	}
}

/** Case class representing the absence of a value. */
export class None<A> extends Option<A> {
	static #instance: undefined | None<unknown> = undefined

	public readonly _tag = 'None' as const

	private constructor() {
		super()
		Object.freeze(this)
	}

	public toJSON() {
		return {
			_id: 'Option',
			_tag: this._tag,
		}
	}

	public static getInstance<A>(): None<A> {
		if (!None.#instance) {
			None.#instance = new None()
		}
		return None.#instance as None<A>
	}
}

/** Case class representing the presence of a value. */
export class Some<out A> extends Option<A> {
	public readonly _tag = 'Some' as const
	readonly #value: A

	public get value(): A {
		return this.#value
	}

	public constructor(value: A) {
		super()
		this.#value = value
		Object.freeze(this)
	}

	public toJSON() {
		return {
			_id: 'Option',
			_tag: this._tag,
			value: this.value,
		}
	}
}
