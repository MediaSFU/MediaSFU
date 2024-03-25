/**
 * Handles recording state and status, updating relevant parameters and indicators.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string} params.state - The recording state/status (recording, pause, stop).
 * @param {Object} params.userRecordingParam - Recording parameters for the user.
 * @param {number} params.pauseCount - The count of pauses during recording.
 * @param {number} params.timeDone - The elapsed time during recording.
 * @param {Object} params.parameters - Additional parameters required for the function.
 * @param {string} params.islevel - User level (host or participant).
 * @param {string} params.eventType - Type of the event.
 * @param {Object} params.userRecordingParams - Recording parameters for the user.
 * @param {string} params.recordingMediaOptions - Media options for recording.
 * @param {string} params.recordingAudioOptions - Audio options for recording.
 * @param {string} params.recordingVideoOptions - Video options for recording.
 * @param {string} params.recordingVideoType - Video type for recording.
 * @param {boolean} params.recordingVideoOptimized - Indicates if video is optimized for recording.
 * @param {string} params.recordingDisplayType - Display type for recording.
 * @param {boolean} params.recordingAddHLS - Indicates if HLS is added during recording.
 * @param {boolean} params.recordingNameTags - Indicates if name tags are added during recording.
 * @param {string} params.recordingBackgroundColor - Background color for recording.
 * @param {string} params.recordingNameTagsColor - Name tags color for recording.
 * @param {string} params.recordingOrientationVideo - Video orientation for recording.
 * @param {string} params.recordingAddText - Indicates if text should be added during recording.
 * @param {string} params.recordingCustomText - Custom text for recording.
 * @param {string} params.recordingCustomTextPosition - Custom text position for recording.
 * @param {string} params.recordingCustomTextColor - Custom text color for recording.
 * @param {number} params.pauseRecordCount - Count of pauses during recording.
 * @param {number} params.recordElapsedTime - Elapsed time during recording.
 * @param {boolean} params.recordStarted - Indicates if recording has started.
 * @param {boolean} params.recordPaused - Indicates if recording is paused.
 * @param {boolean} params.canLaunchRecord - Indicates if recording is launchrecorded.
 * @param {boolean} params.recordStopped - Indicates if recording is stopped.
 * @param {boolean} params.isTimerRunning - Indicates if the recording timer is running.
 * @param {boolean} params.canPauseResume - Indicates if recording can be paused/resumed.
 * @param {number} params.recordStartTime - Start time of recording.
 * @param {string} params.recordingStateIndicator - Recording state indicator.
 * @param {function} params.updateRecordingProgressTime - Function to update recording progress time.
 * @param {function} params.updateShowRecordButtons - Function to update the visibility of record buttons.
 * @param {function} params.updateUserRecordingParams - Function to update user recording parameters.
 * @param {function} params.updateRecordingStateIndicatorMember - Function to update recording state indicator for the host.
 * @param {function} params.updateRecordingMediaOptions - Function to update recording media options.
 * @param {function} params.updateRecordingAudioOptions - Function to update recording audio options.
 * @param {function} params.updateRecordingVideoOptions - Function to update recording video options.
 * @param {function} params.updateRecordingVideoType - Function to update recording video type.
 * @param {function} params.updateRecordingVideoOptimized - Function to update recording video optimization.
 * @param {function} params.updateRecordingDisplayType - Function to update recording display type.
 * @param {function} params.updateRecordingAddHLS - Function to update recording HLS status.
 * @param {function} params.updateRecordingNameTags - Function to update recording name tags status.
 * @param {function} params.updateRecordingBackgroundColor - Function to update recording background color.
 * @param {function} params.updateRecordingNameTagsColor - Function to update recording name tags color.
 * @param {function} params.updateRecordingOrientationVideo - Function to update recording video orientation.
 * @param {function} params.updateRecordingAddText - Function to update recording text status.
 * @param {function} params.updateRecordingCustomText - Function to update recording custom text.
 * @param {function} params.updateRecordingCustomTextPosition - Function to update recording custom text position.
 * @param {function} params.updateRecordingCustomTextColor - Function to update recording custom text color.
 * @param {function} params.updatePauseRecordCount - Function to update pause record count.
 * @param {function} params.updateRecordElapsedTime - Function to update recorded elapsed time.
 * @param {function} params.updateRecordStarted - Function to update recording started status.
 * @param {function} params.updateRecordPaused - Function to update recording paused status.
 * @param {function} params.updateCanLaunchRecord - Function to update launchrecord recording status.
 * @param {function} params.updateRecordStopped - Function to update recording stopped status.
 * @param {function} params.updateIsTimerRunning - Function to update recording timer status.
 * @param {function} params.updateCanPauseResume - Function to update pause/resume capability status.
 * @param {function} params.updateRecordStartTime - Function to update recording start time.
 * @param {function} params.updateRecordingStateIndicator - Function to update recording state indicator.
 * @param {function} params.updateRecordState - Function to update recording state.
 * @throws {Error} Throws an error if there is an issue handling recording state and status.
 */
