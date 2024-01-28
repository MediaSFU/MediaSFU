/**
 * Connects the send transport for video by producing video data.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.videoParams - Parameters related to video production.
 * @param {Object} options.parameters - The parameters object containing video producer details and utility functions.
 * @param {Object} options.parameters.videoProducer - The existing video producer object.
 * @param {Object} options.parameters.device - The video input device information.
 * @param {Object} options.parameters.producerTransport - The producer transport object.
 * @param {string} options.parameters.islevel - The level of the video connection.
 * @param {boolean} options.parameters.updateMainWindow - Whether to update the main window based on the video connection.
 * @param {Function} options.parameters.updateVideoProducer - Function to update the video producer object.
 * @param {Function} options.parameters.updateProducerTransport - Function to update the producer transport object.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window state.
 * @throws Throws an error if an issue occurs during the video transport connection.
 */
export const connectSendTransportVideo = async ({ videoParams, parameters }) => {
  try {
    let {
      videoProducer,
      device,
      producerTransport,
      islevel,
      updateMainWindow,
      updateVideoProducer,
      updateProducerTransport,
      updateUpdateMainWindow,
    } = parameters;

    // Connect the send transport for video by producing video data
    videoProducer = await producerTransport.produce(videoParams);

    // Update main window state based on the video connection level
    if (islevel === '2') {
      updateMainWindow = true;
    }

    // Update the video producer and producer transport objects
    updateVideoProducer(videoProducer);
    updateProducerTransport(producerTransport);
    updateUpdateMainWindow(updateMainWindow);
  } catch (error) {
    console.log('connectSendTransportVideo error', error);
    // throw error;
  }
};
