/**
 * Updates the list of video streams by filtering out the admin's video stream and updating state variables.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Array} options.participants - The list of participants in the session.
 * @param {Array} options.allVideoStreams - The current list of all video streams.
 * @param {Array} options.oldAllStreams - The previous list of all video streams.
 * @param {string} options.adminVidID - The video ID of the admin participant.
 * @param {Function} options.updateAllVideoStreams - The function to update the state variable for all video streams.
 * @param {Function} options.updateOldAllStreams - The function to update the state variable for old video streams.
 * @throws Throws an error if there is an issue during the process of updating video streams.
 */
export async function getVideos({ parameters }) {
  try {
    // Destructure parameters
    let {
      participants,
      allVideoStreams,
      oldAllStreams,
      adminVidID,
      updateAllVideoStreams,
      updateOldAllStreams,
    } = parameters;

    // Filter out the admin's video stream and update state variables
    let admin = await participants.filter(participant => participant.islevel === '2');

    if (admin.length > 0) {
      adminVidID = await admin[0].videoID;

      if (adminVidID != null && adminVidID !== "") {
        let oldAllStreams_ = [];
        
        // Check if the length of oldAllStreams is greater than 0
        if (oldAllStreams.length > 0) {
          oldAllStreams_ = await oldAllStreams;
        }

        // Filter out admin's video stream from oldAllStreams
        oldAllStreams = await allVideoStreams.filter(streame => streame.producerId === adminVidID);

        // If no admin's video stream found, revert to the previous state
        if (oldAllStreams.length < 1) {
          oldAllStreams = await oldAllStreams_;
        }

        // Update the state variable for old video streams
        updateOldAllStreams(oldAllStreams);

        // Filter out admin's video stream from allVideoStreams
        allVideoStreams = await allVideoStreams.filter(streame => streame.producerId !== adminVidID);

        // Update the state variable for all video streams
        updateAllVideoStreams(allVideoStreams);
      }
    }
  } catch (error) {
    // Handle errors during the process of updating video streams
    console.log('Error updating video streams:', error.message);
    // throw error;
  }
}
