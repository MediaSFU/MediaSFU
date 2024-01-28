/**
 * Responds to a participant waiting in the waiting room by updating the waiting list and emitting an event to allow the participant into the room.
 *
 * @param {Object} options - Options for responding to a waiting participant.
 * @param {Object} options.parameters - Object containing various states and functions related to the waiting room.
 * @param {string} options.parameters.participantId - The ID of the participant waiting to be allowed into the room.
 * @param {string} options.parameters.participantName - The name of the participant waiting to be allowed into the room.
 * @param {Function} options.parameters.updateWaitingList - Function to update the waiting list after responding to a participant.
 * @param {Array} options.parameters.waitingList - The current waiting list containing participants waiting to join the room.
 * @param {string} options.parameters.type - The type of response to the waiting participant (e.g., 'allow', 'deny').
 * @param {string} options.parameters.roomName - The name of the room where the waiting participant is trying to join.
 * @param {SocketIOClient.Socket} options.parameters.socket - The Socket.IO client socket for emitting events.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the respondToWaiting function
 * respondToWaiting({
 *   parameters: {
 *     participantId: '123',
 *     participantName: 'John Doe',
 *     updateWaitingList,
 *     waitingList: ['Alice', 'Bob'],
 *     type: 'allow',
 *     roomName: 'Event Room',
 *     socket: socketInstance, // Provide the Socket.IO client socket instance
 *   },
 * });
 */
export const respondToWaiting = async ({ parameters }) => {
  // Function implementation for responding to a waiting participant
  const { participantId, participantName, updateWaitingList, waitingList, type, roomName, socket } = parameters;

  // Filter out the participant from the waiting list
  let newWaitingList = waitingList.filter((item) => item.name !== participantName);

  // Update the waiting list
  updateWaitingList(newWaitingList);

  // Emit an event to allow or deny the participant based on the response type
  await socket.emit('allowUserIn', { participantId, participantName, type, roomName });
};
