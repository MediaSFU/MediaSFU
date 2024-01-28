/**
 * modifySettings - A method for modifying settings related to audio, video, screenshare, and chat.
 * @param {Object} params - The parameters passed to the modifySettings method.
 * @param {Object} params.parameters - The object containing parameters for the modifySettings method.
 * @param {Function} params.parameters.showAlert - A function to show an alert.
 * @param {string} params.parameters.roomName - The name of the room.
 * @param {string} params.parameters.audioSetting - The current audio setting.
 * @param {string} params.parameters.videoSetting - The current video setting.
 * @param {string} params.parameters.screenshareSetting - The current screenshare setting.
 * @param {string} params.parameters.chatSetting - The current chat setting.
 * @param {string} params.parameters.audioSet - The new audio setting.
 * @param {string} params.parameters.videoSet - The new video setting.
 * @param {string} params.parameters.screenshareSet - The new screenshare setting.
 * @param {string} params.parameters.chatSet - The new chat setting.
 * @param {Object} params.parameters.socket - The socket object for emitting events.
 * @param {Function} params.parameters.updateAudioSetting - A function to update the audio setting state.
 * @param {Function} params.parameters.updateVideoSetting - A function to update the video setting state.
 * @param {Function} params.parameters.updateScreenshareSetting - A function to update the screenshare setting state.
 * @param {Function} params.parameters.updateChatSetting - A function to update the chat setting state.
 * @param {Function} params.parameters.updateIsSettingsModalVisible - A function to update the visibility state of the settings modal.
 * @returns {void} - No return value.
 */

export const modifySettings = async({ parameters }) => {

    const {
        showAlert,
        roomName,
        audioSetting,
        videoSetting,
        screenshareSetting,
        chatSetting,
        audioSet,
        videoSet,
        screenshareSet,
        chatSet,
        socket,

        updateAudioSetting,
        updateVideoSetting,
        updateScreenshareSetting,
        updateChatSetting,
        updateIsSettingsModalVisible,

        // Add other state update functions as needed

    } = parameters;

    if (roomName.toLowerCase().startsWith('d')) {

        //none should be approval 
        if (audioSet == 'approval' || videoSet == 'approval' || screenshareSet == 'approval' || chatSet == 'approval') {

            if (showAlert) {
                showAlert({
                    message: 'You cannot set approval for demo mode.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            return;

        }
    }

    // Check and update state variables based on the provided logic
    if (audioSet){
        updateAudioSetting(audioSet);
    }
    if (videoSet){
        updateVideoSetting(videoSet);
    }
    if (screenshareSet){
        updateScreenshareSetting(screenshareSet);
    }
    if (chatSet){
        updateChatSetting(chatSet);
    }
   
    let settings = [audioSet, videoSet, screenshareSet, chatSet]
    await socket.emit('updateSettingsForRequests', ({ settings, roomName }));


    //close modal
    updateIsSettingsModalVisible(false);
};
