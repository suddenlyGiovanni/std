import { describe, it } from 'jsr:@std/testing/bdd'
import { pipe } from '../internal/function.ts'
import { Option, type OptionTypeLambda } from '../option/option.ts'

import { Util } from '../test/utils.ts'
import * as _ from './covariant.ts'

describe('Covariant', () => {
	it('imap', () => {
		const f = _.imap<OptionTypeLambda>(Option.map)(
			(s: string) => [s],
			([s]) => s,
		)
		Util.deepStrictEqual(pipe(Option.None<string>(), f), Option.None())
		Util.deepStrictEqual(pipe(Option.of('a'), f), Option.of(['a']))
	})
})
