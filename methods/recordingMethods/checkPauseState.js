/**
 * Checks whether the user is allowed to pause recording based on predefined limits.
 * @async
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables and functions.
 * @param {string} parameters.recordingMediaOptions - The selected recording media option (e.g., 'video' or 'audio').
 * @param {number} parameters.recordingVideoPausesLimit - The maximum number of allowed video pauses.
 * @param {number} parameters.recordingAudioPausesLimit - The maximum number of allowed audio pauses.
 * @param {number} parameters.pauseRecordCount - The current count of pause actions during recording.
 * @param {Function} parameters.showAlert - Function to show an alert message.
 * @returns {Promise<boolean>} - A Promise that resolves to `true` if the user can pause recording, and `false` otherwise.
 */
export const checkPauseState = async function ({parameters}) {
    // check if the user can pause recording
    let {
      recordingMediaOptions,
      recordingVideoPausesLimit,
      recordingAudioPausesLimit,
      pauseRecordCount,
      showAlert
    } = parameters;

    // function to check if the user can pause recording
    let ref_limit = 0;
    if (recordingMediaOptions == 'video') {
      ref_limit = recordingVideoPausesLimit;
    } else {
      ref_limit = recordingAudioPausesLimit;
    }

    if (pauseRecordCount < ref_limit) {
      return true;
    } else {
        if (showAlert) {
            showAlert({
            message: 'You have reached the limit of pauses - you can choose to stop recording.',
            type: 'danger',
            duration: 3000,
            });
        }
      return false;
    }
  }
