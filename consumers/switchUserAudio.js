/**
 * Switches the user's audio device based on the provided audio preference.
 * @async
 * @function
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string} params.audioPreference - The preferred audio device ID.
 * @param {Object} params.parameters - Additional parameters needed for the function.
 */
export async function switchUserAudio({ audioPreference, parameters }) {
    // function to switch the user's audio device
    let {
        mediaDevices,
        userDefaultAudioInputDevice,
        prevAudioInputDevice,
        showAlert,
        hasAudioPermission,
        updatePrevAudioInputDevice,
        updateUserDefaultAudioInputDevice,
        updateAudioPreference,

        //media functions
        streamSuccessAudioSwitch,
        sleep,
        requestPermissionAudio,
        checkMediaPermission,
    } = parameters;

    try {
        // Check if audio permission is granted
        if (!hasAudioPermission) {
            if (checkMediaPermission) {
                let statusMic = await requestPermissionAudio();
                if (statusMic !== 'granted') {
                    if (showAlert) {
                        showAlert({
                            message: 'Allow access to your microphone or check if your microphone is not being used by another application.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                    return;
                }
            }
        }

        let mediaConstraints = { audio: { deviceId: { exact: audioPreference }, echoCancellation: false, noiseSuppression: false, googAutoGainControl: false , autoGainControl: false }, video: false };

        // Get user media with the defined audio constraints
        await mediaDevices.getUserMedia(mediaConstraints).then(async (stream) => {
            await streamSuccessAudioSwitch({ stream, parameters });
        }).catch(error => {
            console.log('Error switching audio A', error);
            // Handle errors and revert to the previous audio input device
            userDefaultAudioInputDevice = prevAudioInputDevice;
            updateUserDefaultAudioInputDevice(userDefaultAudioInputDevice);

            if (showAlert) {
                showAlert({
                    message: 'Error switching; the specified microphone could not be accessed.',
                    type: 'danger',
                    duration: 3000,
                });
            }
        });

    } catch (error) {
        console.log('Error switching audio', error);
        // Handle unexpected errors and revert to the previous audio input device
        userDefaultAudioInputDevice = prevAudioInputDevice;
        updateUserDefaultAudioInputDevice(userDefaultAudioInputDevice);

        if (showAlert) {
            showAlert({
                message: 'Error switching; the specified microphone could not be accessed.',
                type: 'danger',
                duration: 3000,
            });
        }
    }
}
