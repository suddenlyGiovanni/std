export abstract class Option<A> {
	abstract readonly _tag: 'None' | 'Some'
	abstract readonly value?: A

	/**
	 * Creates a new `Option` that represents the absence of a value.
	 *
	 * @category constructors
	 */
	static None<T = never>(): Option<T> {
		return new None()
	}

	/**
	 * Creates a new `Option` that wraps the given value.
	 *
	 * @param value - The value to wrap.
	 *
	 * @category constructors
	 */
	static Some<T>(value: T): Option<T> {
		return new Some(value)
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
	static isOption(input: unknown): input is Option<unknown> {
		return input instanceof None || input instanceof Some
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
	static isNone<T>(self: Option<T>): self is None<T> {
		return self instanceof None || self._tag === 'None'
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
	 *```
	 * @category guards
	 */
	static isSome<T>(self: Option<T>): self is Some<T> {
		return self instanceof Some || self._tag === 'Some'
	}
}

class None<out A> implements Option<A> {
	readonly _tag = 'None' as const
}

class Some<out A> implements Option<A> {
	readonly #value: A
	readonly _tag = 'Some' as const

	get value(): A {
		return this.#value
	}

	constructor(value: A) {
		this.#value = value
	}
}
