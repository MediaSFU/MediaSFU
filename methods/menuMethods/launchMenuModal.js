/**
 * Function to toggle the visibility of the menu modal.
 * @function
 * @param {Object} parameters - The parameters for the function.
 * @param {Function} parameters.updateIsMenuModalVisible - Function to update the visibility state of the menu modal.
 * @param {boolean} parameters.IsMenuModalVisible - The current visibility state of the menu modal.
 * @returns {void}
 */
export const launchMenuModal = ({ updateIsMenuModalVisible, IsMenuModalVisible }) => {
    
  // Open or close the menu modal based on the current visibility state
  updateIsMenuModalVisible(!IsMenuModalVisible);
};
