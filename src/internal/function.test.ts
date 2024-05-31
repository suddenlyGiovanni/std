import { assertStrictEquals } from 'jsr:@std/assert@^0.225.3'
import { describe, it } from 'jsr:@std/testing@^0.224.0/bdd'

import { pipe } from './function.ts'

describe('Function', () => {
	const g = (n: number): number => n * 2
	const f = (n: number): number => n + 1

	it('pipe()', () => {
		assertStrictEquals(pipe(2), 2)
		assertStrictEquals(pipe(2, f), 3)
		assertStrictEquals(pipe(2, f, g), 6)
		assertStrictEquals(pipe(2, f, g, f), 7)
		assertStrictEquals(pipe(2, f, g, f, g), 14)
		assertStrictEquals(pipe(2, f, g, f, g, f), 15)
		assertStrictEquals(pipe(2, f, g, f, g, f, g), 30)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f), 31)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g), 62)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f), 63)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g), 126)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f), 127)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f, g), 254)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f), 255)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g), 510)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f), 511)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g), 1022)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f), 1023)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g), 2046)
		assertStrictEquals(pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f), 2047)
		assertStrictEquals(
			(pipe as any)(...[2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g]),
			4094,
		)
	})
})
