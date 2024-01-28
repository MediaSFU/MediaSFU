import { recordUpdateTimer } from './recordUpdateTimer';

/**
 * Pauses or stops the recording timer.
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables and functions.
 * @param {boolean} [stop=false] - Indicates whether to stop the timer (default is false).
 * @param {number} parameters.recordTimerInterval - The interval for updating the recording timer.
 * @param {boolean} parameters.isTimerRunning - Indicates whether the timer is currently running.
 * @param {boolean} parameters.canPauseResume - Indicates whether pause/resume actions are allowed.
 * @param {Function} parameters.showAlert - Function to show an alert message.
 * @param {Function} parameters.updateRecordTimerInterval - Function to update the recordTimerInterval state.
 * @param {Function} parameters.updateIsTimerRunning - Function to update the isTimerRunning state.
 * @param {Function} parameters.updateCanPauseResume - Function to update the canPauseResume state.
 * @returns {boolean} - Indicates whether the timer was successfully paused or stopped.
 */
export function recordPauseTimer({ stop = false, parameters }) {
    

    let {
      recordTimerInterval,
      isTimerRunning,
      canPauseResume,
      showAlert,
      updateRecordTimerInterval,
      updateIsTimerRunning,
      updateCanPauseResume,
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
  
    // Ensure the timer is running and pause/resume actions are allowed
    if (isTimerRunning && canPauseResume) {
      return true;
    } else {
      if (stop) {
        showAlertMessage('Can only stop after 15 seconds of starting or pausing or resuming recording');
      } else {
        showAlertMessage('Can only pause or resume after 15 seconds of starting or pausing or resuming recording');
      }
      return false;
    }
  }
  