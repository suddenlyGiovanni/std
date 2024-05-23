/**
 * Check if the input is a record or an array.
 *
 * @param input - The input value to check.
 * @return - True if the input is a record or an array, false otherwise.
 * @internal
 */
export function isRecordOrArray(input: unknown): boolean {
  return typeof input === 'object' && input !== null
}
