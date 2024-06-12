import type { Kind, TypeClass, TypeLambda } from '../internal/hkt.ts'

export declare namespace Foldable {
	export interface Fluent<F extends TypeLambda> extends TypeClass<F> {
		reduce<R, O, E, A, B>(this: Kind<F, R, O, E, A>, b: B, f: (b: B, a: A) => B): B
	}

	export interface Pipable<F extends TypeLambda> extends TypeClass<F> {
		reduce<A, B>(b: B, f: (b: B, a: A) => B): <R, O, E>(self: Kind<F, R, O, E, A>) => B
	}
}
