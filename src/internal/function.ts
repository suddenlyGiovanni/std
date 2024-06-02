// deno-lint-ignore-file ban-types

/**
 * Pipes the value of an expression into a pipeline of functions.
 *
 * This is useful in combination with data-last functions as a simulation of methods:
 *
 * ```
 * as.map(f).filter(g) -> pipe(as, map(f), filter(g))
 * ```
 *
 * @example
 * ```ts
 * import { assertStrictEquals } from 'jsr:@std/assert'
 * import { pipe } from './function.ts'
 *
 * const length = (s: string): number => s.length
 * const double = (n: number): number => n * 2
 * const decrement = (n: number): number => n - 1
 *
 * assertStrictEquals(
 * 			pipe(
 * 				length('hello'),
 * 				double,
 * 				decrement
 * 			),
 * 			9
 * 		)
 * ```
 */
export function pipe<A>(a: A): A

/**
 * @inheritdoc
 */
export function pipe<A, B>(a: A, ab: (a: A) => B): B

/** @inheritdoc */
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C

/** @inheritdoc */
export function pipe<A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D

/** @inheritdoc */
export function pipe<A, B, C, D, E>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
): E

/** @inheritdoc */
export function pipe<A, B, C, D, E, F>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
): F

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
): G

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
): H

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
): I

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
): J

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
): K

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
): L

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
	lm: (l: L) => M,
): M

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
	lm: (l: L) => M,
	mn: (m: M) => N,
): N

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
	lm: (l: L) => M,
	mn: (m: M) => N,
	no: (n: N) => O,
): O

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
	lm: (l: L) => M,
	mn: (m: M) => N,
	no: (n: N) => O,
	op: (o: O) => P,
): P

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
	lm: (l: L) => M,
	mn: (m: M) => N,
	no: (n: N) => O,
	op: (o: O) => P,
	pq: (p: P) => Q,
): Q

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
	lm: (l: L) => M,
	mn: (m: M) => N,
	no: (n: N) => O,
	op: (o: O) => P,
	pq: (p: P) => Q,
	qr: (q: Q) => R,
): R

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
	lm: (l: L) => M,
	mn: (m: M) => N,
	no: (n: N) => O,
	op: (o: O) => P,
	pq: (p: P) => Q,
	qr: (q: Q) => R,
	rs: (r: R) => S,
): S

/** @inheritdoc */
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
	fg: (f: F) => G,
	gh: (g: G) => H,
	hi: (h: H) => I,
	ij: (i: I) => J,
	jk: (j: J) => K,
	kl: (k: K) => L,
	lm: (l: L) => M,
	mn: (m: M) => N,
	no: (n: N) => O,
	op: (o: O) => P,
	pq: (p: P) => Q,
	qr: (q: Q) => R,
	rs: (r: R) => S,
	st: (s: S) => T,
): T

/** @inheritdoc */
export function pipe<A>(...args: readonly [A, ...Function[]]): unknown {
	const [a, ...fns] = args
	switch (fns.length) {
		case 0:
			return a
		case 1:
			return fns[0](a)
		case 2:
			return fns[1](fns[0](a))
		case 3:
			return fns[2](fns[1](fns[0](a)))
		case 4:
			return fns[3](fns[2](fns[1](fns[0](a))))
		case 5:
			return fns[4](fns[3](fns[2](fns[1](fns[0](a)))))
		case 6:
			return fns[5](fns[4](fns[3](fns[2](fns[1](fns[0](a))))))
		case 7:
			return fns[6](fns[5](fns[4](fns[3](fns[2](fns[1](fns[0](a)))))))
		case 8:
			return fns[7](fns[6](fns[5](fns[4](fns[3](fns[2](fns[1](fns[0](a))))))))
		case 9:
			return fns[8](fns[7](fns[6](fns[5](fns[4](fns[3](fns[2](fns[1](fns[0](a)))))))))
		default: {
			let ret = a

			for (const fn of fns) {
				ret = fn(ret)
			}
			return ret
		}
	}
}
