/**
 * Processes consumer transports by pausing or resuming those that are not on the active page.
 *
 * @param {Object} options - The options object.
 * @param {Array} options.consumerTransports - An array of consumer transports.
 * @param {Array} options.lStreams_ - An array of local streams.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Function} options.getUpdatedAllParams - Function to get updated parameters.
 * @param {Array} options.remoteScreenStream - An array of remote screen streams.
 * @param {Array} options.oldAllStreams - An array of old video streams.
 * @param {Array} options.newLimitedStreams - An array of new limited streams.
 * @param {Function} options.sleep - Function to pause execution for a specified duration.
 * @throws Throws an error if there is an issue during the process of pausing or resuming consumer transports.
 */
export async function processConsumerTransports({ consumerTransports, lStreams_, parameters }) {
  try {
    // Destructure parameters
    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams();

    let { remoteScreenStream,
      oldAllStreams,
      newLimitedStreams,

      //mediasfu functions
      sleep
    } = parameters;

    // Function to check if the producerId is valid in the given stream arrays
    function isValidProducerId(producerId, ...streamArrays) {

      return (
        producerId !== null &&
        producerId !== "" &&
        streamArrays.some((streamArray) => {
          return streamArray.length > 0 && streamArray.some((stream) => stream?.producerId === producerId);
        })
      );
    }

    // Get paused consumer transports that are audio
    const consumerTransportsToResumeAudio = consumerTransports.filter(
      (transport) =>
        isValidProducerId(transport.producerId, lStreams_, remoteScreenStream, oldAllStreams, newLimitedStreams) &&
        transport.consumer?.paused === true &&
        transport.consumer.kind === "audio"
    );

    // Get unpaused consumer transports that are audio
    const consumerTransportsToPauseAudio = consumerTransports.filter(
      (transport) =>
        transport.producerId &&
        transport.producerId !== null &&
        transport.producerId !== "" &&
        !lStreams_.some((stream) => stream.producerId === transport.producerId) &&
        transport.consumer &&
        transport.consumer.kind &&
        transport.consumer.paused !== true &&
        transport.consumer.kind === "audio" &&
        !remoteScreenStream.some((stream) => stream.producerId === transport.producerId) &&
        !oldAllStreams.some((stream) => stream.producerId === transport.producerId) &&
        !newLimitedStreams.some((stream) => stream.producerId === transport.producerId)
    );

    // Pause consumer transports after a short delay
    await sleep(100);

    // Emit consumer.pause() for each filtered transport (audio)
    for (const transport of consumerTransportsToPauseAudio) {
      await transport.consumer.pause();
      await transport.socket_.emit("consumer-pause", { serverConsumerId: transport.serverConsumerTransportId }, async ({ paused }) => {
        // Handle the response if needed
      });
    }

    // Get paused consumer transports that are not audio
    const consumerTransportsToResume = consumerTransports.filter(
      (transport) =>
        isValidProducerId(transport.producerId, lStreams_, remoteScreenStream, oldAllStreams, newLimitedStreams) &&
        transport.consumer?.paused === true &&
        transport.consumer.kind !== "audio"
    );

    // Get unpaused consumer transports that are not audio
    const consumerTransportsToPause = consumerTransports.filter(
      (transport) =>
        transport.producerId &&
        transport.producerId !== null &&
        transport.producerId !== "" &&
        !lStreams_.some((stream) => stream.producerId === transport.producerId) &&
        transport.consumer &&
        transport.consumer.kind &&
        transport.consumer.paused !== true &&
        transport.consumer.kind !== "audio" &&
        !remoteScreenStream.some((stream) => stream.producerId === transport.producerId) &&
        !oldAllStreams.some((stream) => stream.producerId === transport.producerId) &&
        !newLimitedStreams.some((stream) => stream.producerId === transport.producerId)
    );

    // Pause consumer transports after a short delay
    await sleep(100);

    // Emit consumer.pause() for each filtered transport (not audio)
    for (const transport of consumerTransportsToPause) {
      await transport.consumer.pause();
      await transport.socket_.emit("consumer-pause", { serverConsumerId: transport.serverConsumerTransportId }, async ({ paused }) => {
        // Handle the response if needed
      });
    }

    // Emit consumer.resume() for each filtered transport (not audio)
    for (const transport of consumerTransportsToResume) {
      await transport.socket_.emit("consumer-resume", { serverConsumerId: transport.serverConsumerTransportId }, async ({ resumed }) => {
        if (resumed) {
          await transport.consumer.resume();
        }
      });
    }
  } catch (error) {
    // Handle errors during the process of pausing or resuming consumer transports
    console.log(`Error processing consumer transports: ${error.message}`);
    // throw new Error(`Error processing consumer transports: ${error.message}`);
  }
}
