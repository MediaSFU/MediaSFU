/**
 * Resume or pause video streams based on participants' video states.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Array} options.parameters.participants - Array of participants.
 * @param {Array} options.parameters.dispActiveNames - Array of currently displayed participant names.
 * @param {Array} options.parameters.remoteScreenStream - Array of remote screen streams.
 * @param {Array} options.parameters.consumerTransports - Array of consumer transports.
 * @param {string} options.parameters.screenId - ID of the screen.
 * @param {string} options.parameters.islevel - The level of the user.
 * @throws Throws an error if there is an issue during the process of resuming or pausing streams.
 */
export async function resumePauseStreams({ parameters }) {
  try {
    // Destructure parameters
    let { participants, dispActiveNames, remoteScreenStream, consumerTransports, screenId, islevel } = parameters;

    // Get the videoID of the host (islevel=2)
    let host = participants.find(obj => obj.islevel === '2');
    let hostVideoID = host ? host.videoID : null;

    // Get videoIDs of participants in dispActiveNames and screenproducerId
    let videosIDs = dispActiveNames.map(name => {
      let participant = participants.find(obj => obj.name === name);
      return participant ? participant.videoID : null;
    });

    // Add screenproducerId to allVideoIDs if it's not null or empty
    if (screenId) {
      videosIDs.push(screenId);
    }

    // Add hostVideoID to allVideoIDs if it's not null or empty (only if the user is not the host)
    if (islevel !== '2' && hostVideoID) {
      videosIDs.push(hostVideoID);
    }

    // Remove null or empty videoIDs
    let allVideoIDs = videosIDs.filter(videoID => videoID !== null && videoID !== '');

    if (allVideoIDs.length > 0) {
      // Get consumer transports with producerId in allVideoIDs
      const consumerTransportsToResume = consumerTransports.filter(
        transport => allVideoIDs.includes(transport.producerId) && transport.consumer.kind !== 'audio'
      );

      // Resume all consumerTransportsToResume
      for (const transport of consumerTransportsToResume) {
        await transport.socket_.emit('consumer-resume', { serverConsumerId: transport.serverConsumerTransportId }, async ({ resumed }) => {
          if (resumed) {
            await transport.consumer.resume();
          }
        });
      }
    }
  } catch (error) {
    console.log('Error during resuming or pausing streams: ', error);
    // Handle errors during the process of resuming or pausing streams
    // throw new Error(`Error during resuming or pausing streams: ${error.message}`);
  }
}
