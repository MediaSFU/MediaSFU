/**
 * Handles the creation of a poll.
 * 
 * @param {Object} options - The options for creating the poll.
 * @param {Object} options.poll - The poll object containing the poll details.
 * @param {string} options.roomName - The name of the room where the poll is created.
 * @param {Function} options.showAlert - The function to show an alert message.
 * @returns {Promise<void>} - A promise that resolves when the poll is created successfully.
 */
export const handleCreatePoll = async ({ poll, parameters}) => {

    const {
        socket,
        roomName,
        showAlert,
        updateIsPollModalVisible,
        } = parameters;

    try {
        socket.emit('createPoll', { roomName, poll }, (response) => {
            if (response.success) {
                if (showAlert) {
                    showAlert({ message: 'Poll created successfully', type: 'success' });
                    updateIsPollModalVisible(false);
                }
            } else {
                if (showAlert) {
                    showAlert({ message: response.reason, type: 'danger' });
                }
            }
          });
    } catch (error) {
        
    }
  
  };