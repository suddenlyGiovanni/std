import type { TypeLambda } from '../internal/hkt.ts'
import type { Covariant } from './covariant.ts'
import type { Of } from './of.ts'

/**
 * The Pointed namespace provides interfaces for working with type classes that have both Covariant and Of capabilities.
 */
export declare namespace Pointed {
	/**
	 * Pipeable interface for Pointed type class, extending the functionalities of Covariant.Pipeable and Of.Pipeable.
	 * @template F TypeLambda
	 */
	export interface Pipeable<F extends TypeLambda> extends Covariant.Pipeable<F>, Of.Pipeable<F> {}

	/**
	 * Fluent interface for Pointed type class, extending the functionalities of Covariant.Fluent.
	 * @template F TypeLambda
	 */
	export interface Fluent<F extends TypeLambda> extends Covariant.Fluent<F> {}
}
