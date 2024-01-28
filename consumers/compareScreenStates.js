/**
 * Compares the current screen states with the previous screen states and triggers actions or events on changes.
 *
 * @param {Object} options - The options object.
 * @param {number} options.t_stamp - The timestamp associated with the comparison.
 * @param {boolean} [options.restart=false] - Indicates whether to restart the comparison.
 * @param {Object} options.parameters - The parameters object containing state and utility functions.
 * @param {string} options.parameters.recordingDisplayType - The type of display during recording ('video', 'media', 'all').
 * @param {boolean} options.parameters.recordingVideoOptimized - Indicates whether video during recording is optimized.
 * @param {Array} options.parameters.screenStates - The array of current screen states.
 * @param {Array} options.parameters.prevScreenStates - The array of previous screen states.
 * @param {Array} options.parameters.activeNames - The array of current active participant names.
 * @param {Function} options.parameters.trigger - Function to trigger actions or events on changes.
 * @throws Throws an error if an issue occurs during the comparison.
 */
export async function compareScreenStates({ t_stamp, restart = false, parameters }) {
  try {

    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams()

    let {
      recordingDisplayType,
      recordingVideoOptimized,
      screenStates,
      prevScreenStates,
      activeNames,

      //mediasfu functions
      trigger,
    } = parameters;

    // Restart the comparison if needed
    if (restart) {
      // Perform necessary actions on restart
      return;
    }
    // Compare each key-value pair in the screenStates objects
    for (let i = 0; i < screenStates.length; i++) {
      const currentScreenState = screenStates[i];
      const prevScreenState = prevScreenStates[i];

      // Check if any value has changed
      const hasChanged = Object.keys(currentScreenState).some((key) => currentScreenState[key] !== prevScreenState[key]);

      // Signal change if any value has changed
      if (hasChanged) {
        // Perform actions or trigger events based on the change
        if (recordingDisplayType === 'video') {
          if (recordingVideoOptimized) {
            trigger({ref_ActiveNames:activeNames,t_stamp, deff:true, parameters });
            break;
          }
        }
        trigger({ref_ActiveNames:activeNames,t_stamp, parameters });
        break;
      }
    }
  } catch (error) {
    console.log('compareScreenStates error', error);
    // throw error;
  }
}
