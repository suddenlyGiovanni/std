import { describe, it } from '@std/testing/bdd'
import { assertStrictEquals } from '@std/assert'
import { Option } from './option.ts'

describe('Option', () => {
	describe('constructors', () => {
		it('Some', () => {
			const some = Option.Some(1)
			assertStrictEquals(some._tag, 'Some')
			assertStrictEquals(some.value, 1)
		})

		it('None', () => {
			const none = Option.None()
			assertStrictEquals(none._tag, 'None')
		})
	})

	describe('guards', () => {
		it('isOption', () => {
			assertStrictEquals(Option.isOption(Option.Some(1)), true)
			assertStrictEquals(Option.isOption(Option.None()), true)
			assertStrictEquals(Option.isOption({}), false)
		})

		it('isNone', () => {
			assertStrictEquals(Option.isNone(Option.None()), true)
			assertStrictEquals(Option.isNone(Option.Some(1)), false)
		})

		it('isSome', () => {
			assertStrictEquals(Option.isSome(Option.None()), false)
			assertStrictEquals(Option.isSome(Option.Some(1)), true)
		})
	})
})
