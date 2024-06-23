import type { Equals } from '../internal/equals.ts'
import * as F from '../internal/function.ts'
import type { TypeLambda as _TypeLambda } from '../internal/hkt.ts'
import type { Inspectable } from '../internal/inspectable.ts'
import {
	Covariant,
	type FlatMap,
	type Foldable,
	type Monad,
	type Pointed,
	type Product,
	type SemiProduct,
} from '../typeclass/mod.ts'

function format(x: unknown): string {
	return JSON.stringify(x, null, 2)
}

/**
 * Represents optional values. Instances of `Option` are either an instance of {@linkcode Some} or the  {@linkcode None},  where  Some holds a value, and None is empty.
 *
 * The most idiomatic way to use an Option instance is to treat it as  monad and use `map`,`flatMap`,` filter`, or `foreach`:
 * These are useful methods that exist for both Some and None:
 * -[ ] `isDefined` : True if not empty
 * - {@linkcode Option#isEmpty|isEmpty} : True if empty
 * -[ ] `nonEmpty`: True if not empty
 * -[ ] `orElse`: Evaluate and return alternate optional value if empty
 * - {@linkcode Option#getOrElse|getOrElse}: Evaluate and return alternate value if empty
 * - {@linkcode Option#get|get} : Return value, throw exception if empty
 * - {@linkcode Option#fold|fold}: Apply function on optional value, return default if empty
 * - {@linkcode Option#map|map}: Apply a function on the optional value
 * - {@linkcode  Option#flatMap|flatMap }: Same as map but function must return an optional value
 * -[ ] `foreach`: Apply a procedure on option value
 * -[ ] `collect`: Apply partial pattern match on optional value
 * -[ ] `filter`: An optional value satisfies predicate
 * -[ ] `filterNot`: An optional value doesn't satisfy predicate
 * -[ ] `exists`: Apply predicate on optional value, or false if empty
 * -[ ] `forall`: Apply predicate on optional value, or true if empty
 * -[ ] `contains`: Checks if value equals optional value, or false if empty
 * -[ ] `zip`: Combine two optional values to make a paired optional value
 * -[ ] `unzip`: Split an optional pair to two optional values
 * -[ ] `unzip3`: Split an optional triple to three optional values
 * -[ ] `toList`: Unary list of optional value, otherwise the empty list
 * A less-idiomatic way to use Option values is via pattern matching method `match`:
 *
 * ```ts
 * import { assertStrictEquals } from 'jsr:@std/assert'
 * import { pipe } from '../internal/function.ts'
 * import { Option } from './option.ts'
 *
 * assertStrictEquals(
 * 	pipe(
 * 		Option.fromNullable<number | undefined>(undefined),
 * 		Option.match({
 * 			onNone: () => 'a none',
 * 			onSome: a => `a some containing ${a}`,
 * 		}),
 * 	),
 * 	'a none',
 * )
 *
 * assertStrictEquals(
 * 	Option.fromNullable(1).match({
 * 		onNone: () => 'a none',
 * 		onSome: a => `a some containing ${a}`,
 * 	}),
 * 	'a some containing 1',
 * )
 * ```
 */
