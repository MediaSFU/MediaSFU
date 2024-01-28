/**
 * Initiates media control by the host or co-host. The host (co-host) can stop and resume audio, video, or screenshare of a participant.
 *
 * @param {Object} options - The options object.
 * @param {string} options.participantId - The ID of the participant to control media.
 * @param {string} options.participantName - The name of the participant to control media.
 * @param {string} options.type - The type of media to control ('audio', 'video', 'screenshare', 'all').
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Object} options.parameters.socket - The socket used for communication.
 * @param {Array} options.parameters.coHostResponsibility - An array representing the responsibilities of the co-host.
 * @param {Object} options.parameters.participant - The details of the participant initiating the media control.
 * @param {string} options.parameters.member - The member's identity.
 * @param {string} options.parameters.islevel - The participant's level ('1' for regular participant, '2' for host).
 * @param {Function} options.parameters.showAlert - A function to display an alert message.
 * @param {string} options.parameters.coHost - The co-host's identity.
 * @throws Throws an error if there is an issue during media control initiation.
 */
export async function controlMedia({ participantId, participantName, type, parameters }) {
  try {
    // Destructure parameters
    const { socket, coHostResponsibility, participants, member, islevel, showAlert, coHost, roomName } = parameters;
    let mediaValue = false;

    try {
      mediaValue = coHostResponsibility.find((item) => item.name === 'media').value;
    } catch (error) {}

    let participant = participants.find((obj) => obj.name === participantName);

    if (islevel === '2' || (coHost === member && mediaValue === true)) {
      // Check if the participant is not muted and is not a host
      if ((!participant.muted && participant.islevel !== '2' && type == 'audio')  || (participant.islevel !== '2' && type == 'video' && participant.videoOn)) {
        // Emit controlMedia event to the server
        await socket.emit('controlMedia', { participantId, participantName, type, roomName });
      }
    } else {
      // Display an alert if the participant is not allowed to mute other participants
      if (showAlert) {
        showAlert({
          message: 'You are not allowed to control media for other participants.',
          type: 'danger',
          duration: 3000,
        });
      }
    }
  } catch (error) {
    console.log('controlMedia error', error);
    // throw error;
  }
}
