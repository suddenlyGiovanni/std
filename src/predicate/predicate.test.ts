import { describe, it } from '@std/testing/bdd'
import { assertEquals } from '@std/assert'

import { isFunction, isRecordOrArray } from './predicate.ts'

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
