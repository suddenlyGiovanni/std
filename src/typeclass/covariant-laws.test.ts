import { assertEquals } from 'jsr:@std/assert'
import { describe, it } from 'jsr:@std/testing/bdd'

import { flow, identity, pipe } from '../internal/function.ts'
import type { Kind, TypeLambda } from '../internal/hkt.ts'
import { Option } from '../option/option.ts'
import { Util } from '../test/utils.ts'
import { Covariant } from './covariant.ts'

/**
 * Represents a class that implements the Covariant laws.
 * @typeparam F - The type lambda.
 */

// biome-ignore lint/suspicious/noExportsInTest: <explanation>
export class CovariantLaws<F extends TypeLambda> {
	/**
	 * instantiate assertion laws for the given covariant instance
	 */
	public constructor(private readonly F: Covariant.Pipeable<F>) {}

	/**
	 * Mapping the identity function over every item in a container has no effect.
	 */
	public assertIdentity<In, Out2, Out1, A>(fa: Kind<F, In, Out2, Out1, A>): void {
		assertEquals(pipe(fa, this.F.map(identity)), fa)
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
		ab: (a: A) => B,
		bc: (b: B) => C,
	): void {
		assertEquals(
			pipe(Fa, this.F.map(ab), this.F.map(bc)), //
			pipe(Fa, this.F.map(flow(ab, bc))),
		)
	}
}

describe('Covariant', () => {
	it('imap', () => {
		const f = Covariant.imap<Option.TypeLambda>(Option.map)(
			(s: string) => [s],
			([s]) => s,
		)
		Util.deepStrictEqual(pipe(Option.None<string>(), f), Option.None())
		Util.deepStrictEqual(pipe(Option.of('a'), f), Option.of(['a']))
	})
})
