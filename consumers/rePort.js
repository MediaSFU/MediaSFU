/**
 * Function to rePort the activeNames and screenStates.
 *
 * @param {Object} options - The options object.
 * @param {boolean} options.restart - Indicates if it's a restart.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {string} options.parameters.islevel - The user level.
 * @param {string} options.parameters.mainScreenPerson - The person on the main screen.
 * @param {boolean} options.parameters.adminOnMainScreen - Indicates if admin is on the main screen.
 * @param {boolean} options.parameters.mainScreenFilled - Indicates if the main screen is filled.
 * @param {boolean} options.parameters.recordStarted - Indicates if recording started.
 * @param {boolean} options.parameters.recordStopped - Indicates if recording stopped.
 * @param {boolean} options.parameters.recordPaused - Indicates if recording paused.
 * @param {boolean} options.parameters.recordResumed - Indicates if recording resumed.
 * @param {Function} options.parameters.compareActiveNames - Function to compare active names.
 * @param {Function} options.parameters.compareScreenStates - Function to compare screen states.
 * @param {Array} options.parameters.screenStates - The current screen states.
 * @param {Array} options.parameters.prevScreenStates - The previous screen states.
 * @param {Function} options.parameters.updateScreenStates - Function to update screen states.
 * @param {Function} options.parameters.updatePrevScreenStates - Function to update previous screen states.
 * @throws Throws an error if there is an issue during the process of rePorting.
 */
export async function rePort({ restart = false, parameters }) {

  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams()

  try {
    // Destructure parameters
    let {
      islevel,
      mainScreenPerson,
      adminOnMainScreen,
      mainScreenFilled,
      recordStarted,
      recordStopped,
      recordPaused,
      recordResumed,
      screenStates,
      prevScreenStates,
      updateScreenStates,
      updatePrevScreenStates,

      //mediasfu functions
      compareActiveNames,
      compareScreenStates,
    } = parameters;

    if (recordStarted || recordResumed) {
      if (recordStopped || recordPaused) {
        // Recording stopped or paused, do nothing
      } else {
        if (islevel === '2') {
          prevScreenStates = [...screenStates];
          updatePrevScreenStates(prevScreenStates);

          screenStates = [{ mainScreenPerson, adminOnMainScreen, mainScreenFilled }];
          updateScreenStates(screenStates);

          let noww = new Date();
          let t_stamp =
            noww.toISOString().replace(/[-T:]/g, '').slice(0, 8) +
            '_' +
            noww.toISOString().replace(/[-T:]/g, '').slice(8, 14);

          if (restart) {
            await compareActiveNames({ t_stamp, restart, parameters });
            return;
          }
          await compareActiveNames({ t_stamp, restart, parameters });
          await compareScreenStates({ t_stamp, restart, parameters });
        }
      }
    }
  } catch (error) {
    // Handle errors during the process of rePorting
    // throw new Error(`Error during rePorting: ${error.message}`);
    console.log('Error during rePorting: ', error);
  }
}
