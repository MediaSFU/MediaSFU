/**
 * Handles the success of obtaining a video stream.
 *
 * @param {object} options - The function parameters.
 * @param {object} options.stream - The video stream received successfully.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {object} options.parameters.socket - The socket used for communication.
 * @param {array} options.parameters.participants - Array containing information about participants.
 * @param {object} options.parameters.localStream - The local media stream containing video and audio tracks.
 * @param {boolean} options.parameters.transportCreated - Indicates whether a transport is created.
 * @param {boolean} options.parameters.transportCreatedVideo - Indicates whether a video transport is created.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if video is already being used.
 * @param {boolean} options.parameters.videoAction - Indicates if there is an ongoing video action.
 * @param {object} options.parameters.videoParams - Parameters related to the video stream.
 * @param {object} options.parameters.localStreamVideo - The local video stream.
 * @param {string} options.parameters.defVideoID - The default video input device ID.
 * @param {string} options.parameters.userDefaultVideoInputDevice - The user's default video input device.
 * @param {object} options.parameters.params - Additional parameters related to the video stream.
 * @param {object} options.parameters.videoParamse - Additional parameters related to the video stream.
 * @param {object} options.parameters.HostLabel - The label for the host.
 * @param {string} options.parameters.islevel - The user level.
 * @param {function} options.parameters.updateMainWindow - Function to update the main window state.
 * @param {boolean} options.parameters.lock_screen - Indicates if the screen is locked.
 * @param {boolean} options.parameters.shared - Indicates if screen sharing is active.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {object} options.parameters.vParams - Additional parameters related to video constraints.
 * @param {object} options.parameters.hParams - Additional parameters related to video constraints.
 * @param {boolean} options.parameters.allowed - Indicates if video is allowed.
 * @param {string} options.parameters.currentFacingMode - The current facing mode of the video.
 * @param {string} options.parameters.device - The media device information.
 * @param {object} options.parameters.rtpCapabilities - RTP capabilities of the media device.
 * @param {function} options.parameters.updateTransportCreated - Function to update the transportCreated variable.
 * @param {function} options.parameters.updateTransportCreatedVideo - Function to update the transportCreatedVideo variable.
 * @param {function} options.parameters.updateVideoAlreadyOn - Function to update the videoAlreadyOn variable.
 * @param {function} options.parameters.updateVideoAction - Function to update the videoAction variable.
 * @param {function} options.parameters.updateLocalStream - Function to update the localStream variable.
 * @param {function} options.parameters.updateLocalStreamVideo - Function to update the localStreamVideo variable.
 * @param {function} options.parameters.updateUserDefaultVideoInputDevice - Function to update the userDefaultVideoInputDevice variable.
 * @param {function} options.parameters.updateCurrentFacingMode - Function to update the currentFacingMode variable.
 * @param {function} options.parameters.updateDefVideoID - Function to update the defVideoID variable.
 * @param {function} options.parameters.updateAllowed - Function to update the allowed variable.
 * @param {function} options.parameters.updateUpdateMainWindow - Function to update the updateMainWindow variable.
 * @param {function} options.parameters.updateParticipants - Function to update the participants array.
 * @param {function} options.parameters.updateVideoParams - Function to update the videoParams variable.
 * @param {function} options.parameters.createSendTransport - Function to create a send transport.
 * @param {function} options.parameters.connectSendTransportVideo - Function to connect the video send transport.
 * @param {function} options.parameters.showAlert - Function to show an alert.
 * @param {function} options.parameters.reorderStreams - Function to reorder streams.
 */

import { MediaStream } from '../methods/utils/webrtc/webrtc'

