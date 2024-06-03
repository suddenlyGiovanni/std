import type { Types } from './types.ts'

export declare const URI: unique symbol

export interface TypeClass<F extends TypeLambda> {
	/**
	 * To improve inference it is necessary to mention the F parameter inside it otherwise it will be lost, we can do so by adding an optional property
	 */
	readonly [URI]?: F
}

/**
 * Type Lambdas are a way to define type-level functions in TypeScript, which are not natively supported by the language.
 *
 * A Type Lambda, like `Target -> F<Target>`, essentially defines a function that operates on types and returns other types. Let's break down this concept:
 * ```
 * Target -> Array<Target>
 * ```
 * In this example, the Type Lambda maps the input type `Target` to the output type `Array<Target>`. It's like defining a rule that transforms one type into another.
 *
 * @see https://effect.website/docs/other/behaviour/hkt#type-lambdas
 */
export interface TypeLambda {
	/**
	 * (Contravariant):
	 * This type parameter is used for contravariant operations, which means that it accepts input types that are more general or broader than the original type.
	 */
	readonly In: unknown

	/**
	 * (Covariant):
	 * Out2 represents a covariant type parameter.
	 * It allows for operations where the output type is more specific or narrower than the original type.
	 */
	readonly Out2: unknown

	/**
	 * (Covariant):
	 * Similar to Out2, Out1 is a covariant type parameter, enabling operations that result in a more specific output type.
	 */
	readonly Out1: unknown

	/**
	 * (Invariant):
	 * The Target type parameter remains invariant, meaning that it maintains the exact type as the original without any variation.
	 */
	readonly Target: unknown
}

/**
 * Represents a generic type `Kind` that can be applied to specific type arguments.
 * It allows the user to obtain the result of applying the `Kind` to a target type.
 *
 * @template F - The type parameter for the `Kind` class, can be either a concrete type or a generic type.
 * @template In - The contravariant input type.
 * @template Out2 - The covariant second output type.
 * @template Out1 - The covariant first output type.
 * @template Target - The invariant target type.
 */
export type Kind<F extends TypeLambda, In, Out2, Out1, Target> = F extends {
	readonly type: unknown
}
	? // If F has a type property, it means it is a concrete type lambda (e.g., F = ArrayTypeLambda).
		// The intersection allows us to obtain the result of applying F to Target.
		(F & {
			readonly In: In
			readonly Out2: Out2
			readonly Out1: Out1
			readonly Target: Target
		})['type']
	: // If F is generic, we must explicitly specify all of its type parameters
		// to ensure that none are omitted from type checking.
		{
			readonly F: F
			readonly In: Types.Contravariant<In>
			readonly Out2: Types.Covariant<Out2>
			readonly Out1: Types.Covariant<Out1>
			readonly Target: Types.Invariant<Target>
		}
