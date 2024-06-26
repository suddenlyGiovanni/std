/**
 * This namespace provides utility types for type manipulation.
 *
 * @example
 * ```ts
 * import type { Types } from './types.ts'
 *
 * type Test1 = Types.Tags<string | { _tag: 'a' } | { _tag: 'b'} >
 * //      ^? "a" | "b"
 *
 * type Test2 = Types.Equals<{ a: number }, { a: number }>
 * //       ^? true
 *
 * type Test3 = Types.Simplify<{ a: number } & { b: number }>
 * //   ^? { a: number; b: number; }
 *
 * ```
 */
export declare namespace Types {
	/**
	 * Returns the tags in a type.
	 *
	 *  @example
	 * ```ts
	 * import type { Types } from './types.ts'
	 *
	 * type Res = Types.Tags<string | { _tag: 'a' } | { _tag: 'b'} > // "a" | "b"
	 * ```
	 *
	 * @category types
	 */
	export type Tags<E> = E extends { _tag: string } ? E['_tag'] : never

	/**
	 * Determines if two types are equal.
	 *
	 * @example
	 * ```ts
	 * import type { Types } from './types.ts'
	 *
	 * type Res1 = Types.Equals<{ a: number }, { a: number }> // true
	 * type Res2 = Types.Equals<{ a: number }, { b: number }> // false
	 * ```
	 *
	 * @category models
	 */
	export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
		? true
		: false

	/**
	 * Simplifies the type signature of a type.
	 *
	 * @example
	 * ```ts
	 * import type { Types } from './types.ts'
	 *
	 * type Res = Types.Simplify<{ a: number } & { b: number }> // { a: number; b: number; }
	 * ```
	 * @category types
	 */
	export type Simplify<A> = {
		[K in keyof A]: A[K]
	} extends infer B ? B
		: never

	/**
	 * Invariant helper.
	 */
	export type Invariant<A> = (_: A) => A

	/**
	 * Covariant helper.
	 */
	export type Covariant<A> = (_: never) => A

	/**
	 * Contravariant helper.
	 */
	export type Contravariant<A> = (_: A) => void
}
