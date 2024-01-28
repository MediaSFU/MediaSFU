/**
 * Creates and receives all piped transports for a given room and member using a specific socket (nsock).
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {string} options.parameters.roomName - The name of the room for which to create and receive piped transports.
 * @param {string} options.parameters.member - The member's identity.
 * @param {Object}  nsock - The socket used for communication.
 * @param {Function} options.parameters.getProducersPipedAlt - A function to get and handle producers for a given level.
 * @throws Throws an error if there is an issue during the creation and reception of piped transports.
 */
export const receiveAllPipedTransports = async ({ nsock, parameters }) => {
  try {
    // Destructure parameters
    let { roomName, member,
      //mediasfu functions
      getPipedProducersAlt } = parameters;

    // Emit createReceiveAllTransportsPiped event to the server
    await nsock.emit('createReceiveAllTransportsPiped', { roomName, member }, async ({ producersExist }) => {
      // Array of options representing different levels
      const options = ['0', '1', '2'];

      // If producers exist, loop through each level and get producers
      if (producersExist) {
        for (let i = 0; i < options.length; i++) {
          const islevel = options[i];
          await getPipedProducersAlt({ nsock, islevel, parameters });
        }
      }
    });
  } catch (error) {
    console.log('receiveAllPipedTransports error', error);
    // throw error;
  }
};
