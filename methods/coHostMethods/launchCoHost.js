/**
 * launchCoHost - Launches the co-host modal for managing co-host settings.
 * @param {Object} options - The options for launching the co-host modal.
 * @param {Object} options.parameters - The parameters required for launching the co-host modal.
 * @param {Function} options.parameters.updateIsCoHostModalVisible - A function to update the visibility of the co-host modal.
 * @param {boolean} options.parameters.IsCoHostModalVisible - The current visibility state of the co-host modal.
 * @returns {void} - This function doesn't return any value.
 */
export const launchCoHost = ({ parameters }) => {
  const { updateIsCoHostModalVisible, IsCoHostModalVisible } = parameters;

  // Open or close the co-host modal based on its current visibility state
  updateIsCoHostModalVisible(!IsCoHostModalVisible);
};
