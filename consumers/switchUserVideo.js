/**
 * Switches the user's video device based on the provided video preference.
 * @async
 * @function
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string} params.videoPreference - The preferred video device ID.
 * @param {boolean} params.checkoff - Flag to check off the video.
 * @param {Object} params.parameters - Additional parameters needed for the function.
 */
import { clickVideo } from "../methods/streamMethods/clickVideo";

export async function switchUserVideo({ videoPreference, checkoff, parameters }) {
    // function to switch the user's video device
    let {
        audioOnlyRoom,
        currentFacingMode,
        prevFacingMode,
        videoDevices,
        frameRate,
        vidCons,
        prevVideoInputDevice,
        userDefaultVideoInputDevice,
        showAlert,
        videoSwitching,
        mediaDevices,
        hasCameraPermission,
        updateVideoSwitching,
        updateCurrentFacingMode,
        updateVideoDevices,
        updateUserDefaultVideoInputDevice,


        //mediasfu functions
        requestPermissionCamera,
        streamSuccessVideo,
        sleep,
        checkMediaPermission,
        // clickVideo,
    } = parameters;

    try {
        // Check if it's an audio-only room
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

        // If checkoff is not true, trigger a click on the video button to turn off the video
        if (!checkoff) {
            await clickVideo({ parameters });
            await updateVideoSwitching(true);
            await sleep(500);
            await updateVideoSwitching(false);
        }

        // Check camera permission
        if (!hasCameraPermission) {
            if (checkMediaPermission) {
                let statusCamera = await requestPermissionCamera();
                console.log('statusCamera', statusCamera);
                if (statusCamera !== 'granted') {
                    if (showAlert) {
                        showAlert({
                            message: 'Allow access to your camera or check if your camera is not being used by another application.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                    return;
                }
            }
        }

        let mediaConstraints = {};

        if (vidCons && vidCons.width && vidCons.height) {
            mediaConstraints = { video: { deviceId: { exact: videoPreference }, ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
        } else {
            mediaConstraints = { video: { deviceId: { exact: videoPreference }, frameRate: { ideal: frameRate } }, audio: false };
        }

        // Get user media with the defined constraints
        await mediaDevices.getUserMedia(mediaConstraints).then(async (stream) => {
            await streamSuccessVideo({ stream, parameters });
        }).catch(async error => {
            // Handle errors and revert to the previous video input device
            userDefaultVideoInputDevice = prevVideoInputDevice;
            updateUserDefaultVideoInputDevice(userDefaultVideoInputDevice);


            if (showAlert) {
                showAlert({
                    message: 'Error switching; not accessible, might need to turn off your video and turn it back on after switching.',
                    type: 'danger',
                    duration: 3000,
                });
            }
        });

    } catch (error) {
        // Handle unexpected errors and revert to the previous video input device
        userDefaultVideoInputDevice = prevVideoInputDevice;
        updateUserDefaultVideoInputDevice(userDefaultVideoInputDevice);

        if (showAlert) {
            showAlert({
                message: 'Error switching; not accessible, might need to turn off your video and turn it back on after switching.',
                type: 'danger',
                duration: 3000,
            });
        }
    }
}
