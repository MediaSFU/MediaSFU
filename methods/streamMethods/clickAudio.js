
/**
 * Handles the click event to toggle the participant's audio on/off and manages audio permission requests.
 *
 * @param {object} options - The function parameters.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {boolean} options.parameters.checkMediaPermission - Indicates whether to check media permissions.
 * @param {boolean} options.parameters.hasAudioPermission - Indicates whether the participant has audio permission.
 * @param {boolean} options.parameters.audioPaused - Indicates whether the participant's audio is currently paused.
 * @param {boolean} options.parameters.audioAlreadyOn - Indicates whether the participant's audio is currently on.
 * @param {boolean} options.parameters.audioOnlyRoom - Indicates whether the room is audio-only.
 * @param {boolean} options.parameters.recordStarted - Indicates if recording has started.
 * @param {boolean} options.parameters.recordResumed - Indicates if recording has been resumed.
 * @param {boolean} options.parameters.recordPaused - Indicates if recording has been paused.
 * @param {boolean} options.parameters.recordStopped - Indicates if recording has been stopped.
 * @param {string} options.parameters.recordingMediaOptions - Type of media being recorded ('audio').
 * @param {string} options.parameters.islevel - Participant's level ('2' for admin/host).
 * @param {boolean} options.parameters.youAreCoHost - Indicates if the participant is a co-host.
 * @param {boolean} options.parameters.adminRestrictSetting - Indicates if the host has restricted audio access.
 * @param {string} options.parameters.audioRequestState - State of the audio permission request ('pending', 'rejected', null).
 * @param {number} options.parameters.audioRequestTime - Timestamp of the last audio permission request.
 * @param {string} options.parameters.member - Participant's name.
 * @param {object} options.parameters.socket - Socket connection object.
 * @param {string} options.parameters.roomName - Name of the room.
 * @param {string} options.parameters.userDefaultAudioInputDevice - Default audio input device for the participant.
 * @param {string} options.parameters.currentFacingMode - Current facing mode of the microphone.
 * @param {object} options.parameters.vidCons - Audio constraints.
 * @param {number} options.parameters.frameRate - Audio frame rate.
 * @param {string} options.parameters.micAction - Type of microphone action ('start', 'stop', 'request').
 * @param {MediaStream} options.parameters.localStream - The local audio and video stream.
 * @param {object} options.parameters.audioSetting - Participant's audio setting.
 * @param {object} options.parameters.videoSetting - Participant's video setting.
 * @param {object} options.parameters.screenshareSetting - Participant's screenshare setting.
 * @param {object} options.parameters.chatSetting - Participant's chat setting.
 * @param {number} options.parameters.requestIntervalSeconds - Interval between audio permission requests.
 * @param {function} options.parameters.checkPermission - Function to check permission settings.
 * @param {function} options.parameters.streamSuccessAudio - Function to handle successful audio stream acquisition.
 * @param {function} options.parameters.disconnectSendTransportAudio - Function to disconnect audio send transport.
 * @param {function} options.parameters.showAlert - Function to display alerts.
 * @param {function} options.parameters.updateAudioAlreadyOn - Function to update the audioAlreadyOn status.
 * @param {function} options.parameters.updateAudioRequestState - Function to update the audioRequestState.
 * @param {function} options.parameters.updateAudioRequestTime - Function to update the audioRequestTime.
 * @param {function} options.parameters.updateLocalStream - Function to update the local audio and video stream.
 * @param {function} options.parameters.updateLocalStreamAudio - Function to update the local audio stream.
 * @param {function} options.parameters.updateAudioPaused - Function to update the audioPaused status.
 * @param {object} options.parameters.mediaDevices - MediaDevices API object.
 * @param {function} options.parameters.requestPermissionAudio - Function to request audio permission.
 */

