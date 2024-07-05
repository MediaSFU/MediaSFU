/**
 * Handles the success scenario of sharing a screen stream.
 * 
 * @param {object} options - Options object containing function parameters.
 * @param {MediaStream} options.stream - The local screen stream to be shared.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {Socket} options.parameters.socket - The socket used for communication.
 * @param {boolean} options.parameters.transportCreated - Indicates whether a transport is created.
 * @param {MediaStream} options.parameters.localStreamScreen - The local screen sharing stream.
 * @param {boolean} options.parameters.screenAlreadyOn - Indicates if the screen is already being shared.
 * @param {boolean} options.parameters.screenAction - Indicates if there is an ongoing screen sharing action.
 * @param {boolean} options.parameters.transportCreatedScreen - Indicates whether a screen transport is created.
 * @param {string} options.parameters.hostLabel - The label of the host user.
 * @param {string} options.parameters.eventType - The type of the event (e.g., 'conference').
 * @param {Function} options.parameters.showAlert - Function to display alerts.
 * @param {boolean} options.parameters.annotateScreenStream - Indicates whether screen annotation is active.
 * @param {Function} options.parameters.updateTransportCreatedScreen - Function to update the transportCreatedScreen state.
 * @param {Function} options.parameters.updateScreenAlreadyOn - Function to update the screenAlreadyOn state.
 * @param {Function} options.parameters.updateScreenAction - Function to update the screenAction state.
 * @param {Function} options.parameters.updateTransportCreated - Function to update the transportCreated state.
 * @param {Function} options.parameters.updateLocalStreamScreen - Function to update the localStreamScreen state.
 * @param {Function} options.parameters.updateShared - Function to update the shared state.
 * @param {Function} options.parameters.updateIsScreenboardModalVisible - Function to update the visibility of the screen annotation modal.
 * @param {Function} options.parameters.sleep - Function to create a delay.
 * @param {Function} options.parameters.createSendTransport - Function to create a send transport.
 * @param {Function} options.parameters.connectSendTransportScreen - Function to connect a send transport for screen sharing.
 * @param {Function} options.parameters.disconnectSendTransportScreen - Function to disconnect the screen share transport.
 * @param {Function} options.parameters.stopShareScreen - Function to stop screen sharing.
 * @param {Function} options.parameters.reorderStreams - Function to reorder streams.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 * @param {Function} options.parameters.rePort - Function to handle reporting during screen sharing.
 * @returns {void}
 */

export const streamSuccessScreen = async ({ stream, parameters }) => {
  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams();

  let {
    socket,
    transportCreated,
    localStreamScreen,
    screenAlreadyOn,
    screenAction,
    transportCreatedScreen,
    hostLabel,
    eventType,
    showAlert,
    annotateScreenStream,

    // updates for the above
    updateTransportCreatedScreen,
    updateScreenAlreadyOn,
    updateScreenAction,
    updateTransportCreated,
    updateLocalStreamScreen,
    updateShared,
    updateIsScreenboardModalVisible,
    sleep,

    // mediasoup functions
    createSendTransport,
    connectSendTransportScreen,
    disconnectSendTransportScreen,
    stopShareScreen,
    reorderStreams,
    prepopulateUserMedia,
    rePort,
  } = parameters;

  // Share screen on success
  localStreamScreen = await stream;
  await updateLocalStreamScreen(localStreamScreen);

  try {
    // Create transport if not created else connect transport
    if (!transportCreated) {
      await createSendTransport({ option: 'screen', parameters: { ...parameters, localStreamScreen } });
    } else {
      await connectSendTransportScreen({ stream: localStreamScreen, parameters: { ...parameters, localStreamScreen } });
    }

    // Alert the socket that you are sharing screen
    await socket.emit('startScreenShare');
  } catch (error) {
    if (showAlert) {
      showAlert({
        message: error.message,
        type: 'danger',
        duration: 3000
      });
    }
  }

  // Reupdate the screen display
  try {
    await updateShared(true);
    await prepopulateUserMedia({ name: hostLabel, parameters: { ...parameters, localStreamScreen, shared: true } });
  } catch (error) {}

  // Update the participants array to reflect the change
  screenAlreadyOn = true;
  await updateScreenAlreadyOn(screenAlreadyOn);

  // Reorder streams if required
  try {
    if (eventType == 'conference') {
      await reorderStreams({ add: false, screenChanged: true, parameters });
      await prepopulateUserMedia({ name: hostLabel, parameters });
    } else {
      await reorderStreams({ parameters });
    }
  } catch (error) {
    try {
      await rePort({ parameters });
    } catch (error) {}
  }

  // Handle screen share end
  localStreamScreen.getVideoTracks()[0].onended = async function () {
    // Supports both manual and automatic screen share end
    await disconnectSendTransportScreen({ parameters });
    await stopShareScreen({ parameters });
  };

  // If user requested to share screen, update the screenAction state
  if (screenAction == true) {
    screenAction = false;
  }
  await updateScreenAction(screenAction);

  // Update the transport created state
  transportCreatedScreen = true;
  await updateTransportCreatedScreen(transportCreatedScreen);
  await updateTransportCreated(transportCreated);

  // Handle screen annotation modal
  try {
    if (annotateScreenStream) {
      annotateScreenStream = false;
      updateIsScreenboardModalVisible(true);
      await sleep(500);
      updateIsScreenboardModalVisible(false);
    }
  } catch (error) {
    //console.log('Error handling screen annotation:', error);
  }
};