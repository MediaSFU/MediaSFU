/**
 * Compares the current activeNames with the previous activeNames and triggers an action if there are changes.
 *
 * @param {Object} options - The options object.
 * @param {number} options.t_stamp - The timestamp associated with the comparison.
 * @param {boolean} [options.restart=false] - Indicates whether to restart the comparison.
 * @param {Object} options.parameters - The parameters object containing state and utility functions.
 * @param {Array} options.parameters.activeNames - The current array of active participant names.
 * @param {Array} options.parameters.prevActiveNames - The array of previous active participant names.
 * @param {Function} options.parameters.updateActiveNames - Function to update the current activeNames.
 * @param {Function} options.parameters.updatePrevActiveNames - Function to update the previous activeNames.
 * @param {Function} options.parameters.trigger - Function to trigger an action on changes.
 * @throws Throws an error if an issue occurs during the comparison.
 */
export async function compareActiveNames({ t_stamp, restart = false, parameters }) {
  try {

    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams();

    
    let {
      activeNames,
      prevActiveNames,
      updateActiveNames,
      updatePrevActiveNames,

      //mediasfu functions
      trigger,
    } = parameters;

    // Restart the comparison if needed
    if (restart) {
      await trigger({ref_ActiveNames:activeNames,t_stamp, parameters });
      return;
    }

    // Array to track changes in activeNames
    let nameChanged = [];

    // Compare each name in activeNames
    for (let i = 0; i < activeNames.length; i++) {
      const currentName = await activeNames[i];

      // Check if the name is present in prevActiveNames
      const hasNameChanged = await !prevActiveNames.includes(currentName);

      if (hasNameChanged) {
        await nameChanged.push(true);
        trigger({ref_ActiveNames:activeNames,t_stamp, parameters });
        break;
      }
    }

    // Count the number of true in nameChanged
    let count = nameChanged.filter((value) => value === true).length;

    if (count < 1) {
      // Check for new names in prevActiveNames
      for (let i = 0; i < prevActiveNames.length; i++) {
        const currentName = await prevActiveNames[i];

        // Check if the name is present in activeNames
        const hasNameChanged = await !activeNames.includes(currentName);

        // Signal change if the name is new
        if (hasNameChanged) {
          trigger({ref_ActiveNames:activeNames,t_stamp, parameters });
          break;
        }
      }
    }

    // Update prevActiveNames with current activeNames
    prevActiveNames = await [...activeNames];
    updatePrevActiveNames(prevActiveNames);
  } catch (error) {
    console.log('compareActiveNames error', error);
    // throw error;
  }
}
