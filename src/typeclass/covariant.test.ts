import { describe, it } from 'jsr:@std/testing/bdd'

import { pipe } from '../internal/function.ts'
import { Option } from '../option/mod.ts'
import { Util } from '../test/utils.ts'
import { Covariant } from './covariant.ts'

/**
 * Represents a class that implements the Covariant laws.
 * @typeparam F - The type lambda.
 */

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
