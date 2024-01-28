/**
 * removeParticipants - Handles the process of removing a participant from the chat room.
 * @async
 * @param {Object} options - The options for removing participants.
 * @param {Object} options.parameters - The parameters required for the removal process.
 * @param {boolean} options.parameters.coHostResponsibility - The co-host responsibilities configuration.
 * @param {Object} options.parameters.participant - The participant to be removed.
 * @param {string} options.parameters.member - The username of the current member.
 * @param {string} options.parameters.islevel - The membership level of the current member.
 * @param {Function} options.parameters.showAlert - A function to show alert messages.
 * @param {string} options.parameters.coHost - The username of the co-host.
 * @param {Array} options.parameters.participants - The array of participants in the chat room.
 * @param {Object} options.parameters.socket - The socket object for communication.
 * @param {string} options.parameters.roomName - The name of the chat room.
 * @param {Function} options.parameters.updateParticipants - A function to update the participants array.
 * @returns {Promise<void>} - A Promise that resolves once the removal process is completed.
 */
export const removeParticipants = async ({ parameters }) => {
  const {
    coHostResponsibility,
    participant,
    member,
    islevel,
    showAlert,
    coHost,
    participants,
    socket,
    roomName,
    updateParticipants,
  } = parameters;

  let participantsValue = false;

  try {
    participantsValue = coHostResponsibility.find((item) => item.name === 'participants').value;
  } catch (error) {}

  if (islevel === '2' || (coHost === member && participantsValue === true)) {
    if (participant.islevel !== '2') {
      const participantId = participant.id;

      // Emit a socket event to disconnect the user
      await socket.emit('disconnectUserInitiate', { member: participant.name, roomName, id: participantId });

      // Remove the participant from the local array
      participants.splice(participants.findIndex((obj) => obj.name === participant.name), 1);

      // Update the participants array
      updateParticipants(participants);
    }
  } else {
    if (showAlert) {
      showAlert({
        message: 'You are not allowed to remove other participants',
        type: 'danger',
        duration: 3000,
      });
    }
  }
};
