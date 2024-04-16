/**
 * Send a request to the socket to request screen share.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Object} options.parameters.socket - The socket object for communication.
 * @param {Function} options.parameters.showAlert - Function to show an alert.
 * @param {Function} options.parameters.startShareScreen - Function to start screen sharing.
 * @throws Throws an error if there is an issue during the process of requesting screen share.
 */
export async function requestScreenShare({ parameters }) {
  try {
    // Destructure parameters
    let { 
      
       socket,
       showAlert,
       localUIMode,

       //mediasfu functions
        startShareScreen
       } = parameters;

    // Check if the user is in local UI mode
    if (localUIMode === true) {
      await startShareScreen({ parameters });
      return;
    }

    await socket.emit('requestScreenShare', async ({ allowScreenShare }) => {
      if (!allowScreenShare) {
        // Send an alert to the user
        if (showAlert) {
          showAlert({
            message: 'You are not allowed to share screen',
            type: 'danger',
            duration: 3000,
          });
        }
      } else {
        await startShareScreen({ parameters });
      }
    });
  } catch (error) {
    // Handle errors during the process of requesting screen share
    // throw new Error(`Error during requesting screen share: ${error.message}`);
    console.log("Error during requesting screen share: ", error);
  }
}

