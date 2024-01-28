/**
 * Handles the action for the screen button, including starting and stopping screen sharing.
 *
 * @param {Object} options - Options for handling the screen button action.
 * @param {Object} options.parameters - Object containing various functions and states related to the screen button action.
 * @param {Function} options.parameters.showAlert - Function to display alerts.
 * @param {string} options.parameters.roomName - The name of the current room.
 * @param {string} options.parameters.member - The name of the current participant.
 * @param {Object} options.parameters.socket - The socket connection object.
 * @param {string} options.parameters.islevel - The level of the current participant.
 * @param {boolean} options.parameters.youAreCoHost - Flag indicating whether the current participant is a co-host.
 * @param {boolean} options.parameters.adminRestrictSetting - Flag indicating whether screen sharing is restricted by the host.
 * @param {boolean} options.parameters.audioSetting - Audio setting for the current participant.
 * @param {boolean} options.parameters.videoSetting - Video setting for the current participant.
 * @param {boolean} options.parameters.screenshareSetting - Screen sharing setting for the current participant.
 * @param {boolean} options.parameters.chatSetting - Chat setting for the current participant.
 * @param {boolean} options.parameters.screenAction - Flag indicating the current screen action (start/stop).
 * @param {boolean} options.parameters.screenAlreadyOn - Flag indicating whether screen sharing is already active.
 * @param {string} options.parameters.screenRequestState - The state of the screen sharing request (pending/approved/rejected).
 * @param {number} options.parameters.screenRequestTime - The timestamp of the last screen sharing request.
 * @param {Function} options.parameters.updateScreenRequestState - Function to update the screen sharing request state.
 * @param {Function} options.parameters.updateScreenAlreadyOn - Function to update the flag indicating screen sharing status.
 * @param {Function} options.parameters.updateScreenAction - Function to update the current screen action.
 * @param {Function} options.parameters.updateScreenRequestTime - Function to update the timestamp of the last screen sharing request.
 * @param {Function} options.parameters.updateScreenRequestState - Function to update the screen sharing request state.
 * @param {Function} options.parameters.checkPermission - Function to check permission for screen sharing.
 * @param {Function} options.parameters.checkScreenShare - Function to initiate screen sharing.
 * @param {Function} options.parameters.stopShareScreen - Function to stop screen sharing.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the clickScreenShare function
 * clickScreenShare({
 *   parameters: {
 *     showAlert,
 *     roomName,
 *     member,
 *     socket,
 *     islevel,
 *     youAreCoHost,
 *     adminRestrictSetting,
 *     audioSetting,
 *     videoSetting,
 *     screenshareSetting,
 *     chatSetting,
 *     screenAction,
 *     screenAlreadyOn,
 *     screenRequestState,
 *     screenRequestTime,
 *     updateScreenRequestState,
 *     updateScreenAlreadyOn,
 *     updateScreenAction,
 *     updateScreenRequestTime,
 *     updateScreenRequestState,
 *     checkPermission,
 *     checkScreenShare,
 *     stopShareScreen,
 *   },
 * });
 */
export const clickScreenShare = async ({ parameters }) => {
    // Function implementation for handling the screen button action
    let {
        showAlert,
        roomName,
        member,
        socket,
        islevel,
        youAreCoHost,
        adminRestrictSetting,
        audioSetting,
        videoSetting,
        screenshareSetting,
        chatSetting,
        screenAction,
        screenAlreadyOn,
        screenRequestState,
        screenRequestTime,
        audioOnlyRoom,
  


        updateScreenRequestState,
        updateScreenAlreadyOn,
        updateScreenAction,
        updateScreenRequestTime,
        

        //mediasfu functions
        checkPermission,
        checkScreenShare,
        stopShareScreen,

        
    } = parameters;

    // Check if the room is audio-only
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

    // Check if the room is a demo room
    if (roomName.startsWith('d')) {
        if (showAlert) {
            showAlert({
                message: 'You cannot start screen share in a demo room.',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
    }

    // Toggle screen sharing based on current status
    if (screenAlreadyOn) {
        screenAlreadyOn = false;
        updateScreenAlreadyOn(screenAlreadyOn);
        await stopShareScreen({ parameters });
    } else {
        // Check if screen sharing is restricted by the host
        if (adminRestrictSetting) {
            if (showAlert) {
                showAlert({
                    message: 'You cannot start screen share. Access denied by host.',
                    type: 'danger',
                    duration: 3000,
                });
            }
            return;
        }

        let response = 2;
        // Check and turn on screen sharing
        if (!screenAction && islevel != '2' && !youAreCoHost) {
            response = await checkPermission({
                permissionType: 'screenshareSetting',
                parameters: { audioSetting, videoSetting, screenshareSetting, chatSetting },
            });
        } else {
            response = 0;
        }

        // Handle different responses
        switch (response) {
            case 0:
                // Allow screen sharing
                checkScreenShare({ parameters });
                break;
            case 1:
                // Approval required
                // Check if a request is already pending
                if (screenRequestState === 'pending') {
                    if (showAlert) {
                        showAlert({
                            message: 'A request is already pending. Please wait for the host to respond.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                    return;
                }

                // Check if rejected and current time is less than screenRequestTime
                if (screenRequestState === 'rejected' && Date.now() - screenRequestTime < requestIntervalSeconds) {
                    if (showAlert) {
                        showAlert({
                            message: 'You cannot send another request at this time.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                    return;
                }

                // Send request to host
                if (showAlert) {
                    showAlert({
                        message: 'Your request has been sent to the host.',
                        type: 'success',
                        duration: 3000,
                    });
                }
                screenRequestState = 'pending';
                updateScreenRequestState(screenRequestState);

                // Create a request and add it to the request list, then send it to the host
                let userRequest = { id: socket.id, name: member, icon: 'fa-desktop' };
                await socket.emit('participantRequest', { userRequest, roomName });
                break;
            case 2:
                // Disallow screen sharing
                if (showAlert) {
                    showAlert({
                        message: 'You are not allowed to start screen share.',
                        type: 'danger',
                        duration: 3000,
                    });
                }
                break;
            default:
        }
    }
};
