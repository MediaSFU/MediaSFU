/**
 * Toggles the visibility of the breakoutrooms modal.
 * @function
 * @param {Object} options - The options object containing necessary variables and functions.
 * @param {Function} options.updateIsBreakoutRoomsModalVisible - Function to update the visibility state of the breakoutrooms modal.
 * @param {boolean} options.isBreakoutRoomsModalVisible - Current visibility state of the breakoutrooms modal.
 */
export const launchBreakoutRooms = ({ updateIsBreakoutRoomsModalVisible, isBreakoutRoomsModalVisible }) => {
    /**
     * Toggle the visibility of the breakoutrooms modal.
     */
    updateIsBreakoutRoomsModalVisible(!isBreakoutRoomsModalVisible);
  };
  