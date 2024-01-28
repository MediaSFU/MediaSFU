/**
 * Toggles the visibility of the participants modal.
 * @function
 * @param {Object} options - The options object containing necessary variables and functions.
 * @param {Function} options.updateIsParticipantsModalVisible - Function to update the visibility state of the participants modal.
 * @param {boolean} options.IsParticipantsModalVisible - Current visibility state of the participants modal.
 */
export const launchParticipants = ({ updateIsParticipantsModalVisible, IsParticipantsModalVisible }) => {
  /**
   * Toggle the visibility of the participants modal.
   */
  updateIsParticipantsModalVisible(!IsParticipantsModalVisible);
};
