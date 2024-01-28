/**
 * Delays the execution of the code for the specified duration.
 * @function
 * @async
 * @param {number} ms - The duration to delay in milliseconds.
 * @returns {Promise<void>} - A Promise that resolves after the specified duration.
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
