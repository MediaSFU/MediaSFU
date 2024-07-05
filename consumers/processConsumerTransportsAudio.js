/**
 * Processes consumer transports to pause or resume audio streams based on the active streams.
 *
 * @param {Object} options - An object containing options for the function.
 * @param {Array} options.consumerTransports - The list of consumer transports.
 * @param {Array} options.lStreams - The list of active streams.
 * @param {Object} options.parameters - An object containing various parameters and state values.
 */
export const processConsumerTransportsAudio = async ({ consumerTransports, lStreams, parameters }) => {
    try {
  
      const { sleep } = parameters;
    
      // Function to check if the producerId is valid
      const isValidProducerId = (producerId, ...streamArrays) => {
        return (
          producerId !== null &&
          producerId !== "" &&
          streamArrays.some((streamArray) => {
            return streamArray.length > 0 && streamArray.some((stream) => stream?.producerId === producerId);
          })
        );
      };
    
      // Get paused consumer transports that are audio
      const consumerTransportsToResume = await consumerTransports.filter(
        (transport) =>
          isValidProducerId(transport.producerId, lStreams) &&
          transport.consumer?.paused === true &&
          transport.consumer.kind === "audio"
      );
    
      // Get unpaused consumer transports that are audio
      const consumerTransportsToPause = await consumerTransports.filter(
        (transport) =>
          transport.producerId &&
          transport.producerId !== null &&
          transport.producerId !== "" &&
          !lStreams.some((stream) => stream.producerId === transport.producerId) &&
          transport.consumer &&
          transport.consumer.kind &&
          transport.consumer.paused !== true &&
          transport.consumer.kind === "audio"
      );
    
      await sleep(100);
  
    
      // Emit consumer.pause() for each transport to pause
      for (const transport of consumerTransportsToPause) {
        await transport.consumer.pause();
        await transport.socket_.emit("consumer-pause", { serverConsumerId: transport.serverConsumerTransportId }, async ({ paused }) => {});
      }
    
      // Emit consumer.resume() for each transport to resume
      for (const transport of consumerTransportsToResume) {
        await transport.socket_.emit("consumer-resume", { serverConsumerId: transport.serverConsumerTransportId }, async ({ resumed }) => {
          if (resumed) {
            await transport.consumer.resume();
          }
        });
      }
    } catch (error) {
      // console.log(error, "error in processConsumerTransportsAudio");
    }
    
    };
    