/**
 * Opens or closes the waiting modal based on the current visibility state.
 * @function
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {function} params.updateIsWaitingModalVisible - Function to update the visibility state of the waiting modal.
 * @param {boolean} params.IsWaitingModalVisible - The current visibility state of the waiting modal.
 */

export const launchWaiting = ({

    parameters
}
  ) => {

    const { updateIsWaitingModalVisible, IsWaitingModalVisible } = parameters;

    // Open the menu modal
    updateIsWaitingModalVisible(!IsWaitingModalVisible);


  };

  
  