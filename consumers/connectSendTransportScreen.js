/**
 * Connects the send transport for screen share by producing screen video data.
 *
 * @param {Object} options - The options object.
 * @param {MediaStream} options.stream - The media stream containing the screen share video track.
 * @param {Object} options.parameters - The parameters object containing screen producer details and utility functions.
 * @param {Object} options.parameters.screenProducer - The existing screen producer object.
 * @param {Object} options.parameters.device - The screen share input device information.
 * @param {Object} options.parameters.screenParams - Parameters related to screen share transport connection.
 * @param {Object} options.parameters.producerTransport - The producer transport object.
 * @param {Object} options.parameters.params - Additional parameters for screen share transport connection.
 * @param {Function} options.parameters.updateScreenProducer - Function to update the screen producer object.
 * @param {Function} options.parameters.updateProducerTransport - Function to update the producer transport object.
 * @throws Throws an error if an issue occurs during the screen share transport connection.
 */
export const connectSendTransportScreen = async ({ stream, parameters }) => {


  try {
    let { screenProducer, device, screenParams, producerTransport, params, updateScreenProducer, updateProducerTransport } = parameters;

    device = await parameters.getUpdatedAllParams().device

    // Connect the send transport for screen share by producing screen video data
    params = await screenParams;

    // Find VP9 codec for screen share
    let codec = await device.rtpCapabilities.codecs.find((codec) => codec.mimeType.toLowerCase() === 'video/vp9');

    // Produce screen share data using the producer transport
    screenProducer = await producerTransport.produce({
      track: stream.getVideoTracks()[0],
      ...params,
      codec: codec,
      appData: { mediaTag: 'screen-video' },
    });

    // Update the screen producer and producer transport objects
    updateScreenProducer(screenProducer);
    updateProducerTransport(producerTransport);

  } catch (error) {
    console.log('connectSendTransportScreen error', error);
    throw error;
  }
};
