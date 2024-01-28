
/**
 * Update media settings to resume the audio of a participant.
 *
 * @param {Object} options - The options for resuming audio.
 * @param {string} options.name - The name of the participant.
 * @param {string} options.kind - The kind of media (always 'audio').
 * @param {Object} options.parameters - The parameters object containing update functions and state variables.
 *
 * @example
 * // Example usage of producerMediaResumed function
 * const options = {
 *   name: 'John Doe', // Name of the participant
 *   kind: 'audio', // Kind of media (always 'audio')
 *   parameters: {
 *     activeSounds: [], // Array of active sounds
 *     meetingDisplayType: 'media', // Display type in the meeting (media)
 *     meetingVideoOptimized: false, // Boolean indicating if video is optimized
 *     participants: [], // Array of participants
 *     oldSoundIds: [], // Array of old sound IDs
 *     shared: false, // Boolean indicating if screen is shared
 *     shareScreenStarted: false, // Boolean indicating if screen sharing has started
 *     updateMainWindow: false, // Boolean to update main window
 *     mainScreenFilled: false, // Boolean indicating if main screen is filled
 *     HostLabel: 'Host', // Label for the host
 *     updateMainScreenFilled: (mainScreenFilled) => {}, // Function to update main screen filled status
 *     updateParticipants: (participants) => {}, // Function to update participants
 *     updateActiveSounds: (activeSounds) => {}, // Function to update active sounds
 *     updateOldSoundIds: (oldSoundIds) => {}, // Function to update old sound IDs
 *     updateShared: (shared) => {}, // Function to update shared status
 *     updateShareScreenStarted: (shareScreenStarted) => {}, // Function to update screen sharing status
 *     updateUpdateMainWindow: (updateMainWindow) => {}, // Function to update main window status
 *     reorderStreams: ({ add, screenChanged }) => {}, // Function to reorder streams
 *     prepopulateUserMedia: ({ name }) => {}, // Function to prepopulate user media
 *     reUpdateInter: ({ name, add, force }) => {}, // Function to update interest levels
 *   },
 * };
 * await producerMediaResumed(options);
 */

export const producerMediaResumed = async ({ name, kind, parameters }) => {

  let
    {
      activeSounds,
      meetingDisplayType,
      meetingVideoOptimized,
      participants,
      oldSoundIds,
      shared,
      shareScreenStarted,
      updateMainWindow,

      mainScreenFilled,
      HostLabel,
      updateMainScreenFilled,
      updateParticipants,
      updateActiveSounds,
      updateOldSoundIds,
      updateShared,
      updateShareScreenStarted,
      updateUpdateMainWindow,

      //mediasfu functions
      reorderStreams,
      prepopulateUserMedia,
      reUpdateInter,

    } = parameters;

  //update to resume the audio only of a participant
  //name is the name of the participant
  //kind is the kind of media (always audio)
  //this is only emitted for audio (and not video or screenshare)

  //we naturally just pause the audio and not close it; every other media is closed when user turns it off
  //so only audio gets paused and resumed with same producerId; rest get closed and reopened with new producerId (which is notified in another way)


  //opertaions to update ui to optimize interest levels
  let participant = await participants.find(obj => obj.name === name);

  if (!mainScreenFilled && participant.islevel == '2') {
    updateMainWindow = true;
    updateUpdateMainWindow(updateMainWindow)
    await prepopulateUserMedia({ name: HostLabel, parameters })
    updateMainWindow = false;

  }

  let checker
  if (meetingDisplayType == 'media') {
    let participant = await participants.find(obj => obj.name === name);
    checker = participant.videoID != null && participant.videoID != "" && participant.videoID != undefined


    if (!checker) {

      if (shareScreenStarted || shared) {

      } else {

        await reorderStreams({ add: false, screenChanged: true, parameters })

      }

    }
  }

}