export abstract class Option<out A>
	implements
		Inspectable,
		Equals,
		FlatMap.Fluent<Option.TypeLambda>,
		Pointed.Fluent<Option.TypeLambda>,
		Foldable.Fluent<Option.TypeLambda>,
		SemiProduct.Fluent<Option.TypeLambda>,
		Monad.Fluent<Option.TypeLambda> {
	/**
	 * The discriminant property that identifies the type of the `Option` instance.
	 */
	public abstract readonly _tag: 'None' | 'Some'

	/**
	 * Option is an abstract class and should not be instantiated directly.
	 * @throws Error - Option is not meant to be instantiated directly.
	 *
	 * @see Option.None - to create an empty Option
	 * @see Option.Some - to create an Option with a value
	 * @see Option.fromNullable - to create an Option from a nullable value
	 *
	 * @hideconstructor
	 */
	protected constructor() {
		if (new.target === Option) {
			throw new Error(
				"Option is not meant to be instantiated directly; instantiate instead Option's derived classes (Some, None)",
			)
		}
	}

	/**
	 * Overloads default {@linkcode Object.[Symbol.toStringTag]} getter allowing Option to return a custom string
	 */
	public get [Symbol.toStringTag](): string {
		return `Option.${this._tag}`
	}

	/**
	 * Creates a new `Option` that represents the absence of a value.
	 *
	 * @category constructors
	 */
	public static None<A = never>(): Option.Type<A> {
		return None.getSingletonInstance<A>()
	}

	/**
	 * Creates a new `Option` that wraps the given non-null value.
	 *
	 * @template A - The type of the value to wrap.
	 * @template B - A subtype of `A` that excludes `null` and `undefined`.
	 * @param value - The non-null value to wrap.
	 * @returns An instance of `Option.Type<B>` containing the value.
	 *
	 * @remarks
	 * This method ensures that the wrapped value is not `null` or `undefined`.
	 * For a more loose typing use cases, see {@link Option.of}.
	 *
	 * @example
	 * non-null value
	 * ```ts
	 * import { Option } from './option.ts';
	 *
	 * // Wrapping a non-null value
	 * const someValue = Option.Some(42)
	 * //    ^?  Some<number>
	 * ```
	 *
	 * @example
	 * Attempting to wrap a nullable value will result in a compile-time error
	 * ```ts
	 * import { Option } from './option.ts';
	 *
	 * const nullableValue: number | null = null
	 * // @ts-expect-error Argument of type 'null' is not assignable to parameter of type 'NonNullable<number>'
	 * const optionValue = Option.Some(nullableValue)
	 * //                              ^^^^^^^^^^^^^
	 *
	 * // Ensuring a non-null value
	 * const safeValue = Option.Some(nullableValue ?? 0);
	 * //    ^?  Some<number>
	 * ```
	 *
	 * @see {@link Option.of}
	 * @category constructors
	 */
	public static Some<A, B extends NonNullable<A>>(value: B): Option.Type<B> {
		return Option.of(value)
	}

	/**
	 * Applies a function to the value of an Option and flattens the result, if the input is Some.
	 * @returns A function that takes an Option and returns the result of applying `f` to this Option's value if the Option is nonempty. Otherwise, returns None.
	 * @see  Option#flatMap
	 */
	public static flatMap: FlatMap.Pipeable<Option.TypeLambda>['flatMap'] =
		<A, B>(f: (a: A) => Option.Type<B>) => (self: Option.Type<A>): Option.Type<B> =>
			Option.isNone(self) ? Option.None() : f(self.get())

	/**
	 * Flattens a nested Option by one level.
	 *
	 * @param ffa - The nested Option to flatten;
	 * @returns The flattened Option.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 * import { pipe } from '../internal/function.ts'
	 *
	 * assertStrictEquals(
	 * 	pipe(
	 * 		Option.Some(Option.Some(1)),
	 * 		Option.flatten
	 * 	),
	 * 	Option.Some(1)
	 * )
	 * ```
	 *
	 * @see Option#flatten
	 * @see Option#flatMap
	 */
	static flatten: FlatMap.Pipeable<Option.TypeLambda>['flatten'] = <A>(
		ffa: Option.Type<Option.Type<A>>,
	): Option.Type<A> => ffa.flatMap(F.identity)

	/**
	 * Returns a new function that takes an Option and returns the result of applying `f` to Option's value if the Option is nonempty. Otherwise, evaluates expression `ifEmpty`.
	 * This is equivalent to:
	 * ```ts
	 * import { Option } from  './option.ts'
	 *
	 * declare const option: Option.Type<unknown>
	 * declare const f: <A, B>(a: A) => B
	 * declare const ifEmpty: <B>() => B
	 *
	 * option.match({
	 *    onSome: (x) => f(x),
	 *    onNone: () => ifEmpty(),
	 *  })
	 * ```
	 *
	 * This is also equivalent to:
	 * ```ts no-eval no-assert
	 * import { Option } from  './option.ts'
	 *
	 * declare const option: Option.Type<unknown>
	 * declare const f: <A, B>(a: A) => B
	 * declare const ifEmpty: <B>() => B
	 *
	 * option.map(f).getOrElse(ifEmpty)
	 * ```
	 *
	 * @param ifEmpty - The expression to evaluate if empty.
	 * @param f - The function to apply if nonempty.
	 * @returns a function that takes an Option and returns the result of applying `f` to this Option's value if the Option is nonempty. Otherwise, evaluates expression `ifEmpty`.
	 *
	 * @remarks
	 * This is a curried function, so it can be partially applied.
	 * It is also known as `reduce` in other languages.
	 *
	 * @example
	 *  ( ( ) -> B,  (A) -> B ) -> Option.Type<A> -> B
	 * ```ts
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 * import type * as F from '../internal/function.ts'
	 *
	 * import { Option } from  './option.ts'
	 *
	 * // Define a function to execute if the option holds a value
	 * const increment: (x: number) => number = a => a + 1
	 * // Define function to be evaluated if the Option is empty
	 * const ifEmpty:F.Lazy<number> = () => 0
	 *
	 * // Define curry function
	 * const incrementOrZero = Option.fold(ifEmpty, increment)
	 *
	 * const two = incrementOrZero(Option.Some(1))
	 * //        ^? number
	 * assertStrictEquals(two, 2)
	 *
	 * const zero: number = incrementOrZero(Option.None())
	 * //        ^? number
	 * assertStrictEquals(zero, 0)
	 * ```
	 *
	 * @example
	 * ( ( ) -> B,  (A) -> C ) -> Option.Type<A> -> B | C
	 * ```ts
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 * import type * as F from '../internal/function.ts'
	 *
	 * import { Option } from  './option.ts'
	 *
	 * const fold = Option.fold(() => null, (a: number) => a + 1)
	 *
	 * const two: number | null = fold(Option.Some(1))
	 * // 			  ^? number | null
	 * assertStrictEquals(two, 2)
	 *
	 * const numberOrNull: number | null = fold(Option.None())
	 * // 			  ^? number | null
	 * assertStrictEquals(numberOrNull, null)
	 * ```
	 * @see {Option.match}
	 * @category scala3-api
	 */
	public static fold<B, A, C = B>(
		ifEmpty: F.Lazy<B>,
		f: (a: A) => C,
	): (self: Option.Type<A>) => B | C {
		return (self) => (self.isEmpty() ? ifEmpty() : f(self.get()))
	}

	/**
	 * Constructs a new `Option` from a nullable type.
	 * @param nullableValue - An nullable nullableValue
	 * @returns An `Option` that is {@linkcode class None} if the nullableValue is `null` or `undefined`, otherwise a {@linkcode Some(1)} containing the nullableValue.
	 *
	 * @example
	 * ```ts
	 *  import { assertStrictEquals  } from 'jsr:@std/assert'
	 *  import { Option } from  './option.ts'
	 *
	 *  assertStrictEquals(Option.fromNullable(undefined), Option.None()) // None | Option.Some<never>
	 *  assertStrictEquals(Option.fromNullable(undefined as (undefined | string)), Option.None()) // None | Option.Some<string>
	 *  assertStrictEquals(Option.fromNullable(null), Option.None())  // None | Option.Some<never>
	 *  assertStrictEquals(Option.fromNullable(1), Option.Some(1)) // None | Option.Some<number>
	 * ```
	 *
	 * @category constructors
	 */
	public static fromNullable<T>(nullableValue: T): Option.Type<NonNullable<T>> {
		return nullableValue === undefined || nullableValue === null
			? None.getSingletonInstance()
			: Option.Some(nullableValue)
	}

	/**
	 * Determine if a `Option` is a `None`.
	 *
	 * @param self - The `Option` to check.
	 *
	 * @example
	 * ```ts
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 * import { Option } from  './option.ts'
	 *
	 * assertStrictEquals(Option.isNone(Option.Some(1)), false)
	 * assertStrictEquals(Option.isNone(Option.None()), true)
	 * ```
	 * @category type-guards
	 */
	public static isNone<T>(self: Option.Type<T>): self is None<T> {
		return self instanceof None
	}

	/**
	 * Tests if a value is a `Option`; it does not check if the value is a `Some` or a `None`.
	 *
	 * @param input - The value to check.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 *
	 * assertStrictEquals(Option.isOption(Option.Some(1)), true)
	 * assertStrictEquals(Option.isOption(Option.None()), true)
	 * assertStrictEquals(Option.isOption({}), false)
	 * ```
	 * @category type-guards
	 */
	public static isOption(input: unknown): input is Option.Type<unknown> {
		return input instanceof None || input instanceof Some
	}

	/**
	 * Determine if a `Option` is a `Some`.
	 *
	 * @param self - The `Option` to check.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 *
	 * assertStrictEquals(Option.isSome(Option.Some(1)), true)
	 * assertStrictEquals(Option.isSome(Option.None()), false)
	 * ```
	 * @category type-guards
	 */
	public static isSome<T>(self: Option.Type<T>): self is Some<T> {
		return self instanceof Some
	}

	/**
	 * Returns a curried function that, when invoked with an `Option<A>`, applies the provided function `f` to the value within the `Option` (if it exists) and wraps the result in a `Some`. If the `Option` is `None`, it returns `None`.
	 * This is equivalent to:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * declare const option: Option.Type<number>
	 * declare const f: (a: number) => string
	 *
	 * option.match({
	 * 	onSome: (x) => Option.Some(f(x)),
	 * 	onNone: () => Option.None(),
	 * })
	 * ```
	 *
	 * @typeParam A - The type of the value within the `Option`.
	 * @typeParam B - The type of the value that the function `f` returns.
	 * @param f - The function to apply that has a type signature that goes from an `A` to  a `B`
	 * @returns A curried function that takes an `Option<A>` and returns a new `Option<B>` with the result of applying `f` to the original `Option`'s value, if it was `Some`. If the original `Option` was `None`, it returns `None`.
	 *
	 *

	 * @remarks
	 * This method is curried to support partial application and pipelining. The `Option` instance to operate on is provided last.
	 * This is similar to the instance method {@linkcode Option#map|map}, but is designed to be used in a functional programming style where data is provided last.
	 * Unlike {@linkcode Option.flatMap|flatMap}, `f` does not need to return an `Option`; the result is automatically wrapped in a `Some`.
	 *
	 * @example
	 * Operating on Some:
	 * ```ts
	 * import { pipe } from '../internal/function.ts'
	 * import { Option } from './option.ts'
	 *
	 * const result = pipe(
	 * 	Option.Some(5),
	 * 	Option.map(value => value + 1)
	 * 	)
	 *
	 * console.log(result) // Some(6)
	 * ```
	 *
	 * @example
	 *  Operating on None:
	 *  ```ts
	 *  import { Option } from './option.ts'
	 *  import { pipe } from '../internal/function.ts'
	 *
	 *  const result = pipe(
	 *  	Option.None(),
	 *  	Option.map(value => value + 1)
	 *  	)
	 *
	 *  console.log(result) // None
	 *  ```
	 *
	 * @see Option.flatMap
	 * @see Option.forEach
	 * @see Option#map
	 */
	public static map: Covariant.Pipeable<Option.TypeLambda>['map'] =
		<A, B>(f: (a: A) => B) => (self: Option.Type<A>): Option.Type<B> =>
			Option.flatMap((a: A) => Option.of(f(a)))(self)

	/**
	 * Transform an `Option<A>` into an `Option<B>` by providing a transformation from `A` to `B` and one from `B` to `A`.
	 * This method is curried, meaning it takes the transformation functions first and returns a new function that expects the `Option` instance.
	 * This is its type signature:
	 * `<A, B>(to: (a: A) => B, from: (b: B) => A) => <R, O, E>(self: Option.Type<A>) => Option.Type<B>`
	 * @typeParam A - The source type of the value within the `Option`.
	 * @typeParam B - The target type of the value within the `Option`.
	 * @param to - The function  from `A` to `B` to apply to the value of the `Option` if it is nonempty.
	 * @param from - The function from `B` to `A` to apply to the value of the `Option` if it is nonempty.
	 * @returns A function that takes an `Option<A>` and returns an `Option<B>`.
	 *
	 * @example
	 * ```ts
	 * import { pipe } from '../internal/function.ts'
	 * import { Option } from './option.ts'
	 *
	 * const to = (n: number): string => `Number is ${n}`
	 * const from = (s: string): number => parseInt(s.split(' ')[2])
	 *
	 * const result = pipe(
	 *   Option.Some(5),
	 *   Option.imap(to, from)
	 * );
	 *
	 * console.log(result); // Outputs: Some("Number is 5")
	 * ```
	 *
	 * @see Option#imap
	 */
	public static imap: Covariant.Pipeable<Option.TypeLambda>['imap'] = Covariant.imap<
		Option.TypeLambda
	>(Option.map)

	/**
	 * Curried pattern matching for `Option` instances.
	 * Given a pattern matching object, it will return a function that will match the `Option` instance against the pattern.
	 *
	 * @param cases - The pattern matching object
	 * @param cases.onNone - The lazy value to be returned if the `Option` is `None`;
	 * @param cases.onSome - The function to be called if the `Option` is `Some`, it will be passed the `Option`'s value and its result will be returned
	 * @returns A function that will match the `Option` instance against the pattern.
	 *
	 * @example
	 * ```ts
	 *  import { assertStrictEquals  } from 'jsr:@std/assert'
	 * import { Option } from './option.ts'
	 * import { pipe } from '../internal/function.ts'
	 *
	 * assertStrictEquals(
	 *   pipe(
	 *    Option.Some(1),
	 *    Option.match({ onNone: () => 'a none', onSome: (a) => `a some containing ${a}` })
	 *   ),
	 *   'a some containing 1'
	 * )
	 *
	 * assertStrictEquals(
	 *   pipe(
	 *    Option.None(),
	 *    Option.match({ onNone: () => 'a none', onSome: (a) => `a some containing ${a}` })
	 *   ),
	 *   'a none'
	 * )
	 * ```
	 * @see {Option.fold}
	 * @category pattern matching
	 */
	public static match<B, A, C = B>(cases: {
		readonly onNone: F.Lazy<B>
		readonly onSome: (a: A) => C
	}): (self: Option.Type<A>) => B | C {
		return Option.fold(cases.onNone, cases.onSome)
	}

	/**
	 * Lifts a value `A` into the context of an `Option`.
	 *
	 * @template A - The type of the value to lift.
	 * @param a - The value to lift.
	 * @returns An instance of `Option.Type<A>` containing the value of type `A`.
	 *
	 * @remarks
	 * This method wraps the provided value in an `Option`.
	 * Specifically, it creates an instance of `Some` containing the given value.
	 * If you want to stronger type guarantees that you are not lifting nullable values, consider using {@link Option.Some}.
	 *
	 * @example
	 * ```ts
	 * import { Option } from './option.ts'
	 *
	 * // Lifting a non-null value
	 * const someValue = Option.of(42)
	 * //        ^? Some<number>
	 *
	 * // Lifting a nullable value
	 * const nullableValue: number | null = null
	 * const optionValue = Option.of(nullableValue)
	 * //        ^? Some<null>
	 *
	 * // TypeScript will not throw compile errors, but consider handling nulls explicitly
	 * const safeValue = Option.of(nullableValue ?? 0)
	 * //        ^? Some<number>
	 * ```
	 *
	 * @see {@link Option.Some}
	 * @category Constructors
	 */
	public static of: Pointed.Pipeable<Option.TypeLambda>['of'] = <A>(a: A): Option.Type<A> =>
		new Some(a)

	/**
	 * Represents the cartesian product of two Options.
	 *
	 * @typeParam A
	 * @typeParam B
	 * @param self - The option of type `A` to be combined with.
	 * @param that - The option of type `B` to be combined with.
	 * @returns the result of combining the two options.
	 *
	 * @remarks
	 * It implements the {@linkcode SemiProduct#Pipeable#product} type class interface.
	 *
	 * @example
	 * ```ts
	 * import { assertEquals } from 'jsr:@std/assert'
	 * import { pipe } from '../internal/function.ts'
	 * import { Option } from './option.ts'
	 *
	 * assertEquals(
	 * 	Option.product(Option.Some(1), Option.Some(2)),
	 * 	Option.Some([1, 2])
	 * )
	 *
	 * assertEquals(
	 * 	Option.product(Option.Some('a'), Option.None()),
	 * 	Option.None()
	 * )
	 * ```
	 */
	public static readonly product: SemiProduct.Pipeable<Option.TypeLambda>['product'] = <A, B>(
		self: Option.Type<A>,
		that: Option.Type<B>,
	): Option.Type<[A, B]> =>
		Option.isSome(self) && Option.isSome(that)
			? Option.of([self.get(), that.get()])
			: Option.None()

	/**
	 * Takes a structure of Options and returns an Option of values with the same structure.
	 *
	 * @typeParam A - The type of the values in the Options.
	 * @param optionCollection - The structure of Options to combine.
	 * @returns An Option of values with the same structure.
	 *
	 * @remarks
	 * It implements the {@linkcode Product#Pipeable#productAll} type class interface.
	 *
	 * @example
	 * All Some
	 * ```ts
	 * import { assertEquals } from 'jsr:@std/assert'
	 * import { Option } from './option.ts'
	 *
	 * assertEquals(
	 * 	Option.productAll([Option.Some(1), Option.Some(2), Option.Some(3)]),
	 * 	Option.Some([1, 2, 3])
	 * )
	 * ```
	 *
	 * @example
	 * Some and None
	 * ```ts
	 * import { assertEquals } from 'jsr:@std/assert'
	 * import { Option } from './option.ts'
	 *
	 * assertEquals(
	 * 	Option.productAll([Option.Some(1), Option.None(), Option.Some(3)]),
	 * 	Option.None()
	 * )
	 * ```
	 */
	public static readonly productAll: Product.Pipeable<Option.TypeLambda>['productAll'] = <A>(
		optionCollection: Iterable<Option.Type<A>>,
	): Option.Type<Array<A>> => {
		const out: A[] = []
		for (const option of optionCollection) {
			if (Option.isNone(option)) {
				return Option.None()
			}
			out.push(option.get())
		}
		return Option.of(out)
	}

	/**
	 * Combines an `Option<A>` from 'self' and an iterable collection of `Option<A>` into an `Option<[A, ...Array<A>]>`.
	 * If any of the options are `None`, the result will be `None`.
	 *
	 * @typeParam A
	 * @param collection - The {@linkcode Iterable} options of type A to combine with the `self` option.
	 * @returns a function that takes an `Option<A>` and returns the result of combining the `self` option with the collection of options.
	 *
	 * @remarks
	 * This method is curried, so it can be partially applied.
	 * It implements the {@linkcode SemiProduct#Pipeable#productMany} type class interface.
	 *
	 * @example
	 * Some(1).productMany([Some(2), Some(3)]) // Some([1, 2, 3])
	 * ```ts
	 * import { assertEquals } from 'jsr:@std/assert'
	 * import { Option } from './option.ts'
	 *
	 * assertEquals(
	 *    Option.productMany(Option.Some(1), [Option.Some(2), Option.Some(3)]),
	 *    Option.Some([1, 2, 3])
	 * )
	 * ```
	 *
	 * @example
	 * Some(1).productMany([None(), Some(3)]) // None
	 * ```ts
	 * import { assertEquals } from 'jsr:@std/assert'
	 * import { Option } from './option.ts'
	 *
	 * assertEquals(
	 *  Option.productMany(Option.Some(1), [Option.None(), Option.Some(3)]),
	 *  Option.None()
	 * )
	 * ```
	 *
	 * @example
	 * Some('string').productMany([Some(2)]) // type error
	 * ```ts
	 * import { Option } from './option.ts'
	 *
	 * // @ts-expect-error Option.Type<string> is not assignable to type Option.Type<number>
	 * Option.productMany(Option.Some('a'), [Option.Some(2), Option.Some(3)])
	 * ```
	 */
	public static readonly productMany: SemiProduct.Pipeable<Option.TypeLambda>['productMany'] = <
		A,
	>(
		self: Option.Type<A>,
		collection: Iterable<Option.Type<A>>,
	): Option.Type<[A, ...Array<A>]> => {
		if (Option.isNone(self)) {
			return Option.None()
		}
		const out: [A, ...Array<A>] = [self.get()]

		for (const option of collection) {
			if (Option.isNone(option)) {
				return Option.None()
			}
			out.push(option.get())
		}
		return Option.of(out)
	}

	/**
	 * This curried static method allows you to fold an Option to a summary value.
	 *
	 * @template A The type of the values in the Option.
	 * @template B The type of the result after folding.
	 * @param b - The initial value for the folding operation.
	 * @param f - The folding function that takes the accumulated value and the current value
	 * and returns the new accumulated value.
	 * @returns a function that takes an Option of type A and returns the result of applying the f function to it.
	 *
	 * @remarks
	 * It implements the {@linkcode Foldable} type class interface.
	 * @see Option#reduce
	 */
	public static reduce: Foldable.Pipable<Option.TypeLambda>['reduce'] =
		<A, B>(b: B, f: (b: B, a: A) => B) => (self: Option.Type<A>): B =>
			Option.isNone(self) ? b : f(b, self.get())

	/**
	 * Implements the {@linkcode Equals} interface, providing a way to compare two this Option instance with another unknown value that may be an Option or not.
	 *
	 * @param that - the value to compare
	 * @param predicateStrategy - an optional predicate strategy to use when comparing the values. Defaults to `Object.is`.
	 * @returns `true` if the two values are equal, `false` otherwise.
	 * @remarks
	 * In its unary form, it uses referential equality (employing the Object.is algorithm). This behavior can be overridden by providing a custom predicate strategy as second argument.
	 *
	 * @example
	 * Using the default referential equality strategy on primitive types:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals, equal } from 'jsr:@std/assert'
	 *
	 * const some1 = Option.Some(1)
	 * const none = Option.None()
	 *
	 * // equality on primitive types
	 * assertStrictEquals(some1.equals(some1), true)
	 * assertStrictEquals(some1.equals(none), false)
	 * assertStrictEquals(none.equals(none), true)
	 * ```
	 *
	 * @example
	 * Using the default referential equality strategy on non-primitive types:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals, equal } from 'jsr:@std/assert'
	 *
	 * const some1 = Option.Some(1)
	 * const none = Option.None()
	 *
	 * // equality derive types
	 * assertStrictEquals(some1.equals(Option.Some(1)), true)
	 * const someRecord = Option.Some({ foo: 'bar' })
	 * assertStrictEquals(someRecord.equals(someRecord), true)
	 * assertStrictEquals(someRecord.equals(Option.Some({ foo: 'bar' })), false)
	 * ```
	 *
	 * @example
	 * Using a custom predicate strategy:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals, equal } from 'jsr:@std/assert'
	 *
	 * // equality with custom predicate strategy
	 * assertStrictEquals(
	 * 	Option.Some({ foo: 'bar' }).equals(
	 * 		Option.Some({ foo: 'bar' }),
	 * 		equal, // a custom deep equality strategy
	 * 	),
	 * 	true,
	 * )
	 * ```
	 */
	public equals<That>(
		this: Option.Type<A>,
		that: That,
		predicateStrategy: (self: A, that: That) => boolean = Object.is,
	): boolean {
		return this.isSome()
			? Option.isOption(that) &&
				Option.isSome(that) &&
				predicateStrategy(this.get(), that.get() as That)
			: Option.isOption(that) && Option.isNone(that)
	}

	/**
	 * Returns the result of applying `f` to `this` Option's value if this Option is nonempty. Returns `None` if this Option is empty.
	 * Slightly different from `map` in that `f` is expected to return `Option.Type` (which could be None).
	 *
	 * @param f – the function to apply
	 * @returns the result of applying `f` to `this` Option's value if this Option is nonempty. Returns `None` if this Option is empty.
	 *
	 *  @remarks
	 * This is equivalent to:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * declare const option: Option.Type<unknown>
	 * declare const f: <A, B>(a: A) => Option.Type<B>
	 *
	 * option.match({
	 *  onSome: (x) => f(x),
	 *  onNone: () => Option.None()
	 * })
	 * ```
	 *
	 * @see {Option.flatMap}
	 * @see map
	 * @see foreach
	 * @implements {FlatMap}
	 */
	public flatMap<A, B>(this: Option.Type<A>, f: (a: A) => Option.Type<B>): Option.Type<B> {
		return Option.flatMap(f)(this)
	}

	/**
	 * Flatten a nested `Option` of `Option` structure into a single-layer `Option` structure.
	 *
	 * @template A - The type of value wrapped in the Option type.
	 * @this Option.Type<Option.Type<A>> - The nested Option to flatten.
	 * @returns The flattened Option type.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 *
	 * assertStrictEquals(
	 *  Option.Some(Option.Some(1)).flatten(),
	 *  Option.Some(1)
	 * )
	 *
	 * assertStrictEquals(
	 *  Option.Some(Option.None()).flatten(),
	 *  Option.None()
	 * )
	 * ```
	 * @see Option.flatten
	 * @see Option.flatMap
	 */
	public flatten<A>(this: Option.Type<Option.Type<A>>): Option.Type<A> {
		return this.flatMap(F.identity)
	}

	/**
	 * Returns the result of applying f to this Option's value if the Option is
	 * nonempty. Otherwise, evaluates expression ifEmpty.
	 *
	 * @param ifEmpty - The expression to evaluate if empty.
	 * @param f - The function to apply if nonempty.
	 * @returns The result of applying `f` to this Option's value if the Option is nonempty. Otherwise, evaluates expression `ifEmpty`.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 * import { assertStrictEquals } from 'jsr:@std/assert'
	 *
	 * assertStrictEquals(Option.Some(1).fold(() => 0, (a) => a + 1), 2)
	 * assertStrictEquals(Option.Some(1).fold(() => 0, (a) => a + 1), 0)
	 * ```
	 * @category scala3-api
	 * @see {Option.fold}
	 */
	public fold<A, B, C = B>(
		this: Option.Type<A>,
		ifEmpty: F.Lazy<B>,
		f: (a: NoInfer<A>) => C,
	): B | C {
		return Option.fold(ifEmpty, f)(this)
	}

	/**
	 * Returns the option's value.
	 * @throws Error - if the option is empty
	 * @remarks The option must be nonempty.
	 */
	public abstract get(): A

	/**
	 * Returns the option's value if the option is nonempty, otherwise return the result of evaluating default.
	 *
	 * This is equivalent to the following pattern match:
	 * ```ts no-assert
	 * import { Option } from  './option.ts'
	 *
	 * declare const option: Option.Type<unknown>
	 * declare const defaultValue: <B>() => B
	 *
	 * option.match({
	 * 	onNone: () => defaultValue(),
	 * 	onSome: (a) => a
	 * })
	 * ```
	 *
	 * @param defaultValue - T the default expression. It will be evaluated if the option is empty.
	 */
	public getOrElse<B extends A>(this: Option.Type<A>, defaultValue: F.Lazy<B>): A | B {
		return this.isEmpty() ? defaultValue() : this.get()
	}

	/**
	 * Transform an `Option<A>` into an `Option<B>` by providing a transformation from `A` to `B` and one from `B` to `A`.
	 *
	 * @typeParam A - The source type of the value within the `Option`.
	 * @typeParam B - The target type of the value within the `Option`.
	 * @param f - The function `A` TO `B` to apply to the value of the `Option` if it is nonempty.
	 * @param _g - The function `A` FROM `B` to apply to the value of the `Option` if it is nonempty.
	 * @returns An `Option<B>` containing the result of applying `to` to the value of the `Option` if it is nonempty.
	 *
	 * @see Option.imap
	 */
	public imap<A, B>(this: Option.Type<A>, f: (a: A) => B, _g: (b: B) => A): Option.Type<B> {
		return Option.map(f)(this)
	}

	/**
	 * Type guard that returns `true` if the option is None, `false` otherwise.
	 *
	 * @returns `true` if the option is None, `false` otherwise.
	 * @alias isNone
	 * @category type-guards, scala3-api
	 */
	isEmpty(this: Option.Type<A>): this is None<A> {
		return this.isNone()
	}

	/**
	 * Type guard that checks if the `Option` instance is a {@linkcode None}.
	 * @returns `true` if the `Option` instance is a {@linkcode None}, `false` otherwise.
	 *
	 * @category type-guards
	 */
	public isNone(this: Option.Type<A>): this is None<A> {
		return Option.isNone(this)
	}

	/**
	 * Determine if an `Option` instance  is a `Some`.
	 *
	 * @category type-guards
	 */
	public isSome(this: Option.Type<A>): this is Some<A> {
		return Option.isSome(this)
	}

	/**
	 * Returns a `Some` containing the result of applying `f` to this Option's value if this Option is nonempty.
	 * Otherwise, return `None`
	 *
	 * @param f - The function to apply
	 * @returns a `Some<B>` if the Option is nonempty, otherwise `None`
	 *
	 * @remarks
	 * This is equivalent to:
	 * ```ts
	 * import { Option } from  './option.ts'
	 * declare const option: Option.Type<Array<number>>
	 * declare const f: (a: number[]) => boolean[]
	 *
	 * option.match({
	 * 	onSome: (a) => Option.Some(f(a)), // Some<B>
	 * 	onNone: () => Option.None()
	 * })
	 * ```
	 *
	 * @remarks
	 * This is similar to {@linkcode Option#flatMap|flatMap } except here, `f` does not need to wrap its result in an `Option`.
	 *
	 * @see Option.map
	 */
	public map<A, B>(this: Option.Type<A>, f: (a: A) => B): Option.Type<B> {
		return Option.map(f)(this)
	}

	/**
	 * Pattern matches the value of the Option.
	 *
	 * @this {Some | None} - The `Option` instance to match.
	 * @param cases - The pattern matching object containing callbacks for different case branches:
	 * @param cases.onNone - The lazy value to be returned if the `Option` is `None`;
	 * @param cases.onSome - The function to be called if the `Option` is `Some`, it will be passed the `Option`'s value and its result will be returned
	 * @returns The value returned by the corresponding callback from the cases object of type `B` or `C`.
	 *
	 * @example
	 * ```ts
	 *  import { assertStrictEquals  } from 'jsr:@std/assert'
	 * import { Option } from './option.ts'
	 *
	 * assertStrictEquals(
	 *    Option.fromNullable<null | number>(1)
	 *      .match({
	 *        onNone: () => 'a none',
	 *        onSome: (a) => `a some containing ${a}`
	 *        }),
	 *   'a some containing 1'
	 * )
	 *
	 * assertStrictEquals(
	 *    Option.fromNullable<null | number>(null)
	 *      .match({
	 *        onNone: () => 'a none',
	 *        onSome: (a) => `a some containing ${a}`
	 *        }),
	 *   'a none'
	 * )
	 * ```
	 * @see {Option.fold}
	 * @see {Option.match}
	 * @category pattern-matching
	 */
	public match<A, B, C = B>(
		this: Option.Type<A>,
		cases: {
			readonly onNone: F.Lazy<B>
			readonly onSome: (a: A) => C
		},
	): B | C {
		return Option.match(cases)(this)
	}

	/**
	 * Returns an Option containing a tuple of values from two Option objects.
	 *
	 * @template A - The type of the values in the first Option.
	 * @template B - The type of the values in the second Option.
	 * @this {Option.Type<A>} - The first Option object.
	 * @param that - The second Option object.
	 * @returns An Option object containing a tuple of values from the two Option objects.
	 *
	 * @see Option.product
	 */
	public product<A, B>(this: Option.Type<A>, that: Option.Type<B>): Option.Type<[A, B]> {
		return Option.product(this, that)
	}

	/**
	 * Calculates the product of an Option with multiple Options in a collection.
	 *
	 * @template A - The type of the values in the Options.
	 * @this {Option.Type<A>} - The Option to calculate the product with.
	 * @param collection - The collection of Options to calculate the product with; it must be an iterable collection.
	 * @returns An Option that represents the product of the Option with the Options in the collection.
	 *
	 * @see Option.productMany
	 * @see Option#product
	 */
	public productMany<A>(
		this: Option.Type<A>,
		collection: Iterable<Option.Type<A>>,
	): Option.Type<[A, ...A[]]> {
		return Option.productMany(this, collection)
	}

	/**
	 * Instance method that applies a function to each element in the Option and reduces them to a single value.
	 *
	 * @template A - The type of the values in the Option.
	 * @template B - The type of the result after folding.
	 * @param b - The initial value for the reduction.
	 * @param f - The reducing function that takes the accumulated value and the current element as arguments.
	 * @returns The result of the reduction.
	 * @this Option.Type<A> - The Option to reduce.
	 *
	 * @remarks
	 * It Implements the {@linkcode Foldable.Fluent} type class interface.
	 *
	 * @see Option.reduce
	 * @see Option#fold
	 */
	public reduce<A, B>(this: Option.Type<A>, b: B, f: (b: B, a: A) => B): B {
		return Option.reduce(b, f)(this)
	}

	/**
	 * Overloads default serialization behavior when using JSON stringify method
	 * @override
	 */
	public toJSON(this: Option.Type<A>): {
		_id: 'Option'
		_tag: 'None' | 'Some'
		value?: A
	} {
		return {
			_id: 'Option',
			_tag: this._tag,
			...(this.isSome() ? { value: this.get() } : {}),
		}
	}

	/**
	 * Overloads default {@linkcode Object.prototype.toString} method allowing Option to return a custom string representation of the boxed value
	 * @override
	 */
	public toString(this: Option.Type<A>): string {
		return format(this.toJSON())
	}
}

