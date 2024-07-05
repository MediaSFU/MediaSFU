/**
 * Updates the poll based on the provided parameters.
 * @param {Object} parameters - The parameters object.
 * @param {Array} parameters.polls - The array of polls.
 * @param {Object} parameters.poll - The poll object.
 * @param {string} parameters.member - The member identifier.
 * @param {string} parameters.islevel - The level identifier.
 * @param {Function} parameters.showAlert - The function to show an alert.
 * @param {Function} parameters.updatePolls - The function to update the polls.
 * @param {Function} parameters.updatePoll - The function to update a poll.
 * @returns {Promise<void>} - A promise that resolves when the poll is updated.
 */
export const pollUpdated = async ({data, parameters }) => {

  try {
    let {
      polls,
      poll,
      member,
      islevel,
      showAlert,
      updatePolls,
      updatePoll,
      updateIsPollModalVisible,
    } = parameters;
  
    if (data.polls) {
        polls = data.polls;
      updatePolls(data.polls);
    } else {
        polls = [data.poll];
      updatePolls([data.poll]);
    }
  
    let temp_poll = { id: '' };
  
    if (poll) {
      temp_poll = { ...poll };
    }
  
    if (data.status != 'ended') {
        poll = data.poll;
        updatePoll(data.poll);
    }
  
    if (data.status === 'started' && islevel !== '2') {
      if (!poll.voters || (poll.voters && !poll.voters[member])) {
        showAlert({ message: 'New poll started', type: 'success', duration: 3000 });
        updateIsPollModalVisible(true);
      }
    } else if (data.status === 'ended') {
      if (temp_poll.id === data.poll.id) {
        showAlert({ message: 'Poll ended', type: 'danger', duration: 3000 });
      }
    }
  } catch (error) {
    // console.log(error);
  }

   
  };
  