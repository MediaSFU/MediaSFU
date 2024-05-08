/**
 * Periodically updates the UI for active media streams based on specified parameters.
 *
 * @param {object} options - The function parameters.
 * @param {string} options.name - The name of the participant.
 * @param {boolean} options.add - A flag indicating whether to add a new stream.
 * @param {boolean} [options.force=false] - A flag indicating whether to force the update.
 * @param {number} [options.average=127] - The average value for stream update.
 * @param {object} options.parameters - Additional parameters needed for the function.
 */

export async function reUpdateInter({ name, add, force = false, average = 127, parameters }) {
  // function to periodically update the ui for active media streams

  let {
    screenPageLimit, itemPageLimit, reorderInterval, fastReOrderInterval, eventType,
    participants, allVideoStreams, shared, shareScreenStarted, adminNameStream, screenShareNameStream,
    updateMainWindow,
    sortAudioLoudness,
    lastReorderTime, newLimitedStreams, newLimitedStreamsIDs, oldSoundIds,
    updateUpdateMainWindow, updateSortAudioLoudness, updateLastReorderTime,
    updateNewLimitedStreams, updateNewLimitedStreamsIDs, updateOldSoundIds,

    //mediasfu functions
    onScreenChanges, reorderStreams, changeVids
  } = parameters;


  if (eventType == 'broadcast' || eventType == 'chat') {
    return
  }

  let refLimit = screenPageLimit - 1;

  if (shareScreenStarted || shared) {


  } else {

    refLimit = itemPageLimit - 1;

    if (add) {
      const currentTime = Date.now();
      if (((currentTime - lastReorderTime >= reorderInterval) && (average > 128.5)) || (average > 130 && currentTime - lastReorderTime >= fastReOrderInterval)) {
        lastReorderTime = currentTime;
        sortAudioLoudness = true;
        // updateMainWindow = true;
        if (eventType == 'conference') {
          await onScreenChanges({ changed: true, parameters });
        } else {
          await reorderStreams({ add: false, screenChanged: true, parameters });
        }
        sortAudioLoudness = false;

        updateSortAudioLoudness(sortAudioLoudness);
        updateUpdateMainWindow(updateMainWindow);
        updateLastReorderTime(lastReorderTime);

        return
      }
    }


  }

  let videoID
  if (shareScreenStarted || shared) {

    let newLimitedStreams_ = []
    let newLimitedStreamsIDs_ = []

    if (add) {

      let participant = await participants.find(participant => participant.name == name)

      videoID = await participant.videoID;

      if (videoID == null || videoID == "" || videoID == undefined) {
        return
      }
      // check if videoID is in newLimitedStreamsIDs
      //check length of newLimitedStreamsIDs

      if (!newLimitedStreamsIDs.includes(videoID)) {

        //first check length of newLimitedStreams to not exceed refLimit, if so remove oldSoundID from newLimitedStreams
        if (newLimitedStreams.length > refLimit) {
          let oldoldSounds = await oldSoundIds;
          // remove stream from newLimitedStreams
          //loop through oldSoundIds and remove one and stop if newLimitedStreams.length <refLimit
          for (let i = 0; i < oldSoundIds.length; i++) {
            if (newLimitedStreams.length > refLimit) {
              // remove stream from newLimitedStreams
              if (oldSoundIds[i] != screenShareNameStream || oldSoundIds[i] != adminNameStream) {
                newLimitedStreams = await newLimitedStreams.filter(stream => stream.producerId != oldSoundIds[i])
                newLimitedStreamsIDs = await newLimitedStreamsIDs.filter(id => id != oldSoundIds[i])
                oldoldSounds = await oldoldSounds.filter(id => id != oldSoundIds[i])
              }
            }
          }
          oldSoundIds = await oldoldSounds;
        }

        // find the stream with the videoID in allVideoStreams
        let stream = await allVideoStreams.find(stream => stream.producerId == videoID)
        // add stream to newLimitedStreams
        if (newLimitedStreams.length < screenPageLimit) {
          newLimitedStreams = await [...newLimitedStreams, stream]
          newLimitedStreamsIDs = await [...newLimitedStreamsIDs, videoID]
          // add the soundID to oldSoundIds
          if (!oldSoundIds.includes(name)) {
            oldSoundIds = await [...oldSoundIds, name]
          }
          await changeVids({ parameters });
        }
      }

    } else {

      let participant = await participants.find(participant => participant.name == name)

      videoID = await participant.videoID;

      if (videoID == null || videoID == "" || videoID == undefined) {
        return
      }

      if (!force) {

        try {
          // remove stream from newLimitedStreams
          newLimitedStreams = await newLimitedStreams.filter(stream => stream.producerId != videoID)
          newLimitedStreamsIDs = await newLimitedStreamsIDs.filter(id => id != videoID)
          oldSoundIds = await oldSoundIds.filter(id => id != name)
          await changeVids({ parameters });

        } catch (error) {

        }

      } else {
        //check if the persons.muted == false
        let mic = await participant.muted;
      

        if (mic) {

          try {
            // remove stream from newLimitedStreams
            newLimitedStreams = await newLimitedStreams.filter(stream => stream.producerId != videoID)
            newLimitedStreamsIDs = await newLimitedStreamsIDs.filter(id => id != videoID)
            oldSoundIds = await oldSoundIds.filter(id => id != name)
            await changeVids({ parameters });

          } catch (error) {

          }

        }

      }
    }

    updateNewLimitedStreams(newLimitedStreams);
    updateNewLimitedStreamsIDs(newLimitedStreamsIDs);
    updateOldSoundIds(oldSoundIds);



  }

}