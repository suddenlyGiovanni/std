/**
 * Interface that allows the implementer to customize the serialization and string representation of a boxed value
 */
export interface Inspectable {
	/**
	 * Overloads default `Object[Symbol.toStringTag]` getter allowing the implementer to return a custom string
	 *
	 * @example
	 * ```ts
	 * class BoxedV1  {}
	 *
	 * Object.prototype.toString.call(new BoxedV1()); // '[object Object]'
	 *
	 * import { type  Inspectable } from './inspectable.ts'
	 *
	 * class BoxedV2 implements Inspectable {
	 *  toString(): string {
	 *    throw new Error('Method not implemented.')
	 *  }
	 *  toJSON(): unknown {
	 *    throw new Error('Method not implemented.')
	 *  }
	 *  get [Symbol.toStringTag](): string {
	 *    return this.constructor.name
	 *  }
	 * }
	 *
	 * Object.prototype.toString.call(new BoxedV2()); // '[object BoxedV2]'
	 * ```
	 */
	readonly [Symbol.toStringTag]: string

	/**
	 * Overloads default serialization behavior when using `JSON.stringify` method
	 */
	toJSON(): unknown

	/**
	 * Overloads default {@link Object.toString } method allowing the implementer to return a
	 * custom string
	 * representation of the boxed value
	 * @returns A string representation of the boxed value
	 *
	 * @example
	 * ```ts
	 * class DogV1 {
	 *  constructor(
	 *    readonly name: string,
	 *    readonly breed: string,
	 *    readonly color: string,
	 *    readonly sex: 'male' | 'female',
	 *  ) {}
	 * }
	 * const dogV1 = new DogV1('Gabby', 'Lab', 'chocolate', 'female')
	 *
	 * console.log(dogV1.toString()) // '[object Object]'
	 * console.log(String(dogV1)) // '[object Object]'
	 *
	 * import { type  Inspectable } from './inspectable.ts'
	 *
	 * class DogV2 implements Inspectable {
	 *  constructor(
	 *    readonly name: string,
	 *    readonly breed: string,
	 *    readonly color: string,
	 *    readonly sex: 'male' | 'female',
	 *  ) {}
	 *
	 *   get [Symbol.toStringTag](): string {
	 *     throw new Error('Getter not implemented.')
	 *   }
	 *
	 *  toString(): string {
	 *     return 'Dog ' + this.name + ' is a ' + this.sex + ' ' + this.color + ' ' + this.breed;
	 *  }
	 *
	 *  toJSON(): unknown {
	 *    throw new Error('Method not implemented.')
	 *  }
	 * }
	 *
	 * const dogV2 = new DogV2('Gabby', 'Lab', 'chocolate', 'female');
	 *
	 * console.log(String(dogV2)) // 'Dog Gabby is a female chocolate Lab'
	 * ```
	 */
	toString(): string
}
