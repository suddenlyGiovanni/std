import type { Kind, TypeClass, TypeLambda } from '../internal/hkt.ts'

/**
 * The `Of` type class is used to lifts any value into a context.
 *
 * | Name            | Given | To          |
 * |-----------------|-------|-------------|
 * | **of**          | `A`   | `F<A>`      |
 * | ~ofComposition~ | ~`A`~ | ~`F<G<A>>`~ |
 * | ~unit~          |       | ~`F<void>`~ |
 * | ~Do~            |       | ~`F<{}>`~   |
 *
 * @module
 * @category typeclass
 */
export declare namespace Of {
	/**
	 * This is a Pipeable interface for TypeLambda.
	 */
	export interface Pipeable<F extends TypeLambda> extends TypeClass<F> {
		/**
		 * Lifts a value into the context.
		 * @tpeParam A
		 * @param  a - The value to lift into the context.
		 * @returns the value lifted into the context.
		 */
		of<A>(a: A): Kind<F, unknown, never, never, A>
	}
}
