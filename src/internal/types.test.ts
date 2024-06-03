import { expectTypeOf } from 'npm:expect-type@0.19.0'
import { describe, test } from 'jsr:@std/testing/bdd'
import type { Types } from './types.ts'

describe('Types', () => {
	test('Tag', () => {
		expectTypeOf<Types.Tags<string | { _tag: 'a' } | { _tag: 'b' }> & unknown>().toEqualTypeOf<
			'a' | 'b'
		>()
	})

	test('Equal', () => {
		expectTypeOf<Types.Equals<{ a: number }, { a: number }>>().toEqualTypeOf<true>()
		expectTypeOf<Types.Equals<{ a: number }, { b: number }>>().toEqualTypeOf<false>()
	})

	test('Simplify', () => {
		expectTypeOf<Types.Simplify<object & { a: number } & { b: number }>>().toEqualTypeOf<{
			a: number
			b: number
		}>()
	})
})
