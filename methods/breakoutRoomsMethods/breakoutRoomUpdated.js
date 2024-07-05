/**
 * Updates the breakout room based on the received data.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.data - The data received for the breakout room update.
 * @param {Object} options.parameters - The parameters object containing various variables and functions.
 * @param {number} options.parameters.mainRoomsLength - The length of the main rooms.
 * @param {string} options.parameters.memberRoom - The member room.
 * @param {boolean} options.parameters.breakOutRoomStarted - Indicates if the breakout room has started.
 * @param {boolean} options.parameters.breakOutRoomEnded - Indicates if the breakout room has ended.
 * @param {Object} options.parameters.member - The member object.
 * @param {Array} options.parameters.breakoutRooms - The breakout rooms array.
 * @param {string} options.parameters.hostNewRoom - The new room for the host.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {string} options.parameters.islevel - The level of the room.
 * @param {boolean} options.parameters.showAlert - Indicates if an alert should be shown.
 * @param {Object} options.parameters.socket - The socket object.
 * @param {Function} options.parameters.onScreenChanges - The function to handle screen changes.
 */
export const breakoutRoomUpdated = async({ data, parameters }) => {

    try {
        
    let {
        mainRoomsLength,
        memberRoom,
        breakOutRoomStarted,
        breakOutRoomEnded,
        member,
        breakoutRooms,
        hostNewRoom,
        roomName,
        islevel,
        showAlert,
        socket,
        participantsAll,
        participants,


        updateBreakoutRooms,
        updateBreakOutRoomStarted,
        updateBreakOutRoomEnded,
        updateHostNewRoom,
        updateMeetingDisplayType,
        meetingDisplayType,
        prevMeetingDisplayType,
        updateParticipantsAll,
        updateParticipants,

        //mediaSfu functions
        onScreenChanges,
        rePort,
    } = parameters;


    if (data.forHost) {
        hostNewRoom = data.newRoom;
        updateHostNewRoom(data.newRoom);
        await onScreenChanges({ changed: true, parameters });
        return;
    }

    if (islevel == '2' && data.members) {
         //filter out the participant that isBanned == true 
         participantsAll = await data.members
         //remove every field other than isBanned and name from participantsAll
         participantsAll = await participantsAll.map(participant => ({ isBanned: participant.isBanned, name: participant.name }))
         updateParticipantsAll(participantsAll);
 
 
         participants = await data.members.filter(participant => participant.isBanned == false)
         updateParticipants(participants);
    }

    breakoutRooms = data.breakoutRooms;
    updateBreakoutRooms(data.breakoutRooms);

    if (data.status == 'started' && ((breakOutRoomStarted) || !breakOutRoomEnded)) {
        breakOutRoomStarted = true;
        breakOutRoomEnded = false;
        updateBreakOutRoomStarted(true);
        updateBreakOutRoomEnded(false);
        prevMeetingDisplayType = meetingDisplayType;
        if (meetingDisplayType != 'all') {
            meetingDisplayType = 'all';
            updateMeetingDisplayType('all');
        }
        await onScreenChanges({ changed: true, parameters });
        if (islevel == '2') {
            await rePort({restart: true, parameters});
        }
    } else if (data.status == 'ended') {
        breakOutRoomEnded = true;
        updateBreakOutRoomEnded(true);
        if (meetingDisplayType != prevMeetingDisplayType) {
            meetingDisplayType = prevMeetingDisplayType;
            updateMeetingDisplayType(prevMeetingDisplayType);
        }
        await onScreenChanges({ changed: true, parameters });
        if (islevel == '2') {
            await rePort({restart: true, parameters});
        }
    } else if (data.status == 'started' && breakOutRoomStarted) {
        breakOutRoomStarted = true;
        breakOutRoomEnded = false;
        updateBreakOutRoomStarted(true);
        updateBreakOutRoomEnded(false);
        await onScreenChanges({ changed: true, parameters });
        if (islevel == '2') {
            await rePort({restart: true, parameters});
        }
    }
    } catch (error) {
        console.log('Error updating breakout room:', error.message);
    }


}

