/**
 * hostRequestResponse - A method for handling the host's response to participant requests.
 * @param {Object} params - The parameters passed to the hostRequestResponse method.
 * @param {string} params.requestResponse - The response of the host to the participant's request.
 * @param {Object} params.parameters - The object containing parameters for the hostRequestResponse method.
 * @param {Function} params.parameters.showAlert - A function to show an alert.
 * @param {Array} params.parameters.requestList - The list of participant requests.
 * @param {Function} params.parameters.updateRequestList - A function to update the list of participant requests.
 * @param {boolean} params.parameters.micAction - The current microphone action state.
 * @param {Function} params.parameters.updateMicAction - A function to update the microphone action state.
 * @param {boolean} params.parameters.videoAction - The current video action state.
 * @param {Function} params.parameters.updateVideoAction - A function to update the video action state.
 * @param {boolean} params.parameters.screenAction - The current screenshare action state.
 * @param {Function} params.parameters.updateScreenAction - A function to update the screenshare action state.
 * @param {boolean} params.parameters.chatAction - The current chat action state.
 * @param {Function} params.parameters.updateChatAction - A function to update the chat action state.
 * @param {string} params.parameters.audioRequestState - The current state of the audio request.
 * @param {Function} params.parameters.updateAudioRequestState - A function to update the audio request state.
 * @param {string} params.parameters.videoRequestState - The current state of the video request.
 * @param {Function} params.parameters.updateVideoRequestState - A function to update the video request state.
 * @param {string} params.parameters.screenRequestState - The current state of the screenshare request.
 * @param {Function} params.parameters.updateScreenRequestState - A function to update the screenshare request state.
 * @param {string} params.parameters.chatRequestState - The current state of the chat request.
 * @param {Function} params.parameters.updateChatRequestState - A function to update the chat request state.
 * @param {Date} params.parameters.audioRequestTime - The time of the last audio request.
 * @param {Function} params.parameters.updateAudioRequestTime - A function to update the audio request time.
 * @param {Date} params.parameters.videoRequestTime - The time of the last video request.
 * @param {Function} params.parameters.updateVideoRequestTime - A function to update the video request time.
 * @param {Date} params.parameters.screenRequestTime - The time of the last screenshare request.
 * @param {Function} params.parameters.updateScreenRequestTime - A function to update the screenshare request time.
 * @param {Date} params.parameters.chatRequestTime - The time of the last chat request.
 * @param {Function} params.parameters.updateChatRequestTime - A function to update the chat request time.
 * @param {number} params.parameters.updateRequestIntervalSeconds - The interval in seconds to wait before requesting again.
 * @returns {void} - No return value.
 */

