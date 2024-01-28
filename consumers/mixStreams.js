/**
 * Mixes audio and video streams, prioritizing unmuted streams and interleaving muted streams with non-audio/video streams.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Array} options.alVideoStreams - The array of audio/video streams.
 * @param {Array} options.non_alVideoStreams - The array of non-audio/video streams.
 * @param {Array} options.ref_participants - The array of participants in the session.
 * @return {Array} - The array of mixed streams.
 * @throws Throws an error if there is an issue during the process of mixing streams.
 */
export async function mixStreams({ parameters }) {
  try {
    // Destructure parameters
    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams();

    let {
      alVideoStreams,
      non_alVideoStreams,
      ref_participants,
    } = parameters;

    const mixedStreams = [];
    const youyouStream = await alVideoStreams.find(obj => obj.producerId === 'youyou' || obj.producerId === 'youyouyou');
    alVideoStreams = await alVideoStreams.filter(obj => obj.producerId !== 'youyou' && obj.producerId !== 'youyouyou');

    const unmutedAlVideoStreams = await alVideoStreams.filter(obj => {
      const participant = ref_participants.find(p => p.videoID === obj.producerId);
      return !obj.muted && participant && participant.muted === false;
    });

    const mutedAlVideoStreams = await alVideoStreams.filter(obj => {
      const participant = ref_participants.find(p => p.videoID === obj.producerId);
      return obj.muted || (participant && participant.muted === true);
    });

    const nonAlVideoStreams = await non_alVideoStreams.slice(); // Create a copy of non_alVideoStreams

    // Add unmutedAlVideoStreams to mixedStreams
    await mixedStreams.push(...unmutedAlVideoStreams);

    // Interleave the mutedAlVideoStreams and nonAlVideoStreams
    let nonAlIndex = 0;
    for (let i = 0; i < mutedAlVideoStreams.length; i++) {
      if (nonAlIndex < nonAlVideoStreams.length) {
        await mixedStreams.push(nonAlVideoStreams[nonAlIndex]);
        nonAlIndex++;
      }
      await mixedStreams.push(mutedAlVideoStreams[i]);
    }

    // Handle remaining nonAlVideoStreams (if any)
    for (let i = nonAlIndex; i < nonAlVideoStreams.length; i++) {
      await mixedStreams.push(nonAlVideoStreams[i]);
    }

    // Unshift 'youyou' or 'youyouyou' stream to mixedStreams
    if (youyouStream) {
      await mixedStreams.unshift(youyouStream);
    }

    return mixedStreams;
  } catch (error) {
    // Handle errors during the process of mixing streams
    console.log('Error mixing streams:', error.message);
    throw error;
  }
}
