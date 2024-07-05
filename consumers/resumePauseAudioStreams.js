/**
 * Resumes or pauses audio streams based on the current room and breakout status.
 *
 * @param {Object} options - An object containing options for the function.
 * @param {number} options.breakRoom - The breakout room number.
 * @param {boolean} options.inBreakRoom - Indicates whether the user is in a breakout room.
 * @param {Object} options.parameters - An object containing various parameters and state values.
 */
export const resumePauseAudioStreams = async ({ breakRoom = -1, inBreakRoom = false, parameters }) => {
    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams();
  
    let {
      breakoutRooms,
      ref_participants,
      allAudioStreams,
      participants,
      islevel,
      eventType,
      consumerTransports,
      limitedBreakRoom,
      hostNewRoom,
      member,
  
      updateLimitedBreakRoom,
      processConsumerTransportsAudio,
    } = parameters;
  
    let room;
    let currentStreams = [];
  
    // Determine the room based on breakout status
    if (inBreakRoom && breakRoom != -1) {
      room = breakoutRooms[breakRoom];
      limitedBreakRoom = room;
    } else {
      room = ref_participants.filter(
        (participant) => !breakoutRooms.flat().map((obj) => obj.name).includes(participant.name)
      );
      limitedBreakRoom = room;
    }
    updateLimitedBreakRoom(room);
  
    try {


      let addHostAudio = false

      if (islevel != '2' && eventType == 'conference') {
        const roomMember = breakoutRooms.find(r => r.find(p => p.name == member));
        let memberBreakRoom = -1;
        if (roomMember) {
          memberBreakRoom = breakoutRooms.indexOf(roomMember);
        }
        if ((inBreakRoom && breakRoom !== hostNewRoom) || (!inBreakRoom && hostNewRoom !== -1 && hostNewRoom !== memberBreakRoom)) {
          let host = participants.find(obj => obj.islevel == '2');
          //remove the host from the room
          room = room.filter(participant => participant.name !== host.name);
        } else {
          if ((inBreakRoom && breakRoom == hostNewRoom) || (!inBreakRoom && hostNewRoom === -1 ) || (!inBreakRoom && hostNewRoom === memberBreakRoom && memberBreakRoom !== -1)) {
            addHostAudio = true
          }
        }

      }

      for (let participant of room) {
        let streams = allAudioStreams.filter((stream) => {
          if (
            (stream.hasOwnProperty('producerId') && stream.producerId) ||
            (stream.hasOwnProperty('audioID') && stream.audioID)
          ) {
            let producerId = stream.producerId || stream.audioID;
            let matchingParticipant = ref_participants.find((obj) => obj.audioID == producerId);
            return matchingParticipant && matchingParticipant.name == participant.name;
          }
        });
  
        for (let stream of streams) {
          currentStreams.push(stream);
        }
      }
  
      // If webinar, add the host audio stream if it is not in the currentStreams
      if (islevel != '2' && (eventType == 'webinar' || addHostAudio)) {
        let host = participants.find((obj) => obj.islevel == '2');
        let hostStream = allAudioStreams.find((obj) => obj.producerId == host.audioID);
        if (hostStream && !currentStreams.includes(hostStream)) {
          currentStreams.push(hostStream);
          if (!room.map((obj) => obj.name).includes(host.name)) {
            room.push({ name: host.name, breakRoom: -1 });
          }
          updateLimitedBreakRoom(room);
        }
      }
  
      await processConsumerTransportsAudio({ consumerTransports, lStreams:currentStreams, parameters });
    } catch (error) {
      // console.log('Error in resumePauseAudioStreams:', error);
    }

   
  };
  