/**
 * Retrieves piped producers for a specific user level using a given WebSocket.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.nsock - The WebSocket used for communication.
 * @param {string} options.islevel - The user level for which producers are being retrieved.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {string} options.member - The member for whom producers are being retrieved.
 * @param {Function} options.signalNewConsumerTransport - The function to signal new consumer transport when producers are retrieved.
 * @throws Throws an error if there is an issue during the process of retrieving producers.
 */
export const getPipedProducersAlt = async ({ nsock, islevel, parameters }) => {
  try {
    // Destructure parameters
    let {
      member,

      //mediasfu functions
       signalNewConsumerTransport 
      } = parameters;

    // Emit request to get piped producers using WebSocket
    await nsock.emit('getProducersPipedAlt', { islevel: islevel, member: member }, async (producerIds) => {
      // Check if producers are retrieved
      if (producerIds.length > 0) {
        // Signal new consumer transport for each retrieved producer
        await producerIds.forEach(id => signalNewConsumerTransport({ nsock, remoteProducerId: id, islevel, parameters }));
      }
    });
  } catch (error) {
    // Handle errors during the process of retrieving producers
    console.log('Error getting piped producers:', error.message);
    // throw error;
  }
};
