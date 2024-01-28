/**
 * Handles the event when information about all waiting room members is received.
 *
 * @param {Object} options - Options for handling the waiting room members event.
 * @param {Array} options.waitingParticipants - An array containing information about waiting room participants.
 * @param {Object} options.parameters - Object containing various parameters and functions.
 * @param {Function} options.parameters.showAlert - Function to display an alert/notification.
 * @param {Function} options.parameters.updateWaitingRoomList - Function to update the waiting room participants list.
 * @param {Function} options.parameters.updateTotalReqWait - Function to update the total count of waiting room participants.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the allWaitingRoomMembers function
 * allWaitingRoomMembers({
 *   waitingParticipants: [
 *     { name: 'John Doe', /* other participant information * / },
 *     { name: 'Jane Doe', /* other participant information * / },
 *     // ... more participants
 *   ],
 *   parameters: {
 *     showAlert: showNotification,
 *     updateWaitingRoomList: updateWaitingRoom,
 *     updateTotalReqWait: updateTotalRequests,
 *   },
 * });
 */
export const allWaitingRoomMembers = async ({ waitingParticipants, parameters }) => {
    let {
        showAlert,
        updateWaitingRoomList,
        updateTotalReqWait,
    } = parameters;

    // Calculate the total number of waiting room participants
    let totalReqs = waitingParticipants.length;

    // Update the waiting room participants list
    updateWaitingRoomList(waitingParticipants);

    // Update the total count of waiting room participants
    updateTotalReqWait(totalReqs);

};
