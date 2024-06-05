import { assertEquals, assertStrictEquals } from 'jsr:@std/assert'
import type { Option } from '../option/option.ts'

// deno-lint-ignore no-namespace
export namespace Util {
	export const deepStrictEqual = <A>(actual: A, expected: A) => {
		assertEquals(actual, expected)
	}

	export const optionEqual = <A>(actual: Option.Type<A>, expected: Option.Type<A>) => {
		assertStrictEquals(actual.equals(expected), true)
	}
}