export const RecordingNotice = async ({ state, userRecordingParam, pauseCount, timeDone, parameters }) => {
  // Function to handle recording state and status
  // Update relevant parameters and indicators based on provided logic

  let {
      islevel,
      eventType,
      userRecordingParams,
      recordingMediaOptions,
      recordingAudioOptions,
      recordingVideoOptions,
      recordingVideoType,
      recordingVideoOptimized,
      recordingDisplayType,
      recordingAddHLS,
      recordingNameTags,
      recordingBackgroundColor,
      recordingNameTagsColor,
      recordingOrientationVideo,
      recordingAddText,
      recordingCustomText,
      recordingCustomTextPosition,
      recordingCustomTextColor,
      pauseRecordCount,
      recordElapsedTime,
      recordStarted,
      recordPaused,
      canLaunchRecord,
      stopLaunchRecord,
      recordStopped,
      isTimerRunning,
      canPauseResume,
      recordStartTime,
      recordingStateIndicator,
      // Add other state update functions as needed
      updateRecordingProgressTime,
      updateShowRecordButtons,
      updateUserRecordingParams,
      updateRecordingStateIndicatorMember,
      updateRecordingMediaOptions,
      updateRecordingAudioOptions,
      updateRecordingVideoOptions,
      updateRecordingVideoType,
      updateRecordingVideoOptimized,
      updateRecordingDisplayType,
      updateRecordingAddHLS,
      updateRecordingNameTags,
      updateRecordingBackgroundColor,
      updateRecordingNameTagsColor,
      updateRecordingOrientationVideo,
      updateRecordingAddText,
      updateRecordingCustomText,
      updateRecordingCustomTextPosition,
      updateRecordingCustomTextColor,
      updatePauseRecordCount,
      updateRecordElapsedTime,
      updateRecordStarted,
      updateRecordPaused,
      updateCanLaunchRecord,
      updateStopLaunchRecord,
      updateRecordStopped,
      updateIsTimerRunning,
      updateCanPauseResume,
      updateRecordStartTime,
      updateRecordingStateIndicator,
      updateRecordState,
  } = parameters;

  try {
      // Update recording state and status based on user level
      if (islevel !== '2') {
          // If not host, update recording state indicator
          if (state === 'pause') {
              updateRecordStarted(true);
              updateRecordPaused(true);
              updateRecordState('yellow')
          } else if (state === 'stop') {
              updateRecordStarted(true);
              updateRecordStopped(true);
              updateRecordState('green')
          }else{
              updateRecordState('red')
              updateRecordStarted(true);
              updateRecordPaused(false);
          }
      } else {
          // If host, update recording state indicator and additional functionalities
          // Applicable for the host returning to the event room after leaving (leaving pauses the recording)
          if (state === 'pause') {
            updateRecordState('yellow')
              if (userRecordingParam) {
                  userRecordingParams = userRecordingParam;
                  // Add logic to update recording state indicator for the host
                  // updateRecordingStateIndicatorMember(state);

                  // Update recording parameters for the host
                  recordingMediaOptions = userRecordingParams.mainSpecs.mediaOptions;
                  recordingAudioOptions = userRecordingParams.mainSpecs.audioOptions;
                  recordingVideoOptions = userRecordingParams.mainSpecs.videoOptions;
                  recordingVideoType = userRecordingParams.mainSpecs.videoType;
                  recordingVideoOptimized = userRecordingParams.mainSpecs.videoOptimized;
                  recordingDisplayType = userRecordingParams.mainSpecs.recordingDisplayType;
                  recordingAddHLS = userRecordingParams.mainSpecs.addHLS;
                  recordingNameTags = userRecordingParams.dispSpecs.nameTags;
                  recordingBackgroundColor = userRecordingParams.dispSpecs.backgroundColor;
                  recordingNameTagsColor = userRecordingParams.dispSpecs.nameTagsColor;
                  recordingOrientationVideo = userRecordingParams.dispSpecs.orientationVideo;
                  recordingAddText = userRecordingParams.textSpecs.addText
                  recordingCustomText = userRecordingParams.textSpecs.customText
                  recordingCustomTextPosition = userRecordingParams.textSpecs.customTextPosition
                  recordingCustomTextColor = userRecordingParams.textSpecs.customTextColor

                  // Update user recording parameters
                  updateUserRecordingParams(userRecordingParams);
                  updateRecordingMediaOptions(recordingMediaOptions);
                  updateRecordingAudioOptions(recordingAudioOptions);
                  updateRecordingVideoOptions(recordingVideoOptions);
                  updateRecordingVideoType(recordingVideoType);
                  updateRecordingVideoOptimized(recordingVideoOptimized);
                  updateRecordingDisplayType(recordingDisplayType);
                  updateRecordingAddHLS(recordingAddHLS);
                  updateRecordingNameTags(recordingNameTags);
                  updateRecordingBackgroundColor(recordingBackgroundColor);
                  updateRecordingNameTagsColor(recordingNameTagsColor);
                  updateRecordingOrientationVideo(recordingOrientationVideo);
                  updateRecordingAddText(recordingAddText);
                  updateRecordingCustomText(recordingCustomText);
                  updateRecordingCustomTextPosition(recordingCustomTextPosition);
                  updateRecordingCustomTextColor(recordingCustomTextColor);

                  // Update pause record count
                  pauseRecordCount = pauseCount;
                  updatePauseRecordCount(pauseRecordCount);

                  // Update record elapsed time
                  recordElapsedTime = timeDone;
                  updateRecordElapsedTime(recordElapsedTime);

                  // Update recording status
                  recordStarted = true;
                  recordPaused = true;
                  canLaunchRecord = false;
                  recordStopped = false;

                  updateRecordStarted(recordStarted);
                  updateRecordPaused(recordPaused);
                  updateCanLaunchRecord(canLaunchRecord);
                  updateRecordStopped(recordStopped);
                  updateShowRecordButtons(true);

                  // Update timer and pause/resume status
                  isTimerRunning = false;
                  canPauseResume = true;

                  updateIsTimerRunning(isTimerRunning);
                  updateCanPauseResume(canPauseResume);

                  // Format and update recording progress time
                  recordElapsedTime = Math.floor(recordElapsedTime / 1000);
                  recordStartTime = Math.floor(Date.now() / 1000) - recordElapsedTime;
                  updateRecordElapsedTime(recordElapsedTime);
                  updateRecordStartTime(recordStartTime);

                  function padNumber(number) {
                      return number.toString().padStart(2, '0');
                  }

                  const hours = Math.floor(recordElapsedTime / 3600);
                  const minutes = Math.floor((recordElapsedTime % 3600) / 60);
                  const seconds = recordElapsedTime % 60;
                  const formattedTime = padNumber(hours) + ':' + padNumber(minutes) + ':' + padNumber(seconds);

                  updateRecordingProgressTime(formattedTime);
              }
          } else if (state === 'stop') {
              // If recording has stopped, update recording state indicator and stop attempt to resume recording
              recordStarted = true;
              recordStopped = true;
              canLaunchRecord = false;
              stopLaunchRecord = true;
     
              updateRecordStarted(recordStarted);
              updateRecordStopped(recordStopped);
              updateCanLaunchRecord(canLaunchRecord);
              updateStopLaunchRecord(stopLaunchRecord);
              updateShowRecordButtons(false);

              updateRecordState('green')
          }else{
            updateRecordState('red')
            updateRecordStarted(true);
            updateRecordPaused(false);
          }
      }
  } catch (error) {
      console.log("Error in recordingNotice: ", error);
    //   throw new Error("Failed to handle recording state and status.");
  }
};
