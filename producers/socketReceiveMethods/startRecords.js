/**
 * Initiates the recording process by sending a 'startRecording' event to the server with the roomName and member information.
 * @function
 * @async
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various state variables and utility functions.
 * @param {string} options.parameters.roomName - The name of the room where recording will be started.
 * @param {string} options.parameters.member - The member initiating the recording.
 * @param {SocketIOClient.Socket} options.parameters.socket - The Socket.IO client socket instance.
 * @returns {void}
 */
export const startRecords = async ({ parameters }) => {
  // Destructure options
  let {
      roomName,
      member,
      socket,
      
  } = parameters;

  // Send the 'startRecording' event to the server with roomName and member information
  await socket.emit('startRecordIng', { roomName, member }, ({ success }) => {
      // Handle the success or failure of starting recording (if needed)
      if (success) {
          // Handle success case
        //   console.log('Recording started', success);
      } else {
          // Handle failure case
        //   console.log('Recording failed to start', success);
      }
  });
};
