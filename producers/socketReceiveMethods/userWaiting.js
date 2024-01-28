/**
 * Handles the event when a user joins the waiting room.
 *
 * @param {Object} options - Options for handling the user waiting event.
 * @param {string} options.name - The name of the user who joined the waiting room.
 * @param {Object} options.parameters - Object containing various parameters and functions.
 * @param {Function} options.parameters.showAlert - Function to display an alert/notification.
 * @param {Array} options.parameters.requestsList - The list of user requests.
 * @param {Array} options.parameters.waitingRoomList - The list of users currently in the waiting room.
 * @param {number} options.parameters.totalReqWait - The total number of requests waiting in the waiting room.
 * @param {Function} options.parameters.updateTotalReqWait - Function to update the total number of requests waiting.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the userWaiting function
 * userWaiting({
 *   name: 'John Doe',
 *   parameters: {
 *     showAlert: showNotification,
 *     requestsList: userRequests,
 *     waitingRoomList: waitingUsers,
 *     totalReqWait: totalRequests,
 *     updateTotalReqWait: updateTotalRequests,
 *   },
 * });
 */
export const userWaiting = async ({ name, parameters }) => {
    let {
        showAlert,
        requestsList,
        waitingRoomList,
        totalReqWait,
        updateTotalReqWait,
    } = parameters;

    // Display an alert/notification about the user joining the waiting room
    if (showAlert) {
        showAlert({
            message: `${name} joined the waiting room.`,
            type: 'info',
            duration: 3000,
        });
    }

    // Update the total number of requests waiting in the waiting room
    let totalReqs = totalReqWait + 1;
    updateTotalReqWait(totalReqs);
};
