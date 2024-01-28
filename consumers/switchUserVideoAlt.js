/**
 * Switches the user's video device based on the provided video preference.
 * @async
 * @function
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string} params.videoPreference - The preferred facing mode of the video device ('user' or 'environment').
 * @param {boolean} params.checkoff - Flag to check off the video.
 * @param {Object} params.parameters - Additional parameters needed for the function.
 */

import { clickVideo } from "../methods/streamMethods/clickVideo";
export async function switchUserVideoAlt({ videoPreference, checkoff, parameters }) {

    let {getUpdatedAllParams } = parameters;
    let parameters_ = await getUpdatedAllParams()

    let {
        audioOnlyRoom,
        frameRate,
        vidCons,
        showAlert,
        videoSwitching,
        mediaDevices,
        hasCameraPermission,
        updateVideoSwitching,
        updateCurrentFacingMode,
    

        //mediasfu functions
        requestPermissionCamera,
        streamSuccessVideo,
        sleep,
        checkMediaPermission,
    } = parameters;

    let {currentFacingMode,prevFacingMode} = parameters_

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

        // Enumerate video devices
        const videoDevices = await mediaDevices.enumerateDevices();

        // Define media constraints based on preferences and options
        let mediaConstraints = {};

        if (vidCons && vidCons.width && vidCons.height) {
            mediaConstraints = { video: { facingMode: { exact: videoPreference }, ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
        } else {
            mediaConstraints = { video: { facingMode: { exact: videoPreference }, frameRate: { ideal: frameRate } }, audio: false };
        }

        // Get user media with the defined constraints
        await mediaDevices.getUserMedia(mediaConstraints).then(async (stream) => {
            await streamSuccessVideo({ stream, parameters });
        }).catch(async error => {

            let videoDevicesFront = [];

            // Filter video devices based on the preferred facing mode
            if (videoPreference === 'user') {
                videoDevicesFront = videoDevices.filter(device => device.label.includes('front') && device.kind === 'videoinput');
            } else {
                videoDevicesFront = videoDevices.filter(device => device.label.includes('back') && device.kind === 'videoinput');
            }

            if (videoDevicesFront.length > 0) {
                videoDevicesFront.forEach((device) => {
                    if (device.kind === 'videoinput') {
                        let videoDeviceId = device.deviceId;

                        // Update media constraints with the specific video device
                        if (vidCons && vidCons.width && vidCons.height) {
                            mediaConstraints = { video: { deviceId: { exact: videoDeviceId }, ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
                        } else {
                            mediaConstraints = { video: { deviceId: { exact: videoDeviceId }, frameRate: { ideal: frameRate } }, audio: false };
                        }

                        // Try to get user media with the new constraints
                        mediaDevices.getUserMedia(mediaConstraints).then(async (stream) => {
                            await streamSuccessVideo({ stream, parameters });
                        }).catch(error => {
                            // If the current video device is the last one in the list, show the error; otherwise, try the next device
                            if (videoDeviceId === videoDevicesFront[videoDevicesFront.length - 1].deviceId) {
                                currentFacingMode = prevFacingMode;
                                updateCurrentFacingMode(currentFacingMode);
                                if (showAlert) {
                                    showAlert({
                                        message: 'Error switching; not accessible, might need to turn off your video and turn it back on after switching.',
                                        type: 'danger',
                                        duration: 3000,
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                // Show error if no compatible video devices are found
                currentFacingMode = prevFacingMode;
                updateCurrentFacingMode(currentFacingMode);

                if (showAlert) {
                    showAlert({
                        message: 'Error switching; not accessible, might need to turn off your video and turn it back on after switching.',
                        type: 'danger',
                        duration: 3000,
                    });
                }
            }

        });

    } catch (error) {

        // Handle any unexpected errors

        const videoDevices = await mediaDevices.enumerateDevices();
        // Handle any unexpected errors
        let videoDevicesFront = []
        if (videoPreference === 'user') {
            videoDevicesFront = videoDevices.filter(device => device.label.includes('front') && device.kind === 'videoinput');
        } else {
            videoDevicesFront = videoDevices.filter(device => device.label.includes('back') && device.kind === 'videoinput');
        }

        if (videoDevicesFront.length > 0) {
            videoDevicesFront.forEach((device) => {
                if (device.kind === 'videoinput') {
                    let videoDeviceId = device.deviceId;

                    if (vidCons && vidCons.width && vidCons.height) {
                        mediaConstraints = { video: { deviceId: { exact: videoDeviceId }, ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
                    } else {
                        mediaConstraints = { video: { deviceId: { exact: videoDeviceId }, frameRate: { ideal: frameRate } }, audio: false };
                    }

                    mediaDevices.getUserMedia(mediaConstraints).then(async (stream) => {
                        await streamSuccessVideo({ stream, parameters })
                    }).catch(error => {
                        // if current video device is the last one in the list, show the error else try next device
                        if (videoDeviceId === videoDevicesFront[videoDevicesFront.length - 1].deviceId) {

                            currentFacingMode = prevFacingMode
                            updateCurrentFacingMode(currentFacingMode)
                            if (showAlert) {
                                showAlert({
                                    message: 'Error switching; not accessible, might need to turn off your video and turn it back on after switching.',
                                    type: 'danger',
                                    duration: 3000,
                                });
                            }
                        }

                    });
                }
            });
        } else {


            currentFacingMode = prevFacingMode
            updateCurrentFacingMode(currentFacingMode)

            if (showAlert) {
                showAlert({
                    message: 'Error switching; not accessible, might need to turn off your video and turn it back on after switching.',
                    type: 'danger',
                    duration: 3000,
                });
            }
        }
    
    }

}
