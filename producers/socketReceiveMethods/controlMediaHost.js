/**
 * Controls the media (audio, video, screenshare, chat) of a participant as a host.
 *
 * @param {object} options - The function parameters.
 * @param {string} options.type - The type of media to control ('audio', 'video', 'screenshare', 'chat', 'all').
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {boolean} options.parameters.adminRestrictSetting - The setting to restrict host control.
 * @param {function} options.parameters.updateAdminRestrictSetting - Function to update the adminRestrictSetting.
 * @param {MediaStream} options.parameters.localStream - The local audio and video stream.
 * @param {function} options.parameters.updateLocalStream - Function to update the local audio and video stream.
 * @param {boolean} options.parameters.audioAlreadyOn - Indicates whether audio is currently on.
 * @param {function} options.parameters.updateAudioAlreadyOn - Function to update the audioAlreadyOn status.
 * @param {MediaStream} options.parameters.localStreamScreen - The local screenshare stream.
 * @param {function} options.parameters.updateLocalStreamScreen - Function to update the local screenshare stream.
 * @param {boolean} options.parameters.screenAlreadyOn - Indicates whether screenshare is currently on.
 * @param {function} options.parameters.updateScreenAlreadyOn - Function to update the screenAlreadyOn status.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates whether video is currently on.
 * @param {function} options.parameters.updateVideoAlreadyOn - Function to update the videoAlreadyOn status.
 * @param {boolean} options.parameters.chatAlreadyOn - Indicates whether chat is currently on.
 * @param {function} options.parameters.updateChatAlreadyOn - Function to update the chatAlreadyOn status.
 * @param {function} options.parameters.onScreenChanges - Function to handle changes in screen status.
 * @param {function} options.parameters.stopShareScreen - Function to stop sharing the screen.
 * @param {function} options.parameters.disconnectSendTransportVideo - Function to disconnect video send transport.
 * @param {function} options.parameters.disconnectSendTransportAudio - Function to disconnect audio send transport.
 * @param {function} options.parameters.disconnectSendTransportScreen - Function to disconnect screenshare send transport.
 */
export const controlMediaHost = async ({ type, parameters }) => {
  let {
    adminRestrictSetting,
    updateAdminRestrictSetting,
    localStream,
    updateLocalStream,
    audioAlreadyOn,
    updateAudioAlreadyOn,
    localStreamScreen,
    updateLocalStreamScreen,
    screenAlreadyOn,
    updateScreenAlreadyOn,
    videoAlreadyOn,
    updateVideoAlreadyOn,
    updateChatAlreadyOn,
    chatAlreadyOn,

    //media functions
    onScreenChanges,
    stopShareScreen,
    disconnectSendTransportVideo,
    disconnectSendTransportAudio,
    disconnectSendTransportScreen,
  } = parameters;

  // Update to control the media of a participant by the host
  // Type is the type of media ('audio', 'video', 'screenshare', 'chat', 'all')

  try {
    adminRestrictSetting = true;
    updateAdminRestrictSetting(adminRestrictSetting);

    if (type === 'audio') {
      localStream.getAudioTracks()[0].enabled = false;
      updateLocalStream(localStream);
      await disconnectSendTransportAudio({ parameters });
      audioAlreadyOn = false;
      updateAudioAlreadyOn(audioAlreadyOn);
    } else if (type === 'video') {
      localStream.getVideoTracks()[0].enabled = false;
      updateLocalStream(localStream);
      await disconnectSendTransportVideo({ parameters });
      videoAlreadyOn = false;
      await onScreenChanges({ changed: true, parameters });
      updateVideoAlreadyOn(videoAlreadyOn);
    } else if (type === 'screenshare') {
      localStreamScreen.getVideoTracks()[0].enabled = false;
      updateLocalStreamScreen(localStreamScreen);
      await disconnectSendTransportScreen({ parameters });
      await stopShareScreen({ parameters });
      screenAlreadyOn = false;
      updateScreenAlreadyOn(screenAlreadyOn);
    } else if (type === 'chat') {
      chatAlreadyOn = false;
      updateChatAlreadyOn(chatAlreadyOn);
    } else if (type === 'all') {
      try {
        localStream.getAudioTracks()[0].enabled = false;
        updateLocalStream(localStream);
        await disconnectSendTransportAudio({ parameters });
        audioAlreadyOn = false;
        updateAudioAlreadyOn(audioAlreadyOn);
      } catch (error) {
        console.log('Error controlling audio:', error);
      }

      try {
        localStreamScreen.getVideoTracks()[0].enabled = false;
        updateLocalStreamScreen(localStreamScreen);
        await disconnectSendTransportScreen({ parameters });
        await stopShareScreen({ parameters });
        screenAlreadyOn = false;
        updateScreenAlreadyOn(screenAlreadyOn);
      } catch (error) {
        console.log('Error controlling screenshare:', error);
      }

      try {
        localStream.getVideoTracks()[0].enabled = false;
        updateLocalStream(localStream);
        await disconnectSendTransportVideo({ parameters });
        videoAlreadyOn = false;
        await onScreenChanges({ changed: true, parameters });
        updateVideoAlreadyOn(videoAlreadyOn);
      } catch (error) {
        console.log('Error controlling video:', error);
      }
    }
  } catch (error) {
    console.log('Error in controlMediaHost:', error);
  }
};
