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
		return (input instanceof None || input instanceof Some)
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
