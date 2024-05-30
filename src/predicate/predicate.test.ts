// deno-lint-ignore-file no-explicit-any
import { expectTypeOf } from 'npm:expect-type@0.19.0'
import { assertEquals, assertStrictEquals } from 'jsr:@std/assert'
import { describe, it, test } from 'jsr:@std/testing'

import { isFunction, isObject, isRecordOrArray } from './predicate.ts'

describe('isRecordOrArray', () => {
	it('should return true when input is an object', () => {
		const result = isRecordOrArray({ key: 'value' })
		assertEquals(result, true)
	})

	it('should return true when input is an array', () => {
		const result = isRecordOrArray([1, 2, 3])
		assertEquals(result, true)
	})

	it('should return false when input is null', () => {
		const result = isRecordOrArray(null)
		assertEquals(result, false)
	})

	it('should return false when input is a primitive data type', () => {
		const result = isRecordOrArray('string')
		assertEquals(result, false)
	})
})

describe('isFunction', () => {
	it('should return true when input is a function', () => {
		const result = isFunction(isFunction)
		assertEquals(result, true)
	})

	it('should return false when input is not a function', () => {
		assertEquals(isFunction({ key: 'value' }), false)
		assertEquals(isFunction([1, 'string']), false)
		assertEquals(isFunction(1), false)
		assertEquals(isFunction('function'), false)
	})
})

describe('isObject', () => {
	it('should return true when input is an object', () => {
		assertStrictEquals(isObject({}), true)
		assertStrictEquals(isObject([]), true)
		assertStrictEquals(
			isObject(() => 1),
			true,
		)
	})

	it('should return false when input is not an object', () => {
		assertStrictEquals(isObject(null), false)
		assertStrictEquals(isObject(undefined), false)
		assertStrictEquals(isObject('a'), false)
		assertStrictEquals(isObject(1), false)
		assertStrictEquals(isObject(true), false)
		assertStrictEquals(isObject(1n), false)
		assertStrictEquals(isObject(Symbol.for('a')), false)
	})

	test('type', () => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		expectTypeOf(new Array<any>().filter(isObject)).toEqualTypeOf<object[]>()
	})
})
