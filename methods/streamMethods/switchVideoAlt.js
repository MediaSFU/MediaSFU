/**
 * Switches the user's video device with alternate logic, taking into account recording state and camera access permissions.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {boolean} params.recordStarted - Flag indicating whether recording has started.
 * @param {boolean} params.recordResumed - Flag indicating whether recording has resumed.
 * @param {boolean} params.recordStopped - Flag indicating whether recording has stopped.
 * @param {boolean} params.recordPaused - Flag indicating whether recording has been paused.
 * @param {string} params.recordingMediaOptions - Type of media being recorded (e.g., 'video').
 * @param {boolean} params.videoAlreadyOn - Flag indicating whether video is already turned on.
 * @param {string} params.currentFacingMode - The current facing mode of the video device.
 * @param {string} params.prevFacingMode - The previous facing mode of the video device.
 * @param {boolean} params.allowed - Flag indicating whether camera access is allowed.
 * @param {boolean} params.audioOnlyRoom - Flag indicating whether the room is audio-only.
 * @param {function} params.updateCurrentFacingMode - Function to update the current facing mode of the video device.
 * @param {function} params.updatePrevFacingMode - Function to update the previous facing mode of the video device.
 * @param {function} params.updateAllowed - Function to update the camera access permission status.
 * @param {function} params.updatePrevVideoInputDevice - Function to update the previous video input device.
 * @param {function} params.updateUserDefaultVideoInputDevice - Function to update the user's default video input device.
 * @param {function} params.updateIsMediaSettingsModalVisible - Function to update the visibility state of the media settings modal.
 * @param {function} params.createSendTransport - Function to create a send transport for video.
 * @param {function} params.connectSendTransportVideo - Function to connect the send transport for video.
 * @param {function} params.showAlert - Function to show an alert message.
 * @param {function} params.reorderStreams - Function to reorder video streams.
 * @param {function} params.switchUserVideoAlt - Function to switch the user's video device with alternate logic.
 */

export const switchVideoAlt = async ({ parameters}) => {
   
    // Destructure parameters for ease of use
    let {
        recordStarted,
        recordResumed,
        recordStopped,
        recordPaused,
        recordingMediaOptions,
        videoAlreadyOn,
        currentFacingMode,
        prevFacingMode,

        allowed,
        audioOnlyRoom,
        updateCurrentFacingMode,
        updatePrevFacingMode,
        updateAllowed,
        updatePrevVideoInputDevice,
        updateUserDefaultVideoInputDevice,
        updateIsMediaSettingsModalVisible,


        //media functions
        createSendTransport,
        connectSendTransportVideo,
        showAlert,
        reorderStreams,
        switchUserVideoAlt,
    } = parameters;

    if (audioOnlyRoom) {
        if (showAlert) {
            showAlert({
                message: 'You cannot turn on your camera in an audio-only event.',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
    }

    // Check if recording is in progress and whether the selected video device is the default one
    let checkoff = false;
    if ((recordStarted || recordResumed) && (!recordStopped && !recordPaused)) {
        if (recordingMediaOptions === 'video') {
            checkoff = true;
        }
    }

    // Check camera access permission
    if (!allowed) {
        if (showAlert) {
            showAlert({
                message: 'Allow access to your camera by starting it for the first time.',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
    }

    // Check video state and display appropriate alert messages
    if (checkoff) {
        if (videoAlreadyOn) {
            if (showAlert) {
                showAlert({
                    message: 'Please turn off your video before switching.',
                    type: 'danger',
                    duration: 3000,
                });
            }
            return;
        }
    } else {
        if (!videoAlreadyOn) {
            if (showAlert) {
                showAlert({
                    message: 'Please turn on your video before switching.',
                    type: 'danger',
                    duration: 3000,
                });
            }
            return;
        }
    }

    //camera switching logic here
    prevFacingMode = await currentFacingMode;
    if (currentFacingMode == "environment") {
        currentFacingMode = "user";
     } else {
        currentFacingMode = "environment";
    }
    
    await updateCurrentFacingMode(currentFacingMode);


    updateIsMediaSettingsModalVisible(false);
    await switchUserVideoAlt({ videoPreference:currentFacingMode, checkoff, parameters });
        
    
};
