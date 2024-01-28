/**
 * Attempts to stop the ongoing recording in the specified room.
 *
 * @param {object} options - The function parameters.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {object} options.parameters.socket - The socket used for communication.
 * @param {function} options.parameters.showAlert - Function to display alerts.
 * @param {string} options.parameters.roomName - The name of the room where recording is ongoing.
 * @param {boolean} options.parameters.recordStarted - Indicates if recording has started.
 * @param {boolean} options.parameters.recordPaused - Indicates if recording is currently paused.
 * @param {boolean} options.parameters.recordResumed - Indicates if recording is resumed after being paused.
 * @param {boolean} options.parameters.recordStopped - Indicates if recording has been stopped.
 * @param {boolean} options.parameters.canRecord - Indicates if the user can initiate recording.
 * @param {boolean} options.parameters.startReport - Indicates the start of a recording report.
 * @param {boolean} options.parameters.endReport - Indicates the end of a recording report.
 * @param {function} options.parameters.updateRecordStarted - Function to update the recordStarted variable.
 * @param {function} options.parameters.updateRecordPaused - Function to update the recordPaused variable.
 * @param {function} options.parameters.updateRecordResumed - Function to update the recordResumed variable.
 * @param {function} options.parameters.updateRecordStopped - Function to update the recordStopped variable.
 * @param {function} options.parameters.updateCanRecord - Function to update the canRecord variable.
 * @param {function} options.parameters.updateStartReport - Function to update the startReport variable.
 * @param {function} options.parameters.updateEndReport - Function to update the endReport variable.
 * @param {function} options.parameters.rePort - Function to rePort the activeNames and screenStates.
 * @returns {boolean} - Returns true if the recording attempt is successful, otherwise false.
 */

export async function stopRecording({ parameters }) {
    
    let {
        socket,
        showAlert,
        roomName,
        recordStarted,
        recordPaused,
        recordResumed,
        recordStopped,
        canRecord,
        startReport,
        endReport,
      
      
        //update functions
        updateRecordStarted,
        updateRecordPaused,
        updateRecordResumed,
        updateRecordStopped,
        updateCanRecord,
        updateStartReport,
        updateEndReport,

        //mediasfu functions
        rePort,
        } = parameters;

    //attempt to stop recording and return true if successful
    let action = 'stopRecord'

    let recAttempt

    await new Promise((resolve) => {

      socket.emit('stopRecord', { roomName }, ({ success, reason, recordState }) => {

        if (success) {

          startReport = false;
          endReport = true;
          recordPaused = false;
          recordStopped = true;
          recAttempt = true

          if (showAlert) {
            showAlert({
              message: `Recording Stopped`,
              type: 'success',
              duration: 3000,
            });
          }

        } else {
          let reasonMessage = `Recording Stop Failed: ${reason}; the recording is currently ${recordState}`
          if (showAlert) {
            showAlert({
              message: reasonMessage,
              type: 'danger',
              duration: 3000,
            });
          }
          recAttempt = false
        }

        resolve()
      });


    });

    //update the recordStarted variable
    updateRecordStarted(recordStarted)
    updateRecordPaused(recordPaused)
    updateRecordResumed(recordResumed)
    updateRecordStopped(recordStopped)
    updateCanRecord(canRecord)
    updateStartReport(startReport)
    updateEndReport(endReport)


    return recAttempt
  }