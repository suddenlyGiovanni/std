import type { Kind, TypeClass, TypeLambda } from '../internal/hkt.ts'

export declare namespace Of {
	export interface Pipeable<F extends TypeLambda> extends TypeClass<F> {
		of<A>(a: A): Kind<F, unknown, never, never, A>
	}
}
