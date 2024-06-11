import type { Kind, TypeClass, TypeLambda } from '../internal/hkt.ts'

/**
 * {@linkcode FlatMap.Fluent} type class gives us {@linkcode FlatMap.flatMap|flatMap}, which allows us to have a `value` in a context `(F[A])` and then feed that into a function that takes a normal value and returns a value in a context `(A => F[B])`.
 *
 * One motivation for separating this out from Monad is that there are
 * situations where we can implement `flatMap` but not `pure`.
 *
 * @see See [[https://github.com/typelevel/cats/issues/3]] for some discussion.
 *
 * Must obey the laws defined in cats.laws.FlatMapLaws.
 * - Associativity:
 * ```scala
 * def flatMapAssociativity[A, B, C](fa: F[A], f: A => F[B], g: B => F[C]): IsEq[F[C]] =
 *     fa.flatMap(f).flatMap(g) <-> fa.flatMap(a => f(a).flatMap(g))
 * ```
 */
export declare namespace FlatMap {
	/**
	 * Fluent interface for TypeClass
	 * @template F TypeLambda
	 */
	export interface Fluent<F extends TypeLambda> extends TypeClass<F> {
		/**
		 * Applies the function `f` to a value within the context, returning a new value within the context.
		 *
		 * @template R1, O1, E1, A, R2, O2, E2, B
		 * @this Kind<F, R1, O1, E1, A> - The context holding the initial value.
		 * @param f - The function to apply.
		 * @returns A new context holding the transformed value.
		 */
		flatMap<R1, O1, E1, A, R2, O2, E2, B>(
			this: Kind<F, R1, O1, E1, A>,
			f: (a: A) => Kind<F, R2, O2, E2, B>,
		): Kind<F, R1 & R2, O1 | O2, E1 | E2, B>

		/**
		 * "flatten" a nested `F` of `F` structure into a single-layer `F` structure.
		 *
		 * @template R2, O2, E2, R1, O1, E1, A
		 * @this {Kind<F, R2, O2, E2, Kind<F, R1, O1, E1, A>>} - The context holding the nested structure.
		 * @returns A new context with a single-layer structure.
		 * @remarks
		 * This is also commonly called `join`.
		 */
		flatten<R2, O2, E2, R1, O1, E1, A>(
			this: Kind<F, R2, O2, E2, Kind<F, R1, O1, E1, A>>,
		): Kind<F, R1 & R2, O1 | O2, E1 | E2, A>
	}

	/**
	 * Pipeable interface for TypeClass
	 * @template F TypeLambda
	 */
	export interface Pipeable<F extends TypeLambda> extends TypeClass<F> {
		/**
		 * Returns a function that applies `flatMap` to a value within the context.
		 *
		 * @template A, R2, O2, E2, B
		 * @param f - The function to apply.
		 * @returns A function that takes a context and returns a new context with the transformed value.
		 */
		readonly flatMap: <A, R2, O2, E2, B>(
			f: (a: A) => Kind<F, R2, O2, E2, B>,
		) => <R1, O1, E1>(self: Kind<F, R1, O1, E1, A>) => Kind<F, R1 & R2, O1 | O2, E1 | E2, B>

		/**
		 * Returns a function that flattens a nested `F` of `F` structure into a single-layer `F` structure.
		 *
		 * @template R2, O2, E2, R1, O1, E1, A
		 * @param self - The context holding the nested structure.
		 * @returns A new context with a single-layer structure.
		 * @remarks
		 * This method is also known as `join`.
		 */
		readonly flatten: <R2, O2, E2, R1, O1, E1, A>(
			self: Kind<F, R2, O2, E2, Kind<F, R1, O1, E1, A>>,
		) => Kind<F, R1 & R2, O1 | O2, E1 | E2, A>
	}
}
