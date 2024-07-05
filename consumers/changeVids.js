/**
 * Changes the displayed videos on the screen based on the current state and parameters.
 *
 * @param {Object} options - An object containing options for the function.
 * @param {boolean} options.screenChanged - A boolean indicating whether the screen has changed.
 * @param {Object} options.parameters - An object containing various parameters and state values.
 */

export const changeVids = async ({ screenChanged = false, parameters }) => {
  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams();

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

    breakoutRooms,
    hostNewRoom,
    breakOutRoomStarted,
    breakOutRoomEnded,
    virtualStream,
    mainRoomsLength,
    memberRoom,

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

    updateMainRoomsLength,
    updateMemberRoom,

    // mediasoup functions
    mixStreams,
    dispStreams,
  } = parameters;

  try {
      let alVideoStreams = await allVideoStreams
      p_activeNames = await activeNames
      p_dispActiveNames = await dispActiveNames

      let streame

    if (shareScreenStarted || shared) {
      alVideoStreams = await newLimitedStreams;
      activeNames = [];
    }

    activeNames = [];
    dispActiveNames = [];
    ref_participants = await participants;

    let temp = await alVideoStreams;

    await Promise.all(
      temp.map(async (stream) => {
        let participant = ref_participants.find((obj) => obj.videoID == stream.producerId);
        if (!participant && stream.producerId !== 'youyou' && stream.producerId !== 'youyouyou') {
          alVideoStreams = alVideoStreams.filter((obj) => obj.producerId !== stream.producerId);
        }
      })
    );

    if (eventType == 'broadcast' || eventType == 'chat') {
      sortAudioLoudness = false;
    }

    if (shareScreenStarted || shared) {
      non_alVideoStreams = [];
      non_alVideoStreams_muted = [];
      mixed_alVideoStreams = [];
    } else {
      if (alVideoStreams.length > screenPageLimit) {
        alVideoStreams = alVideoStreams.filter((obj) => obj.producerId !== 'youyou');
        alVideoStreams = alVideoStreams.filter((obj) => obj.producerId !== 'youyouyou');

        ref_participants = await ref_participants.sort((a, b) => (a.muted > b.muted ? 1 : -1));

        let temp = [];
        await Promise.all(
          ref_participants.map((participant) => {
            let stream = alVideoStreams.find((obj) => obj.producerId == participant.videoID);
            if (stream) {
              temp.push(stream);
            }
          })
        );
        alVideoStreams = temp;

        let youyou = await allVideoStreams.find((obj) => obj.producerId == 'youyou');
        if (!youyou) {
          let youyouyou = await allVideoStreams.find((obj) => obj.producerId == 'youyouyou');
          alVideoStreams.unshift(youyouyou);
        } else {
          alVideoStreams.unshift(youyou);
        }
      }

      const admin = await participants.filter((participant) => participant.islevel == '2');
      let adminName = '';
      if (admin.length > 0) {
        adminName = admin[0].name;
      }

      non_alVideoStreams = [];
      await Promise.all(
        ref_participants.map((participant) => {
          let stream = alVideoStreams.find((obj) => obj.producerId == participant.videoID);
          if (eventType !== 'chat' && eventType !== 'conference') {
            if (!stream && participant.name !== member && !participant.muted && participant.name !== adminName) {
              non_alVideoStreams.push(participant);
            }
          } else {
            if (!stream && participant.name !== member && !participant.muted) {
              non_alVideoStreams.push(participant);
            }
          }
        })
      );

      if (sortAudioLoudness) {
        await non_alVideoStreams.sort((a, b) => {
          const avgLoudnessA = audioDecibels.find((obj) => obj.name == a.name)?.averageLoudness || 127;
          const avgLoudnessB = audioDecibels.find((obj) => obj.name == b.name)?.averageLoudness || 127;
          return avgLoudnessB - avgLoudnessA;
        });

        if (
          !(meetingDisplayType == 'video' && meetingVideoOptimized) ||
          !(recordingVideoOptimized && recordingDisplayType == 'video')
        ) {
          mixed_alVideoStreams = await mixStreams({ parameters: { alVideoStreams, non_alVideoStreams, ref_participants } });
        }
      }

      non_alVideoStreams_muted = [];
      await Promise.all(
        ref_participants.map((participant) => {
          let stream = alVideoStreams.find((obj) => obj.producerId == participant.videoID);
          if (eventType !== 'chat' && eventType !== 'conference') {
            if (!stream && participant.name !== member && participant.muted && participant.name !== adminName) {
              non_alVideoStreams_muted.push(participant);
            }
          } else {
            if (!stream && participant.name !== member && participant.muted) {
              non_alVideoStreams_muted.push(participant);
            }
          }
        })
      );
    }

    if (eventType == 'conference' && islevel !== '2') {
      let host = await participants.find((obj) => obj.islevel == '2');
      if (host) {
        remoteProducerId = await host.videoID;
        if (islevel == '2') {
          host.stream = virtualStream ? virtualStream : await localStreamVideo;
        } else {
          let hostVideo = await alVideoStreams.find((obj) => obj.producerId == remoteProducerId);
          if (!hostVideo) {
            streame = await oldAllStreams.find((streame) => streame.producerId == remoteProducerId);
            if (streame) {
              alVideoStreams = alVideoStreams.filter((obj) => obj.producerId !== host.videoID);
              non_alVideoStreams = non_alVideoStreams.filter((obj) => obj.name !== host.name);
              non_alVideoStreams_muted = non_alVideoStreams_muted.filter((obj) => obj.name !== host.name);
              if (sortAudioLoudness) {
                mixed_alVideoStreams = mixed_alVideoStreams.filter((obj) => obj.name !== host.name);
                non_alVideoStreams_muted = non_alVideoStreams_muted.filter((obj) => obj.name !== host.name);
                if (meetingDisplayType == 'video' && meetingVideoOptimized) {
                  alVideoStreams.unshift(streame);
                } else {
                  mixed_alVideoStreams.unshift(streame);
                }
              } else {
                alVideoStreams.unshift(streame);
              }
            } else {
              await Promise.all(
                ref_participants.map(async (participant) => {
                  let stream = alVideoStreams.find((obj) => obj.producerId == participant.videoID && participant.name == host.name);
                  if (stream) {
                    if (sortAudioLoudness) {
                      mixed_alVideoStreams = mixed_alVideoStreams.filter((obj) => obj.name !== host.name);
                      non_alVideoStreams_muted = non_alVideoStreams_muted.filter((obj) => obj.name !== host.name);
                      mixed_alVideoStreams.unshift(participant);
                    } else {
                      non_alVideoStreams = non_alVideoStreams.filter((obj) => obj.name !== host.name);
                      non_alVideoStreams.unshift(participant);
                      return;
                    }
                  }
                })
              );
            }
          }
        }
      }
    }

    let allStreamsPaged = [];
    if (sortAudioLoudness) {
      if (meetingDisplayType == 'video') {
        if (meetingVideoOptimized) {
          allStreamsPaged = [...alVideoStreams];
        } else {
          allStreamsPaged = [...mixed_alVideoStreams];
        }
      } else if (meetingDisplayType == 'media') {
        allStreamsPaged = [...mixed_alVideoStreams];
      } else if (meetingDisplayType == 'all') {
        allStreamsPaged = [...mixed_alVideoStreams, ...non_alVideoStreams_muted];
      }
    } else {
      if (meetingDisplayType == 'video') {
        allStreamsPaged = [...alVideoStreams];
      } else if (meetingDisplayType == 'media') {
        allStreamsPaged = [...alVideoStreams, ...non_alVideoStreams];
      } else if (meetingDisplayType == 'all') {
        allStreamsPaged = [...alVideoStreams, ...non_alVideoStreams, ...non_alVideoStreams_muted];
      }
    }

    let allStreamsPagedRecord = [];
    if (sortAudioLoudness) {
      if (recordingDisplayType == 'video') {
        if (recordingVideoOptimized) {
          allStreamsPagedRecord = [...alVideoStreams];
        } else {
          allStreamsPagedRecord = [...mixed_alVideoStreams];
        }
      } else if (recordingDisplayType == 'media') {
        allStreamsPagedRecord = [...mixed_alVideoStreams];
      } else if (recordingDisplayType == 'all') {
        allStreamsPagedRecord = [...mixed_alVideoStreams, ...non_alVideoStreams_muted];
      }
    } else {
      if (recordingDisplayType == 'video') {
        allStreamsPagedRecord = [...alVideoStreams];
      } else if (recordingDisplayType == 'media') {
        allStreamsPagedRecord = [...alVideoStreams, ...non_alVideoStreams];
      } else if (recordingDisplayType == 'all') {
        allStreamsPagedRecord = [...alVideoStreams, ...non_alVideoStreams, ...non_alVideoStreams_muted];
      }
    }

    paginatedStreams = [];
    let limit = await itemPageLimit;

    if (shareScreenStarted || shared) {
      limit = await screenPageLimit;
    }

    let firstPage = [];
    let remainingStreams = [];
    let page;

    let limit_ = limit + 1;

    if (eventType == 'conference') {
      if (!shared && !shareScreenStarted) {
        limit_ = limit_ - 1;
      }
    }

    let nForReadjustRecords = allStreamsPagedRecord.slice(0, limit_);

  // Create pagination
  let memberInRoom = false;
  let filterHost = false;
  if (breakOutRoomStarted && !breakOutRoomEnded) {
    let tempBreakoutRooms = JSON.parse(JSON.stringify(breakoutRooms));
    let host = participants.find((obj) => obj.islevel == '2');
    for (let room of tempBreakoutRooms) {
      try {
        let currentStreams = [];
        const roomIndex = tempBreakoutRooms.indexOf(room);
        if (hostNewRoom != -1 && roomIndex == hostNewRoom) {
          if (host) {
            if (!room.map((obj) => obj.name).includes(host.name)) {
              room = [...room, { name: host.name, breakRoom: roomIndex }];
              filterHost = true;
            }
          }
        }
        for (let participant of room) {
          if (participant.name == member && !memberInRoom) {
            memberInRoom = true;
            memberRoom = participant.breakRoom;
            updateMemberRoom(memberRoom);
          }
          let streams = await allStreamsPaged.filter((stream) => {
            if ((stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) ||
                (stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== "")) {
                let producerId = stream.producerId || stream.audioID;
                let matchingParticipant = ref_participants.find(obj => obj.audioID === producerId || obj.videoID === producerId || ((producerId == 'youyou' || producerId == 'youyouyou') && member == participant.name));
                return (matchingParticipant && matchingParticipant.name === participant.name) || (participant.name == member && (producerId == 'youyou' || producerId == 'youyouyou'));
              } else {
                return stream.hasOwnProperty('name') && stream.name == participant.name;
              }
          });
          for (let stream of streams) {
            if (currentStreams.length < limit_) {
              currentStreams.push(stream);
            }
          }
        }
        paginatedStreams.push(currentStreams);
      } catch (error) {}
    }

    let remainingStreams = await allStreamsPaged.filter((stream) => {
      if ((stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) ||
      (stream.hasOwnProperty('audioID') && stream.audioID != null && stream.audioID !== "")) {
      let producerId = stream.producerId || stream.audioID;
      let matchingParticipant = ref_participants.find(obj => obj.audioID === producerId || obj.videoID === producerId || ((producerId == 'youyou' || producerId == 'youyouyou') && member == obj.name));
      return matchingParticipant && !breakoutRooms.flat().map(obj => obj.name).includes(matchingParticipant.name) && (!filterHost || matchingParticipant.name != host.name);
    } else {
      return !breakoutRooms.flat().map(obj => obj.name).includes(stream.name) && (!filterHost || stream.name != host.name);
    };
    });

    if (memberInRoom) {
      let memberStream = await allStreamsPaged.find(stream => {
        if (stream.hasOwnProperty('producerId') && (stream.producerId != null && stream.producerId !== "")) {
          return stream.producerId == 'youyou' || stream.producerId == 'youyouyou';
        }
      });
      if (memberStream && !remainingStreams.includes(memberStream)) {
        await remainingStreams.unshift(memberStream);
      }
    }
    let remainingPaginatedStreams = [];

    if (remainingStreams.length > 0) {
      firstPage = await remainingStreams.slice(0, limit_);
      remainingPaginatedStreams.push(firstPage);
      for (let i = limit_; i < remainingStreams.length; i += limit) {
        page = await remainingStreams.slice(i, i + limit);
        await remainingPaginatedStreams.push(page);
      }
    }

    mainRoomsLength = await remainingPaginatedStreams.length;
    updateMainRoomsLength(mainRoomsLength);
       // Add the remaining streams to the beginning of the paginatedStreams
    for (let i = remainingPaginatedStreams.length - 1; i >= 0; i--) {
      await paginatedStreams.unshift(remainingPaginatedStreams[i]);
    }
  } else {
    firstPage = allStreamsPaged.slice(0, limit_);
    paginatedStreams.push(firstPage);

    for (let i = limit_; i < allStreamsPaged.length; i += limit) {
      page = allStreamsPaged.slice(i, i + limit);
      paginatedStreams.push(page);
    }
  }

    // State updates
    updateP_activeNames(p_activeNames);
    updateActiveNames(activeNames);
    updateDispActiveNames(dispActiveNames);
    updateNewLimitedStreams(newLimitedStreams);
    updateNon_alVideoStreams(non_alVideoStreams);
    updateRef_participants(ref_participants);
    updateSortAudioLoudness(sortAudioLoudness);
    updateMixed_alVideoStreams(mixed_alVideoStreams);
    updateNon_alVideoStreams_muted(non_alVideoStreams_muted);
    updatePaginatedStreams(paginatedStreams);

    prevDoPaginate = doPaginate;
    doPaginate = false;
    updatePrevDoPaginate(prevDoPaginate);
    updateDoPaginate(doPaginate);

    let isActive = false;

    if (paginatedStreams.length > 1) {
      if (!shareScreenStarted && !shared) {
        doPaginate = true;
      }
      updateDoPaginate(doPaginate);

      if (currentUserPage > paginatedStreams.length - 1) {
        if (breakOutRoomStarted && !breakOutRoomEnded) {
          currentUserPage = 0;
        } else {
          currentUserPage = paginatedStreams.length - 1;
        }
      } else if (currentUserPage == 0) {
        isActive = true;
      }
      updateCurrentUserPage(currentUserPage);
      updateNumberPages(paginatedStreams.length - 1);
      

      if (screenChanged) {
        await dispStreams({ lStreams: paginatedStreams[0], ind: 0, parameters });
      } else {
        await dispStreams({ lStreams: paginatedStreams[0], ind: 0, auto: true, parameters });
      }
      

      if (!isActive) {
        const currentPageBreak = parseInt(currentUserPage) - mainRoomsLength;
        await dispStreams({ lStreams: paginatedStreams[currentUserPage], ind: currentUserPage, parameters, breakRoom: currentPageBreak, inBreakRoom: currentPageBreak >= 0 });
      }
    } else {
      currentUserPage = 0;
      updateCurrentUserPage(currentUserPage);

      if (screenChanged) {
        await dispStreams({ lStreams: paginatedStreams[0], ind: 0, parameters });
      } else {
        await dispStreams({ lStreams: paginatedStreams[0], ind: 0, auto: true, parameters });
      }
    }
  } catch (error) {
    console.log('changeVids error', error);
  }
};