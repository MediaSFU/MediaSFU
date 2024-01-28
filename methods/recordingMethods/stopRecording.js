
import {recordPauseTimer} from './recordPauseTimer'
/**
 * Initiates the stoppage recording process based on the provided parameters.
 * @function
 * @async
 * @param {Object} parameters - The parameters for the recording process.
 * @param {string} parameters.roomName - The name of the room where the recording will take place.
 * @param {Object} parameters.socket - The socket for communication with the server.
 * @param {Function} parameters.updateIsRecordingModalVisible - Function to update the visibility state of the recording modal.
 * @param {boolean} parameters.IsRecordingModalVisible - The current visibility state of the recording modal.
 * @param {string} parameters.islevel - The level of the user.
 * @param {Function} parameters.showAlert - Function to display alerts.
 * @param {boolean} parameters.recordStarted - Indicates if the recording has started.
 * @param {boolean} parameters.recordPaused - Indicates if the recording is paused.
 * @param {boolean} parameters.recordResumed - Indicates if the recording is resumed.
 * @param {boolean} parameters.recordStopped - Indicates if the recording is stopped.
 * @param {Function} parameters.updateRecordStarted - Function to update the recordStarted state.
 * @param {Function} parameters.updateRecordPaused - Function to update the recordPaused state.
 * @param {Function} parameters.updateRecordResumed - Function to update the recordResumed state.
 * @param {Function} parameters.updateRecordStopped - Function to update the recordStopped state.
 * @param {Function} parameters.updateRecordState - Function to update the overall recording state.
 * @param {Function} parameters.updateStartReport - Function to update the start report state.
 * @param {Function} parameters.updateEndReport - Function to update the end report state.
 * @param {Function} parameters.updateCanRecord - Function to update the canRecord state.
 * @param {Function} parameters.updateShowRecordButtons - Function to update the showRecordButtons state.
 * @param {Function} parameters.recordPauseTimer - Function to pause the recording timer.
 * @returns {void}
 */
export const stopRecording = async ({ parameters }) => {

    let {
        roomName,
        socket,
        updateIsRecordingModalVisible,
        IsRecordingModalVisible,
        islevel,
        showAlert,
        startReport,
        endReport,


        recordStarted,
        recordPaused,
        recordResumed,
        recordStopped,
        updateRecordStarted,
        updateRecordPaused,
        updateRecordResumed,
        updateRecordStopped,
        updateRecordState,
        updateStartReport,
        updateEndReport,
        updateCanRecord,
        updateShowRecordButtons,

        //mediasfu Functions
        // recordPauseTimer,
    } = parameters;

    let recAttempt;

    if (recordStarted && !recordStopped) {
        let stop = recordPauseTimer({ stop: true, parameters });
        let stopped = false;
        if (stop) {
            let action = 'stopRecord'

            await new Promise((resolve) => {

                socket.emit('stopRecord', { roomName }, ({ success, reason, recordState }) => {
          
                  if (success) {
          
                    startReport = false;
                    endReport = true;
                    recordPaused = false;
                    recordStopped = true;
                    recAttempt = true

                    updateStartReport(startReport);
                    updateEndReport(endReport);
                    updateRecordPaused(recordPaused);
                    updateRecordStopped(recordStopped);

                    if (showAlert) {
                        showAlert({
                            message: 'Recording Stopped',
                            type: 'success',
                            duration: 3000,
                        });
                    }

                    updateShowRecordButtons(false);
          
                  } else {
                    let reasonMessage = `Recording Stop Failed: ${reason}; the recording is currently ${recordState}`
                    if (showAlert) {
                        showAlert({
                            message: reasonMessage,
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                  }
          
                  resolve()
                });
          
          
              });


        } else {
          return
        }

    }else {
        if (showAlert) {
            showAlert({
                message: 'Recording is not started yet or already stopped',
                type: 'danger',
                duration: 3000,
            });
        }
    }
    
};
