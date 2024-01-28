/**
 * Changes the displayed videos on the screen based on the current state and parameters.
 *
 * @param {Object} options - An object containing options for the function.
 * @param {boolean} options.screenChanged - A boolean indicating whether the screen has changed.
 * @param {Object} options.parameters - An object containing various parameters and state values.
 */

export const changeVids = async({screenChanged=false,parameters})=> {
    //function to change the videos on the screen
    // Call updateMiniCardsGrid() with the current number of rows and columns
  
    let {getUpdatedAllParams} = parameters;
    parameters = await getUpdatedAllParams()

    let {
        allVideoStreams,
        p_activeNames,
        activeNames,
        dispActiveNames,
        p_dispActiveNames,
        shareScreenStarted,
        shareScreen,
        shared,
        newLimitedStreams,
        non_alVideoStreams,
        ref_participants,
        participants,
        eventType,
        islevel,
        member,
        sortAudioLoudness,
        audioDecibels,
        mixed_alVideoStreams,
        non_alVideoStreams_muted,
        remoteProducerId,
        localStreamVideo,
        oldAllStreams,
        screenPageLimit,
        meetingDisplayType,
        meetingVideoOptimized,
        recordingVideoOptimized,
        recordingDisplayType,
        paginatedStreams,
        itemPageLimit,
        screenId,
        adminVidID,
        doPaginate,
        prevDoPaginate,
        currentUserPage,
        numberPages,

    
        updateP_activeNames,
        updateActiveNames,
        updateDispActiveNames,
        updateNewLimitedStreams,
        updateNon_alVideoStreams,
        updateRef_participants,
        updateParticipants,
        updateEventType,
        updateIslevel,
        updateMember,
        updateSortAudioLoudness,
        updateAudioDecibels,
        updateMixed_alVideoStreams,
        updateNon_alVideoStreams_muted,

        updateLocalStreamVideo,
        updateOldAllStreams,
        updateScreenPageLimit,
        updateMeetingDisplayType,
        updateMeetingVideoOptimized,
        updateRecordingVideoOptimized,
        updateRecordingDisplayType,
        updatePaginatedStreams,
        updateItemPageLimit,
        updateScreenId,
        updateAdminVidID,
        updateDoPaginate,
        updatePrevDoPaginate,
        updateCurrentUserPage,
        updateNumberPages,

        //mediasfu Functions
        mixStreams,
        dispStreams,
     
    } = parameters

    try {
      let alVideoStreams = await allVideoStreams
      p_activeNames = await activeNames
      p_dispActiveNames = await dispActiveNames

      let streame
  
      if (shareScreenStarted || ( shared)) {
        alVideoStreams = await newLimitedStreams
  
        activeNames = []
      } else {
  
      }
  
      activeNames = []
      dispActiveNames = []
  
      ref_participants = await participants
  
      let temp = await alVideoStreams
  
      await temp.forEach((stream) => {
        //find the participant with the same videoID
        try {
  
          let participant = ref_participants.find(obj => {
            return obj.videoID === stream.producerId
          })
          // if not found and producerid is not youyou or youyouyou, remove the stream
          if (!participant && stream.producerId != 'youyou' && stream.producerId != 'youyouyou') {
            alVideoStreams = alVideoStreams.filter(function (obj) {
              return obj.producerId !== stream.producerId;
            });
          }
  
        } catch (error) {
  
        }
  
      })
  
      if (eventType == 'broadcast' || eventType == 'chat') {
        sortAudioLoudness = false
        //not needed
      } else {
  
      }
  
      if (shareScreenStarted || shared) {
  
        non_alVideoStreams = []
        non_alVideoStreams_muted = []
        mixed_alVideoStreams = []
  
      } else {
  
        if (alVideoStreams.length > screenPageLimit) {
          //remove youyou and youyouyou from alVideoStreams
          alVideoStreams = alVideoStreams.filter(function (obj) {
            return obj.producerId !== 'youyou';
          });
          alVideoStreams = alVideoStreams.filter(function (obj) {
            return obj.producerId !== 'youyouyou';
          });
  
          //sort participants by muted = false
          ref_participants = await ref_participants.sort((a, b) => (a.muted > b.muted) ? 1 : -1)
  
          //sort alVideoStreams by order of participants
          let temp = []
          await ref_participants.forEach((participant) => {
            let stream = alVideoStreams.find(obj => {
              return obj.producerId === participant.videoID
            })
            if (stream) {
              temp.push(stream)
            }
          })
          alVideoStreams = temp
  
          //add youyou and youyouyou to the beginning of alVideoStreams
          let youyou = await allVideoStreams.find(obj => {
            return obj.producerId === 'youyou'
          })
  
          if (!youyou) {
            let youyouyou = await allVideoStreams.find(obj => {
              return obj.producerId === 'youyouyou'
            })
            await alVideoStreams.unshift(youyouyou)
          } else {
            await alVideoStreams.unshift(youyou)
          }
        }
  
        const admin = await participants.filter(participant => participant.isAdmin == true && participant.islevel == '2')
        let adminName = ""
        if (admin.length > 0) {
          adminName = await admin[0].name;
        }
  
        //get all participants that are not on alVideoStreams array and name is not == member and have muted = false and add them to non_alVideoStreams
        non_alVideoStreams = []
        await ref_participants.forEach((participant) => {
          let stream = alVideoStreams.find(obj => {
            return obj.producerId === participant.videoID
          })
  
          if (eventType != 'chat' && eventType != 'conference') {
            if (!stream && participant.name != member && !participant.muted && participant.name != adminName) {
              non_alVideoStreams.push(participant)
            }
          } else {
            if (!stream && participant.name != member && !participant.muted) {
              non_alVideoStreams.push(participant)
            }
          }
        })
  
  
        if (sortAudioLoudness) {
          //sort non_alVideoStreams_muted by loudness
  
          await non_alVideoStreams.sort((a, b) => {
            const avgLoudnessA = audioDecibels.find(obj => obj.name === a.name)?.averageLoudness || 127;
            const avgLoudnessB = audioDecibels.find(obj => obj.name === b.name)?.averageLoudness || 127;
  
            return avgLoudnessB - avgLoudnessA;
          });
  
          if ((meetingDisplayType == "video" && meetingVideoOptimized) && (recordingVideoOptimized && recordingDisplayType == "video")) {
          } else {
  
            mixed_alVideoStreams = await mixStreams({ parameters: { alVideoStreams, non_alVideoStreams, ref_participants } })
          }
  
        }
  
        //get the rest with muted = true and add them to non_alVideoStreams_muted
        non_alVideoStreams_muted = []
        await ref_participants.forEach((participant) => {
          let stream = alVideoStreams.find(obj => {
            return obj.producerId === participant.videoID
          })
  
          if (eventType != 'chat' && eventType != 'conference') {
            if (!stream && participant.name != member && participant.muted && participant.name != adminName) {
              non_alVideoStreams_muted.push(participant)
            }
          } else {
            if (!stream && participant.name != member && participant.muted) {
              non_alVideoStreams_muted.push(participant)
            }
          }
        })
  
      }
  
      if (eventType == 'conference' && islevel != '2') {
  
        // try and look for the admin stream and add it to the beginning of alVideoStreams 
        // try video first then audio
  
        let host = await participants.find(obj => {
          return obj.islevel == '2'
        })
  
        if (host) {
  
          remoteProducerId = await host.videoID;
          // get the stream from allvideostream with the same id as remoteProducerId
  
          if (islevel == '2') {
            host.stream = await localStreamVideo;
          } else {
            // first check if the host is in alVideoStreams
            let hostVideo = await alVideoStreams.find(obj => {
              return obj.producerId === remoteProducerId
            })
  
            if (!hostVideo) {
              streame = await oldAllStreams.find((streame) => streame.producerId == remoteProducerId);
              // add streame to lStreams
              if (streame) {
                //remove any stream with name of host.name from [alVideoStreams,non_alVideoStreams,non_alVideoStreams_muted]
                alVideoStreams = await alVideoStreams.filter(function (obj) {
                  return obj.producerId !== host.videoID;
                });
  
                non_alVideoStreams = await non_alVideoStreams.filter(function (obj) {
                  return obj.name !== host.name;
                });
  
                non_alVideoStreams_muted = await non_alVideoStreams_muted.filter(function (obj) {
                  return obj.name !== host.name;
                });
  
                if (sortAudioLoudness) {
  
                  mixed_alVideoStreams = await mixed_alVideoStreams.filter(function (obj) {
                    return obj.name !== host.name;
                  });
  
                  non_alVideoStreams_muted = await non_alVideoStreams_muted.filter(function (obj) {
                    return obj.name !== host.name;
                  });
  
                  if (meetingDisplayType == "video" && meetingVideoOptimized) {
                    await alVideoStreams.unshift(streame)
                  } else {
                    await mixed_alVideoStreams.unshift(streame)
                  }
  
  
                } else {
                  await alVideoStreams.unshift(streame)
                }
  
              } else {
  
                //look for audio stream of host if the main video stream is not found
  
                await ref_participants.forEach(async (participant) => {
                  let stream = await alVideoStreams.find(obj => {
                    return obj.producerId === participant.videoID && participant.name == host.name
                  })
  
                  if (stream) {
  
                    if (sortAudioLoudness) {
                      //remove any stream with name of host.name from mixed_alVideoStreams and return
                      mixed_alVideoStreams = await mixed_alVideoStreams.filter(function (obj) {
                        return obj.name !== host.name;
                      });
  
  
                      non_alVideoStreams_muted = await non_alVideoStreams_muted.filter(function (obj) {
                        return obj.name !== host.name;
                      });
  
  
                      await mixed_alVideoStreams.unshift(participant)
  
                    } else {
  
                      //remove any stream with name of host.name from non_alVideoStreams and return
                      non_alVideoStreams = await non_alVideoStreams.filter(function (obj) {
                        return obj.name !== host.name;
                      });
  
                      await non_alVideoStreams.unshift(participant)
  
                      return
  
                    }
  
                  }
                })
  
  
              }
            }
          }
        }
  
      }
  
  
      let allStreamsPaged = []
  
      if (sortAudioLoudness) {
  
        if (meetingDisplayType == 'video') {
  
          if (meetingVideoOptimized) {
            // video only
            allStreamsPaged = await [...alVideoStreams]
          } else {
            allStreamsPaged = await [...mixed_alVideoStreams]
  
          }
        } else if (meetingDisplayType == 'media') {
  
          allStreamsPaged = await [...mixed_alVideoStreams];
  
        } else if (meetingDisplayType == 'all') {
  
          allStreamsPaged = await [...mixed_alVideoStreams, ...non_alVideoStreams_muted];
        }
  
      } else {
        if (meetingDisplayType == 'video') {
  
          allStreamsPaged = await [...alVideoStreams]
  
  
        } else if (meetingDisplayType == 'media') {
  
          allStreamsPaged = await [...alVideoStreams, ...non_alVideoStreams];
  
        } else if (meetingDisplayType == 'all') {
  
          allStreamsPaged = await [...alVideoStreams, ...non_alVideoStreams, ...non_alVideoStreams_muted];
  
        }
      }
  
      let allStreamsPagedRecord = []
  
      if (sortAudioLoudness) {
  
        if (recordingDisplayType == 'video') {
  
          if (recordingVideoOptimized) {
            // video only
            allStreamsPagedRecord = await [...alVideoStreams]
          } else {
            allStreamsPagedRecord = await [...mixed_alVideoStreams]
  
          }
        } else if (recordingDisplayType == 'media') {
  
          allStreamsPagedRecord = await [...mixed_alVideoStreams];
  
        } else if (recordingDisplayType == 'all') {
  
          allStreamsPagedRecord = await [...mixed_alVideoStreams, ...non_alVideoStreams_muted];
        }
  
      } else {
        if (recordingDisplayType == 'video') {
  
          allStreamsPagedRecord = await [...alVideoStreams]
  
  
        } else if (recordingDisplayType == 'media') {
  
          allStreamsPagedRecord = await [...alVideoStreams, ...non_alVideoStreams];
  
        } else if (recordingDisplayType == 'all') {
  
          allStreamsPagedRecord = await [...alVideoStreams, ...non_alVideoStreams, ...non_alVideoStreams_muted];
  
        }
      }
  
      paginatedStreams = [];
      let combinedStreams = [];
      let limit = await itemPageLimit;
  
  
      if (shareScreenStarted || shared) {
        limit = await screenPageLimit;
      }
  
      let firstPage = [];
      let remainingStreams = [];
      let page;
  
      let limit_ = await limit + 1
  
      if (eventType == 'conference') {
  
        if (shared || shareScreenStarted) {
  
        } else {
  
          limit_ = await limit_ - 1
        }
  
  
      }
  
      //do all relevant state updates here
    updateP_activeNames(p_activeNames)
    updateActiveNames(activeNames)
    updateDispActiveNames(dispActiveNames)
    updateNewLimitedStreams(newLimitedStreams)
    updateNon_alVideoStreams(non_alVideoStreams)
    updateRef_participants(ref_participants)
  
    updateSortAudioLoudness(sortAudioLoudness)
    updateMixed_alVideoStreams(mixed_alVideoStreams)
    updateNon_alVideoStreams_muted(non_alVideoStreams_muted)
    updatePaginatedStreams(paginatedStreams)

    let nForReadjustRecords = await allStreamsPagedRecord.slice(0, limit_);

    // Create pagination
    // Add the first page to the pagination

    firstPage = await allStreamsPaged.slice(0, limit_);
    await paginatedStreams.push(firstPage);

    // Add the remaining streams to the pagination
    for (let i = limit_; i < allStreamsPaged.length; i += limit) {
      page = await allStreamsPaged.slice(i, i + limit);
      await paginatedStreams.push(page);
    }

    updatePaginatedStreams(paginatedStreams)
    

    prevDoPaginate = await doPaginate
    doPaginate = false
    updatePrevDoPaginate(prevDoPaginate)
    updateDoPaginate(doPaginate)

    let isActive = false

    if (paginatedStreams.length > 1) {
      

      if (shareScreenStarted || shared) {
        doPaginate = false
        
      } else {
        doPaginate = true
      }
      updateDoPaginate(doPaginate)

      if (currentUserPage > (paginatedStreams.length - 1)) {
        currentUserPage = await paginatedStreams.length - 1
        updateCurrentUserPage(currentUserPage)
      } else {
        if (currentUserPage == 0) {
          isActive = true
        }
      }
    

      if (!isActive) {
        // await generatePagination(paginatedStreams.length - 1, true); 
        updateNumberPages(paginatedStreams.length - 1)
      } else {
        // await generatePagination(paginatedStreams.length - 1, false); 
        updateNumberPages(paginatedStreams.length - 1)
      }

      //first page
      if (screenChanged) {
        await dispStreams({lStreams:paginatedStreams[0], ind:0,parameters})
      } else {
        await dispStreams({lStreams:paginatedStreams[0], ind:0,auto:true,parameters})
      }

      //current page
      if (!isActive) {
   
        await dispStreams({lStreams:paginatedStreams[currentUserPage], ind:currentUserPage,parameters})
      }

    } else {

      doPaginate = false
      updateDoPaginate(doPaginate)
      currentUserPage = 0
      updateCurrentUserPage(currentUserPage)
      
      if (screenChanged) {
        await dispStreams({lStreams:paginatedStreams[0], ind:0,parameters})
      } else {
        await dispStreams({lStreams:paginatedStreams[0], ind:0,auto:true,parameters})
      }
    }
      
  
    } catch (error) {
        console.log('changeVids error',error)
    }

   
  }


    
