import type { Semigroup } from './semigroup.ts'

/**
 * Monoid extends the power of Semigroup by providing an additional empty value.
 *
 * This empty value should be an identity for the combine operation, which means the following equalities hold for any choice of x.
 * `combine(x, empty) = combine(empty, x) = x`
 *
 * @example
 * Int monoid instance
 * ```ts
 * import { assertStrictEquals } from 'jsr:@std/assert'
 * import type { Monoid } from './monoid.ts'
 * import type { Semigroup } from './semigroup.ts'

 *
 * class IntMonoid implements Monoid<number> {
 * 	combineMany(self: number, collection: Iterable<number>): number {
 * 		return [self, ...collection].reduce(this.combine)
 * 	}
 *
 * 	combine(self: number, that: number): number {
 * 		return self + that
 * 	}
 *
 * 	readonly empty: number = 0
 * }
 *
 * const monoidInt = new IntMonoid()
 *
 * const a = 1
 * assertStrictEquals(monoidInt.combine(a, monoidInt.empty), monoidInt.combine(monoidInt.empty, a))
 * assertStrictEquals(monoidInt.combine(monoidInt.empty, a), a)
 * ```
 */
export interface Monoid<A> extends Semigroup<A> {
	/**
	 * Identity element for the combine operation.
	 *
	 * @remarks
	 * for Monoid<number> it would be `0` as `0 + x = x + 0 = x`
	 * for Monoid<string> it would be `''` as `'' + x = x + '' = x`
	 */
	readonly empty: A
}
