import { expectTypeOf } from 'npm:expect-type@0.19.0'
import { equal } from 'jsr:@std/assert'
import { expect } from 'jsr:@std/expect'
import { describe, it, test } from 'jsr:@std/testing/bdd'

import { type Lazy, pipe } from '../internal/function.ts'
import { Util } from '../test/utils.ts'
import { InvariantLaws } from '../typeclass/Invariant-laws.test.ts'
import { CovariantLaws } from '../typeclass/covariant-laws.test.ts'
import type { Covariant } from '../typeclass/covariant.ts'
import type { Invariant } from '../typeclass/invariant.ts'
import { SemiProductLaws } from '../typeclass/semi-product-laws.test.ts'
import type { SemiProduct } from '../typeclass/semi-product.ts'
import { Option } from './option.ts'

describe('Option', () => {
	describe('constructors', () => {
		test('should throw an error when trying to construct Option directly  ', () => {
			expect(() => {
				// @ts-expect-error - TSC does not allow instantiation of abstract classes, but what about runtime?
				new Option()
			}).toThrow('Option is not meant to be instantiated directly')
		})

		test('of', () => {
			const some = Option.of(1)
			expectTypeOf(some).toEqualTypeOf<Option.Type<number>>()
			expect(some._tag).toBe('Some')
			expect(some.get()).toBe(1)

			expectTypeOf(Option.of(null)).toEqualTypeOf<Option.Type<null>>() // should we allow this?
			expectTypeOf(Option.of(undefined)).toEqualTypeOf<Option.Type<undefined>>() // should we allow this? maybe of should not lift nullable values?
		})

		test('Some', () => {
			const some = Option.Some(1)
			expect(some._tag).toBe('Some')
			expect(some.get()).toBe(1)

			// @ts-expect-error - should not allow null or undefined
			expectTypeOf(Option.Some(null)).not.toEqualTypeOf<Option.Type<null>>()

			// @ts-expect-error - should not allow null or undefined
			expectTypeOf(Option.Some(undefined)).not.toEqualTypeOf<Option.Type<undefined>>()
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
			expect(Option.fromNullable<null | number>(2).equals(Option.Some(2))).toBe(true)
			expectTypeOf(Option.fromNullable<null | number>(2)).toEqualTypeOf<Option.Type<number>>()

			expect(Option.fromNullable(0).equals(Option.Some(0))).toBe(true)
			expectTypeOf(Option.fromNullable(0)).toEqualTypeOf<Option.Type<number>>()

			expect(Option.fromNullable('').equals(Option.Some(''))).toBe(true)
			expectTypeOf(Option.fromNullable<string | undefined>('')).toEqualTypeOf<
				Option.Type<string>
			>()

			expect(Option.fromNullable([]).equals(Option.Some([]), equal)).toBe(true)
			expectTypeOf(Option.fromNullable<undefined | number[]>([])).toEqualTypeOf<
				Option.Type<number[]>
			>()
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
			expectTypeOf<Option.Value<typeof noneOfUnknown>>().toEqualTypeOf<never>()
			expectTypeOf<Option.Value<typeof noneOfNumber>>().toEqualTypeOf<number>()

			type Foo = { foo: string }
			const someOfRecord = Option.Some({ foo: 'bar' } satisfies Foo)
			expectTypeOf<Option.Value<typeof someOfRecord>>().toEqualTypeOf<Foo>()
		})
	})

	describe('Invariant', () => {
		describe('imap', () => {
			type A = string
			const a: A = '3'
			const someA = Option.of<A>(a)

			type B = number
			const b: B = 3
			const someB = Option.of<B>(b)

			const none = Option.None()

			const f: (a: A) => B = (string) => Number.parseInt(string)
			const g: (b: B) => A = (number) => number.toString()

			test('static', () => {
				Util.optionEqual(pipe(someA, Option.imap(f, g)), someB)
				Util.optionEqual(pipe(none, Option.imap(f, g)), none)
			})

			test('instance', () => {
				Util.optionEqual(someA.imap(f, g), someB)
				Util.optionEqual(none.imap(f, g), none)
			})
		})

		describe('Laws', () => {
			const OptionInvariant: Invariant.Pipeable<Option.TypeLambda> = Option
			const optionInvariantLaws = new InvariantLaws(OptionInvariant)

			test('identity', () => {
				optionInvariantLaws.assertIdentity(Option.of(42))
				optionInvariantLaws.assertIdentity(Option.None())
			})

			test('Composition', () => {
				const f1 = (a: number): string => String(a)
				const f2 = (b: string): number => Number(b)
				const g1 = (b: string): boolean => Boolean(b)
				const g2 = (c: boolean): string => (c ? '1' : '0')

				optionInvariantLaws.assertComposition(Option.of<0 | 1>(1), f1, f2, g1, g2)
				optionInvariantLaws.assertComposition(Option.None<0 | 1>(), f1, f2, g1, g2)
			})
		})
	})

	describe('Covariant extends Invariant', () => {
		describe('map', () => {
			const f: (n: number) => number = (n) => n * 2
			const g: (n: number) => string = (n) => n.toString()
			const someNumber = Option.of(1)
			const noneNumber = Option.None<number>()

			test('static', () => {
				Util.optionEqual(pipe(someNumber, Option.map(f)), Option.of(2))
				expectTypeOf(Option.map(f)(someNumber)).toEqualTypeOf<Option.Type<number>>()

				Util.optionEqual(pipe(Option.Some(42), Option.map(g)), Option.Some('42'))
				expectTypeOf(Option.map(g)(Option.Some(1))).toEqualTypeOf<Option.Type<string>>()

				Util.optionEqual(pipe(noneNumber, Option.map(f)), noneNumber)
				Util.optionEqual(pipe(noneNumber, Option.map(g)), Option.None<string>())
			})

			test('instance', () => {
				Util.optionEqual(someNumber.map(f), Option.of(2))
				Util.optionEqual(Option.Some(42).map(g), Option.Some('42'))
				Util.optionEqual(noneNumber.map(f), noneNumber)
				Util.optionEqual(noneNumber.map(g), Option.None<string>())
			})
		})

		describe('imap', () => {
			const f: (n: number) => string = (n) => n.toString()
			const g: (s: string) => number = (s) => Number(s)
			const someNumber = Option.of(1)
			const noneNumber = Option.None<number>()

			test('static', () => {
				Util.optionEqual(pipe(someNumber, Option.imap(f, g)), Option.of('1'))
				Util.optionEqual(pipe(noneNumber, Option.imap(f, g)), Option.None<string>())
			})

			test('instance', () => {
				Util.optionEqual(someNumber.imap(f, g), Option.of('1'))
				Util.optionEqual(noneNumber.imap(f, g), Option.None<string>())
			})
		})

		describe('laws', () => {
			const CovariantOption: Covariant.Pipeable<Option.TypeLambda> = Option
			const optionCovariantLaws = new CovariantLaws(CovariantOption)
			test('identity', () => {
				optionCovariantLaws.assertIdentity(Option.of(6 * 7))
				optionCovariantLaws.assertIdentity(Option.of(['hello', 'world']))
				optionCovariantLaws.assertIdentity(Option.of({ foo: 'bar' }))
				optionCovariantLaws.assertIdentity(Option.None())
			})

			test('composition', () => {
				const f = (a: number): string => String(a)
				const g = (b: string): number => Number(b)

				optionCovariantLaws.assertComposition(Option.of(6 * 7), f, g)
				optionCovariantLaws.assertComposition(Option.None(), f, g)
			})
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

	describe('getOrElse', () => {
		test('Some', () => {
			expect(Option.Some(1).getOrElse(() => 2)).toBe(1)
			expect(Option.Some({ foo: 'bar' }).getOrElse(() => ({ foo: 'baz' }))).toEqual({
				foo: 'bar',
			})

			expectTypeOf(Option.Some({ foo: 'bar' }).getOrElse(() => ({ foo: 'baz' })))
				.toEqualTypeOf<{
					foo: string
				}>()

			expectTypeOf(
				Option.Some({ foo: 'bar' }).getOrElse(() => ({ foo: 'baz' })),
			).not.toEqualTypeOf<{ foo: number }>() // it should extend the type Option instance type
		})

		test('None', () => {
			expect(Option.None<number>().getOrElse(() => 2)).toBe(2)
			expect(
				Option.fromNullable<undefined | { foo: string }>(undefined).getOrElse(() => ({
					foo: 'baz',
				})),
			).toEqual({
				foo: 'baz',
			})
			expect(Option.None<null | unknown>().getOrElse(() => null)).toEqual(null)
		})
	})

	describe('Foldable', () => {
		const f = (number: number, string: string): number => string.length + number

		it('static ', () => {
			expect(pipe(Option.of('foo'), Option.reduce(0, f))).toBe(3)
			expect(pipe(Option.None(), Option.reduce(0, f))).toBe(0)
		})

		it('instance', () => {
			expect(Option.of('FooBarBaz').reduce(0, f)).toBe(9)
			expect(Option.None().reduce(0, f)).toBe(0)
		})
	})

	describe('Semiproduct', () => {
		describe('product', () => {
			const a: number = 42
			const someA: Option.Type<number> = Option.Some(a)

			const b: string = 'meaning of life'
			const someB: Option.Type<string> = Option.Some(b)

			const none: Option.Type<never> = Option.None()

			test('static', () => {
				Util.optionEqual(Option.product(someA, someB), Option.of([a, b]))
				Util.optionEqual(Option.product(someB, none), none)
				Util.optionEqual(Option.product(none, someB), none)
				Util.optionEqual(Option.product(none, none), none)
			})

			test('instance', () => {
				Util.optionEqual(someA.product(someB), Option.of([a, b]))
				Util.optionEqual(someB.product(none), none)
				Util.optionEqual(none.product(someB), none)
				Util.optionEqual(none.product(none), none)
			})
		})

		describe('productMany', () => {
			const a: number = 1
			const someA: Option.Type<number> = Option.Some(a)

			const b: number = 2
			const someB: Option.Type<number> = Option.Some(b)

			const c: number = 3
			const someC: Option.Type<number> = Option.Some(c)

			const none: Option.Type<unknown> = Option.None()

			test('static', () => {
				// productMany with all Some
				Util.optionEqual(Option.productMany(someA, [someB, someC]), Option.Some([a, b, c]))

				Util.optionEqual(
					Option.productMany(someA, new Set([someB, someC])),
					Option.Some([a, b, c]),
				)

				// productMany with one None
				Util.optionEqual(Option.productMany(someA, [none, someC]), none)
				// productMany with empty collection
				Util.optionEqual(Option.productMany(someA, []), Option.Some([a]))

				// productMany with self None
				Util.optionEqual(Option.productMany(none, [someB, someC]), none)

				// productMany with different types
				// @ts-expect-error Option.Type<string> is not assignable to type Option.Type<number>
				Option.productMany(Option.Some('a'), [someB, someC])
			})

			test('instance', () => {
				// productMany with all Some
				Util.optionEqual(someA.productMany([someB, someC]), Option.Some([a, b, c]))

				Util.optionEqual(someA.productMany(new Set([someB, someC])), Option.Some([a, b, c]))

				// productMany with one None
				Util.optionEqual(someA.productMany([none, someC]), none)
				// productMany with empty collection
				Util.optionEqual(someA.productMany([]), Option.Some([a]))

				// productMany with self None
				Util.optionEqual(none.productMany([someB, someC]), none)

				// productMany with different types
				// @ts-expect-error Option.Type<string> is not assignable to type Option.Type<number>
				Option.Some('a').productMany([someB, someC])
			})
		})

		describe('laws', () => {
			test('Associativity', () => {
				// arrange
				const semiProductOption: SemiProduct.Pipeable<Option.TypeLambda> = Option
				const semiProductLawsOption = new SemiProductLaws(semiProductOption)

				// act & assert
				semiProductLawsOption.assertAssociativity(
					Option.of(1),
					Option.of('1'),
					Option.of(true),
				)
			})
		})
	})

	describe('Product', () => {
		test('Some', () => {
			Util.optionEqual(
				Option.productAll([Option.Some(1), Option.Some(2), Option.Some(3)]),
				Option.Some([1, 2, 3]),
			)
		})

		test('None', () => {
			Util.optionEqual(
				Option.productAll([Option.Some(1), Option.None(), Option.Some(3)]),
				Option.None(),
			)
		})
	})

	describe('Monad', () => {
		test('of', () => {
			expect(Option.isOption(Option.of(1))).toBe(true)
		})

		test('flatMap', () => {
			Util.optionEqual(Option.of(Option.of(0)).flatten(), Option.of(0))
		})

		describe('laws', () => {
			test('Left identity', () => {
				type A = number
				type B = string
				const a: A = 1
				const f = (a: A): Option.Type<B> => Option.of(a.toString())

				Util.optionEqual(Option.of(a).flatMap(f), f(a))
			})

			test('Right identity', () => {
				const Fa = Option.Some(1)
				Util.optionEqual(Fa.flatMap(Option.of), Fa)
			})
			test('Associativity', () => {
				type A = number
				type B = string
				type C = boolean

				const Fa = Option.of(1)
				const f = (a: A): Option.Type<B> => Option.of(a.toString())
				const g = (b: B): Option.Type<C> => Option.of(Boolean(b))

				Util.optionEqual(
					Fa.flatMap(f).flatMap(g),
					Fa.flatMap((a) => f(a).flatMap(g)),
				)
			})
		})
	})

	describe('fold', () => {
		const fa = (s: string): { length: number } => ({ length: s.length })
		const ifEmpty: Lazy<number> = () => 42

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

	describe('FlatMap', () => {
		describe('flatMap', () => {
			const f = (n: number) => Option.Some(n * 2)
			const g = () => Option.None<string>()

			test('static', () => {
				Util.optionEqual(pipe(Option.Some(1), Option.flatMap(f)), Option.Some(2))
				Util.optionEqual(pipe(Option.None(), Option.flatMap(f)), Option.None())
				Util.optionEqual(pipe(Option.Some(1), Option.flatMap(g)), Option.None())
				Util.optionEqual(pipe(Option.None(), Option.flatMap(g)), Option.None())
			})

			test('instance', () => {
				Util.optionEqual(Option.Some(1).flatMap(f), Option.Some(2))
				Util.optionEqual(Option.None().flatMap(f), Option.None())
				Util.optionEqual(Option.Some(1).flatMap(g), Option.None())
				Util.optionEqual(Option.None().flatMap(g), Option.None())
			})
		})

		describe('flatten', () => {
			test('static', () => {
				Util.optionEqual(pipe(Option.Some(Option.Some(1)), Option.flatten), Option.Some(1))
				Util.optionEqual(pipe(Option.Some(Option.None()), Option.flatten), Option.None())
			})

			test('instance', () => {
				Util.optionEqual(Option.Some(Option.Some(1)).flatten(), Option.Some(1))
				Util.optionEqual(Option.Some(Option.None()).flatten(), Option.None())
			})
		})

		test('associativity law', () => {
			const Fa: Option.Type<number> = Option.Some(1)
			const f: (a: number) => Option.Type<string> = (a) => Option.Some(a.toString())
			const g: (b: string) => Option.Type<boolean> = (b) => Option.Some(Boolean(b))
			// If ⊕ is associative, then a ⊕ (b ⊕ c) = (a ⊕ b) ⊕ c.
			Util.optionEqual(
				Fa.flatMap(f).flatMap(g),
				Fa.flatMap((a) => f(a).flatMap(g)),
			)
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
			test('static', () => {
				expect(pipe(Option.None(), Option.isNone)).toBe(true)
				expect(pipe(Option.Some(1), Option.isNone)).toBe(false)
			})

			test('instance', () => {
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
