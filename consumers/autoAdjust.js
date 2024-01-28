/**
 * Automatically adjusts the grid layout based on the provided parameters.
 *
 * @param {Object} options - The options object containing parameters for grid adjustment.
 * @param {number} options.n - The number of participants in the grid.
 * @param {Object} options.parameters - Additional parameters required for adjustment.
 * @param {string} options.parameters.eventType - The type of the event (e.g., 'broadcast', 'chat', 'conference').
 * @param {boolean} options.parameters.shareScreenStarted - Indicates whether screen sharing has started.
 * @param {boolean} options.parameters.shared - Indicates whether content is being shared.
 * @returns {Promise<Array<number>>} - A Promise that resolves with an array containing two values: val1 and val2.
 */
export async function autoAdjust({ n, parameters }) {

  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams()

  // Extract specific parameters from the parameters object
  let {
    eventType,
    shareScreenStarted,
    shared,
    shareScreen,
  } = parameters;

  // Default values
  let val1 = 6;
  let val2 = 12 - val1;

  // Calculate percentage values
  let cal1 = Math.floor((val1 / 12) * 100);
  let cal2 = 100 - cal1;

  // Adjust values based on eventType and other conditions
  if (eventType === 'broadcast') {
    val1 = 0;
    val2 = 12 - val1;
  } else if (eventType === 'chat' || (eventType === 'conference' && !(shareScreenStarted || shared))) {
    val1 = 12;
    val2 = 12 - val1;
  } else {
    if (shareScreenStarted || shared) {
      val2 = 10;
      val1 = 12 - val2;
    } else {
      // Adjust values based on the number of participants (n)
      if (n === 0) {
        val1 = 1;
        val2 = 12 - val1;
      } else if (n >= 1 && n < 4) {
        val1 = 4;
        val2 = 12 - val1;
      } else if (n >= 4 && n < 6) {
        val1 = 6;
        val2 = 12 - val1;
      } else if (n >= 6 && n < 9) {
        val1 = 6;
        val2 = 12 - val1;
      } else if (n >= 9 && n < 12) {
        val1 = 6;
        val2 = 12 - val1;
      } else if (n >= 12 && n < 20) {
        val1 = 8;
        val2 = 12 - val1;
      } else if (n >= 20 && n < 50) {
        val1 = 8;
        val2 = 12 - val1;
      } else {
        val1 = 10;
        val2 = 12 - val1;
      }
    }
  }

  // Return an array with adjusted values
  return [val1, val2];
}
