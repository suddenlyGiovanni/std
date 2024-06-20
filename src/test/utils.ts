import { assertEquals, assertStrictEquals, equal } from 'jsr:@std/assert'
import type { Option } from '../option/option.ts'

/**
 * Utility class with helper methods for various test assertions.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Util {
	/**
	 * Asserts that the actual value is equal to the expected value as well as their types.
	 */
	public static readonly deepStrictEqual = <A>(actual: A, expected: A) => {
		assertEquals(actual, expected)
	}

	/**
	 * Compares two Option.Type instances for equality and asserts that they are equal.
	 */
	public static readonly optionEqual = <A>(actual: Option.Type<A>, expected: Option.Type<A>) => {
		assertStrictEquals(actual.equals(expected, equal), true)
	}
}
