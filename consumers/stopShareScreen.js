/**
 * Stops the screen sharing and performs necessary updates.
 *
 * @param {Object} parameters - The parameters object containing necessary variables and functions.
 * @param {boolean} parameters.shared - Indicates whether screen sharing is currently active.
 * @param {boolean} parameters.shareScreenStarted - Indicates whether screen sharing has started.
 * @param {boolean} parameters.shareEnded - Indicates whether screen sharing has ended.
 * @param {boolean} parameters.updateMainWindow - Indicates whether to update the main window.
 * @param {boolean} parameters.defer_receive - Indicates whether to defer receiving streams.
 * @param {string} parameters.hostLabel - The label of the host user.
 * @param {boolean} parameters.lock_screen - Indicates whether the screen is locked.
 * @param {boolean} parameters.forceFullDisplay - Indicates whether to force full display.
 * @param {boolean} parameters.firstAll - Indicates whether it's the first round for all participants.
 * @param {boolean} parameters.first_round - Indicates whether it's the first round.
 * @param {MediaStream} parameters.localStreamScreen - The local screen sharing stream.
 * @param {Function} parameters.updateShared - Function to update the shared state.
 * @param {Function} parameters.updateShareScreenStarted - Function to update the shareScreenStarted state.
 * @param {Function} parameters.updateShareEnded - Function to update the shareEnded state.
 * @param {Function} parameters.updateUpdateMainWindow - Function to update the updateMainWindow state.
 * @param {Function} parameters.updateDefer_receive - Function to update the defer_receive state.
 * @param {Function} parameters.updatehostLabel - Function to update the hostLabel state.
 * @param {Function} parameters.updateLock_screen - Function to update the lock_screen state.
 * @param {Function} parameters.updateForceFullDisplay - Function to update the forceFullDisplay state.
 * @param {Function} parameters.updateFirstAll - Function to update the firstAll state.
 * @param {Function} parameters.updateFirst_round - Function to update the first_round state.
 * @param {Function} parameters.updateLocalStreamScreen - Function to update the localStreamScreen state.
 * @param {Function} parameters.updateMainHeightWidth - Function to update the main height and width.
 * @param {Function} parameters.disconnectSendTransportScreen - Function to disconnect the screen share transport.
 * @param {Function} parameters.prepopulateUserMedia - Function to prepopulate user media.
 * @param {Function} parameters.reorderStreams - Function to reorder streams.
 * @param {Function} parameters.getVideos - Function to get video streams.
 * @param {string} parameters.eventType - The type of the event (e.g., 'conference').
 * @param {number} parameters.prevForceFullDisplay - The previous state of forceFullDisplay.
 * @param {boolean} parameters.annotateScreenStream - Indicates whether screen annotation is active.
 * @param {Function} parameters.updateAnnotateScreenStream - Function to update the annotateScreenStream state.
 * @param {Funcion} parameters.updateIsScreenboardModalVisible - Function to update the screen annotation modal visibility.
 * @returns {Promise<void>} - A Promise that resolves after stopping screen sharing and performing updates.
 */
export async function stopShareScreen({ parameters }) {
  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams();

  let {
    shared,
    shareScreenStarted,
    shareEnded,
    updateMainWindow,
    defer_receive,
    hostLabel,
    lock_screen,
    forceFullDisplay,
    firstAll,
    first_round,
    localStreamScreen,
    eventType,
    prevForceFullDisplay,
    annotateScreenStream,

    // updates for the above
    updateShared,
    updateShareScreenStarted,
    updateShareEnded,
    updateUpdateMainWindow,
    updateDefer_receive,
    updatehostLabel,
    updateLock_screen,
    updateForceFullDisplay,
    updateFirstAll,
    updateFirst_round,
    updateLocalStreamScreen,
    updateMainHeightWidth,
    updateAnnotateScreenStream,
    updateIsScreenboardModalVisible,

    // mediasfu functions
    disconnectSendTransportScreen,
    prepopulateUserMedia,
    reorderStreams,
    getVideos,



  } = parameters;

  shared = false;
  updateShared(shared);
  shareScreenStarted = false;
  updateShareScreenStarted(shareScreenStarted);
  shareEnded = true;
  updateShareEnded(shareEnded);
  updateMainWindow = true;
  updateUpdateMainWindow(updateMainWindow);

  if (defer_receive) {
    defer_receive = false;
    updateDefer_receive(defer_receive);
    await getVideos({ parameters });
  }

  await localStreamScreen.getTracks().forEach(track => track.stop());
  updateLocalStreamScreen(localStreamScreen);
  await disconnectSendTransportScreen({ parameters });

  try {
    if (annotateScreenStream) {
      annotateScreenStream = false;
      updateAnnotateScreenStream(annotateScreenStream);
      updateIsScreenboardModalVisible(true)
      await new Promise(resolve => setTimeout(resolve, 500));
      updateIsScreenboardModalVisible(false)
    }
  } catch (error) {
    console.log('Error handling screen annotation:', error);
  }

  if (eventType == 'conference') {
    updateMainHeightWidth(0);
  }

  try {
    await prepopulateUserMedia({ name: hostLabel, parameters });
  } catch (error) {

  }

  try {
    await reorderStreams({ add: false, screenChanged: true, parameters });
  } catch (error) {
  }

  lock_screen = false;
  updateLock_screen(lock_screen);
  forceFullDisplay = prevForceFullDisplay;
  updateForceFullDisplay(forceFullDisplay);
  firstAll = false;
  updateFirstAll(firstAll);
  first_round = false;
  updateFirst_round(first_round);
}