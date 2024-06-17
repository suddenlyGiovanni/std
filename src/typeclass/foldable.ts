import type { Kind, TypeClass, TypeLambda } from '../internal/hkt.ts'

/**
 * Data structures that can be folded to a summary value.
 *
 * Consider a simple list like `List(1, 2, 3)`. You could `sum` the numbers of this list using `reduce` where `0` is the
 * starting value (b) and integer addition (+) is the combination operation (f). Since reduce is left-associative,
 * the execution of this fold would look something like `((0 + 1) + 2) + 3`.
 */
export declare namespace Foldable {
	/**
	 * Fluent interface for Foldable type-class
	 * @template F TypeLambda
	 */
	export interface Fluent<F extends TypeLambda> extends TypeClass<F> {
		/**
		 * Reduces the values within the context to a single value.
		 *
		 * @template R, O, E, A, B
		 * @param b - The initial value of type B.
		 * @param f - The combining function from B to B.
		 * @returns The final value.
		 * @this Kind<F, R, O, E, A> - The context on which to reduce the values.
		 */
		reduce<R, O, E, A, B>(this: Kind<F, R, O, E, A>, b: B, f: (b: B, a: A) => B): B
	}

	/**
	 * Fluent interface for Pipable type-class
	 * @template F TypeLambda
	 */
	export interface Pipable<F extends TypeLambda> extends TypeClass<F> {
		/**
		 * Apply a binary function to a given initial value and each element of a container to reduce it to a single value.
		 *
		 * @template A - The type of elements in the container
		 * @template B - The type of accumulated value for reduction
		 * @param b - The initial value for reduction
		 * @param f - The binary function to apply for reduction. It takes the accumulated value `b` and the current value `a` of the container and outputs a new accumulated value.
		 * @returns A curried function that takes a container of type `Kind<F, R, O, E, A>` and reduces it to a single value of type `B`.
		 */
		reduce<A, B>(b: B, f: (b: B, a: A) => B): <R, O, E>(self: Kind<F, R, O, E, A>) => B
	}
}
