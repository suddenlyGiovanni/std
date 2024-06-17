import type { TypeLambda } from '../internal/hkt.ts'
import type { FlatMap } from './flat-map.ts'
import type { Pointed } from './pointed.ts'

/**
 * Monad.
 * > "A monad is just a monoid in the category of endofunctors"
 *
 * The equivalent definition of a monad is a **monad** is an *endofunctor* **F** (a *functor* mapping a
 * *category* to itself), together with two *natural transformations* required to fulfil certain
 * *coherence conditions* (aka laws).
 *
 * Monads have two operations:
 * - `of` |`pure` | `return` - `v → F(v)` = Lifts a value into the monadic type.
 *
 * - `flatMap` | `join` - `F(F(v)) → F(v)` = Means that we can join/flatten the two containers in one; Chains
 * together functions that return a monadic type.
 *
 *
 *
 * Allows composition of dependent effectful functions.
 * See: {@link http://homepages.inf.ed.ac.uk/wadler/papers/marktoberdorf/baastad.pdf|Monads for functional programming}
 *
 * Must obey the following laws:
 * - Left Identity:
 * Given `a` is `A` value and `f` is a function that returns a monadic type `f: (a:A) => F<B>`.
 * Then `F.of(a).flatMap(f) === f(a)`.
 *
 * - Right Identity:
 * Given `fa` is a monadic type `F<A>`.
 * Then `fa.flatMap(F.of) === fa`.
 *
 * - Associativity:
 * Given `fa` is a monadic type `F<A>` and `f` and `g` are functions that return a monadic type `f: (a:A) => F<B>` and `g: (b:B) => F<C>`.
 * Then `fa.flatMap(f).flatMap(g) === fa.flatMap(a => f(a).flatMap(g))`.
 *
 */
export declare namespace Monad {
	/**
	 * Fluent interface for Monad type-class
	 * @template F TypeLambda
	 */
	export interface Fluent<F extends TypeLambda> extends FlatMap.Fluent<F>, Pointed.Fluent<F> {}

	/**
	 * Pipeable interface for Monad type-class
	 * @template F TypeLambda
	 */
	export interface Pipeable<F extends TypeLambda>
		extends FlatMap.Pipeable<F>,
			Pointed.Pipeable<F> {}
}
