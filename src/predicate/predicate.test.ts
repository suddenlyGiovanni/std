import { describe, it } from '@std/testing/bdd.ts'
import { assertEquals } from '@std/assert'

import { isRecordOrArray } from './predicate.ts'

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
