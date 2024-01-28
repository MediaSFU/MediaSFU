
/**
 * Handles the click event to toggle the participant's video on/off and manages video permission requests.
 *
 * @param {object} options - The function parameters.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {boolean} options.parameters.checkMediaPermission - Indicates whether to check media permissions.
 * @param {boolean} options.parameters.hasCameraPermission - Indicates whether the participant has camera permission.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates whether the participant's video is currently on.
 * @param {boolean} options.parameters.audioOnlyRoom - Indicates whether the room is audio-only.
 * @param {boolean} options.parameters.recordStarted - Indicates if recording has started.
 * @param {boolean} options.parameters.recordResumed - Indicates if recording has been resumed.
 * @param {boolean} options.parameters.recordPaused - Indicates if recording has been paused.
 * @param {boolean} options.parameters.recordStopped - Indicates if recording has been stopped.
 * @param {string} options.parameters.recordingMediaOptions - Type of media being recorded ('video').
 * @param {string} options.parameters.islevel - Participant's level ('2' for admin/host).
 * @param {boolean} options.parameters.youAreCoHost - Indicates if the participant is a co-host.
 * @param {boolean} options.parameters.adminRestrictSetting - Indicates if the host has restricted video access.
 * @param {string} options.parameters.videoRequestState - State of the video permission request ('pending', 'rejected', null).
 * @param {number} options.parameters.videoRequestTime - Timestamp of the last video permission request.
 * @param {string} options.parameters.member - Participant's name.
 * @param {object} options.parameters.socket - Socket connection object.
 * @param {string} options.parameters.roomName - Name of the room.
 * @param {string} options.parameters.userDefaultVideoInputDevice - Default video input device for the participant.
 * @param {string} options.parameters.currentFacingMode - Current facing mode of the camera.
 * @param {object} options.parameters.vidCons - Video constraints.
 * @param {number} options.parameters.frameRate - Video frame rate.
 * @param {string} options.parameters.videoAction - Type of video action ('start', 'stop', 'request').
 * @param {MediaStream} options.parameters.localStream - The local audio and video stream.
 * @param {object} options.parameters.audioSetting - Participant's audio setting.
 * @param {object} options.parameters.videoSetting - Participant's video setting.
 * @param {object} options.parameters.screenshareSetting - Participant's screenshare setting.
 * @param {object} options.parameters.chatSetting - Participant's chat setting.
 * @param {number} options.parameters.requestIntervalSeconds - Interval between video permission requests.
 * @param {function} options.parameters.streamSuccessVideo - Function to handle successful video stream acquisition.
 * @param {function} options.parameters.showAlert - Function to display alerts.
 * @param {function} options.parameters.updateVideoAlreadyOn - Function to update the videoAlreadyOn status.
 * @param {function} options.parameters.updateVideoRequestState - Function to update the videoRequestState.
 * @param {function} options.parameters.updateVideoRequestTime - Function to update the videoRequestTime.
 * @param {function} options.parameters.updateLocalStream - Function to update the local audio and video stream.
 * @param {function} options.parameters.updateLocalStreamVideo - Function to update the local video stream.
 * @param {object} options.parameters.mediaDevices - MediaDevices API object.
 * @param {function} options.parameters.disconnectSendTransportVideo - Function to disconnect video send transport.
 * @param {function} options.parameters.requestPermissionCamera - Function to request camera permission.
 * @param {function} options.parameters.checkPermission - Function to check permission settings.
 */

