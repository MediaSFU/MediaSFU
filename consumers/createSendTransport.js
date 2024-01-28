/**
 * Creates a send transport for producing media and establishes necessary event listeners.
 *
 * @param {Object} options - The options object.
 * @param {string} options.option - The option indicating the type of media to produce ('audio', 'video', 'screen', or 'all').
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {string} options.parameters.islevel - The level of the participant ('0', '1', or '2'; '2' is the host).
 * @param {string} options.parameters.member - The identity of the participant.
 * @param {Object} options.parameters.socket - The socket used for communication.
 * @param {Object} options.parameters.device - The WebRTC device object.
 * @param {boolean} options.parameters.transportCreated - The state indicating whether the transport is created.
 * @param {Object} options.parameters.producerTransport - The WebRTC send transport.
 * @param {Function} options.parameters.updateProducerTransport - The function to update the producer transport state.
 * @param {Function} options.parameters.updateTransportCreated - The function to update the transport creation state.
 * @param {Function} options.parameters.connectSendTransport - The function to connect the send transport.
 * @throws Throws an error if there is an issue during the creation of the send transport.
 */
export const createSendTransport = async ({ option, parameters }) => {
  try {
    // Destructure parameters
    let {
      islevel,
      member,
      socket,
      device,
      transportCreated,
      producerTransport,
      updateProducerTransport,
      updateTransportCreated,

      //mediasfu functions
      connectSendTransport,
    } = parameters;

    device = await parameters.getUpdatedAllParams().device

    // Emit createWebRtcTransport event to the server
    await socket.emit('createWebRtcTransport', { consumer: false, islevel: islevel }, async ({ params }) => {
      // Check if there is an error in the response
      if (params.error) {
        return;
      }

      // Create a WebRTC send transport
      producerTransport = await device.createSendTransport(params);
      await updateProducerTransport(producerTransport);

      // Handle 'connect' event
      await producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.emit('transport-connect', {
            dtlsParameters,
          });
          callback();
        } catch (error) {
          errback(error);
        }
      });

      // Handle 'produce' event
      await producerTransport.on('produce', async (parameters, callback, errback) => {
        try {
          await socket.emit(
            'transport-produce',
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
              islevel: islevel,
              name: member,
            },
            async ({ id, producersExist }) => {
              callback({ id });
            }
          );
        } catch (error) {
          errback(error);
        }
      });

      // Handle 'connectionstatechange' event
      await producerTransport.on('connectionstatechange', async (state) => {
        switch (state) {
          case 'connecting':
            break;
          case 'connected':
            break;
          case 'failed':
            await producerTransport.close();
            break;
          default:
            break;
        }
      });

      // Update transport creation state
      transportCreated = true;
      await connectSendTransport({
        option: option,
        parameters: {
          ...parameters,
          producerTransport: producerTransport,
        },
      });

      updateTransportCreated(true);
    });
  } catch (error) {
    // Handle errors during transport creation
    try {
      let { showAlert } = parameters;
    } catch (error) {
      if (showAlert) {
        showAlert({
          message: 'Error creating transport - ' + error.message,
          type: 'danger',
          duration: 3000,
        });
      }
    }
  }
};
