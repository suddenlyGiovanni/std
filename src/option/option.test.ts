import { assertStrictEquals, assertThrows, equal } from '@std/assert'
import { describe, it, test } from '@std/testing/bdd'
import { Option } from './option.ts'

describe('Option', () => {
	describe('constructors', () => {
		it('Option should not be directly constructed ', () => {
			assertThrows(() => {
				// @ts-expect-error - TSC does not allow instantiation of abstract classes, but what about runtime?
				new Option()
			})
		})

		it('Some', () => {
			const some = Option.Some(1)
			assertStrictEquals(some._tag, 'Some')
			assertStrictEquals(some.value, 1)
		})

		it('None', () => {
			const none = Option.None()
			assertStrictEquals(none._tag, 'None')
		})

		it('fromNullable', () => {
			assertStrictEquals(Option.fromNullable(2).equals(Option.Some(2)), true)
			assertStrictEquals(Option.fromNullable(0).equals(Option.Some(0)), true)
			assertStrictEquals(Option.fromNullable('').equals(Option.Some('')), true)
			assertStrictEquals(Option.fromNullable([]).equals(Option.Some([]), equal), true)

			assertStrictEquals(Option.isNone(Option.fromNullable(null)), true)
			assertStrictEquals(Option.fromNullable(undefined)._tag, 'None')
		})
	})

	describe('guards', () => {
		it('isOption', () => {
			assertStrictEquals(Option.isOption(Option.Some(1)), true)
			assertStrictEquals(Option.isOption(Option.None()), true)
			assertStrictEquals(Option.isOption({}), false)
		})

		describe('isNone', () => {
			test('on Option static method ', () => {
				assertStrictEquals(Option.isNone(Option.None()), true)
				assertStrictEquals(Option.isNone(Option.Some(1)), false)
			})

			test('on Option instances: Some and None ', () => {
				assertStrictEquals(Option.None().isNone(), true)
				assertStrictEquals(Option.Some('foo').isNone(), false)
			})
		})

		describe('isSome', () => {
			test('on Option static method ', () => {
				assertStrictEquals(Option.isSome(Option.None()), false)
				assertStrictEquals(Option.isSome(Option.Some(1)), true)
			})

			test('on Option instances: Some and None ', () => {
				assertStrictEquals(Option.fromNullable(0).isSome(), true)
				assertStrictEquals(Option.None().isSome(), false)
			})
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

	describe('Equal', () => {
		it('None ', () => {
			assertStrictEquals(Option.None().equals(Option.None()), true)
			assertStrictEquals(Option.None().equals(Option.Some('a')), false)
		})

		it('Some', () => {
			assertStrictEquals(Option.Some('a').equals(Option.None()), false)
			assertStrictEquals(Option.Some(1).equals(Option.Some(2)), false)
			assertStrictEquals(Option.Some(1).equals(Option.Some(1)), true)

			assertStrictEquals(Option.Some([]).equals(Option.Some([])), false)
			assertStrictEquals(Option.Some([]).equals(Option.Some([])), false)

			const arr = [1, 2, 3]
			assertStrictEquals(Option.Some(arr).equals(Option.Some(arr)), true)
			assertStrictEquals(Option.Some(arr).equals(Option.Some([1, 2, 3])), false)
		})

		it('should use the custom comparison predicate strategy', () => {
			assertStrictEquals(Option.Some([]).equals(Option.Some([]), equal), true)
			assertStrictEquals(Option.Some([1, 2, 3]).equals(Option.Some([1, 2, 3]), equal), true)
			assertStrictEquals(
				Option.Some({
					foo: {
						bar: {
							baz: 1,
						},
					},
				}).equals(
					Option.Some({
						foo: {
							bar: {
								baz: 1,
							},
						},
					}),
					equal,
				),
				true,
			)
		})
	})
})
