import type { Inspectable } from '../internal/inspectable.ts'

function format(x: unknown): string {
	return JSON.stringify(x, null, 2)
}

/**
 * FIXME: exported symbol is missing JSDoc documentation
 */
export abstract class Option<A> implements Inspectable {
	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	get [Symbol.toStringTag](): string {
		return `${this.constructor.name}.${this._tag}`
	}

	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	toString(): string {
		return format(this.toJSON())
	}

	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	toJSON() {
		switch (this._tag) {
			case 'Some':
				return {
					_id: 'Option',
					_tag: this._tag,
					value: this.value,
				}
			case 'None':
				return {
					_id: 'Option',
					_tag: this._tag,
				}
		}
	}

	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	abstract readonly _tag: 'None' | 'Some'

	/**
	 * FIXME: exported symbol is missing JSDoc documentation
	 */
	abstract readonly value?: A

	/**
	 * Creates a new `Option` that represents the absence of a value.
	 *
	 * @category constructors
	 */
	static None<T = never>(): None<T> | Some<T> {
		return new None()
	}

	/**
	 * Creates a new `Option` that wraps the given value.
	 *
	 * @param value - The value to wrap.
	 *
	 * @category constructors
	 */
	static Some<T>(value: T): None<T> | Some<T> {
		return new Some(value)
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
	static isSome<T>(self: Option<T>): self is Some<T> {
		return self instanceof Some || self._tag === 'Some'
	}
}

class None<out A> extends Option<A> {
	readonly _tag = 'None' as const
	value?: never
}

class Some<out A> extends Option<A> {
	readonly _tag = 'Some' as const
	readonly #value: A

	constructor(value: A) {
		super()
		this.#value = value
	}

	get value(): A {
		return this.#value
	}
}
