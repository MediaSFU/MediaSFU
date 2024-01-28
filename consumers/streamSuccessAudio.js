/**
 * Handles the success of obtaining an audio stream.
 *
 * @param {object} options - The function parameters.
 * @param {object} options.stream - The audio stream received successfully.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {object} options.parameters.socket - The socket used for communication.
 * @param {array} options.parameters.participants - Array containing information about participants.
 * @param {object} options.parameters.localStream - The local media stream containing video and audio tracks.
 * @param {boolean} options.parameters.transportCreated - Indicates whether a transport is created.
 * @param {boolean} options.parameters.transportCreatedAudio - Indicates whether an audio transport is created.
 * @param {boolean} options.parameters.audioAlreadyOn - Indicates if audio is already being used.
 * @param {boolean} options.parameters.micAction - Indicates if there is an ongoing microphone action.
 * @param {object} options.parameters.audioParams - Parameters related to the audio stream.
 * @param {object} options.parameters.localStreamAudio - The local audio stream.
 * @param {string} options.parameters.defAudioID - The default audio input device ID.
 * @param {string} options.parameters.userDefaultAudioInputDevice - The user's default audio input device.
 * @param {object} options.parameters.params - Additional parameters related to the audio stream.
 * @param {object} options.parameters.audioParamse - Additional parameters related to the audio stream.
 * @param {object} options.parameters.aParams - Additional parameters related to the audio stream.
 * @param {string} options.parameters.HostLabel - The label for the host.
 * @param {string} options.parameters.islevel - The user level.
 * @param {function} options.parameters.updateMainWindow - Function to update the main window state.
 * @param {boolean} options.parameters.lock_screen - Indicates if the screen is locked.
 * @param {boolean} options.parameters.shared - Indicates if screen sharing is active.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if video is already being used.
 * @param {function} options.parameters.updateParticipants - Function to update the participants array.
 * @param {function} options.parameters.updateTransportCreated - Function to update the transportCreated variable.
 * @param {function} options.parameters.updateTransportCreatedAudio - Function to update the transportCreatedAudio variable.
 * @param {function} options.parameters.updateAudioAlreadyOn - Function to update the audioAlreadyOn variable.
 * @param {function} options.parameters.updateMicAction - Function to update the micAction variable.
 * @param {function} options.parameters.updateAudioParams - Function to update the audioParams variable.
 * @param {function} options.parameters.updateLocalStream - Function to update the localStream variable.
 * @param {function} options.parameters.updateLocalStreamAudio - Function to update the localStreamAudio variable.
 * @param {function} options.parameters.updateDefAudioID - Function to update the defAudioID variable.
 * @param {function} options.parameters.updateUserDefaultAudioInputDevice - Function to update the userDefaultAudioInputDevice variable.
 * @param {function} options.parameters.updateUpdateMainWindow - Function to update the updateMainWindow variable.
 * @param {function} options.parameters.createSendTransport - Function to create a send transport.
 * @param {function} options.parameters.connectSendTransportAudio - Function to connect the audio send transport.
 * @param {function} options.parameters.resumeSendTransportAudio - Function to resume the audio send transport.
 * @param {function} options.parameters.prepopulateUserMedia - Function to prepopulate user media information.
 */

export const streamSuccessAudio = async ({stream,parameters}) => {

    let {
        socket,
        participants,
        localStream,
        transportCreated,   
        transportCreatedAudio,
        audioAlreadyOn,
        micAction,
        audioParams,
        localStreamAudio,
        defAudioID,
        userDefaultAudioInputDevice,
        params,
        audioParamse,
        aParams,
        HostLabel,
        islevel,
        updateMainWindow,
        lock_screen,
        shared,
        videoAlreadyOn,


         
        //update functions
        updateParticipants,
        updateTransportCreated,
        updateTransportCreatedAudio,
        updateAudioAlreadyOn,
        updateMicAction,
        updateAudioParams,
        updateLocalStream,
        updateLocalStreamAudio,
        updateDefAudioID,
        updateUserDefaultAudioInputDevice,
        updateUpdateMainWindow,
   

        //mediasfu functions
        createSendTransport,
        connectSendTransportAudio,
        resumeSendTransportAudio,
        prepopulateUserMedia


    } = parameters;



    localStreamAudio = await stream
    updateLocalStreamAudio(localStreamAudio);
    //add the audio stream track to the localStream
    //if there localStream is null then add the audio stream to the localStream else add the audio stream track to the localStream
    if (localStream == null) {
      localStream = await new MediaStream([localStreamAudio.getAudioTracks()[0]]);
      updateLocalStream(localStream);
    } else {
      localStream.addTrack(localStreamAudio.getAudioTracks()[0]);
      updateLocalStream(localStream);
    }

    const audioTracked = await localStream.getAudioTracks()[0];
    defAudioID = await audioTracked.getSettings().deviceId;
    userDefaultAudioInputDevice = await defAudioID;

    //update the state variables
    updateDefAudioID(defAudioID);
    updateUserDefaultAudioInputDevice(userDefaultAudioInputDevice);

    params = aParams;
    audioParamse = { params }

    audioParams = await { track: localStream.getAudioTracks()[0], ...audioParamse };
    updateAudioParams(audioParams);


    //create transport if not created else connect transport
    if (!transportCreated) {

      try {
        await createSendTransport({
          parameters: {
            ...parameters,
            audioParams: audioParams,
          },
          option: 'audio'
         });
      } catch (error) {
       
      }
    
 
    } else {
      if (!transportCreatedAudio) {
        await connectSendTransportAudio({ 
          audioParams,
          parameters
           });
      } else {
        await resumeSendTransportAudio({ parameters });
      }
    }

    //update the participants array to reflect the change
    audioAlreadyOn = true;
    updateAudioAlreadyOn(audioAlreadyOn);

    if (micAction == true) {
      micAction = false;
      updateMicAction(micAction);
    }

    //update the participants array to reflect the change
    await participants.forEach((participant) => {
      if (participant.socketId == socket.id && participant.name == member) {
        participant.muted = false;
      }
    });
    updateParticipants(participants);

    // //update the transport created state
    transportCreated = true;
    transportCreatedAudio = true;
    updateTransportCreated(transportCreated);
    updateTransportCreatedAudio(transportCreatedAudio);

    //reupdate screen display if host
    if (videoAlreadyOn == false && islevel == '2') {

      if (!lock_screen && !shared) {
        updateMainWindow = true;
        updateUpdateMainWindow(updateMainWindow)
        await prepopulateUserMedia({name: HostLabel, parameters})
        updateMainWindow = false;
        updateUpdateMainWindow(updateMainWindow)
      }
    }

    

  }