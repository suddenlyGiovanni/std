import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { Invariant } from './invariant.ts'

/**
 * Covariant is a type class that abstracts over type constructors that can be mapped over.
 * Examples of such type constructors in Scala are `List`, `Option`, and `Future`.
 *
 * @remarks
 * Laws that must be obeyed by any `Functor`.
 *
 * - Identity: Mapping with the identity function is a no-op
 * `fa.map(a => a) <-> fa`
 *
 * - Composition: Mapping with `f` and then again with `g` is the same as mapping once with the composition of `f` and `g`
 * `fa.map(f).map(g) = fa.map(f.andThen(g))`
 */
export declare namespace Covariant {
	/**
	 * Fluent interface for Covariant
	 */
	export interface Fluent<F extends TypeLambda> extends Invariant.Fluent<F> {
		/**
		 * Map function for Fluent interface
		 */
		map<R, O, E, A, B>(this: Kind<F, R, O, E, A>, f: (a: A) => B): Kind<F, R, O, E, B>
	}

	/**
	 * Pipeable interface for Covariant
	 */
	export interface Pipeable<F extends TypeLambda> extends Invariant.Pipeable<F> {
		/**
		 * Map function for Pipeable interface
		 */
		map<A, B>(f: (a: A) => B): <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
	}
}

/**
 * Covariant companion object
 */
export const Covariant = {
	/**
	 * imap function for Covariant object
	 */
	imap: <F extends TypeLambda>(
		map: <A, B>(f: (a: A) => B) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>,
	): Invariant.Pipeable<F>['imap'] =>
	(self, _to) => map(self),
} as const
