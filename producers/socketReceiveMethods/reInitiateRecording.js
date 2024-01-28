/**
 * Re-initiates recording based on specific conditions.
 * @async
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables.
 * @param {string} parameters.roomName - The name of the room where recording will be re-initiated.
 * @param {Object} parameters.member - The member initiating the recording.
 * @param {Object} parameters.socket - The WebSocket connection object.
 * @param {boolean} parameters.adminRestrictSetting - A boolean flag indicating if the recording initiation is restricted by admin settings.
 * @returns {Promise<void>} - A Promise that resolves when the recording initiation is attempted.
 */
export const reInitiateRecording = async ({ parameters }) => {
   
  let {
      roomName,
      member,
      socket,
      adminRestrictSetting,
  } = parameters;

      //function to reInitiate recording
      if (!adminRestrictSetting) {

          await socket.emit('startRecordIng', { roomName, member }, ({ success }) => {
            if (success) {
                // Handle success, if needed
            } else {
                // Handle failure, if needed
            }
          })
        }
};
