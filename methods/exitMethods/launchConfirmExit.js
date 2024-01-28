/**
 * Launches the confirmation modal for exit.
 *
 * @param {Object} parameters - The parameters required for launching the confirmation modal.
 * @param {Function} parameters.updateIsConfirmExitModalVisible - The function to update the visibility status of the confirmation exit modal.
 * @param {boolean} parameters.isConfirmExitModalVisible - The current visibility status of the confirmation exit modal.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of launchConfirmExit
 * launchConfirmExit({
 *   updateIsConfirmExitModalVisible: (isVisible) => setConfirmExitModalVisible(isVisible),
 *   isConfirmExitModalVisible: confirmExitModalVisible,
 * });
 */
export const launchConfirmExit = ({ updateIsConfirmExitModalVisible, isConfirmExitModalVisible }) => {
  // Open the confirmation exit modal
  updateIsConfirmExitModalVisible(!isConfirmExitModalVisible);

};
