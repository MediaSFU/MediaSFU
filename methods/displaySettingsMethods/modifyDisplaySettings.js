/**
 * Modifies display settings based on provided logic and state variables.
 * @function
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {function} params.showAlert - Function to show an alert message.
 * @param {string} params.meetingDisplayType - Current meeting display type ('video', 'media', 'all').
 * @param {boolean} params.autoWave - Flag indicating whether auto wave is enabled.
 * @param {boolean} params.forceFullDisplay - Flag indicating whether force full display is enabled.
 * @param {boolean} params.meetingVideoOptimized - Flag indicating whether meeting video is optimized.
 * @param {string} params.islevel - The current level of the user.
 * @param {boolean} params.recordStarted - Flag indicating whether recording has started.
 * @param {boolean} params.recordResumed - Flag indicating whether recording has resumed.
 * @param {boolean} params.recordStopped - Flag indicating whether recording has stopped.
 * @param {boolean} params.recordPaused - Flag indicating whether recording has been paused.
 * @param {string} params.recordingDisplayType - Recording display type ('video', 'media', 'all').
 * @param {boolean} params.recordingVideoOptimized - Flag indicating whether recording video is optimized.
 * @param {boolean} params.prevForceFullDisplay - Previous state of force full display.
 * @param {string} params.prevMeetingDisplayType - Previous state of meeting display type.
 * @param {boolean} params.firstAll - Flag indicating whether the 'all' display type is set for the first time.
 * @param {function} params.updateMeetingDisplayType - Function to update the meeting display type state.
 * @param {function} params.updateAutoWave - Function to update the auto wave state.
 * @param {function} params.updateForceFullDisplay - Function to update the force full display state.
 * @param {function} params.updateMeetingVideoOptimized - Function to update the meeting video optimization state.
 * @param {function} params.updatePrevForceFullDisplay - Function to update the previous force full display state.
 * @param {function} params.updatePrevMeetingDisplayType - Function to update the previous meeting display type state.
 * @param {function} params.updateIsDisplaySettingsModalVisible - Function to update the visibility state of the display settings modal.
 * @param {function} params.updateFirstAll - Function to update the firstAll state.
 * @param {function} params.updateUpdateMainWindow - Function to update the updateMainWindow state.
 * @param {function} params.onScreenChanges - Function to handle on-screen changes.
 */
export const modifyDisplaySettings = async({ parameters }) => {

  // displayOption: displayOptionState, autoWave: autoWaveState, forceFullDisplay: forceFullDisplayState, meetingVideoOptimized: meetingVideoOptimizedState
  let {
      showAlert,
      meetingDisplayType,
      autoWave,
      forceFullDisplay,
      meetingVideoOptimized,
      islevel,
      recordStarted,
      recordResumed,
      recordStopped,
      recordPaused,
      recordingDisplayType,
      recordingVideoOptimized,
      prevForceFullDisplay,
      prevMeetingDisplayType,
      firstAll,
      updateMeetingDisplayType,
      updateAutoWave,
      updateForceFullDisplay,
      updateMeetingVideoOptimized,
      updatePrevForceFullDisplay,
      updatePrevMeetingDisplayType,
      updateIsDisplaySettingsModalVisible,
      updateFirstAll,
      updateUpdateMainWindow,

      //mediasfu functions
      onScreenChanges,
  } = parameters;

  // Update previous states
  updateAutoWave(autoWave);
  updateForceFullDisplay(forceFullDisplay);



  // Check and update state variables based on the provided logic
  if (islevel === '2' && (recordStarted || recordResumed) && (!recordStopped && !recordPaused)) {
      if (recordingDisplayType === 'video') {
          if (meetingDisplayType === 'video' && meetingVideoOptimized && !recordingVideoOptimized) {
              if (showAlert) {
                  showAlert({
                      message: 'Meeting display type can be either video, media, or all when recording display type is non-optimized video.',
                      type: 'danger',
                      duration: 3000,
                  });
              }
              // Reset to previous values or handle as needed
              meetingDisplayType = recordingDisplayType;
              updateMeetingDisplayType(meetingDisplayType);
              meetingVideoOptimized = recordingVideoOptimized;
              updateMeetingVideoOptimized(meetingVideoOptimized);
              return;
          }
      } else if (recordingDisplayType === 'media') {
          if (meetingDisplayType === 'video') {
              if (showAlert) {
                  showAlert({
                      message: 'Meeting display type can be either media or all when recording display type is media.',
                      type: 'danger',
                      duration: 3000,
                  });
              }
              // Reset to previous values or handle as needed
              meetingDisplayType = recordingDisplayType;
              updateMeetingDisplayType(meetingDisplayType);
              return;
          }
      } else if (recordingDisplayType === 'all') {
          if (meetingDisplayType === 'video' || meetingDisplayType === 'media') {
              if (showAlert) {
                  showAlert({
                      message: 'Meeting display type can be only all when recording display type is all.',
                      type: 'danger',
                      duration: 3000,
                  });
              }
              // Reset to previous values or handle as needed
              meetingDisplayType = recordingDisplayType;
              updateMeetingDisplayType(meetingDisplayType);
              return;
          }
      }
  }

  // Update state variables based on logic
  updateMeetingDisplayType(meetingDisplayType);
  updateMeetingVideoOptimized(meetingVideoOptimized);

  // Close the modal or perform additional actions
  updateIsDisplaySettingsModalVisible(false);
  if (prevMeetingDisplayType !== meetingDisplayType || prevForceFullDisplay !== forceFullDisplay) {
      if (meetingDisplayType !== 'all') {
          updateFirstAll(true);
      } else {
          updateFirstAll(false);
      }
      updateUpdateMainWindow(true);
      // Handle on-screen changes
      await onScreenChanges({ changed: true, parameters });
      updatePrevForceFullDisplay(forceFullDisplay);
      updatePrevMeetingDisplayType(meetingDisplayType);
  }
};
