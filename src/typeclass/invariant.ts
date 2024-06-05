import type { Kind, TypeClass, TypeLambda } from '../internal/hkt.ts'

/**
 * Must obey the laws defined in {@link cats.laws.InvariantLaws}.
 * - identity:
 * ```scala
 * def invariantIdentity[A](fa: F[A]): IsEq[F[A]] =
 *     fa.imap(identity[A])(identity[A]) <-> fa
 * ```
 * - composition:
 * ```scala
 *  def invariantComposition[A, B, C](fa: F[A], f1: A => B, f2: B => A, g1: B => C, g2: C => B): IsEq[F[C]] =
 *     fa.imap(f1)(f2).imap(g1)(g2) <-> fa.imap(g1.compose(f1))(f2.compose(g2))
 * ```
 */
export declare namespace Invariant {
	export interface Fluent<F extends TypeLambda> extends TypeClass<F> {
		imap<R, O, E, A, B>(
			this: Kind<F, R, O, E, A>,
			to: (a: A) => B,
			from: (b: B) => A,
		): Kind<F, R, O, E, B>
	}

	export interface Pipeable<F extends TypeLambda> extends TypeClass<F> {
		imap<A, B>(
			to: (a: A) => B,
			from: (b: B) => A,
		): <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
	}
}
