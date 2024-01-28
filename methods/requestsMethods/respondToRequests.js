/**
 * Respond to participant requests and update the request list.
 *
 * @param {Object} options - The options for responding to participant requests.
 * @param {Object} options.parameters - The parameters object containing required functions and state variables.
 * @param {Object} options.parameters.socket - The socket object for emitting events.
 * @param {Object} options.parameters.request - The request object containing information about the participant request.
 * @param {Function} options.parameters.updateRequestList - The function to update the participant request list.
 * @param {Array} options.parameters.requestList - The array of participant requests.
 * @param {string} options.parameters.action - The action to be performed ('accepted' or 'rejected').
 * @param {string} options.parameters.roomName - The name of the room where the request is being responded to.
 *
 * @example
 * // Example usage of respondToRequests function
 * const options = {
 *   parameters: {
 *     socket: socketObject, // Socket object for emitting events
 *     request: {
 *       id: '12345', // ID of the participant
 *       name: 'John Doe', // Name of the participant
 *       icon: 'fa-microphone', // Type of the request icon
 *     },
 *     updateRequestList: (newRequestList) => {}, // Function to update participant request list
 *     requestList: [], // Array of participant requests
 *     action: 'accepted', // Action to be performed ('accepted' or 'rejected')
 *     roomName: 'exampleRoom', // Name of the room where the request is being responded to
 *   },
 * };
 * await respondToRequests(options);
 */

export const respondToRequests = async({
    parameters
}
  ) => {

    const {socket,request,updateRequestList,requestList,action,roomName } = parameters;
    // Perform your logic here to determine which buttons to show/hide based on the state variables

    let newRequestList = requestList.filter(function (request_) {
        return !(request_.id == request.id && request_.icon == request.icon && request_.name == request.name)
      })
    
    
    updateRequestList(newRequestList);

    let requestResponse = {
        id: request.id,
        name: request.name,
        type: request.icon,
        action: action,
      };


    await socket.emit('updateUserofRequestStatus', ({ requestResponse, roomName }));

  }

  
  