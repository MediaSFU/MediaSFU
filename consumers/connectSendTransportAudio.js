/**
 * Connects the send transport for audio by producing audio data.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.audioParams - Parameters related to audio transport connection.
 * @param {Object} options.parameters - The parameters object containing audio producer details and utility functions.
 * @param {Object} options.parameters.audioProducer - The existing audio producer object.
 * @param {Object} options.parameters.device - The audio input device information.
 * @param {Object} options.parameters.producerTransport - The producer transport object.
 * @param {Function} options.parameters.updateAudioProducer - Function to update the audio producer object.
 * @param {Function} options.parameters.updateProducerTransport - Function to update the producer transport object.
 * @throws Throws an error if an issue occurs during the audio transport connection.
 */
export const connectSendTransportAudio = async ({ audioParams, parameters }) => {
    try {
        let { audioProducer, device, producerTransport, updateAudioProducer, updateProducerTransport } = parameters;

        // Connect the send transport for audio by producing audio data
        audioProducer = await producerTransport.produce(audioParams);

        // Update the audio producer and producer transport objects
        updateAudioProducer(audioProducer);
        updateProducerTransport(producerTransport);
    } catch (error) {
        console.log('connectSendTransportAudio error', error);
        // throw error;
    }
};
