import { recordUpdateTimer } from "./recordUpdateTimer";

/**
 * Resumes the recording timer.
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables and functions.
 * @param {boolean} parameters.isTimerRunning - Indicates whether the timer is currently running.
 * @param {boolean} parameters.canPauseResume - Indicates whether pause/resume actions are allowed.
 * @param {number} parameters.recordElapsedTime - The elapsed time in seconds.
 * @param {number} parameters.recordStartTime - The timestamp when the recording started.
 * @param {number} parameters.recordTimerInterval - The interval for updating the recording timer.
 * @param {Function} parameters.recordUpdateTimer - Function to update the recording timer.
 * @param {Function} parameters.showAlert - Function to show an alert message.
 * @param {Function} parameters.updateRecordElapsedTime - Function to update the recordElapsedTime state.
 * @param {Function} parameters.updateRecordStartTime - Function to update the recordStartTime state.
 * @param {Function} parameters.updateRecordTimerInterval - Function to update the recordTimerInterval state.
 * @param {Function} parameters.updateIsTimerRunning - Function to update the isTimerRunning state.
 * @param {Function} parameters.updateCanPauseResume - Function to update the canPauseResume state.
 * @returns {boolean} - Indicates whether the timer was successfully resumed.
 */
export async function recordResumeTimer({ parameters }) {

    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams();

    let {
        isTimerRunning,
        canPauseResume,
        recordElapsedTime,
        recordStartTime,
        recordTimerInterval,
        showAlert,
        updateRecordElapsedTime,
        updateRecordStartTime,
        updateRecordTimerInterval,
        updateIsTimerRunning,
        updateCanPauseResume,

        //mediasfu Functions
        // recordUpdateTimer,

    } = parameters;

    /**
     * Utility function to show an alert message.
     * @param {string} message - The message to be displayed in the alert.
     */
    function showAlertMessage(message) {
        if (showAlert) {
            showAlert({
                message: message,
                type: 'danger',
                duration: 3000,
            });
        }
    }

    if (!isTimerRunning && canPauseResume) {
        recordStartTime = new Date().getTime() - recordElapsedTime * 1000; // Calculate the starting time based on elapsed time
        updateRecordStartTime(recordStartTime);
        recordTimerInterval = setInterval(() => {
            // Update the timer every second (1000 milliseconds)
            recordUpdateTimer({ parameters: { ...parameters, recordStartTime } });

            parameters = getUpdatedAllParams();

            // Check if recording is paused or stopped, and close the interval if needed
            if (parameters.recordPaused || parameters.recordStopped || (parameters.roomName == "" || parameters.roomName == null)) {
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
        canPauseResume = false; // Disable pause/resume actions until paused again
        updateCanPauseResume(canPauseResume);
        return true;
    } else {
        showAlertMessage('Can only pause or resume after 15 seconds of starting or pausing or resuming recording');
        return false;
    }
}
