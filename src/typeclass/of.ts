import type { Kind, TypeClass, TypeLambda } from '../internal/hkt.ts'

export interface OfPipeable<F extends TypeLambda> extends TypeClass<F> {
	new <A, In, Out2, Out1>(): Kind<F, In, Out2, Out1, A>

	readonly of: <A>(a: A) => Kind<F, unknown, never, never, A>
}
