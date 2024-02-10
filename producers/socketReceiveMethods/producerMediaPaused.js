/**
 * Update media settings to pause the audio, video, or screenshare of a participant.
 *
 * @param {Object} options - The options for pausing media.
 * @param {string} options.producerId - The ID of the producer.
 * @param {string} options.kind - The kind of media (audio, video, screenshare).
 * @param {string} options.name - The name of the participant.
 * @param {Object} options.parameters - The parameters object containing update functions and state variables.
 *
 * @example
 * // Example usage of producerMediaPaused function
 * const options = {
 *   producerId: '12345', // ID of the producer
 *   kind: 'audio', // Kind of media (audio, video, screenshare)
 *   name: 'John Doe', // Name of the participant
 *   parameters: {
 *     activeSounds: [], // Array of active sounds
 *     meetingDisplayType: 'media', // Display type in the meeting (media, video)
 *     meetingVideoOptimized: false, // Boolean indicating if video is optimized
 *     participants: [], // Array of participants
 *     oldSoundIds: [], // Array of old sound IDs
 *     shared: false, // Boolean indicating if screen is shared
 *     shareScreenStarted: false, // Boolean indicating if screen sharing has started
 *     updateMainWindow: false, // Boolean to update main window
 *     HostLabel: 'Host', // Label for the host
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
 * await producerMediaPaused(options);
 */

export const producerMediaPaused = async ({ producerId, kind, name, parameters }) => { 

    //update to pause the audio, video, screenshare of a participant
    //producerId is the id of the producer
    //kind is the kind of media (audio, video, screenshare)
    //name is the name of the participant

    let {
        activeSounds,
        meetingDisplayType,
        meetingVideoOptimized,
        participants,
        oldSoundIds,
        shared,
        shareScreenStarted,
        updateMainWindow,
        HostLabel,
        islevel,


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
    

    //iterate through all activeSounds and check if any participant with muted property of true is in it and remove it
    await participants.forEach(async (participant) => {
        //update the ui for mediaDisplayTypes and re-render
        if (participant.muted) {
  
          try {
  
            if (participant.islevel == '2') {
              //look for videoID is null or "" or undefined
              if (participant.videoID == null || participant.videoID == "" || participant.videoID == undefined) {
                if (!shared && !shareScreenStarted && islevel != '2') {
                  updateMainWindow = true;
                   updateUpdateMainWindow(updateMainWindow)
                  await prepopulateUserMedia({name: HostLabel, parameters})
                  updateMainWindow = false;
                  updateUpdateMainWindow(updateMainWindow)
                }
  
              }
            }
  
  
          } catch (error) {
  
          }
  
          if (shareScreenStarted || shared) {
            //check if the participant is in activeSounds
            //remove the participant from activeSounds if need be; others might have both audio and video on
            if (activeSounds.includes(participant.name)) {

              //remove the participant from activeSounds
              activeSounds = await activeSounds.filter(function (audioStream) {
                return audioStream !== participant.name;
              });

                updateActiveSounds(activeSounds)
            }
       
            reUpdateInter({name: participant.name, add:false, force:true,parameters})
      
          } else {
            // no screensahre so obey user display settings; show waveforms, ..
          }
  
        }
      });
  
      //operation to update the ui based on the mediaDisplayType
      let checker = false
      let alt_checker = false
  
      if (meetingDisplayType == 'media' || (meetingDisplayType == 'video' && meetingVideoOptimized == false)) {
        let participant = await participants.find(obj => obj.name === name);
        checker = participant.videoID != null && participant.videoID != "" && participant.videoID != undefined
  
        if (!checker) {
  
          //may need to come in front of the video
          if (shareScreenStarted || shared) {
  
          } else {
            // updateMainWindow = true;
            await reorderStreams(
              {
                add: false,
                screenChanged: true,
                parameters
              }
            );
  
          }
  
        }
      }
  
  
      if (kind === 'audio') {
        //opertaion to update ui to optimize interest levels
        //stop the audio by removing the miniAudio with id = producerId
        //get audio element with id = producerId
        try {
  
          //try and check if the name for this producerId is in oldsoundsids
          //find the participant with this producerId as audioID 
          let participant = await participants.find(obj => obj.audioID === producerId);
  
          //CHECK IF THE PARTICIPANT NAME IS IN OLDSOUNDSIDS
          if (oldSoundIds.includes(participant.name)) {
            //remove the participant name from oldSoundsIds
            reUpdateInter({name: participant.name, add:false, force:true,parameters})
          }
  
        } catch (error) {
        }
      }

}