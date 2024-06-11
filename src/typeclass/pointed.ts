import type { TypeLambda } from '../internal/hkt.ts'
import type { Covariant } from './covariant.ts'
import type { Of } from './of.ts'

export declare namespace Pointed {
	export interface Pipeable<F extends TypeLambda> extends Covariant.Pipeable<F>, Of.Pipeable<F> {}
	export interface Fluent<F extends TypeLambda> extends Covariant.Fluent<F> {}
}