/**
 * The type-level namespace for Option
 * @namespace Option
 */
export declare namespace Option {
	/**
	 * Option is the sum type of {@linkcode None} and {@linkcode Some}.
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 *
	 * // ts-check
	 * const some: Option.Type<number> = Option.Some(1)
	 * const none: Option.Type<number> = Option.None()
	 * ```
	 *
	 * @category type-level
	 */
	export type Type<A> = None<A> | Some<A>

	/**
	 * Type utility to extract the type of the value from an Option.
	 *
	 * @example
	 * ```ts
	 * import { Option } from  './option.ts'
	 *
	 * const aNumber: number = 42
	 * const someOfNumber: Option.Type<number> = Option.Some(aNumber)
	 * const test1: Option.Value<typeof someOfNumber> = aNumber // ✅ no ts error!
	 * //       ^? number
	 *
	 * // @ts-expect-error Type 'string' is not assignable to type 'number'.
	 * const test2: Option.Value<typeof someOfNumber> = "42" // 💥ts error!
	 * ```
	 */
	export type Value<T extends Option.Type<unknown>> = [T] extends [Option.Type<infer _A>] ? _A
		: never

	/**
	 * @internal
	 */
	export interface TypeLambda extends _TypeLambda {
		readonly type: Type<this['Target']>
	}
}

