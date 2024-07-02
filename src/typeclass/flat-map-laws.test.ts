import { assertEquals } from 'jsr:@std/assert'

import { pipe } from '../internal/function.ts'
import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { FlatMap } from './flat-map.ts'

/**
 * Represents a class that implements the FlatMap laws.
 * @typeparam F - The type lambda.
 */
export class FlatMapLaws<F extends TypeLambda> {
	readonly #F: FlatMap.Pipeable<F>

	readonly #assertEqualStrategy: <T>(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		actual: Kind<F, any, any, any, T>,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		expected: Kind<F, any, any, any, T>,
	) => void

	/**
	 * Instantiate assertion laws for the given FlatMap instance.
	 * @param {FlatMap.Pipeable<F>} F - The FlatMap instance.
	 * @param {Function} [assertEqualStrategy] - The strategy used to assert equality between actual and expected values. Defaults to `assertEquals`.
	 * @return {void}
	 */
	public constructor(
		F: FlatMap.Pipeable<F>,
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
	 * If ⊕ is associative, then a ⊕ (b ⊕ c) = (a ⊕ b) ⊕ c.
	 */
	public assertAssociativity<A, B, C, R1, R2, O1, O2, E1, E2>(
		fa: Kind<F, R1, O1, E1, A>,
		f: (a: A) => Kind<F, R1, O1, E1, B>,
		g: (b: B) => Kind<F, R2, O2, E2, C>,
	): void {
		const lhs = pipe(fa, this.#F.flatMap(f), this.#F.flatMap(g))
		const rhs = pipe(
			fa,
			this.#F.flatMap((a) => pipe(f(a), this.#F.flatMap(g))),
		)

		this.#assertEqualStrategy(lhs, rhs)
	}
}
