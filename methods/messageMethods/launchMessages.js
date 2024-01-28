/**
 * Opens or closes the messages modal based on the current visibility state.
 * @function
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {function} params.updateIsMessagesModalVisible - Function to update the visibility state of the messages modal.
 * @param {boolean} params.IsMessagesModalVisible - The current visibility state of the messages modal.
 */
export const launchMessages = ({
  updateIsMessagesModalVisible,
  IsMessagesModalVisible,
}) => {
  /**
   * Toggles the visibility state of the messages modal.
   * If the modal is currently visible, it will be closed. If it's hidden, it will be opened.
   */
  updateIsMessagesModalVisible(!IsMessagesModalVisible);
};