export const streamSuccessVideo = async ({ stream, parameters }) => {

  let {getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams()

  try {

    let {
      socket,
      participants,
      localStream,
      transportCreated,
      transportCreatedVideo,
      videoAlreadyOn,
      videoAction,
      videoParams,
      localStreamVideo,
      defVideoID,
      userDefaultVideoInputDevice,
      params,
      videoParamse,
      HostLabel,
      islevel,
      member,
      updateMainWindow,
      lock_screen,
      shared,
      shareScreenStarted,
      vParams,
      hParams,
      allowed,
      currentFacingMode,
      device,
      rtpCapabilities,


      //update functions
      updateTransportCreated,
      updateTransportCreatedVideo,
      updateVideoAlreadyOn,
      updateVideoAction,
      updateLocalStream,
      updateLocalStreamVideo,
      updateUserDefaultVideoInputDevice,
      updateCurrentFacingMode,
      updateDefVideoID,
      updateAllowed,
      updateUpdateMainWindow,
      updateParticipants,
      updateVideoParams,


      //mediasoup functions
      createSendTransport,
      connectSendTransportVideo,
      showAlert,
      reorderStreams,


    } = parameters;


    localStreamVideo = await stream
    updateLocalStreamVideo(localStreamVideo)
    //add the video stream track to localStream

    if (localStream == null) {
      localStream = await new MediaStream([localStreamVideo.getVideoTracks()[0]]);
      updateLocalStream(localStream)
    } else {
      // remove all video tracks that are currently in the localStream
      await localStream.getVideoTracks().forEach((track) => {
        localStream.removeTrack(track);
      }

      );
      // add the new video track to the localStream
      await localStream.addTrack(localStreamVideo.getVideoTracks()[0]);
      updateLocalStream(localStream)
    }

    //get the video track settings
    const videoTracked = await localStream.getVideoTracks()[0];
    defVideoID = await videoTracked.getSettings().deviceId;
    userDefaultVideoInputDevice = await defVideoID;
    currentFacingMode = await videoTracked.getSettings().facingMode;

    //update the state variables
    if (defVideoID) {
      updateDefVideoID(defVideoID)
    }
    if (userDefaultVideoInputDevice) {
      updateUserDefaultVideoInputDevice(userDefaultVideoInputDevice)
    }
    if (currentFacingMode){
      updateCurrentFacingMode(currentFacingMode)
    }

    allowed = true
    updateAllowed(allowed)

    //apply the video constraints
    if (islevel == '2') {
      if (!shared || !shareScreenStarted) {
        params = await hParams;
        videoParamse = await { params }
      } else {
        params = await vParams;
        videoParamse = await { params }
      }
    } else {
      params = await vParams;
      videoParamse = await { params }
    }



    //remove vp9 codec from the video codecs; support only vp8 and h264
    let codecs = device.rtpCapabilities.codecs.filter((codec) => codec.mimeType.toLowerCase() !== 'video/vp9');

    //create transport if not created else connect transport
    videoParams = await { track: localStream.getVideoTracks()[0], ...videoParamse, codecs };
    await updateVideoParams(videoParams)


    if (!transportCreated) {

      try {
        await createSendTransport({
          parameters: {
            ...parameters,
            videoParams: videoParams
          },
          option: 'video'
        });
      } catch (error) {

      }

    } else {
      await connectSendTransportVideo({
        parameters: parameters,
        videoParams: videoParams
      });

    }


    //update the videoAlreadyOn state
    videoAlreadyOn = true;
    updateVideoAlreadyOn(videoAlreadyOn)

    //if user requested to share video, update the videoAction state
    if (videoAction == true) {
      videoAction = false;
      updateVideoAction(videoAction)
    }

    // update the display screen if host
    if (islevel == '2') {
      updateMainWindow = true;
      updateUpdateMainWindow(updateMainWindow)
    }

    //update the participants array to reflect the change
    await participants.forEach((participant) => {
      if (participant.socketId == socket.id && participant.name == member) {
        participant.videoOn = true;
      }
    });
    updateParticipants(participants)

    //update the transport created state
    transportCreatedVideo = true;
    updateTransportCreatedVideo(transportCreatedVideo)

    //reupdate the screen display
    if (lock_screen) {

      try {
        await reorderStreams({ add: true, screenChanged: true, parameters: { ...parameters, videoAlreadyOn: videoAlreadyOn } })
      } catch (error) {

      }
    } else {

      try {
        await reorderStreams({ add: false, screenChanged: true, parameters: { ...parameters, videoAlreadyOn: videoAlreadyOn } })
      } catch (error) {

      }

    }


  } catch (error) {
    try {
      let { showAlert } = parameters

      if (showAlert) {
        showAlert({
          message: error.message,
          type: 'danger',
          duration: 3000
        })
      }
    } catch (error) {

    }
  }



}