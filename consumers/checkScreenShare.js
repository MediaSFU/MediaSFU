/**
 * Checks and handles screen share permission.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing functions for handling screen sharing.
 * @param {Function} options.parameters.stopShareScreen - Function to stop screen sharing.
 * @param {Function} options.parameters.requestScreenShare - Function to request screen sharing.
 * @throws Throws an error if an issue occurs during screen share handling.
 */
export async function checkScreenShare({ parameters }) {
  try {
    let {
       shared,


      //mediasfu functions
       stopShareScreen, 
       requestScreenShare
       } = parameters;

    // Stop screen share if already shared or request screen share if not shared
    if (shared) {
      await stopShareScreen({parameters});
    } else {
      await requestScreenShare({parameters});
    }
  } catch (error) {
    console.log('checkScreenShare error', error);
    // throw error;
  }
}
