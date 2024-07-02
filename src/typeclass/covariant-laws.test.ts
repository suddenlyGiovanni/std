// deno-lint-ignore-file no-explicit-any
import { assertEquals } from 'jsr:@std/assert'

import { identity, pipe } from '../internal/function.ts'
import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { Covariant } from './covariant.ts'

/**
 * Represents a class that implements the Covariant laws.
 * @typeparam F - The type lambda.
 */
export class CovariantLaws<F extends TypeLambda> {
	readonly #F: Covariant.Pipeable<F>

	readonly #assertEqualStrategy: <T>(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		actual: Kind<F, any, any, any, T>,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		expected: Kind<F, any, any, any, T>,
	) => void

	/**
	 * instantiate assertion laws for the given covariant instance
	 */
	public constructor(
		F: Covariant.Pipeable<F>,
		assertEqualStrategy: <T>(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			actual: Kind<F, any, any, any, T>,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			expected: Kind<F, any, any, any, T>,
		) => void = assertEquals,
	) {
		this.#F = F
		this.#assertEqualStrategy = assertEqualStrategy
	}

	/**
	 * Mapping the identity function over every item in a container has no effect.
	 */
	public assertIdentity<In, Out2, Out1, A>(fa: Kind<F, In, Out2, Out1, A>): void {
		this.#assertEqualStrategy(pipe(fa, this.#F.map(identity)), fa)
	}

	/**
	 * Mapping a composition of two functions over every item in a container is the same as first mapping one
	 * function, and then mapping the other.
	 *
	 * ```scala
	 * def covariantComposition[A, B, C](fa: F[A], f: A => B, g: B => C): IsEq[F[C]] =
	 *     fa.map(f).map(g) <-> fa.map(f.andThen(g))
	 * ```
	 */
	public assertComposition<In, Out2, Out1, A, B, C>(
		Fa: Kind<F, In, Out2, Out1, A>,
		f: (a: A) => B,
		g: (b: B) => C,
	): void {
		this.#assertEqualStrategy(
			pipe(Fa, this.#F.map(f), this.#F.map(g)),
			pipe(
				Fa,
				this.#F.map((a) => g(f(a))),
			),
		)
	}
}
