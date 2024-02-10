/**
 * Closes and resizes audio, video, or screen share elements based on the provided parameters.
 *
 * @param {Object} options - The options object.
 * @param {string} options.producerId - The ID of the producer to be closed and resized.
 * @param {string} options.kind - The type of the producer (audio, video, screenshare).
 * @param {Object} options.parameters - The parameters object containing various state and utility functions.
 * @param {Array} options.parameters.allAudioStreams - Array containing all audio streams.
 * @param {Array} options.parameters.allVideoStreams - Array containing all video streams.
 * @param {Array} options.parameters.activeNames - Array containing active participant names.
 * @param {Array} options.parameters.participants - Array containing participant information.
 * @param {Array} options.parameters.streamNames - Array containing stream names.
 * @param {string} options.parameters.recordingDisplayType - Type of recording display (video, media, all).
 * @param {boolean} options.parameters.recordingVideoOptimized - Indicates if recording video is optimized.
 * @param {string} options.parameters.adminIDStream - ID of the admin stream.
 * @param {Array} options.parameters.newLimitedStreams - Array containing new limited streams.
 * @param {Array} options.parameters.newLimitedStreamsIDs - Array containing IDs of new limited streams.
 * @param {Array} options.parameters.oldAllStreams - Array containing old streams.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {boolean} options.parameters.shared - Indicates if video is being shared.
 * @param {string} options.parameters.meetingDisplayType - Type of meeting display (video, media, all).
 * @param {boolean} options.parameters.defer_receive - Indicates if stream reception is deferred.
 * @param {string} options.parameters.HostLabel - Label for the host.
 * @param {Function} options.parameters.updateMainWindow - Function to update the main window.
 * @param {Function} options.parameters.updateActiveNames - Function to update active participant names.
 * @param {Function} options.parameters.updateAllAudioStreams - Function to update all audio streams.
 * @param {Function} options.parameters.updateAllVideoStreams - Function to update all video streams.
 * @param {Function} options.parameters.updateShared - Function to update the shared state.
 * @param {Function} options.parameters.updateShareScreenStarted - Function to update the screen sharing started state.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window update state.
 * @param {Function} options.parameters.updateNewLimitedStreams - Function to update new limited streams.
 * @param {Function} options.parameters.updateNewLimitedStreamsIDs - Function to update IDs of new limited streams.
 * @param {Function} options.parameters.updateOldAllStreams - Function to update old streams.
 * @param {Function} options.parameters.updateDefer_receive - Function to update the defer_receive state.
 * @param {Function} options.parameters.updateMainHeightWidth - Function to update main height and width.
 * @param {Function} options.parameters.reorderStreams - Function to reorder streams.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 * @param {Function} options.parameters.getVideos - Function to get videos.
 * @param {Function} options.parameters.rePort - Function to re-port.
 * @throws Throws an error if an issue occurs during closing and resizing.
 */

