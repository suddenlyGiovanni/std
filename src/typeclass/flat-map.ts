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
		 * flatMap method
		 * @template R1, O1, E1, A, R2, O2, E2, B
		 */
		flatMap<R1, O1, E1, A, R2, O2, E2, B>(
			this: Kind<F, R1, O1, E1, A>,
			f: (a: A) => Kind<F, R2, O2, E2, B>,
		): Kind<F, R1 & R2, O1 | O2, E1 | E2, B>
	}

	/**
	 * Pipeable interface for TypeClass
	 * @template F TypeLambda
	 */
	export interface Pipeable<F extends TypeLambda> extends TypeClass<F> {
		/**
		 * readonly flatMap method
		 * @template A, R2, O2, E2, B
		 */
		readonly flatMap: <A, R2, O2, E2, B>(
			f: (a: A) => Kind<F, R2, O2, E2, B>,
		) => <R1, O1, E1>(self: Kind<F, R1, O1, E1, A>) => Kind<F, R1 & R2, O1 | O2, E1 | E2, B>
	}
}
