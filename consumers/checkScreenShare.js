/**
 * Checks and handles screen share permission.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing functions for handling screen sharing.
 * @param {Function} options.parameters.stopShareScreen - Function to stop screen sharing.
 * @param {Function} options.parameters.requestScreenShare - Function to request screen sharing.
 * @param {Function} options.parameters.showAlert - Function to show alert messages.
 * @param {boolean} options.parameters.shared - Flag indicating if screen sharing is currently active.
 * @param {boolean} options.parameters.whiteboardStarted - Flag indicating if the whiteboard is active.
 * @param {boolean} options.parameters.whiteboardEnded - Flag indicating if the whiteboard session has ended.
 * @param {boolean} options.parameters.breakOutRoomStarted - Flag indicating if a breakout room is active.
 * @param {boolean} options.parameters.breakOutRoomEnded - Flag indicating if the breakout room session has ended.
 * @throws Throws an error if an issue occurs during screen share handling.
 */
export async function checkScreenShare({ parameters }) {
  try {
    const {
      shared,
      showAlert,
      whiteboardStarted,
      whiteboardEnded,
      breakOutRoomStarted,
      breakOutRoomEnded,

      //mediasfu functions
      stopShareScreen,
      requestScreenShare,
    } = parameters;

    // Stop screen share if already shared or request screen share if not shared
    if (shared) {
      if (whiteboardStarted && !whiteboardEnded) {
        showAlert({ message: 'Screen share is not allowed when whiteboard is active', type: 'danger' });
        return;
      }
      await stopShareScreen({ parameters });
    } else {
      // Can't share if breakout room is active
      if (breakOutRoomStarted && !breakOutRoomEnded) {
        showAlert({ message: 'Screen share is not allowed when breakout room is active', type: 'danger' });
        return;
      }

      if (whiteboardStarted && !whiteboardEnded) {
        showAlert({ message: 'Screen share is not allowed when whiteboard is active', type: 'danger' });
        return;
      }
      await requestScreenShare({ parameters });
    }
  } catch (error) {
    console.log('checkScreenShare error', error);
    // throw error;
  }
}