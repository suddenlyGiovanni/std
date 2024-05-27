/**
 * An interface containing operations for equality.
 */
export interface Equals {
	/**
	 * Checks if `this` value is equal to`that`  value.
	 * @param that - The value to compare to.
	 */
	equals(that: unknown): boolean
}
