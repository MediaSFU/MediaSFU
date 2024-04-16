/**
 * Launches the recording modal and performs necessary checks before allowing recording initiation.
 * @function
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various state variables and utility functions.
 * @param {Function} options.parameters.updateIsRecordingModalVisible - Function to update the visibility of the recording modal.
 * @param {boolean} options.parameters.isRecordingModalVisible - State variable indicating the visibility of the recording modal.
 * @param {Function} options.parameters.showAlert - Function to show an alert message.
 * @param {Function} options.parameters.stopLaunchRecord - Function to check if recording has already ended or is not allowed.
 * @param {boolean} options.parameters.canLaunchRecord - State variable indicating whether recording initiation is allowed.
 * @param {boolean} options.parameters.recordingAudioSupport - State variable indicating support for audio recording.
 * @param {boolean} options.parameters.recordingVideoSupport - State variable indicating support for video recording.
 * @param {Function} options.parameters.setCanRecord - Function to update the state variable indicating whether recording is allowed.
 * @param {Function} options.parameters.setClearedToRecord - Function to update the state variable indicating whether recording is cleared to resume.
 * @param {boolean} options.parameters.recordStarted - State variable indicating whether recording has started.
 * @param {boolean} options.parameters.recordPaused - State variable indicating whether recording has paused.
 * @param {boolean} options.parameters.recordStopped - State variable indicating whether recording has stopped.
 * @param {boolean} options.parameters.localUIMode - State variable indicating whether the user is in local UI development mode.  
 * @returns {void}
 */
export const launchRecording = ({ parameters }) => {
  // Extract variables from the parameters object
  let {
    updateIsRecordingModalVisible,
    isRecordingModalVisible,
    showAlert,
    stopLaunchRecord,
    canLaunchRecord,
    recordingAudioSupport,
    recordingVideoSupport,
    updateCanRecord,
    updateClearedToRecord,
    recordStarted,
    recordPaused,
    recordStopped,
    localUIMode,
  } = parameters;

  // Check if recording is already launched
  if ((!isRecordingModalVisible && stopLaunchRecord)  && !localUIMode ) {
    if (showAlert) {
      showAlert({
        message: 'Recording has already ended or you are not allowed to record',
        type: 'danger',
        duration: 3000,
      });
    }
    return;
  }

 // Check if recording initiation is allowed
  if ((!isRecordingModalVisible && canLaunchRecord) && !localUIMode) {
    // Check if both audio and video recording are not allowed
    if (!recordingAudioSupport && !recordingVideoSupport) {
      if (showAlert) {
        showAlert({
          message: 'You are not allowed to record',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    // update clearedToRecord to false
    updateClearedToRecord(false);
    // update canRecord to false
    updateCanRecord(false);
  }

  if (!isRecordingModalVisible && recordStarted) {
    if (!recordPaused) {
      if (showAlert) {
        showAlert({
          message: 'You can only re-configure recording after pausing it',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }
  }

  if ((!isRecordingModalVisible && !recordingAudioSupport && !recordingVideoSupport) && !localUIMode) {
    if (showAlert) {
      showAlert({
        message: 'You are not allowed to record',
        type: 'danger',
        duration: 3000,
      });
    }
    return;
  }

  // Update the visibility of the recording modal
  updateIsRecordingModalVisible(!isRecordingModalVisible);

};
