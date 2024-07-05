/**
 * Resume the send transport for audio and update the UI accordingly.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Object} options.parameters.audioProducer - The audio producer object.
 * @param {string} options.parameters.islevel - The level of the user.
 * @param {Function} options.parameters.updateMainWindow - Function to update the main window.
 * @param {string} options.parameters.hostLabel - The label of the host.
 * @param {boolean} options.parameters.lock_screen - Flag indicating whether the screen is locked.
 * @param {boolean} options.parameters.shared - Flag indicating whether the screen is shared.
 * @param {Function} options.parameters.updateAudioProducer - Function to update the audio producer state.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 */
export const resumeSendTransportAudio = async ({ parameters }) => {
  try {
    let { audioProducer, islevel, updateMainWindow, hostLabel, lock_screen, shared, 
      updateAudioProducer, videoAlreadyOn,updateUpdateMainWindow,
      
      //mediasfu functions
      prepopulateUserMedia 
    } = parameters;

    // Resume send transport for audio
    audioProducer.resume();

    // Update the UI
    if (!videoAlreadyOn && islevel === '2') {
      if (!lock_screen && !shared) {
        updateMainWindow=true;
        updateUpdateMainWindow(updateMainWindow);
        await prepopulateUserMedia({ name: hostLabel, parameters });
        updateMainWindow=false;
        updateUpdateMainWindow(updateMainWindow);
      }
    }

    // Update audio producer state
    updateAudioProducer(audioProducer);
  } catch (error) {
    // Handle errors during the process of resuming the audio send transport
    throw new Error(`Error during resuming audio send transport: ${error.message}`);
  }
};
