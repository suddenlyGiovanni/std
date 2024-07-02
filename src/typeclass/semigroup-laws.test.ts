import { assertEquals } from 'jsr:@std/assert'
import type { Semigroup } from './semigroup.ts'

/**
 * Represents a class that implements the Semigroup laws.
 */
export class SemigroupLaws<A> {
	readonly #F: Semigroup<A>
	readonly #assertEquals: <T>(actual: T, expected: T) => void

	/**
	 * instantiate assertion laws for the given covariant instance
	 */
	public constructor(
		F: Semigroup<A>,
		_assertEquals: <T>(actual: T, expected: T) => void = assertEquals,
	) {
		this.#F = F
		this.#assertEquals = _assertEquals
	}

	/**
	 * `( a ⊕ b ) ⊕ c = a ⊕ ( b ⊕ c )`
	 * For example, the natural numbers under addition form a semigroup: the sum of any two natural numbers is a natural number, and
	 * `( a + b ) + c = a + ( b + c )` for any natural numbers a,b,and c.
	 */
	public assertAssociativity(a: A, b: A, c: A): void {
		const lhs = this.#F.combine(this.#F.combine(a, b), c)
		const rhs = this.#F.combine(a, this.#F.combine(b, c))
		this.#assertEquals(lhs, rhs)
	}
}
