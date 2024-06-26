/**
 * Check if the input is a record or an array.
 *
 * @param input - The input value to check.
 * @return - True if the input is a record or an array, false otherwise.
 * @internal
 */
export function isRecordOrArray(input: unknown): boolean {
	return typeof input === 'object' && input !== null
}

/**
 * Tests if a value is a `function`.
 *
 * @param input - The value to test.
 *
 * @example
 * ```ts
 * import { assertEquals } from 'jsr:@std/assert'
 * import { isFunction } from './predicate.ts'
 *
 * assertEquals(isFunction(isFunction), true)
 * assertEquals(isFunction('function'), false)
 * ```
 * @category guards
 */
// deno-lint-ignore ban-types
export function isFunction(input: unknown): input is Function {
	return typeof input === 'function'
}

/**
 * Tests if a value is an `object`.
 *
 * @param input - The value to test.
 *
 * @example
 * ```ts
 * import { assertEquals } from 'jsr:@std/assert'
 * import { isObject } from './predicate.ts'
 *
 * assertEquals(isObject({}), true)
 * assertEquals(isObject([]), true)
 *
 * assertEquals(isObject(null), false)
 * assertEquals(isObject(undefined), false)
 * ```
 * @category guards
 */
export function isObject(input: unknown): input is object {
	return isRecordOrArray(input) || isFunction(input)
}
