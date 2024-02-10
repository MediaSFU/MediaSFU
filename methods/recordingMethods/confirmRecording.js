/**
 * Handles the confirmation of recording parameters and updates state variables accordingly.
 * @function
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various state variables and utility functions.
 * @param {Function} options.parameters.showAlert - Function to show an alert message.
 * @param {string} options.parameters.recordingMediaOptions - Media options for recording (e.g., 'audio', 'video', 'all').
 * @param {string} options.parameters.recordingAudioOptions - Audio options for recording (e.g., 'microphone', 'all').
 * @param {string} options.parameters.recordingVideoOptions - Video options for recording (e.g., 'camera', 'all').
 * @param {string} options.parameters.recordingVideoType - Type of video recording (e.g., 'main', 'all').
 * @param {string} options.parameters.recordingDisplayType - Type of display for recording (e.g., 'video', 'all').
 * @param {string} options.parameters.recordingNameTags - Name tags for recording display.
 * @param {string} options.parameters.recordingBackgroundColor - Background color for recording display.
 * @param {string} options.parameters.recordingNameTagsColor - Color for name tags in recording display.
 * @param {string} options.parameters.recordingOrientationVideo - Video orientation for recording (e.g., 'portrait', 'landscape', 'all').
 * @param {boolean} options.parameters.recordingAddHLS - Whether to add HLS (HTTP Live Streaming) for recording.
 * @param {boolean} options.parameters.clearedToResume - State variable indicating if recording can be resumed.
 * @param {Function} options.parameters.updateClearedToRecord - Function to update the clearedToRecord state variable.
 * @param {string} options.parameters.meetingDisplayType - Display type for the meeting (e.g., 'all', 'video', 'media').
 * @param {boolean} options.parameters.recordingVideoParticipantsFullRoomSupport - Whether full room video participants are supported.
 * @param {boolean} options.parameters.recordingAllParticipantsSupport - Whether recording all participants is supported.
 * @param {boolean} options.parameters.recordingVideoParticipantsSupport - Whether recording video participants is supported.
 * @param {boolean} options.parameters.recordingSupportForOtherOrientation - Whether recording support for other orientation is enabled.
 * @param {string} options.parameters.recordingPreferredOrientation - Preferred orientation for recording (e.g., 'portrait', 'landscape').
 * @param {boolean} options.parameters.recordingMultiFormatsSupport - Whether recording in multiple formats is supported.
 * @param {boolean} options.parameters.recordingVideoOptimized - Whether video recording is optimized.
 * @param {boolean} options.parameters.meetingVideoOptimized - Whether video display in the meeting is optimized.
 * @param {string} options.parameters.eventType - Type of event (e.g., 'broadcast', 'chat').
 * @param {Function} options.parameters.updateRecordingDisplayType - Function to update the recordingDisplayType state variable.
 * @param {Function} options.parameters.updateRecordingVideoOptimized - Function to update the recordingVideoOptimized state variable.
 * @param {Function} options.parameters.updateRecordingVideoParticipantsFullRoomSupport - Function to update the recordingVideoParticipantsFullRoomSupport state variable.
 * @param {Function} options.parameters.updateRecordingAllParticipantsSupport - Function to update the recordingAllParticipantsSupport state variable.
 * @param {Function} options.parameters.updateRecordingVideoParticipantsSupport - Function to update the recordingVideoParticipantsSupport state variable.
 * @param {Function} options.parameters.updateRecordingSupportForOtherOrientation - Function to update the recordingSupportForOtherOrientation state variable.
 * @param {Function} options.parameters.updateRecordingPreferredOrientation - Function to update the recordingPreferredOrientation state variable.
 * @param {Function} options.parameters.updateRecordingMultiFormatsSupport - Function to update the recordingMultiFormatsSupport state variable.
 * @param {Function} options.parameters.updateUserRecordingParams - Function to update userRecordingParams state variable.
 * @param {Function} options.parameters.updateConfirmedToRecord - Function to update the confirmedToRecord state variable.
 * @returns {void}
 */
