import type { Kind, TypeClass, TypeLambda } from '../internal/hkt.ts'

export interface InvariantFluent<F extends TypeLambda> extends TypeClass<F> {
	imap<R, O, E, A, B>(
		this: Kind<F, R, O, E, A>,
		to: (a: A) => B,
		from: (b: B) => A,
	): Kind<F, R, O, E, B>
}

export interface InvariantPipeable<F extends TypeLambda> extends TypeClass<F> {
	imap<A, B>(
		to: (a: A) => B,
		from: (b: B) => A,
	): <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
}

export type Invariant<F extends TypeLambda> = InvariantFluent<F> & InvariantPipeable<F>
