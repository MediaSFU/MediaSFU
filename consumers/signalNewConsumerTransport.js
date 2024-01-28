/**
 * Signals a new consumer transport to the local consumer.
 *
 * @param {string} remoteProducerId - ID of the remote producer.
 * @param {string} islevel - Level information of the remote producer ('0' or '1' or '2').
 * @param {object} nsock - Socket for communication with the remote server.
 * @param {object} parameters - Additional parameters object containing:
 *   @param {string[]} consumingTransports - Array of remote producer IDs being consumed.
 *   @param {object} device - WebRTC device object.
 *   @param {boolean} lock_screen - Boolean indicating screen lock state.
 *   @param {function} connectRecvTransport - Function to connect the receiving transport.
 *   @param {function} reorderStreams - Function to reorder streams based on conditions.
 */

export const signalNewConsumerTransport = async ({ remoteProducerId, islevel, nsock, parameters }) => {
  try {
    let { device, consumingTransports, lock_screen,
      updateConsumingTransports, updateLockScreen,
      
      //media functions
      connectRecvTransport,
      reorderStreams
    } = parameters;

    device = await parameters.getUpdatedAllParams().device
    consumingTransports = await parameters.getUpdatedAllParams().consumingTransports
    
    // Check if already consuming
    if (consumingTransports.includes(remoteProducerId)) {
      return consumingTransports;
    }

    // Add remote producer ID to consumingTransports array
    await consumingTransports.push(remoteProducerId);
    updateConsumingTransports(consumingTransports);

    // Emit createWebRtcTransport event to signal a new consumer
    await nsock.emit('createWebRtcTransport', { consumer: true, islevel: islevel }, async ({ params }) => {
      if (params.error) {
        // Handle error
        return;
      }

      try {
        // Create a new receiving transport using the received parameters
        let consumerTransport = await device.createRecvTransport(params);

        // Handle 'connect' event for the consumer transport
        await consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
          try {
            // Emit transport-recv-connect event to signal connection
            await nsock.emit('transport-recv-connect', {
              dtlsParameters,
              serverConsumerTransportId: params.id,
            });

            callback();
          } catch (error) {
            errback(error);
          }
        });

        // Listen for connection state change
        await consumerTransport.on('connectionstatechange', async (state) => {
          switch (state) {
            case 'connecting':
              // Handle connecting state
              break;

            case 'connected':
              // Handle connected state
              break;

            case 'failed':
              // Handle failed state
              await consumerTransport.close();

              // Reorder streams based on conditions
              if (lock_screen) {
                await reorderStreams({ add: true, parameters });
              } else {
                await reorderStreams({ add: false, parameters });
              }
              break;

            default:
              break;
          }
        });

        // Connect the receiving transport
        await connectRecvTransport({
          consumerTransport,
          remoteProducerId,
          serverConsumerTransportId: params.id,
          nsock,
          parameters,
        });

      } catch (error) {
        console.log(error, 'createRecvTransport error')
        // Handle error
        return;
      }
    });
  } catch (error) {
    console.log(error, 'signalNewConsumerTransport error')
    // Handle error
    return;
  }
};