export const hostRequestResponse = async ({requestResponse , parameters }) => {

    let {
        showAlert,
        requestList,
        updateRequestList,
        micAction,
        updateMicAction,
        videoAction,
        updateVideoAction,
        screenAction,
        updateScreenAction,
        chatAction,
        updateChatAction,
        audioRequestState,
        updateAudioRequestState,
        videoRequestState,
        updateVideoRequestState,
        screenRequestState,
        updateScreenRequestState,
        chatRequestState,
        updateChatRequestState,
        audioRequestTime,
        updateAudioRequestTime,
        videoRequestTime,
        updateVideoRequestTime,
        screenRequestTime,
        updateScreenRequestTime,
        chatRequestTime,
        updateChatRequestTime,
        updateRequestIntervalSeconds,

        
    } = parameters;
    

    //requestResponse is the response of the host to the request of the participant

    // check the action of the admin and if accept, allow the action
    //notify the user if the action was accepted or not
    let requests = requestList
    requestList = await requests.filter(request => request.id !== requestResponse.id && request.icon !== requestResponse.type && request.name !== requestResponse.name && request.username !== requestResponse.username)
    updateRequestList(requestList)
    let requestType = requestResponse.type

    if (requestResponse.action == 'accepted') {
      if (requestType == 'fa-microphone') {
        //tell the user that the unmute request was accepted
        if (showAlert) {
          showAlert({
            message: 'Unmute request was accepted; click the mic button again to begin.',
            type: 'success',
            duration: 10000,
          });
          }
        
        micAction = true
        updateMicAction(micAction)
        audioRequestState = 'accepted'
        updateAudioRequestState(audioRequestState)
      } else if (requestType == 'fa-video') {
        //tell the user that the video request was not accepted
         if (showAlert) {
          showAlert({
            message: 'Video request was accepted; click the video button again to begin.',
            type: 'success',
            duration: 10000,
          });
          }
        videoAction = true
        updateVideoAction(videoAction)
        videoRequestState = 'accepted'
        updateVideoRequestState(videoRequestState)
      } else if (requestType == 'fa-desktop') {
        //tell the user that the screenshare request was not accepted
            if (showAlert) {
            showAlert({
                message: 'Screenshare request was accepted; click the screen button again to begin.',
                type: 'success',
                duration: 10000,
            });
            }
        screenAction = true
        updateScreenAction(screenAction)
        screenRequestState = 'accepted'
        updateScreenRequestState(screenRequestState)
      } else if (requestType == 'fa-comments') {
        //tell the user that the chat request was not accepted
            if (showAlert) {
            showAlert({
                message: 'Chat request was accepted; click the chat button again to begin.',
                type: 'success',
                duration: 10000,
            });
            }

        chatAction = true
        updateChatAction(chatAction)
        chatRequestState = 'accepted'
        updateChatRequestState(chatRequestState)
      }

    } else {
      //notify the user that the action was not accepted, get the type of request and tell the user that the action was not accepted 
      requestType = requestResponse.type
      if (requestType == 'fa-microphone') {
        //tell the user that the unmute request was not accepted

         if (showAlert) {
          showAlert({
            message: 'Unmute request was not accepted',
            type: 'danger',
            duration: 10000,
          });
          }
        audioRequestState = 'rejected'
        updateAudioRequestState(audioRequestState)
        //set audioRequestTimer to maker user wait for updateRequestIntervalSeconds seconds before requesting again
        let audioRequestTimer = updateRequestIntervalSeconds
        // set datetimenow to current time
        let audioRequestTimeNow = new Date()
        //add updateRequestIntervalSeconds seconds to datetimenow
        audioRequestTimeNow.setSeconds(audioRequestTimeNow.getSeconds() + audioRequestTimer)
        //set audioRequestTime to the new time
        audioRequestTime = audioRequestTimeNow
        updateAudioRequestTime(audioRequestTime)

        

      } else if (requestType == 'fa-video') {
        //tell the user that the video request was not accepted
        if (showAlert) {
          showAlert({
            message: 'Video request was not accepted',
            type: 'danger',
            duration: 10000,
          });
          }
        videoRequestState = 'rejected'
        updateVideoRequestState(videoRequestState)
        //set videoRequestTimer to maker user wait for updateRequestIntervalSeconds seconds before requesting again from UTC time now
        let videoRequestTimer = updateRequestIntervalSeconds
        // set datetimenow to current time
        let videoRequestTimeNow = new Date()
        //add updateRequestIntervalSeconds seconds to datetimenow
        videoRequestTimeNow.setSeconds(videoRequestTimeNow.getSeconds() + videoRequestTimer)
        //set videoRequestTime to the new time
        videoRequestTime = videoRequestTimeNow
        updateVideoRequestTime(videoRequestTime)

      } else if (requestType == 'fa-desktop') {
        //tell the user that the screenshare request was not accepted
        if (showAlert) {
          showAlert({
            message: 'Screenshare request was not accepted',
            type: 'danger',
            duration: 10000,
          });
          }
        screenRequestState = 'rejected'
        updateScreenRequestState(screenRequestState)
        //set screenRequestTimer to maker user wait for updateRequestIntervalSeconds seconds before requesting again
        let screenRequestTimer = updateRequestIntervalSeconds
        // set datetimenow to current time
        let screenRequestTimeNow = new Date()
        //add updateRequestIntervalSeconds seconds to datetimenow
        screenRequestTimeNow.setSeconds(screenRequestTimeNow.getSeconds() + screenRequestTimer)
        //set screenRequestTime to the new time
        screenRequestTime = screenRequestTimeNow
        updateScreenRequestTime(screenRequestTime)

      } else if (requestType == 'fa-comments') {
        //tell the user that the chat request was not accepted
        if (showAlert) {
          showAlert({
            message: 'Chat request was not accepted',
            type: 'danger',
            duration: 10000,
          });
          }
        chatRequestState = 'rejected'
        updateChatRequestState(chatRequestState)
        //set chatRequestTimer to maker user wait for updateRequestIntervalSeconds seconds before requesting again
        let chatRequestTimer = updateRequestIntervalSeconds
        // set datetimenow to current time
        let chatRequestTimeNow = new Date()
        //add updateRequestIntervalSeconds seconds to datetimenow
        chatRequestTimeNow.setSeconds(chatRequestTimeNow.getSeconds() + chatRequestTimer)
        //set chatRequestTime to the new time
        chatRequestTime = chatRequestTimeNow
        updateChatRequestTime(chatRequestTime)
      }
    }

}