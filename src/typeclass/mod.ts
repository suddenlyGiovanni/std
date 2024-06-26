/**
 * This internal module provides a collection of re-usable type classes adapted from the `Scala's Cats` library and [`@effect/typeclass`](https://github.com/Effect-TS/effect/blob/184fed83ac36cba05a75a5a8013f740f9f696e3b/packages/typeclass/README.md).
 *
 * [!IMPORTANT]
 * Credits to the original authors of the Scala Cats library and `@effect/typeclass`.
 *
 * **Parameterized Types Hierarchy**
 *
 * ```mermaid
 * flowchart TD
 *     Alternative --> SemiAlternative
 *     Alternative --> Coproduct
 *     Applicative --> Product
 *     Coproduct --> SemiCoproduct
 *     SemiAlternative --> Covariant
 *     SemiAlternative --> SemiCoproduct
 *     SemiApplicative --> SemiProduct
 *     SemiApplicative --> Covariant
 *     Applicative --> SemiApplicative
 *     Chainable --> FlatMap
 *     Chainable ---> Covariant
 *     Monad --> FlatMap
 *     Monad --> Pointed
 *     Pointed --> Of
 *     Pointed --> Covariant
 *     Product --> SemiProduct
 *     Product --> Of
 *     SemiProduct --> Invariant
 *     Covariant --> Invariant
 *     SemiCoproduct --> Invariant
 * ```
 *
 * @module
 * @internal
 */

export type { FlatMap } from './flat-map.ts'
export type { Invariant } from './invariant.ts'
export { Covariant } from './covariant.ts'
export type { Of } from './of.ts'
export type { Pointed } from './pointed.ts'
export type { Foldable } from './foldable.ts'
export type { Monad } from './monad.ts'
export type { Semigroup } from './semigroup.ts'
export type { Monoid } from './monoid.ts'
export type { SemiProduct } from './semi-product.ts'
export type { Product } from './product.ts'
