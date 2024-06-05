import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { InvariantFluent, InvariantPipeable } from './invariant.ts'

export interface CovariantPipeable<F extends TypeLambda> extends InvariantPipeable<F> {
	new <A, In, Out2, Out1>(): Kind<F, In, Out2, Out1, A>

	// static curried map
	readonly map: <A, B>(
		f: (a: A) => B,
	) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
}

export interface CovariantFluent<F extends TypeLambda> extends InvariantFluent<F> {
	map<R, O, E, A, B>(this: Kind<F, R, O, E, A>, f: (a: A) => B): Kind<F, R, O, E, B>
}
