import { assertEquals } from 'jsr:@std/assert'

import { flow, identity, pipe, tap } from '../internal/function.ts'
import type { Kind, TypeLambda } from '../internal/hkt.ts'
import type { Invariant } from './invariant.ts'

/**
 * Represents a class that implements the invariant laws.
 * @typeparam F - The type lambda.
 */
export class InvariantLaws<F extends TypeLambda> {
	/**
	 * instantiate assertion laws for the given invariant instance
	 */
	public constructor(private readonly F: Invariant.Pipeable<F>) {}

	/**
	 * Asserts that the given method returns the same value when passed through identity mapping.
	 *
	 * ```scala
	 * def invariantIdentity[A](fa: F[A]): IsEq[F[A]] = fa.imap(identity[A])(identity[A]) <-> fa
	 * ```
	 */
	public assertIdentity<In, Out2, Out1, A>(fa: Kind<F, In, Out2, Out1, A>): void {
		assertEquals(pipe(fa, this.F.imap(identity, identity)), fa)
	}

	/**
	 * Asserts the Invariant Composition Law for a given type constructor `F`.
	 *
	 * ```scala
	 *  def invariantComposition[A, B, C](fa: F[A], f1: A => B, f2: B => A, g1: B => C, g2: C => B): IsEq[F[C]] =
	 *     fa.imap(f1)(f2).imap(g1)(g2) <-> fa.imap(g1.compose(f1))(f2.compose(g2))
	 * ```
	 */
	public assertComposition<In, Out2, Out1, A, B, C>(
		fa: Kind<F, In, Out2, Out1, A>,
		f1: (a: A) => B,
		f2: (b: B) => A,
		g1: (b: B) => C,
		g2: (c: C) => B,
	): void {
		console.group('Invariant Composition Law')

		const lhs = pipe(
			fa,
			tap((_fa) => {
				console.group('left hand side:')
				console.log('Fa:', _fa.toString())
			}),
			this.F.imap(f1, f2),
			tap((fb) => console.log('Fb:', fb.toString())),
			this.F.imap(g1, g2),
			tap((fc) => {
				console.log('Fc:', fc.toString())
				console.groupEnd()
			}),
		)

		const rhs = pipe(
			fa,
			tap((_fa) => {
				console.group('right hand side:')
				console.log('Fa:', _fa.toString())
			}),
			this.F.imap(flow(f1, g1), flow(g2, f2)),
			tap((fc) => {
				console.log('Fc:', fc.toString())
				console.groupEnd()
			}),
		)

		console.groupEnd()
		assertEquals(lhs, rhs)
	}
}
