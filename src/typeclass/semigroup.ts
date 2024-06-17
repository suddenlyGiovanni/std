/**
 * A semigroup is any set A with an associative operation (combine).
 *
 * @remarks
 * A semigroup is defined loosely as a **set** + a **combination function** which takes two elements of that set and
 * produces a third, still from the set.
 *
 * That’s it! That’s a semigroup. With this trait, we can then create instances of semigroups which are applicable for some types that we want to support:
 *
 * @example
 * Int semigroup instance
 * ```ts
 * import type { Semigroup } from './semigroup.ts'

 * class SemigroupInt implements Semigroup<number> {
 * 	combine(self: number, that: number): number {
 * 		return self + that
 * 	}
 *
 * 	combineMany(self: number, collection: Iterable<number>): number {
 * 		return [self, ...collection].reduce(this.combine)
 * 	}
 * }
 *
 * const semigroupInt = new SemigroupInt()
 * semigroupInt.combine(1, 2) // 3
 * semigroupInt.combineMany(1, [2, 3, 4]) // 10
 * ```
 *
 * @example
 * String semigroup instance
 * ```ts
 * import type { Semigroup } from './semigroup.ts'

 * class SemigroupString implements Semigroup<string> {
 * 	combine(self: string, that: string): string {
 * 		return self + that
 * 	}
 *
 * 	combineMany(self: string, collection: Iterable<string>): string {
 * 		return [self, ...collection].reduce(this.combine)
 * 	}
 * }
 *
 * const semigroupString = new SemigroupString()
 * semigroupString.combine('a', 'b') // 'ab'
 * semigroupString.combineMany('a', ['b', 'c', 'd']) // 'abcd'
 * ```
 */
export interface Semigroup<A> {
	/**
	 * Associative operation which combines two values.
	 */
	combine(self: A, that: A): A

	/**
	 * Combines many values.
	 */
	combineMany(self: A, collection: Iterable<A>): A
}