export const clickVideo = async ({ parameters }) => {

  let {
    checkMediaPermission,
    hasCameraPermission,

    videoAlreadyOn,
    audioOnlyRoom,
    recordStarted,
    recordResumed,
    recordPaused,
    recordStopped,
    recordingMediaOptions,
    islevel,
    youAreCoHost,
    adminRestrictSetting,
    videoRequestState,
    videoRequestTime,
    member,
    socket,
    roomName,
    userDefaultVideoInputDevice,
    currentFacingMode,
    vidCons,
    frameRate,
    videoAction,
    localStream,
    audioSetting,
    videoSetting,
    screenshareSetting,
    chatSetting,
    requestIntervalSeconds,


    streamSuccessVideo,
    showAlert,
    updateVideoAlreadyOn,
    updateVideoRequestState,
    updateVideoRequestTime,
    updateLocalStream,
    updateLocalStreamVideo,
    mediaDevices,


    //mediasfu functions
    disconnectSendTransportVideo,
    requestPermissionCamera,
    checkPermission,
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

  if (videoAlreadyOn) {
    //check and alert before turning off
    if (islevel == '2' && ((recordStarted || recordResumed))) {
      if (!(recordPaused || recordStopped)) {
        if (recordingMediaOptions == 'video') {
          if (showAlert) {
            showAlert({
              message: 'You cannot turn off your camera while recording video, please pause or stop recording first.',
              type: 'danger',
              duration: 3000,
            });
          }
          return;
        }
      }
    }

    //update the icon and turn off video
    videoAlreadyOn = false;
    updateVideoAlreadyOn(videoAlreadyOn);
    //localStreamVideo.getVideoTracks()[0].enabled = false;
    localStream.getVideoTracks()[0].enabled = false;
    updateLocalStream(localStream);
    await disconnectSendTransportVideo({ parameters });


  } else {

    if (adminRestrictSetting) {
      //return with access denied by admin
      if (showAlert) {
        showAlert({
          message: 'You cannot turn on your camera. Access denied by host.',
          duration: 3000,
        });
      }
      return;
    }

    let response = 2;

    if (!videoAction && islevel != '2' && !youAreCoHost) {
      //check if video permission is set to approval
      response = await checkPermission({ permissionType: 'videoSetting', parameters: { audioSetting, videoSetting, screenshareSetting, chatSetting } });
    } else {
      response = 0;
    }



    if (response == 1) {

      //approval
      //check if request is pending or not
      if (videoRequestState === 'pending') {
        if (showAlert) {
          showAlert({
            message: 'A request is pending. Please wait for the host to respond.',
            type: 'danger',
            duration: 3000,
          });
        }
        return;
      }
      // check if rejected and current time is less than videoRequestTime 
      if (videoRequestState === 'rejected' && (Date.now() - videoRequestTime) < requestIntervalSeconds) {

        if (showAlert) {
          showAlert({
            message: 'A request was rejected. Please wait for ' + requestIntervalSeconds + ' seconds before sending another request.',
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
      videoRequestState = 'pending';
      updateVideoRequestState(videoRequestState);
      //create a request and add to the request list and send to host

      //create a request and add to the request list and send to host
      let userRequest = { id: socket.id, name: member, icon: 'fa-video'};
      await socket.emit('participantRequest', { userRequest, roomName });

    } else if (response == 2) {
      //if video permission is set to deny then show alert
      if (showAlert) {
        showAlert({
          message: 'You cannot turn on your camera. Access denied by host.',
          type: 'danger',
          duration: 3000,
        });
      }

    } else {
      //if video permission is set to allow then turn on video

      //first check if permission is granted
      if (!hasCameraPermission) {
        if (checkMediaPermission) {
          let statusCamera = await requestPermissionCamera()
          if (statusCamera !== 'granted') {
            if (showAlert) {
              showAlert({
                message: 'Allow access to your camera or check if your camera is not being used by another application.',
                type: 'danger',
                duration: 3000,
              });
            }
            return;
          }
        }
      }

      let mediaConstraints = {};
      let altMediaConstraints = {};
      if (userDefaultVideoInputDevice) {
        if (vidCons && vidCons.width && vidCons.height) {
          mediaConstraints = { video: { deviceId: userDefaultVideoInputDevice, facingMode: currentFacingMode, ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
          altMediaConstraints = { video: { ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
        } else {
          mediaConstraints = { video: { ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
          altMediaConstraints = { video: { frameRate: { ideal: frameRate } }, audio: false };
        }

      } else {
        if (vidCons && vidCons.width && vidCons.height) {
          mediaConstraints = { video: { ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
          altMediaConstraints = { video: { ...vidCons, frameRate: { ideal: frameRate } }, audio: false };
        } else {
          mediaConstraints = { video: { frameRate: { ideal: frameRate } }, audio: false };
        }
      }

      await mediaDevices.getUserMedia(mediaConstraints).then(async (stream) => {
        await streamSuccessVideo({ stream, parameters })
      }).catch(async error => {

        await mediaDevices.getUserMedia(altMediaConstraints)
          .then(async (stream) => {
            await streamSuccessVideo({ stream, parameters })
          }).catch(error => {

            if (showAlert) {
              showAlert({
                message: 'Allow access to your camera or check if your camera is not being used by another application.',
                type: 'danger',
                duration: 3000,
              });
            }
          })
      })
    }

  }

}