/**
 * Handles a participant's request to join an event, adding the request to the request list.
 *
 * @param {Object} options - Options for handling participant requests.
 * @param {Object} options.userRequest - Information about the participant's request.
 * @param {Object} options.parameters - Object containing various functions and state related to participant requests.
 * @param {Array} options.parameters.requestList - List of participant requests.
 * @param {Array} options.parameters.waitingRoomList - List of participants in the waiting room.
 * @param {number} options.parameters.totalReqWait - Total count of participant requests and waiting room participants.
 * @param {Function} options.parameters.updateTotalReqWait - Function to update the total count of requests and waiting room participants.
 * @param {Function} options.parameters.updateRequestList - Function to update the list of participant requests.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the participantRequested function
 * participantRequested({
 *   userRequest: { id: '123', name: 'John Doe', icon: 'fa-user' },
 *   parameters: {
 *     requestList,
 *     waitingRoomList,
 *     totalReqWait,
 *     updateTotalReqWait,
 *     updateRequestList,
 *   },
 * });
 */
export const participantRequested = async ({ userRequest, parameters }) => {
    // Handle participant request to join the event
    let {
        requestList,
        waitingRoomList,
        totalReqWait,
        updateTotalReqWait,
        updateRequestList,
    } = parameters;

    // Add the user request to the request list
    requestList = await [...requestList, userRequest];
    updateRequestList(requestList);

    // Update the total count of requests and waiting room participants
    let reqCount = requestList.length + waitingRoomList.length;
    updateTotalReqWait(reqCount);
};
