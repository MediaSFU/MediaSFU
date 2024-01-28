

import { recordUpdateTimer } from './recordUpdateTimer.js';

/**
 * Starts the recording timer.
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables and functions.
 * @param {number} parameters.recordStartTime - The timestamp when the recording started.
 * @param {number} parameters.recordTimerInterval - The interval for updating the recording timer.
 * @param {boolean} parameters.isTimerRunning - Indicates whether the timer is currently running.
 * @param {boolean} parameters.canPauseResume - Indicates whether pause/resume actions are allowed.
 * @param {number} parameters.recordChangeSeconds - The time (in seconds) after which pause/resume actions are enabled.
 * @param {boolean} parameters.recordingPaused - Indicates whether the recording is paused.
 * @param {boolean} parameters.recordingStopped - Indicates whether the recording is stopped.
 * @param {Function} parameters.recordUpdateTimer - Function to update the recording timer.
 * @param {Function} parameters.updateRecordStartTime - Function to update the recordStartTime state.
 * @param {Function} parameters.updateRecordTimerInterval - Function to update the recordTimerInterval state.
 * @param {Function} parameters.updateIsTimerRunning - Function to update the isTimerRunning state.
 * @param {Function} parameters.updateCanPauseResume - Function to update the canPauseResume state.
 * @param {Function} parameters.updateRecordChangeSeconds - Function to update the recordChangeSeconds state.
 * @param {Function} parameters.updateRecordingPaused - Function to update the recordingPaused state.
 * @param {Function} parameters.updateRecordingStopped - Function to update the recordingStopped state.
 * @param {Function} parameters.updateRecordUpdateTimer - Function to update the recordUpdateTimer state.
 */
export async function recordStartTimer({ parameters }) {
    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams();

    let {
        recordStartTime,
        recordTimerInterval,
        isTimerRunning,
        canPauseResume,
        recordChangeSeconds,
        recordingPaused,
        recordingStopped,
        recordElapsedTime,

        updateRecordStartTime,
        updateRecordTimerInterval,
        updateIsTimerRunning,
        updateCanPauseResume,
        updateRecordChangeSeconds,
        updateRecordingPaused,
        updateRecordingStopped,
        updateRecordUpdateTimer,
    } = parameters;

    /**
     * Utility function to enable pause/resume actions after a specified time.
     */
    function enablePauseResume() {
        canPauseResume = true;
        updateCanPauseResume(canPauseResume);
    }

    if (!isTimerRunning) {
        recordStartTime = new Date().getTime(); // Get the current timestamp
        updateRecordStartTime(recordStartTime);
        recordTimerInterval = setInterval(() => {
            // Update the timer every second (1000 milliseconds)
            recordUpdateTimer({ parameters: { ...parameters, recordStartTime } });
            
            parameters = getUpdatedAllParams();

            // Check if recording is paused or stopped, and close the interval if needed
            if (parameters.recordPaused || parameters.recordStopped ||(parameters.roomName =="" || parameters.roomName ==null)) {
                clearInterval(recordTimerInterval);
                updateRecordTimerInterval(null);
                isTimerRunning = false;
                updateIsTimerRunning(isTimerRunning);
                canPauseResume = false;
                updateCanPauseResume(canPauseResume);
            }
        }, 1000);
        updateRecordTimerInterval(recordTimerInterval);
        isTimerRunning = true;
        updateIsTimerRunning(isTimerRunning);
        canPauseResume = false; // Disable pause/resume actions initially
        updateCanPauseResume(canPauseResume);
        setTimeout(enablePauseResume, recordChangeSeconds); // Enable pause/resume actions after specified time
    }
}
