/**
 * Connects the send transport for audio, video, screen share, or all based on the specified option.
 *
 * @param {Object} options - The options object.
 * @param {string} options.option - The transport connection option ('audio', 'video', 'screen', 'all').
 * @param {Object} options.parameters - The parameters object containing connection details and utility functions.
 * @param {Object} options.parameters.audioParams - Parameters related to audio transport connection.
 * @param {Object} options.parameters.videoParams - Parameters related to video transport connection.
 * @param {MediaStream} options.parameters.localStreamScreen - The local screen share stream.
 * @param {Function} options.parameters.connectSendTransportAudio - Function to connect the audio send transport.
 * @param {Function} options.parameters.connectSendTransportVideo - Function to connect the video send transport.
 * @param {Function} options.parameters.connectSendTransportScreen - Function to connect the screen share send transport.
 * @throws Throws an error if an issue occurs during the transport connection.
 */
export const connectSendTransport = async ({ option, parameters }) => {
    try {
      let {
        audioParams,
        videoParams,
        localStreamScreen,

        //media functions
        connectSendTransportAudio,
        connectSendTransportVideo,
        connectSendTransportScreen,
      } = parameters;
  
      // Connect send transport based on the specified option
      if (option === 'audio') {
        await connectSendTransportAudio({
          audioParams,
          parameters,
        });
      } else if (option === 'video') {
        await connectSendTransportVideo({
          videoParams,
          parameters,
        });
      } else if (option === 'screen') {
        await connectSendTransportScreen({
          stream: localStreamScreen,
          parameters,
        });
      } else {
        // Connect both audio and video send transports
        await connectSendTransportAudio({
          audioParams,
          parameters,
        });
        await connectSendTransportVideo({
          videoParams,
          parameters,
        });
      }
    } catch (error) {
      console.log('connectSendTransport error', error);
      // throw error;
    }
  };
  