import { assertStrictEquals } from '@std/assert'
import { describe, it } from '@std/testing/bdd'
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

	describe('serialize', () => {
		it('toStringTag', () => {
			assertStrictEquals(
				String(Option.Some(1)),
				JSON.stringify(
					{
						_id: 'Option',
						_tag: 'Some',
						value: 1,
					},
					null,
					2,
				),
			)
			assertStrictEquals(
				String(Option.None()),
				JSON.stringify(
					{
						_id: 'Option',
						_tag: 'None',
					},
					null,
					2,
				),
			)
		})
	})

	it('Equal', () => {
		assertStrictEquals(Option.Some(1).equals(Option.Some(1)), true)
		assertStrictEquals(Option.Some([]).equals(Option.Some([])), false)
		assertStrictEquals(Option.Some([1, 2, 3]).equals(Option.Some([1, 2, 3])), false)
		assertStrictEquals(Option.Some(1).equals(Option.Some(2)), false)
		assertStrictEquals(Option.None().equals(Option.None()), true)
	})
})
