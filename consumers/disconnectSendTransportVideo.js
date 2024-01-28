/**
 * Disconnects the send transport for video and updates the UI accordingly.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Object} options.parameters.videoProducer - The video producer associated with the send transport.
 * @param {Object} options.parameters.socket - The socket used for communication.
 * @param {string} options.parameters.islevel - The level of the participant (e.g., '2' for the host).
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {boolean} options.parameters.lock_screen - A flag indicating whether the screen is locked.
 * @param {Function} options.parameters.updateMainWindow - The function to update the main window state.
 * @param {Function} options.parameters.updateUpdateMainWindow - The function to update the main window update state.
 * @param {Function} options.parameters.updateVideoProducer - The function to update the video producer state.
 * @param {Function} options.parameters.reorderStreams - The function to reorder streams in the UI.
 * @throws Throws an error if there is an issue during the disconnection process.
 */
export const disconnectSendTransportVideo = async ({ parameters }) => {
  try {
    // Destructure parameters
    let {
      videoProducer,
      socket,
      islevel,
      roomName,
      updateMainWindow,
      lock_screen,
      updateUpdateMainWindow,
      updateVideoProducer,
      reorderStreams,
    } = parameters;

    // Close the video producer and update the state
    await videoProducer.close();
    updateVideoProducer(null);

    // Notify the server about pausing video sharing
    await socket.emit('pauseProducerMedia', { mediaTag: 'video', roomName: roomName });

    // Update the UI based on the participant's level and screen lock status
    if (islevel === '2') {
      updateMainWindow = true;
      updateUpdateMainWindow(updateMainWindow);
    }

    if (lock_screen) {
      await reorderStreams({ add: true, screenChanged: true, parameters });
    } else {
      await reorderStreams({ add: false, screenChanged: true, parameters });
    }
  } catch (error) {
    // Handle errors during the disconnection process
    console.log('Error disconnecting send transport for video:', error.message);
  }
};
