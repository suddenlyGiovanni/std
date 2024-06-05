import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { Invariant } from './invariant.ts'

/**
 * Must obey the laws defined in {@link cats.laws.FunctorLaws}.
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
export interface CovariantFluent<F extends TypeLambda> extends Invariant.Fluent<F> {
	map<R, O, E, A, B>(this: Kind<F, R, O, E, A>, f: (a: A) => B): Kind<F, R, O, E, B>
}

export interface CovariantPipeable<F extends TypeLambda> extends Invariant.Pipeable<F> {
	new <A, In, Out2, Out1>(): Kind<F, In, Out2, Out1, A>

	// static curried map
	readonly map: <A, B>(
		f: (a: A) => B,
	) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
}

export const imap = <F extends TypeLambda>(
	map: <A, B>(f: (a: A) => B) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>,
): Invariant.Pipeable<F>['imap'] =>
(self, _to) => map(self)
