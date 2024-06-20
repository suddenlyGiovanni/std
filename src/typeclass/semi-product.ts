import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { Invariant } from './invariant.ts'

/**
 * SemiProduct, also know Semigroupal, captures the idea of composing independent effectful values.
 * It is of particular interest when taken together with **Functor** - where Functor
 * captures the idea of applying a unary pure function to an effectful value,
 * calling `product` with `map` allows one to apply a function of arbitrary arity to multiple
 * independent effectful values.
 *
 * > [!NOTE]
 * > While {@linkcode Semigroup} allows us to join values, {@linkcode SemiProduct} or Semigroupal allows us to join
 * > contexts.
 *
 * @alias Semigroupal
 */
export declare namespace SemiProduct {
	/**
	 * Fluent interface API for SemiProduct type class
	 */
	export interface Fluent<F extends TypeLambda> extends Invariant.Fluent<F> {
		/**
		 * Combine an F<A> and an F<B> into an F<[A, B]> that maintains the effects of both `fa` and `fb`.
		 */
		product<R1, O1, E1, A, R2, O2, E2, B>(
			this: Kind<F, R1, O1, E1, A>,
			that: Kind<F, R2, O2, E2, B>,
		): Kind<F, R1 & R2, O1 | O2, E1 | E2, [A, B]>

		/**
		 * Combines an `F<A>` from 'self' and an iterable collection of `F<A>` into an `F<[A, ...Array<A>]>`.
		 * This preserves the effects of 'self' and each element in 'collection'.
		 */
		productMany<R, O, E, A>(
			this: Kind<F, R, O, E, A>,
			collection: Iterable<Kind<F, R, O, E, A>>,
		): Kind<F, R, O, E, [A, ...Array<A>]>
	}

	/**
	 * Pipeable interface API for SemiProduct type class
	 */
	export interface Pipeable<F extends TypeLambda> extends Invariant.Pipeable<F> {
		/**
		 * Combine an F<A> and an F<B> into an F<[A, B]> that maintains the effects of both `fa` and `fb`.
		 */
		product<R1, O1, E1, A, R2, O2, E2, B>(
			self: Kind<F, R1, O1, E1, A>,
			that: Kind<F, R2, O2, E2, B>,
		): Kind<F, R1 & R2, O1 | O2, E1 | E2, [A, B]>

		/**
		 * Combines an `F<A>` from 'self' and an iterable collection of `F<A>` into an `F<[A, ...Array<A>]>`.
		 * This preserves the effects of 'self' and each element in 'collection'.
		 */
		productMany<R, O, E, A>(
			self: Kind<F, R, O, E, A>,
			collection: Iterable<Kind<F, R, O, E, A>>,
		): Kind<F, R, O, E, [A, ...Array<A>]>
	}

	/**
	 * Utility type alias to simplify the type signature of the `product` method *
	 */
	export type TypeClass<F extends TypeLambda> = Fluent<F> & Pipeable<F>
}
