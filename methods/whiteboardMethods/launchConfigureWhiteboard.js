/**
 * Toggles the visibility of the configurewhiteboard modal.
 * @function
 * @param {Object} options - The options object containing necessary variables and functions.
 * @param {Function} options.updateIsConfigureWhiteboardModalVisible - Function to update the visibility state of the configurewhiteboard modal.
 * @param {boolean} options.isConfigureWhiteboardModalVisible - Current visibility state of the configurewhiteboard modal.
 */
export const launchConfigureWhiteboard = ({ updateIsConfigureWhiteboardModalVisible, isConfigureWhiteboardModalVisible }) => {
    /**
     * Toggle the visibility of the configurewhiteboard modal.
     */
    updateIsConfigureWhiteboardModalVisible(!isConfigureWhiteboardModalVisible);
  };
  