// deno-lint-ignore-file no-explicit-any
import { assertEquals } from 'jsr:@std/assert'

import { pipe } from '../internal/function.ts'
import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { SemiProduct } from './semi-product.ts'

/**
 * Represents a class that implements the Semigroupal laws.
 * @typeparam F - The type lambda.
 */
export class SemiProductLaws<F extends TypeLambda> {
	#assertEqualStrategy: <T>(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		actual: Kind<F, any, any, any, T>,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		expected: Kind<F, any, any, any, T>,
	) => void
	readonly #F: SemiProduct.Pipeable<F>

	/**
	 * instantiate assertion laws for the given covariant instance
	 */
	public constructor(
		F: SemiProduct.Pipeable<F>,
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
	 * Asserts the associativity law for a given type constructor `F`.
	 *
	 * @param Fa - The first value of type `F`.
	 * @param Fb - The second value of type `F`.
	 * @param Fc - The third value of type `F`.
	 */
	public assertAssociativity<InA, InB, InC, Out2A, Out2B, Out2C, Out1A, Out1B, Out1C, A, B, C>(
		Fa: Kind<F, InA, Out2A, Out1A, A>,
		Fb: Kind<F, InB, Out2B, Out1B, B>,
		Fc: Kind<F, InC, Out2C, Out1C, C>,
	): void {
		const lhs: Kind<
			F,
			InA & InB & InC,
			Out2A | Out2B | Out2C,
			Out1A | Out1B | Out1C,
			[A, [B, C]]
		> = this.#F.product(Fa, this.#F.product(Fb, Fc))

		const rhs: Kind<
			F,
			InA & InB & InC,
			Out2A | Out2B | Out2C,
			Out1A | Out1B | Out1C,
			[[A, B], C]
		> = this.#F.product(this.#F.product(Fa, Fb), Fc)

		this.#assertEqualStrategy(
			pipe(
				lhs,
				this.#F.imap(
					([a, [b, c]]: [A, [B, C]]): [A, B, C] => [a, b, c],
					([a, b, c]): [A, [B, C]] => [a, [b, c]],
				),
			),
			pipe(
				rhs,
				this.#F.imap(
					([[a, b], c]: [[A, B], C]): [A, B, C] => [a, b, c],
					([a, b, c]: [A, B, C]): [[A, B], C] => [[a, b], c],
				),
			),
		)
	}
}
