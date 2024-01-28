/**
 * Checks whether the user is allowed to resume recording based on predefined limits.
 * @async
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables.
 * @param {string} parameters.recordingMediaOptions - The selected recording media option (e.g., 'video' or 'audio').
 * @param {number} parameters.recordingVideoPausesLimit - The maximum number of allowed video pauses.
 * @param {number} parameters.recordingAudioPausesLimit - The maximum number of allowed audio pauses.
 * @param {number} parameters.pauseRecordCount - The current count of pause actions during recording.
 * @returns {Promise<boolean>} - A Promise that resolves to `true` if the user can resume recording, and `false` otherwise.
 */
export const checkResumeState = async function ({parameters}) {
    let { 
     recordingMediaOptions,
     recordingVideoPausesLimit,
     recordingAudioPausesLimit,
     pauseRecordCount
    } = parameters;
 
     // function to check if the user can resume recording
     let ref_limit = 0;
     if (recordingMediaOptions == 'video') {
       ref_limit = recordingVideoPausesLimit;
     } else {
       ref_limit = recordingAudioPausesLimit;
     }
 
     if (pauseRecordCount > ref_limit) {
       return false
     } else {
       return true
     }
   }
 