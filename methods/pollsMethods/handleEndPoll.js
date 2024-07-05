

/**
 * Handles the end of a poll.
 * 
 * @param {Object} options - The options for handling the end of the poll.
 * @param {Object} options.socket - The socket object.
 * @param {string} options.roomName - The name of the room.
 * @param {string} options.pollId - The ID of the poll.
 * @returns {Promise<void>} - A promise that resolves when the poll is ended.
 */
export const handleEndPoll = async ({ pollId, parameters }) => {
    const { socket, showAlert,roomName } = parameters;

    try {
      socket.emit('endPoll', { roomName, poll_id: pollId }, (response) => {

        if (response.success) {
          if (showAlert) {
            showAlert({ message: 'Poll ended successfully', severity: 'success' });
          }
        } else {
          if (showAlert) {
            showAlert({ message: response.reason, severity: 'danger' });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };