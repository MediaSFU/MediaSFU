/**
 * modifyCoHostSettings - Modifies the co-host settings for the chat room.
 * @async
 * @param {Object} options - The options for modifying co-host settings.
 * @param {Object} options.parameters - The parameters required for the modification process.
 * @param {string} options.parameters.roomName - The name of the chat room.
 * @param {Function} options.parameters.showAlert - A function to show alert messages.
 * @param {string} options.parameters.selectedParticipant - The selected participant to be set as co-host.
 * @param {string} options.parameters.coHost - The current co-host of the chat room.
 * @param {Array} options.parameters.responsibilities - The available co-host responsibilities.
 * @param {Array} options.parameters.coHostResponsibility - The current co-host responsibilities configuration.
 * @param {Function} options.parameters.updateIsCoHostModalVisible - A function to update the visibility of the co-host modal.
 * @param {Function} options.parameters.updateCoHostResponsibility - A function to update the co-host responsibilities configuration.
 * @param {Function} options.parameters.updateCoHost - A function to update the current co-host.
 * @param {Object} options.parameters.socket - The socket object for communication.
 * @returns {Promise<void>} - A Promise that resolves once the co-host settings are modified.
 */
export const modifyCoHostSettings = async ({ parameters }) => {
  const {
    roomName,
    showAlert,
    selectedParticipant,
    coHost,
    responsibilities,
    coHostResponsibility,
    updateIsCoHostModalVisible,
    updateCoHostResponsibility,
    updateCoHost,
    socket,
  } = parameters;

  // Check if the chat room is in demo mode
  if (roomName.toLowerCase().startsWith('d')) {
    if (showAlert) {
      showAlert({
        message: 'You cannot add co-host in demo mode.',
        type: 'danger',
        duration: 3000,
      });
    }
    return;
  }

  let newCoHost = coHost;

  if (coHost !== 'No coHost' || (selectedParticipant && selectedParticipant !== 'Select a participant')) {
    if (selectedParticipant && selectedParticipant !== 'Select a participant') {
      newCoHost = selectedParticipant;
      updateCoHost(newCoHost);
    }

    updateCoHostResponsibility(coHostResponsibility);

    // Emit a socket event to update co-host information
    await socket.emit('updateCoHost', { roomName, coHost: newCoHost, coHostResponsibility });
  }

  // Close the co-host modal
  updateIsCoHostModalVisible(false);
};
