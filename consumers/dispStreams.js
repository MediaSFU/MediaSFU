/**
 * Displays streams on the UI based on various parameters.
 *
 * @param {Object} options - The options object.
 * @param {Array} options.lStreams - An array of streams to be displayed.
 * @param {number} options.ind - The index of the current page or screen.
 * @param {boolean} [options.auto=false] - A flag indicating whether the display operation is automatic.
 * @param {boolean} [options.ChatSkip=false] - A flag indicating whether to skip certain operations for chat display.
 * @param {*} [options.forChatCard=null] - Additional parameter for chat card display.
 * @param {*} [options.forChatID=null] - Additional parameter for chat ID.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @throws Throws an error if there is an issue during the display process.
 */

export async function dispStreams({lStreams, ind, auto = false, ChatSkip = false, forChatCard = null, forChatID = null,parameters}) {

    //function to display streams

    let {getUpdatedAllParams} = parameters;
    parameters = await getUpdatedAllParams()
   
    let {
        consumerTransports,
        streamNames,
        audStreamNames,
        participants,
        ref_participants,
        recordingDisplayType,
        recordingVideoOptimized,
        meetingDisplayType,
        meetingVideoOptimized,
        currentUserPage,
        HostLabel,
        mainHeightWidth,
        prevMainHeightWidth,
        prevDoPaginate,
        doPaginate,
        firstAll,
        shared,
        shareScreenStarted,
        shareEnded,
        oldAllStreams,
        updateMainWindow,
        remoteProducerId,
        activeNames,
        dispActiveNames,
        p_dispActiveNames,
        nForReadjustRecord,
        first_round,
        lock_screen,
        chatRefStreams,
        eventType,
        islevel,
        localStreamVideo,
        
        

        //update variables
        updateActiveNames,
        updateDispActiveNames,
        updateLStreams,
        updateChatRefStreams,
        updateNForReadjustRecord,
        updateUpdateMainWindow,
        updateShareEnded,
        updateAddAltGrid,
        updateShowMiniView,


        //mediasfu functions
        prepopulateUserMedia,
        rePort,
        processConsumerTransports,
        resumePauseStreams,
        readjust,
        addVideosGrid,
        GetEstimate,
        checkGrid,
 
    } = parameters;
    

    let proceed = true

    let lStreams_ = await lStreams.filter((stream) => {
      return stream.producerId != 'youyou' && stream.producerId != 'youyouyou';
    })

    lStreams_ = await lStreams_.filter((stream) => {

      return stream.id != 'youyou' && stream.id != 'youyouyou' && stream.name != 'youyou' && stream.name != 'youyouyou';
    })

    if (eventType == 'chat') {

      proceed = true


    } else if (ind == 0 || (islevel != '2' && currentUserPage == ind)) {

      proceed = false

      //get the name of every participant in lStreams if stream !null and assign it to activeNames
      await lStreams_.forEach((stream) => {
        let checker = false;
        let check_level = 0;


        if (recordingDisplayType === 'video') {
          if (recordingVideoOptimized) {
            if (stream.hasOwnProperty('producerId') && stream.producerId != null && stream.producerId !== "") {
              checker = true;
              check_level = 0;
            }
          } else {
            if ((stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) || ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== ""))) {
              checker = true;
              check_level = 1;
            }
          }
        } else if (recordingDisplayType === 'media') {
          if ((stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) || ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== ""))) {
            checker = true;
            check_level = 1;
          }
        } else {
          if (((stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) || ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== "")) || stream.hasOwnProperty('name') && stream.name !== null && stream.name != "")) {
            checker = true;
            check_level = 2;
          }
        }

        let participant;

        if (checker) {
          // find the participant with the same videoID as the stream
          if (check_level == 0) {
            if (stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) {
              participant = streamNames.find(obj => obj.producerId === stream.producerId);
            }
          } else if (check_level == 1) {
            // find for either producerId or name
            if (stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) {
              participant = streamNames.find(obj => obj.producerId === stream.producerId);

            }
            if (!participant) {
              if ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== "")) {
                participant = audStreamNames.find(obj => obj.producerId === stream.audioID);
                if (!participant) {
                  participant = ref_participants.find(obj => obj.audioID === stream.audioID);
                }
              }
            }
          } else if (check_level == 2) {
            if (stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) {
              participant = streamNames.find(obj => obj.producerId === stream.producerId);
            }
            if (!participant) {
              if ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== "")) {
                participant = audStreamNames.find(obj => obj.producerId === stream.audioID);
                if (!participant) {
                  participant = ref_participants.find(obj => obj.audioID === stream.audioID);
                }
              }
            }
            if (!participant) {
              if (stream.hasOwnProperty('name') && stream.name !== null && stream.name != "") {
                participant = ref_participants.find(obj => obj.name === stream.name);
              }
            }
          }

          // push the name of the participant to activeNames
          if (participant) {
            // if activeNames does not include the name of the participant, push it
            if (!activeNames.includes(participant.name)) {
              activeNames.push(participant.name);
            }
          }
        }
      });

      updateActiveNames(activeNames)  


      await lStreams_.forEach((stream) => {
        let disp_checker = false;
        let disp_check_level = 0;

        if (meetingDisplayType == 'video') {
          if (meetingVideoOptimized) { 
            if (stream.hasOwnProperty('producerId') && stream.producerId != null && stream.producerId !== "") {
              disp_checker = true;
              disp_check_level = 0;
            }
          } else {
            if ((stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) || ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== ""))) {
              disp_checker = true;
              disp_check_level = 1;
            }
          }
        } else if (meetingDisplayType == 'media') {
          if ((stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) || ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== ""))) {
            disp_checker = true;
            disp_check_level = 1;
          }
        } else {
          if (((stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) || ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== "")) || stream.hasOwnProperty('name') && stream.name !== null && stream.name != "")) {
            disp_checker = true;
            disp_check_level = 2;
          }
        }

        let participant_;

        if (disp_checker) {

          if (disp_check_level == 0) {
            if (stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) {
              participant_ = streamNames.find(obj => obj.producerId === stream.producerId);
            }
          } else if (disp_check_level == 1) {
            // find for either producerId or name
            if (stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) {
              participant_ = streamNames.find(obj => obj.producerId === stream.producerId);

            }
            if (!participant_) {
              if ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== "")) {
                participant_ = audStreamNames.find(obj => obj.producerId === stream.audioID);
                if (!participant_) {
                  participant_ = ref_participants.find(obj => obj.audioID === stream.audioID);
                }
              }
            }
          } else if (disp_check_level == 2) {
            if (stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) {
              participant_ = streamNames.find(obj => obj.producerId === stream.producerId);
            }
            if (!participant_) {
              if ((stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== "")) {
                participant_ = audStreamNames.find(obj => obj.producerId === stream.audioID);
                if (!participant_) {
                  participant_ = ref_participants.find(obj => obj.audioID === stream.audioID);
                }
              }
            }
            if (!participant_) {
              if (stream.hasOwnProperty('name') && stream.name !== null && stream.name != "") {
                participant_ = ref_participants.find(obj => obj.name === stream.name);
              }
            }
          }


        }

        // push the name of the participant to activeNames
        if (participant_) {
          // if dispActiveNames does not include the name of the participant, push it
          if (!dispActiveNames.includes(participant_.name)) {
            dispActiveNames.push(participant_.name);
            if (!p_dispActiveNames.includes(participant_.name)) {
              proceed = true;
            }
          }
        }

      


      });
      
      
      await updateDispActiveNames(dispActiveNames)

      if (lStreams_.length < 1) {
        if (shareScreenStarted || shared) {
          proceed = true;
        } else if (!firstAll) { 
          proceed = true;
        }
      }

      if (shareScreenStarted || shared) {
      } else {
        if ((prevMainHeightWidth != mainHeightWidth)) {
          updateMainWindow = true;
          updateUpdateMainWindow(updateMainWindow)
        }
      }

      nForReadjustRecord = await activeNames.length;
      updateNForReadjustRecord(nForReadjustRecord)
    }


    if (!proceed && auto) {

      if (updateMainWindow) {


        if (!lock_screen && !shared) {

          await prepopulateUserMedia({name: HostLabel,parameters})
        } else {
          if (!first_round) {

            await prepopulateUserMedia({name: HostLabel,parameters})
          }
        }
      }

      if (ind == 0) {
        await rePort({parameters})
      }
      return
    }

    if (eventType == 'broadcast') {

      lStreams = lStreams_
      updateLStreams(lStreams)

    } else if (eventType == 'chat') {

      if (forChatID != null) {

        lStreams = chatRefStreams
        updateLStreams(lStreams)

      } else {

        updateShowMiniView(false)

        if (islevel != '2') {

          let host = await participants.find(obj => {
            return obj.islevel === '2'
          })

          if (host) {

            let streame

            remoteProducerId = await host.videoID;
            // get the stream from allvideostream with the same id as remoteProducerId

            if (islevel == '2') {
              host.stream = await localStreamVideo;
            } else {
              streame = await oldAllStreams.find((streame) => streame.producerId == remoteProducerId);
              // add streame to lStreams
              if (streame) {
                //remove any stream with name of host.name
                lStreams = await lStreams.filter((stream) => {
                  return stream.name != host.name
                })

                lStreams.push(streame);
              }
            }
          }

        }

        //remove youyou and youyouyou from lStreams and then put it at the end
        let youyou = await lStreams.find(obj => {
          return obj.producerId === 'youyou' || obj.producerId === 'youyouyou'
        })

        lStreams = await lStreams.filter((stream) => {
          return stream.producerId != 'youyou' && stream.producerId != 'youyouyou';
        })

        if (youyou) {
          await lStreams.push(youyou)
        }

        chatRefStreams = await lStreams

        updateLStreams(lStreams)
        updateChatRefStreams(chatRefStreams)

      }


    }

    let refLength = await lStreams.length



    const [numtoadd, rows, cols] = await GetEstimate({n:refLength, parameters})
    let [removeAltGrid, numtoaddd, numRows, numCols, remainingVideos, actualRows,lastrowcols] = await checkGrid(rows, cols, refLength)

    if (ChatSkip && eventType == 'chat') {
      numRows = 1
      numCols = 1
      actualRows = 1
    }

    //if removeAltGrid is true then remove everyting from altGrid and add to mainGrid,check for streams on alvideoStreams and add to mainGrid that are not on mainGrid and add switching to true

    await readjust({n:lStreams.length, state:ind,parameters})

    // split the streams into two arrays, one for mainGrid and one for altGrid
    // take up to numtoadd from the lStreams and add to mainGridStreams
    let mainGridStreams = await lStreams.slice(0, numtoaddd);
    // take the rest of the streams and add to altGridStreams
    let altGridStreams = await lStreams.slice(numtoaddd, lStreams.length);
    //add to grids

    if (doPaginate == true || (prevDoPaginate != doPaginate) || (shared || shareScreenStarted) || shareEnded) {
      let lStreams_alt = await lStreams_

      await processConsumerTransports({consumerTransports, lStreams_: lStreams_alt,parameters})

      try {
        await resumePauseStreams({parameters})

      } catch (error) {

      }

      if (shareEnded) {
        shareEnded = false
         updateShareEnded(shareEnded)
      }
    }
    
    if (ChatSkip && eventType == 'chat') {
      await addVideosGrid({mainGridStreams, altGridStreams,numtoadd:numtoaddd - 1,numRows,numCols,remainingVideos,actualRows,lastrowcols,removeAltGrid,ind,forChat:true,forChatMini:true,forChatCard,forChatID,parameters})
    } else {
      await addVideosGrid({mainGridStreams, altGridStreams, numtoadd:numtoaddd, numRows, numCols, remainingVideos, actualRows,lastrowcols,removeAltGrid, ind,parameters})
    }


    if (updateMainWindow) {
      if (!lock_screen && !shared) {
        await prepopulateUserMedia({name: HostLabel,parameters})
      } else {
        if (!first_round) {
          await prepopulateUserMedia({name: HostLabel,parameters})
        }
      }
    }

    if (ind == 0) {

      await rePort({parameters})
    }


  }