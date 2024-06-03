import { expectTypeOf } from 'npm:expect-type@0.19.0'
import { assertEquals, equal } from 'jsr:@std/assert'
import { expect } from 'jsr:@std/expect'
import { describe, it, test } from 'jsr:@std/testing/bdd'

import { pipe } from '../internal/function.ts'
import type * as F from '../internal/function.ts'
import { Option } from './option.ts'

// deno-lint-ignore no-namespace
namespace Util {
	// biome-ignore lint/suspicious/noExportsInTest: <explanation>
	export const deepStrictEqual = <A>(actual: A, expected: A) => {
		assertEquals(actual, expected)
	}
}

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
			expectTypeOf(Option.fromNullable(2)).toEqualTypeOf<Option.Type<number>>()

			expect(Option.fromNullable(0).equals(Option.Some(0))).toBe(true)
			expectTypeOf(Option.fromNullable(0)).toEqualTypeOf<Option.Type<number>>()

			expect(Option.fromNullable('').equals(Option.Some(''))).toBe(true)
			expectTypeOf(Option.fromNullable('')).toEqualTypeOf<Option.Type<string>>()

			expect(Option.fromNullable([]).equals(Option.Some([]), equal)).toBe(true)
			expectTypeOf(Option.fromNullable([])).toEqualTypeOf<Option.Type<never[]>>()
			expectTypeOf(Option.fromNullable(['foo'])).toEqualTypeOf<Option.Type<string[]>>()

			const nullOption = Option.fromNullable(null)
			expect(nullOption.isNone()).toBe(true)
			expectTypeOf(nullOption).toEqualTypeOf<Option.Type<never>>()

			const undefinedOption = Option.fromNullable(undefined)
			expect(undefinedOption.isNone()).toBe(true)
			expectTypeOf(undefinedOption).toEqualTypeOf<Option.Type<never>>()

			interface Bar {
				readonly baz?: null | number
			}

			expectTypeOf(Option.fromNullable({} as undefined | Bar)).toEqualTypeOf<
				Option.Type<{
					readonly baz?: null | number
				}>
			>()
			expectTypeOf(Option.fromNullable({} as Bar)).toEqualTypeOf<
				Option.Type<{
					readonly baz?: null | number
				}>
			>()
			expectTypeOf(Option.fromNullable(undefined as undefined | string)).toEqualTypeOf<
				Option.Type<string>
			>()
			expectTypeOf(Option.fromNullable(null as null | number)).toEqualTypeOf<
				Option.Type<number>
			>()
		})
	})

	describe('Option type namespace', () => {
		test('Option.Value', () => {
			const someOfNumber = Option.Some(1)
			expectTypeOf<Option.Value<typeof someOfNumber>>().toEqualTypeOf<number>()

			const noneOfUnknown = Option.None()
			const noneOfNumber = Option.None<number>()
			expectTypeOf<Option.Value<typeof noneOfUnknown>>().toEqualTypeOf<unknown>()
			expectTypeOf<Option.Value<typeof noneOfNumber>>().toEqualTypeOf<number>()

			type Foo = { foo: string }
			const someOfRecord = Option.Some({ foo: 'bar' } satisfies Foo)
			expectTypeOf<Option.Value<typeof someOfRecord>>().toEqualTypeOf<Foo>()
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

	describe('fold', () => {
		const fa = (s: string): { length: number } => ({ length: s.length })
		const ifEmpty: F.Lazy<number> = () => 42

		it('returns call the ifEmpty for None cases ', () => {
			const stringOption = Option.fromNullable<null | string>(null)

			// test the instance method
			Util.deepStrictEqual(
				stringOption.fold(ifEmpty, (_) => {
					throw new Error('Called `absurd` function which should be un-callable')
				}),
				42,
			)

			expectTypeOf(
				stringOption.fold(ifEmpty, (_): boolean => {
					throw new Error('Called `absurd` function which should be un-callable')
				}),
			).toEqualTypeOf<number | boolean>()

			// test the static method
			Util.deepStrictEqual(
				pipe(
					null as null | string,
					Option.fromNullable,
					Option.fold(ifEmpty, (_) => {
						throw new Error('Called `absurd` function which should be un-callable')
					}),
				),
				42,
			)

			expectTypeOf(
				pipe(
					stringOption,
					Option.fold(ifEmpty, (_) => {
						throw new Error('Called `absurd` function which should be un-callable')
					}),
				),
			).toEqualTypeOf(42)
		})

		it('should call `f` for the `Some` case', () => {
			const stringOption = Option.fromNullable<null | string>('abc')
			// test the instance method
			Util.deepStrictEqual(stringOption.fold(ifEmpty, fa), { length: 3 })
			expectTypeOf(stringOption.fold(ifEmpty, fa)).toEqualTypeOf<
				number | { length: number }
			>()

			// test the static method
			Util.deepStrictEqual(
				pipe('abc' as null | string, Option.fromNullable, Option.fold(ifEmpty, fa)),
				{ length: 3 },
			)
			expectTypeOf(Option.fold(ifEmpty, fa)(stringOption)).toEqualTypeOf<
				number | { length: number }
			>()
		})
	})

	describe('match', () => {
		const onNone = () => 'none' as const
		const onSome = (s: string): number => s.length
		test('static', () => {
			Util.deepStrictEqual(
				pipe(null as null | string, Option.fromNullable, Option.match({ onNone, onSome })),
				'none',
			)
			Util.deepStrictEqual(pipe('abc', Option.Some, Option.match({ onNone, onSome })), 3)

			expectTypeOf(Option.match({ onNone, onSome })(Option.fromNullable(null))).toEqualTypeOf<
				number | 'none'
			>()
		})
		test('instance', () => {
			Util.deepStrictEqual(Option.None<string>().match({ onNone, onSome }), 'none')
			Util.deepStrictEqual(Option.Some('abc').match({ onNone, onSome }), 3)
			expectTypeOf(Option.fromNullable(null).match({ onNone, onSome })).toEqualTypeOf<
				number | 'none'
			>()
		})
	})

	describe('guards', () => {
		test('isOption', () => {
			expect(pipe(Option.Some(1), Option.isOption)).toBe(true)
			expect(pipe(Option.None(), Option.isOption)).toBe(true)
			expect(pipe({}, Option.isOption)).toBe(false)
		})

		describe('isNone', () => {
			test('on Option static method ', () => {
				expect(pipe(Option.None(), Option.isNone)).toBe(true)
				expect(pipe(Option.Some(1), Option.isNone)).toBe(false)
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
				expect(pipe(Option.None(), Option.isSome)).toBe(false)
				expect(pipe(Option.Some(1), Option.isSome)).toEqual(true)
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
