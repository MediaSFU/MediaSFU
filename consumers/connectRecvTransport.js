/**
 * Connects a receiving transport to consume media from a remote producer.
 *
 * @param {object} options - The function parameters.
 * @param {object} options.parameters - Object containing necessary parameters.
 * @param {object} options.parameters.device - Device object.
 * @param {array} options.parameters.consumerTransports - Array of consumer transports.
 * @param {function} options.parameters.updateConsumerTransports - Function to update the consumer transports array.
 * @param {object} options.consumerTransport - Receiving transport for consuming media.
 * @param {string} options.remoteProducerId - ID of the remote producer.
 * @param {string} options.serverConsumerTransportId - ID of the server-side consumer transport.
 * @param {object} options.nsock - Socket for communication with the remote server.
 * @param {function} options.consumerResume - Function to handle consumer resumption.
 *
 * @throws {Error} Throws an error if there is an issue during the consumption process.
 */
export const connectRecvTransport = async ({ consumerTransport, remoteProducerId, serverConsumerTransportId, nsock, parameters }) => {
  
     parameters = await parameters.getUpdatedAllParams()
    let { device, consumerTransports, updateConsumerTransports,
    //media functions
    consumerResume } = parameters;

  try {
      // Emit 'consume' event to signal consumption initiation
      await nsock.emit('consume', {
          rtpCapabilities: device.rtpCapabilities,
          remoteProducerId,
          serverConsumerTransportId,
      }, async ({ params }) => {
          if (params.error) {
              // Handle error
              console.log('consume error', params.error);
              return;
          }

          try {
              // Consume media using received parameters
              const consumer = await consumerTransport.consume({
                  id: params.id,
                  producerId: params.producerId,
                  kind: params.kind,
                  rtpParameters: params.rtpParameters,
              });

              // Update consumerTransports array with the new consumer
              await consumerTransports.push({
                  consumerTransport,
                  serverConsumerTransportId: params.id,
                  producerId: remoteProducerId,
                  consumer,
                  socket_: nsock,
              });

              await updateConsumerTransports(consumerTransports);

              // Extract track from the consumer
              const { track } = await consumer;

              // Emit 'consumer-resume' event to signal consumer resumption
              await nsock.emit('consumer-resume', { serverConsumerId: params.serverConsumerId }, async ({ resumed }) => {
                  if (resumed) {
                      // Consumer resumed and ready to be used
                      try {
                          await consumerResume({ track, kind: params.kind, remoteProducerId, params, parameters, nsock });
                      } catch (error) {
                          // Handle error
                          console.log('consumerResume error', error);
                      }
                  }
              });
          } catch (error) {
              // Handle error
              console.log('consume error', error);
              return;
          }
      });
  } catch (error) {
      // Handle error
      console.log('connectRecvTransport error', error);
    //   throw new Error('Error connecting receiving transport to consume media.');
  }
};