export const clickAudio = async ({ parameters }) => {

    let {
        checkMediaPermission,
        hasAudioPermission,
        
        audioPaused,
        audioAlreadyOn,
        audioOnlyRoom,
        recordStarted,
        recordResumed,
        recordPaused,
        recordStopped,
        recordingMediaOptions,
        islevel,
        youAreCoHost,
        adminRestrictSetting,
        audioRequestState,
        audioRequestTime,
        member,
        socket,
        roomName,
        userDefaultAudioInputDevice,
        currentFacingMode,
        vidCons,
        frameRate,
        micAction,
        localStream,
        audioSetting,
        videoSetting,
        screenshareSetting,
        chatSetting,
        requestIntervalSeconds,
        participants,
        transportCreated,
        transportCreatedAudio,

        checkPermission,
        streamSuccessAudio,
        // disconnectSendTransportAudio,
        showAlert,
        updateAudioAlreadyOn,
        updateAudioRequestState,
        updateAudioRequestTime,
        updateLocalStream,
        updateLocalStreamAudio,
        updateAudioPaused,
        updateParticipants,
        updateTransportCreated,
        updateTransportCreatedAudio,
        updateMicAction,
        mediaDevices,

        //mediasfu functions
        requestPermissionAudio,
        disconnectSendTransportAudio,
        resumeSendTransportAudio,
    } = parameters;
   

    if (audioOnlyRoom) {

        if (showAlert) {
            showAlert({
                message: 'You cannot turn on your camera in an audio only event.',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
      }

      if (audioAlreadyOn) {
        //check and alert before turning off
        if (islevel == '2' && ((recordStarted || recordResumed))) {
          if (!(recordPaused || recordStopped)) {
            if (recordingMediaOptions == 'audio') {
               if (showAlert) {
                showAlert({
                  message: 'You cannot turn off your audio while recording, please pause or stop recording first.',
                  type: 'danger',
                  duration: 3000,
                });
                }
              return;
            }
          }
        }

       //update the icon and turn off audio
        audioAlreadyOn = false;
        updateAudioAlreadyOn(audioAlreadyOn);
        localStream.getAudioTracks()[0].enabled = false;
        updateLocalStream(localStream);
        await disconnectSendTransportAudio({ parameters }); //disconnect function here actuall calls audioProducer.pause() instead of close() as in mediasfu
        audioPaused = true;
        updateAudioPaused(audioPaused);


      } else {

        if (adminRestrictSetting) {
          //return with access denied by admin
            if (showAlert) {
                showAlert({
                message: 'You cannot turn on your microphone. Access denied by host.',
                type: 'danger',
                duration: 3000,
                });
            }
          return;
        }
        let response = 2
        if (!micAction && islevel != '2' && !youAreCoHost) {
          //check if audio permission is set to approval
          response = await checkPermission({ permissionType: 'audioSetting', parameters: { audioSetting, audioSetting, screenshareSetting, chatSetting } });
        }else {
            response = 0;
        }
        switch (response) {
            case 1:

            //approval

            //check if request is pending or not
            if (audioRequestState === 'pending') {
                if (showAlert) {
                    showAlert({
                    message: 'A request is pending. Please wait for the host to respond.',
                    type: 'danger',
                    duration: 3000,
                    });
                }
              return;
            }

            // send request to host
            if (showAlert) {
                showAlert({
                message: 'Request sent to host.',
                type: 'success',
                duration: 3000,
                });
                }
            audioRequestState = 'pending';
            updateAudioRequestState(audioRequestState);
            //create a request and add to the request list and send to host

            //create a request and add to the request list and send to host
            let userRequest = { id: socket.id, name: member, icon: 'fa-microphone' };
            await socket.emit('participantRequest', { userRequest, roomName });

            break;

            case 2:
                // check if rejected and current time is less than audioRequestTime 
                if (audioRequestState === 'rejected' && (Date.now() - audioRequestTime) < requestIntervalSeconds ) {

                    if (showAlert) {
                        showAlert({
                        message: 'A request was rejected. Please wait for ' + requestIntervalSeconds + ' seconds before sending another request.',
                        type: 'danger',
                        duration: 3000,
                        });
                    }
                return;
                }

                break;

            case 0:
                //allow

             if (audioPaused) {
                localStream.getAudioTracks()[0].enabled = true;
                audioAlreadyOn = true;
            
                await resumeSendTransportAudio({ parameters });
                await socket.emit('resumeProducerAudio', { mediaTag: 'audio', roomName: roomName })
                updateLocalStream(localStream);
                updateAudioAlreadyOn(audioAlreadyOn);
                
                if (micAction == true) {
                    micAction = false;
                    updateMicAction(micAction);
                }

                await participants.forEach((participant) => {
                    if (participant.socketId == socket.id && participant.name == member) {
                      participant.muted = false;
                    }
                  });
                updateParticipants(participants);
    
                 transportCreated = true;
                 updateTransportCreated(transportCreated);
    
                transportCreatedAudio = true;
                updateTransportCreatedAudio(transportCreatedAudio);

             } else {

             
                //first check if permission is granted
                if (!hasAudioPermission) {
                    if (checkMediaPermission) {
                        let statusMic  = await requestPermissionAudio()
                        if (statusMic !== 'granted') {
                            if (showAlert) {
                                showAlert({
                                message: 'Allow access to your microphone or check if your microphone is not being used by another application.',
                                type: 'danger',
                                duration: 3000,
                                });
                            }
                            return;
                        }
                    }
                }

                

            let mediaConstraints = {  };
  
            if (userDefaultAudioInputDevice) {
                mediaConstraints = { audio: { deviceId: userDefaultAudioInputDevice} , video: false }; //, echoCancellation: false, noiseSuppression: false, googAutoGainControl: false , autoGainControl: false 
            }else {
                mediaConstraints = { audio: true , video: false };
            }

            await mediaDevices.getUserMedia(mediaConstraints).then(async(stream) => {
              await streamSuccessAudio ({ stream , parameters})
                }).catch(async error => {
                    console.log('error', error)
                     if (showAlert) {
                        showAlert({
                        message: 'Allow access to your microphone or check if your microphone is not being used by another application.',
                        type: 'danger',
                        duration: 3000,
                        });
                    }
                  })
              
          }

            break;
      
      }

    }

}