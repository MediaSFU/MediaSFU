/**
 * Initiates the process to disconnect a user from the room and, optionally, ban them.
 *
 * @param {Object} parameters - The parameters required for initiating the user disconnection.
 * @param {SocketIOClient.Socket} parameters.socket - The Socket.IO client instance.
 * @param {Object} parameters.member - The information about the member/user to be disconnected.
 * @param {string} parameters.roomName - The name of the room from which the member will be disconnected.
 * @param {boolean} [parameters.ban=false] - A flag indicating whether to ban the user after disconnection (default is false).
 *
 * @returns {Promise<void>}
 *
 * @example
 * // Example usage of confirmExit
 * await confirmExit({
 *   socket: socketInstance,
 *   member: { id: '123', name: 'John Doe' },
 *   roomName: 'example-room',
 *   ban: true,
 * });
 */
export const confirmExit = async ({ parameters }) => {
    let { socket, member, roomName, ban = false } = parameters;
  
    // Emit a socket event to disconnect the user from the room
    await socket.emit('disconnectUser', { member: member, roomName: roomName, ban: ban });
  };
  