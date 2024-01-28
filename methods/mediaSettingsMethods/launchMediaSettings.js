/**
 * Launches the media settings modal, updating available audio and video input devices.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {function} params.updateIsMediaSettingsModalVisible - Function to update the visibility state of the media settings modal.
 * @param {boolean} params.IsMediaSettingsModalVisible - Flag indicating whether the media settings modal is currently visible.
 * @param {Object} params.mediaDevices - Media devices API for enumerating devices.
 * @param {Array} params.audioInputs - Array to store available audio input devices.
 * @param {Array} params.videoInputs - Array to store available video input devices.
 * @param {function} params.updateAudioInputs - Function to update the available audio input devices.
 * @param {function} params.updateVideoInputs - Function to update the available video input devices.
 */
export const launchMediaSettings = async ({ parameters }) => {
  // Destructure parameters for ease of use
  let {
      updateIsMediaSettingsModalVisible,
      IsMediaSettingsModalVisible,
      mediaDevices,
      audioInputs,
      videoInputs,
      updateAudioInputs,
      updateVideoInputs,
  } = parameters;

  // Check if media settings modal is not visible and update available audio and video input devices
  if (!IsMediaSettingsModalVisible) {
   

      try {
          // Get the list of all available media devices
          const devices = await mediaDevices.enumerateDevices();

          // Filter the devices to get only audio and video input devices
          videoInputs = devices.filter(device => device.kind === 'videoinput');
          audioInputs = devices.filter(device => device.kind === 'audioinput');

          // Update the available audio and video input devices
          updateVideoInputs(videoInputs);
          updateAudioInputs(audioInputs);
      } catch (error) {
          console.log('Error getting media devices', error);
      }
  }

  // Open or close the media settings modal based on its current visibility state
  updateIsMediaSettingsModalVisible(!IsMediaSettingsModalVisible);
};