/**
 * Case class representing the absence of a value.
 * @class None
 * @extends Option
 * @internal
 */
export class None<out A> extends Option<A> {
	static #instance: undefined | None<unknown> = undefined
	public readonly _tag = 'None' as const

	/**
	 * Creates a new immutable `None` instance.
	 *
	 * @returns An instance of `None`
	 * @remaks
	 * We don't need multiple instances of `None` in memory, therefore we can save memory by using a singleton pattern.
	 * Do not call this constructor directly. Instead, use {@linkcode None.getSingletonInstance}.
	 * @hideconstructor
	 */
	private constructor() {
		super()
		Object.freeze(this)
	}

	/**
	 * Returns the singleton instance of `None`.
	 *
	 * @returns The singleton instance of `None`.
	 * @internal - use instead {@linkcode Option.None}
	 *
	 * @category constructors
	 */
	public static getSingletonInstance<B>(): None<B> {
		if (!None.#instance) {
			None.#instance = new None<B>()
		}
		return None.#instance as None<B>
	}

	/**
	 * @inheritDoc
	 */
	public get(): never {
		throw new Error('None.get')
	}
}

/**
 * Case class representing the presence of a value.
 * @class Some
 * @extends Option
 * @internal
 */
export class Some<out A> extends Option<A> {
	public readonly _tag = 'Some' as const
	readonly #value: A

	/**
	 * Creates a new `Some` immutable instance that wraps the given value.
	 *
	 * @param value - The `value` to wrap.
	 * @returns An instance of `Some`
	 * @remarks Do not call this constructor directly. Instead, use the static  {@linkcode Option.Some}
	 * @hideconstructor
	 */
	public constructor(value: A) {
		super()
		this.#value = value
		Object.freeze(this)
	}

	/**
	 * @inheritDoc
	 */
	public get(): A {
		return this.#value
	}
}

/**
 * constrains option to implement all its Pipeable interfaces And type-class methods
 * @internal
 */
function assertPipableOption<
	T extends
		& FlatMap.Pipeable<Option.TypeLambda>
		& Pointed.Pipeable<Option.TypeLambda>
		& Monad.Pipeable<Option.TypeLambda>
		& SemiProduct.Pipeable<Option.TypeLambda>
		& Product.Pipeable<Option.TypeLambda>,
>(_option: T): void {
	return
}
assertPipableOption(Option)
