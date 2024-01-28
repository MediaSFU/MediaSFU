/**
 * Disconnects the send transport for audio, pauses the audio producer, and notifies the server.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Object} options.parameters.audioProducer - The WebRTC audio producer.
 * @param {Object} options.parameters.socket - The socket used for communication.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates whether video is already on.
 * @param {string} options.parameters.islevel - The level of the participant ('2' for the host).
 * @param {boolean} options.parameters.lock_screen - Indicates whether the screen is locked.
 * @param {boolean} options.parameters.shared - Indicates whether the screen is being shared.
 * @param {boolean} options.parameters.updateMainWindow - The function to update the main window state.
 * @param {string} options.parameters.HostLabel - The label for the host.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {Function} options.parameters.updateAudioProducer - The function to update the audio producer state.
 * @param {Function} options.parameters.updateUpdateMainWindow - The function to update the main window update state.
 * @param {Function} options.parameters.prepopulateUserMedia - The function to prepopulate user media.
 * @throws Throws an error if there is an issue during the disconnection.
 */
export const disconnectSendTransportAudio = async ({ parameters }) => {
  try {
    // Destructure parameters
    let {
      audioProducer,
      socket,
      videoAlreadyOn,
      islevel,
      lock_screen,
      shared,
      updateMainWindow,
      HostLabel,
      roomName,
      updateAudioProducer,
      updateUpdateMainWindow,

      //mediasfu functions
      prepopulateUserMedia,
    } = parameters;

    // Pause the audio producer
    await audioProducer.pause();  // actual logic is to close (await audioProducer.close()) but mediaSFU prefers pause if recording 
    updateAudioProducer(audioProducer);

    // Update the UI
    if (!videoAlreadyOn && islevel === '2') {
      if (!lock_screen && !shared) {
        updateMainWindow = true;
        updateUpdateMainWindow(updateMainWindow);
        await prepopulateUserMedia({ name: HostLabel, parameters });
        updateMainWindow = false;
        updateUpdateMainWindow(updateMainWindow);
      }
    }

    // Notify the server about pausing audio producer
    await socket.emit('pauseProducerMedia', { mediaTag: 'audio', roomName: roomName });
  } catch (error) {

  }
};
