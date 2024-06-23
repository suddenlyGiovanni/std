import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { Of } from './of.ts'
import type { SemiProduct } from './semi-product.ts'

/**
 * TODO: Product type-class
 */
export declare namespace Product {
	/**
	 * Fluent interface for Product type-class
	 * @template F TypeLambda
	 */
	export interface Pipeable<F extends TypeLambda>
		extends SemiProduct.Pipeable<F>, Of.Pipeable<F> {
		/**
		 * Takes a collection of `Kind` instances and returns a new `Kind` instance that represents the product of all the values in the collection.
		 *
		 * @template R - The type of the required environment.
		 * @template O - The type of the output.
		 * @template E - The type of the possible error.
		 * @template A - The type of the values in the collection.
		 *
		 * @param {Iterable<Kind<F, R, O, E, A>>} collection - The collection of `Kind` instances to take the product of.
		 *
		 * @return {Kind<F, R, O, E, Array<A>>} - A new `Kind` instance representing the product of all the values in the collection.
		 */
		productAll<R, O, E, A>(
			collection: Iterable<Kind<F, R, O, E, A>>,
		): Kind<F, R, O, E, Array<A>>
	}
}
