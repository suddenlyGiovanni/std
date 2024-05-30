import { equal } from 'jsr:@std/assert'
import { expect } from 'jsr:@std/expect'
import { describe, test } from 'jsr:@std/testing/bdd'
import { Option } from './option.ts'

describe('Option', () => {
	describe('constructors', () => {
		test('should throw an error when trying to construct Option directly  ', () => {
			expect(() => {
				// @ts-expect-error - TSC does not allow instantiation of abstract classes, but what about runtime?
				new Option()
			}).toThrow('Option is not meant to be instantiated directly')
		})

		test('Some', () => {
			const some = Option.Some(1)
			expect(some._tag).toBe('Some')
			expect(some.get()).toBe(1)
		})

		describe('None', () => {
			test('constructor', () => {
				const none = Option.None()
				expect(none._tag).toBe('None')
			})

			test('None is a singleton ', () => {
				const none = Option.None()
				expect(Option.None()).toStrictEqual(none)
				expect(Object.is(Option.None(), Option.None())).toBe(true)
			})
		})

		test('fromNullable', () => {
			expect(Option.fromNullable(2).equals(Option.Some(2))).toBe(true)
			expect(Option.fromNullable(0).equals(Option.Some(0))).toBe(true)
			expect(Option.fromNullable('').equals(Option.Some(''))).toBe(true)
			expect(Option.fromNullable([]).equals(Option.Some([]), equal)).toBe(true)

			expect(Option.isNone(Option.fromNullable(null))).toBe(true)
			expect(Option.fromNullable(undefined).isNone()).toBe(true)
		})
	})

	describe('get', () => {
		test('Some', () => {
			expect(Option.Some(1).get()).toBe(1)
			expect(Option.Some({ foo: 'bar' }).get()).toEqual({ foo: 'bar' })
		})

		test('None', () => {
			expect(() => Option.None().get()).toThrow('None.get')
		})
	})

	describe('guards', () => {
		test('isOption', () => {
			expect(Option.isOption(Option.Some(1))).toBe(true)
			expect(Option.isOption(Option.None())).toBe(true)
			expect(Option.isOption({})).toBe(false)
		})

		describe('isNone', () => {
			test('on Option static method ', () => {
				expect(Option.isNone(Option.None())).toBe(true)
				expect(Option.isNone(Option.Some(1))).toBe(false)
			})

			test('on Option instances: Some and None ', () => {
				expect(Option.fromNullable(42).isNone()).toBe(false)
				expect(Option.fromNullable(undefined).isNone()).toBe(true)
			})
		})

		test('isEmpty', () => {
			expect(Option.None().isEmpty()).toBe(true)
			expect(Option.Some('foo').isEmpty()).toBe(false)
		})

		describe('isSome', () => {
			test('on Option static method ', () => {
				expect(Option.isSome(Option.None())).toBe(false)
				expect(Option.isSome(Option.Some(1))).toEqual(true)
			})

			test('on Option instances: Some and None ', () => {
				expect(Option.fromNullable(null).isSome()).toBe(false)
				expect(Option.fromNullable(0).isSome()).toBe(true)
			})
		})
	})

	describe('serialize', () => {
		test('toStringTag', () => {
			expect(String(Option.Some(1))).toBe(
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
			expect(String(Option.None())).toBe(
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
		test('None ', () => {
			expect(Option.None().equals(Option.None())).toBe(true)
			expect(Option.None().equals(Option.Some('a'))).toBe(false)
		})

		test('Some', () => {
			expect(Option.Some('a').equals(Option.None())).toBe(false)
			expect(Option.Some(1).equals(Option.Some(2))).toBe(false)
			expect(Option.Some(1).equals(Option.Some(1))).toBe(true)

			expect(Option.Some([]).equals(Option.Some([]))).toBe(false)
			expect(Option.Some([]).equals(Option.Some([]))).toBe(false)

			const arr = [1, 2, 3]
			expect(Option.Some(arr).equals(Option.Some(arr))).toBe(true)
			expect(Option.Some(arr).equals(Option.Some([1, 2, 3]))).toBe(false)
		})

		test('should use the custom comparison predicate strategy', () => {
			expect(Option.Some([]).equals(Option.Some([]), equal)).toBe(true)
			expect(Option.Some([1, 2, 3]).equals(Option.Some([1, 2, 3]), equal)).toBe(true)
			expect(
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
			).toBe(true)
		})
	})

	describe('Inspectable', () => {
		const some = Option.Some(1)
		const none = Option.None()

		test('toStringTag', () => {
			expect(some[Symbol.toStringTag]).toBe('Option.Some')
			expect(none[Symbol.toStringTag]).toBe('Option.None')
		})

		test('toJSON', () => {
			expect(some.toJSON()).toEqual({
				_id: 'Option',
				_tag: 'Some',
				value: 1,
			})

			expect(none.toJSON()).toEqual({
				_id: 'Option',
				_tag: 'None',
			})
		})

		test('toString', () => {
			expect(some.toString()).toBe(JSON.stringify(some.toJSON(), null, 2))
			expect(none.toString()).toBe(JSON.stringify(none.toJSON(), null, 2))
		})
	})
})
