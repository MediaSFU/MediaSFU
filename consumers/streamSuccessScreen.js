export const streamSuccessScreen = async ({stream,parameters}) => {

  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams()

    let {
        socket,
        mediaDevices,
        transportCreated,
        localStreamScreen,
        screenAlreadyOn,
        screenAction,
        transportCreatedScreen,
        HostLabel,
        eventType,
        updateTransportCreatedScreen,
        updateScreenAlreadyOn,
        updateScreenAction,
        updateTransportCreated,
        updateLocalStreamScreen,

        //mediasoup functions
        rePort,
        reorderStreams,
        prepopulateUserMedia,
        createSendTransport,
        connectSendTransportScreen,
        disconnectSendTransportScreen,
        stopShareScreen,

       
    } = parameters;

    // share screen on success
    localStreamScreen = await stream
    await updateLocalStreamScreen(localStreamScreen)

    //create transport if not created else connect transport
    if (!transportCreated) {
      await createSendTransport({option:'screen',parameters:{...parameters,localStreamScreen}})
    } else {
      await connectSendTransportScreen({stream:localStreamScreen,parameters:{...parameters,localStreamScreen}})
    }

    //alert the socket that you are sharing screen
    await socket.emit('startScreenShare')

    //reupdate the screen display 
    try {
      await prepopulateUserMedia({name:HostLabel,parameters})
    } catch (error) {
    }
    
    //update the participants array to reflect the change
    screenAlreadyOn = true;
    await updateScreenAlreadyOn(screenAlreadyOn)

    //reorder streams if required
    try {
      

      if (eventType == 'conference') {
        await reorderStreams({add:false,screenChanged:true,parameters})
        await prepopulateUserMedia({name:HostLabel,parameters})
      } else {
        await reorderStreams({parameters})
      }

    } catch (error) {

      try {
        await rePort({parameters})
      } catch (error) {
      }
    }

    //handle screen share end
    localStreamScreen.getVideoTracks()[0].onended = async function () {
      //supports both manual and automatic screen share end
      await disconnectSendTransportScreen({parameters})
      await stopShareScreen({parameters})
    }


    //if user requested to share screen, update the screenAction state
    if (screenAction == true) {
      screenAction = false;
    }
    updateScreenAction(screenAction)

    //update the transport created state
    transportCreatedScreen = true;
    updateTransportCreatedScreen(transportCreatedScreen)

    //update the states
    updateTransportCreated(transportCreated)
    

  }