export const confirmRecording = async({ parameters }) => {
  // Extract variables from the parameters object

  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams()

  let {
    showAlert,
    recordingMediaOptions,
    recordingAudioOptions,
    recordingVideoOptions,
    recordingVideoType,
    recordingDisplayType,
    recordingNameTags,
    recordingBackgroundColor,
    recordingNameTagsColor,
    recordingOrientationVideo,
    recordingAddHLS,
    clearedToResume,
    updateClearedToRecord,
    meetingDisplayType,
    recordingVideoParticipantsFullRoomSupport,
    recordingAllParticipantsSupport,
    recordingVideoParticipantsSupport,
    recordingSupportForOtherOrientation,
    recordingPreferredOrientation,
    recordingMultiFormatsSupport,
    recordingAllParticipantsFullRoomSupport,
    recordingVideoOptimized,
    meetingVideoOptimized,
    eventType,
    updateRecordingDisplayType,
    updateRecordingVideoOptimized,
    updateRecordingVideoParticipantsFullRoomSupport,
    updateRecordingAllParticipantsSupport,
    updateRecordingVideoParticipantsSupport,
    updateRecordingSupportForOtherOrientation,
    updateRecordingPreferredOrientation,
    updateRecordingMultiFormatsSupport,
    updateUserRecordingParams,
    updateConfirmedToRecord,
    updateIsRecordingModalVisible,
  } = parameters;


  // Retrieve the values from the state
  const displayType = recordingVideoType;
  const nameTags = recordingNameTags;
  const backgroundColor = recordingBackgroundColor;
  const nameTagsColor = recordingNameTagsColor;
  const orientationVideo = recordingOrientationVideo;
  const hlsadd = recordingAddHLS;

  const mediaOptions = recordingMediaOptions;
  const audioOptions = recordingAudioOptions;
  const videoOptions = recordingVideoOptions;

  // Other variables not provided in the guide
  const selectedRecordOption = recordingDisplayType;
  

  // Additional logic similar to the provided guide
  // recordingVideoParticipantsFullRoomSupport = minigrid and main video
  if (eventType !== 'broadcast') {
    if (!recordingVideoParticipantsFullRoomSupport && recordingVideoOptions === 'all' && mediaOptions === 'video') {
      if (meetingDisplayType === 'all') {
        if (showAlert) {
          showAlert({
            message: 'You are not allowed to record videos of all participants; change the meeting display type to video or video optimized.',
            type: 'danger',
            duration: 3000,
          });
        }
        return;
      }
    }

    // recordingAllParticipantsSupport  = others other than host screen (video + audio)
    if (!recordingAllParticipantsSupport && recordingVideoOptions === 'all') {
      if (showAlert) {
        showAlert({
          message: 'You are only allowed to record yourself.',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    // recordingVideoParticipantsSupport (maingrid + non-host screenshare person)
    if (!recordingVideoParticipantsSupport && recordingDisplayType === 'video') {
      if (showAlert) {
        showAlert({
          message: 'You are not allowed to record other video participants.',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }
  }

  if (!recordingSupportForOtherOrientation && recordingOrientationVideo === 'all') {
    if (showAlert) {
      showAlert({
        message: 'You are not allowed to record all orientations.',
        type: 'danger',
        duration: 3000,
      });
    }
    return;
  }

  if (recordingPreferredOrientation === 'landscape' && recordingOrientationVideo === 'portrait' && !recordingSupportForOtherOrientation) {
    if (showAlert) {
      showAlert({
        message: 'You are not allowed to record portrait orientation.',
        type: 'danger',
        duration: 3000,
      });
    }
    return;
  } else if (recordingPreferredOrientation === 'portrait' && recordingOrientationVideo === 'landscape' && !recordingSupportForOtherOrientation) {
    if (showAlert) {
      showAlert({
        message: 'You are not allowed to record landscape orientation.',
        type: 'danger',
        duration: 3000,
      });
    }
    return;
  }

  if (!recordingMultiFormatsSupport && recordingVideoType === 'all') {
    if (showAlert) {
      showAlert({
        message: 'You are not allowed to record all formats.',
        type: 'danger',
        duration: 3000,
      });
    }
    return;
  }

  if (eventType !== 'broadcast') {
    if (recordingMediaOptions === 'video') {
      if (meetingDisplayType === 'media') {
        if (recordingDisplayType === 'all') {
          if (showAlert) {
            showAlert({
              message: 'Recording display type can be either video, video optimized, or media when meeting display type is media.',
              type: 'danger',
              duration: 3000,
            });
          }
          recordingDisplayType = meetingDisplayType;
          return;
        }
      } else if (meetingDisplayType === 'video') {
        if (recordingDisplayType === 'all' || recordingDisplayType === 'media') {
          if (showAlert) {
            showAlert({
              message: 'Recording display type can be either video or video optimized when meeting display type is video.',
              type: 'danger',
              duration: 3000,
            });
          }
          recordingDisplayType = meetingDisplayType;
          return;
        }

        if (meetingVideoOptimized && !recordingVideoOptimized) {
          if (showAlert) {
            showAlert({
              message: 'Recording display type can be only video optimized when meeting display type is video optimized.',
              type: 'danger',
              duration: 3000,
            });
          }
          recordingVideoOptimized = meetingVideoOptimized;
          return;
        }
      }
    } else {
      if (recordingDisplayType === 'all' || recordingDisplayType === 'media') {
      } else {
        recordingDisplayType = 'media';
      }
      recordingVideoOptimized = false;
    }
  }

  if (recordingDisplayType === 'all' && !recordingAllParticipantsFullRoomSupport) {
    if (showAlert) {
      showAlert({
        message: 'You can only record all participants with media.',
        type: 'danger',
        duration: 3000,
      });
    }
    return;
  }
  // Construct mainSpecs and dispSpecs objects based on the state variables
  const mainSpecs = {
    mediaOptions: recordingMediaOptions,
    audioOptions: recordingAudioOptions,
    videoOptions: recordingVideoOptions,
    videoType: recordingVideoType,
    videoOptimized: recordingVideoOptimized,
    recordingDisplayType: recordingDisplayType,
    addHLS: recordingAddHLS,
  };

  const dispSpecs = {
    nameTags: recordingNameTags,
    backgroundColor: recordingBackgroundColor,
    nameTagsColor: recordingNameTagsColor,
    orientationVideo: recordingOrientationVideo,
  };


  // Construct userRecordingParams object
  const userRecordingParams = { mainSpecs, dispSpecs };

  // Update state variables based on the logic
  updateUserRecordingParams(userRecordingParams);
  updateConfirmedToRecord(true);
  updateRecordingDisplayType(selectedRecordOption);
  updateRecordingVideoOptimized(recordingVideoOptimized);
  updateRecordingVideoParticipantsFullRoomSupport(recordingVideoParticipantsFullRoomSupport);
  updateRecordingAllParticipantsSupport(recordingAllParticipantsSupport);
  updateRecordingVideoParticipantsSupport(recordingVideoParticipantsSupport);
  updateRecordingSupportForOtherOrientation(recordingSupportForOtherOrientation);
  updateRecordingPreferredOrientation(recordingPreferredOrientation);
  updateRecordingMultiFormatsSupport(recordingMultiFormatsSupport);


};
