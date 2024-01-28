/**
 * Switches the user's video device based on the provided video preference.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {boolean} params.recordStarted - Flag indicating whether recording has started.
 * @param {boolean} params.recordResumed - Flag indicating whether recording has resumed.
 * @param {boolean} params.recordStopped - Flag indicating whether recording has stopped.
 * @param {boolean} params.recordPaused - Flag indicating whether recording has been paused.
 * @param {string} params.recordingMediaOptions - The selected media option for recording (e.g., 'video').
 * @param {boolean} params.videoAlreadyOn - Flag indicating whether video is already turned on.
 * @param {string} params.userDefaultVideoInputDevice - User's default video input device.
 * @param {string} params.defVideoID - Default video device ID.
 * @param {boolean} params.allowed - Flag indicating whether access to the camera is allowed.
 * @param {function} params.updateDefVideoID - Function to update the default video device ID.
 * @param {function} params.updateAllowed - Function to update the camera access permission status.
 * @param {function} params.updatePrevVideoInputDevice - Function to update the previous video input device.
 * @param {function} params.updateUserDefaultVideoInputDevice - Function to update the user's default video input device.
 * @param {function} params.updateIsMediaSettingsModalVisible - Function to update the visibility state of the media settings modal.
 * @param {function} params.createSendTransport - Function to create a send transport for video.
 * @param {function} params.connectSendTransportVideo - Function to connect the send transport for video.
 * @param {function} params.showAlert - Function to display an alert message.
 * @param {function} params.reorderStreams - Function to reorder video streams.
 * @param {function} params.switchUserVideo - Function to switch the user's video device.
 */
export const switchVideo = async ({videoPreference, parameters}) => {
    // Destructure parameters for ease of use
    let {
        recordStarted,
        recordResumed,
        recordStopped,
        recordPaused,
        recordingMediaOptions,
        videoAlreadyOn,
        userDefaultVideoInputDevice,
        defVideoID,
        allowed,
        updateDefVideoID,
        updateAllowed,
        updatePrevVideoInputDevice,
        updateUserDefaultVideoInputDevice,
        updateIsMediaSettingsModalVisible,

        //mediasfu functions
        createSendTransport,
        connectSendTransportVideo,
        showAlert,
        reorderStreams,
        switchUserVideo,
    } = parameters;

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

    // Set default video ID if not already set
    if (!defVideoID) {
        if (userDefaultVideoInputDevice) {
            defVideoID = userDefaultVideoInputDevice;
        } else {
            defVideoID = 'default';
        }
        updateDefVideoID(defVideoID);
    }

    // Switch video only if the selected video device is different from the default
    if (videoPreference !== defVideoID) {
        let prevVideoInputDevice = userDefaultVideoInputDevice;
        updatePrevVideoInputDevice(prevVideoInputDevice);

        userDefaultVideoInputDevice = videoPreference;
        updateUserDefaultVideoInputDevice(userDefaultVideoInputDevice);

        // Get the current video device ID and initiate the switch
        if (defVideoID) {
            updateIsMediaSettingsModalVisible(false);
            await switchUserVideo({ videoPreference, checkoff, parameters });
        }
    }
};