export async function closeAndResize({producerId, kind, parameters}) {

  let {getUpdatedAllParams} = parameters
  parameters = await getUpdatedAllParams()

    let {
        allAudioStreams,
        allVideoStreams,
        activeNames,
        participants,
        streamNames,
        recordingDisplayType,
        recordingVideoOptimized,
        adminIDStream,
        newLimitedStreams,
        newLimitedStreamsIDs,
        oldAllStreams,
        shareScreenStarted,
        shared,
        meetingDisplayType,
        defer_receive,
        lock_screen,
        firstAll,
        first_round,
        gotAllVids,
        eventType,


        HostLabel,
        shareEnded,
        updateMainWindow,
        updateActiveNames,
        updateAllAudioStreams,
        updateAllVideoStreams,
        updateShared,
        updateShareScreenStarted,
        updateUpdateMainWindow,
        updateNewLimitedStreams,
        updateNewLimitedStreamsIDs,
        updateOldAllStreams,
        updateDefer_receive,
        updateMainHeightWidth,
        updateShareEnded,
        updateLock_screen,
        updateFirstAll,
        updateFirst_round,
        updateGotAllVids,
        updateEventType,
        
        

        //mediasfu functions
        reorderStreams,
        prepopulateUserMedia,
        getVideos,
        rePort,
     
   
    } = parameters;
    

    //function to close and resize the video and audio elements
    let participant

    if (kind === 'audio') {
      //stop the audio by removing the miniAudio with id = producerId
  
      //remove the audio from the allAudioStreams array
      allAudioStreams = await allAudioStreams.filter(function (audioStream) {
        return audioStream.producerId !== producerId;
      }
      );

      updateAllAudioStreams(allAudioStreams)

      if (recordingDisplayType == 'video' && recordingVideoOptimized == true) {

      } else {

        //get the name of the participant with the producerId
        participant = await participants.find(obj => obj.audioID === producerId);

        if (participant) {

          //check if the participants videoID is not null or ""
          if (participant.videoID !== null && participant.videoID !== "") {
          } else {
            //remove the participant from the activeNames array
            activeNames = await activeNames.filter(function (name) {
              return name !== participant.name;
            });
            updateActiveNames(activeNames)
          }
        }
      }

      let checker = false
      let alt_checker = false

      if (meetingDisplayType == 'video') {
        checker = participant[0].videoID != null && participant[0].videoID != "" && participant[0].videoID != undefined
      } else {
        checker = true
        alt_checker = true
      }

      if (checker) {

        if (shareScreenStarted || shared) {
          if (!alt_checker) {
            await reorderStreams({parameters})    

          }

        } else {
          if (alt_checker && meetingDisplayType != 'video') {

            await reorderStreams({add: false, screenChanged: true, parameters})

          }

        }

      }

    } else if (kind === 'video') {
      //update the video elements by removing the miniVideo with id = producerId
      //remove the video from the allVideoStreams array

      //check if producerId == adminidstream
      if (producerId == adminIDStream) {
        updateMainWindow = true;
        updateUpdateMainWindow(updateMainWindow)
      }

      try {

        allVideoStreams = await allVideoStreams.filter(function (videoStream) {
          return videoStream.producerId !== producerId;
        });

        updateAllVideoStreams(allVideoStreams)

        try {

          //try remove it from oldVideoStreams
          oldAllStreams = await oldAllStreams.filter(function (videoStream) {
            return videoStream.producerId !== producerId;
          });

          updateOldAllStreams(oldAllStreams)

        } catch (error) {

        }

        try {

          //try remove it from newLimitedStreams
          newLimitedStreams = await newLimitedStreams.filter(function (videoStream) {
            return videoStream.producerId !== producerId;
          });

            updateNewLimitedStreams(newLimitedStreams)

        } catch (error) {

        }

      } catch (error) {

        try {
          //try remove it from oldVideoStreams
          oldAllStreams = await oldAllStreams.filter(function (videoStream) {
            return videoStream.producerId !== producerId;
          });
            updateOldAllStreams(oldAllStreams)

        } catch (error) {

        }

      }
      
      try {

        //remove the participant from activeNames
        activeNames = await activeNames.filter(function (name) {
          //get the participant with the producerId
          let participant = streamNames.find(obj => obj.producerId === producerId);

          return name !== participant.name;
        });

        updateActiveNames(activeNames)
        
      } catch (error) {
        
      }


      if (lock_screen) {
        defer_receive = true
        // check if the video is the one being displayed (i.e. (newLimitedStreamsIDs))
        if (newLimitedStreamsIDs.includes(producerId)) {
          await prepopulateUserMedia({name: HostLabel,parameters})
          await reorderStreams({add: false, screenChanged: true, parameters})
        }

      } else {
        await prepopulateUserMedia({name: HostLabel,parameters})
        await reorderStreams({add: false, screenChanged: true, parameters})

      }


    } else if (kind === 'screenshare' || kind === 'screen') {
      //update the video elements by removing the mainVideo with id = producerId
      updateMainWindow = true;

      //screenshare stuff
      shareScreenStarted = false
      shareEnded = true

      lock_screen = false
      firstAll = false
      first_round = false

      updateUpdateMainWindow(updateMainWindow)
      updateShareScreenStarted(shareScreenStarted)
      updateShareEnded(shareEnded)
      updateLock_screen(lock_screen)
      updateFirstAll(firstAll)
      updateFirst_round(first_round)

      if (!gotAllVids || defer_receive) {
        defer_receive = false
        updateDefer_receive(defer_receive)
        await getVideos({parameters})
        await rePort({parameters})
      }

      if (eventType == 'conference') {
         updateMainHeightWidth(0)
      }


      await prepopulateUserMedia({name: HostLabel,parameters})
      await reorderStreams({add: false, screenChanged: true, parameters})

    }
  }
