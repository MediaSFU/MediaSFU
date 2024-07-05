/**
 * Handles voting on a poll.
 * @param {Object} options - The options for voting on a poll.
 * @param {Object} options.socket - The socket object.
 * @param {string} options.pollId - The ID of the poll.
 * @param {number} options.pollIndex - The index of the poll in the polls array.
 * @param {number} options.optionIndex - The index of the selected option in the poll.
 * @param {Array} options.polls - The array of polls.
 * @param {string} options.roomName - The name of the room.
 * @param {string} options.member - The member voting on the poll.
 * @param {function} options.showAlert - The function to show an alert message.
 * @returns {Promise<void>} - A promise that resolves when the vote is submitted successfully.
 */
export const handleVotePoll = async ({ pollId, optionIndex, parameters }) => {
    const { socket, showAlert, member, updateIsPollModalVisible } = parameters;

    try {
      socket.emit('votePoll', { roomName: parameters.roomName, poll_id: pollId, member, choice: optionIndex }, (response) => {
        if (response.success) {
          if (showAlert) {
            showAlert({ message: 'Vote submitted successfully', type: 'success' });
            updateIsPollModalVisible(false);
          }
        } else {
          if (showAlert) {
            showAlert({ message: response.reason, type: 'danger' });
          }
        }
      });
    } catch (error) {
      // console.log(error);
    }
  };
