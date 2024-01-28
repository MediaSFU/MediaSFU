/**
 * Function to initiate the disconnection of the user (self) from the room, often used when banning a user.
 *
 * @async
 * @function
 * @param {Object} params - Parameters for the disconnectUserSelf function.
 * @param {Object} params.parameters - Additional parameters for disconnectUserSelf logic.
 * @param {Object} params.parameters.member - Information about the user to be disconnected.
 * @param {string} params.parameters.roomName - The name or identifier of the room from which the user will be disconnected.
 * @param {Object} params.parameters.socket - The socket instance to emit the disconnection request.
 * @returns {Promise<void>} - Promise that resolves after initiating the disconnection.
 *
 * @example
 * // Example usage of disconnectUserSelf function
 * disconnectUserSelf({
 *   parameters: {
 *     member: { userId: '123', username: 'JohnDoe' },
 *     roomName: 'exampleRoom',
 *     socket: socketInstance,
 *   },
 * });
 */
export async function disconnectUserSelf({ parameters }) {

    let {
        member,
        roomName,
        socket
    } = parameters;

    // Update that the user needs to be disconnected; this is initiated by the host when banning a user
    await socket.emit('disconnectUser', { member: member, roomName: roomName, ban: true });
}
