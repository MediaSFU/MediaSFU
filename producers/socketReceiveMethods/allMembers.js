
/**
 * allMembers - A method for handling various tasks related to participant management and UI updates.
 * @param {Object} params - The parameters passed to the allMembers method.
 * @param {Array} params.members - The array of participant members.
 * @param {Array} params.requestss - The array of requests.
 * @param {boolean} params.coHoste - The co-host state.
 * @param {boolean} params.coHostRes - The co-host responsibility state.
 * @param {Object} params.parameters - The object containing parameters for the allMembers method.
 * @param {Array} params.consume_sockets - The array of consume sockets.
 * @param {string} params.apiUserName - The API username.
 * @param {string} params.apiKey - The API key.
 * @param {string} params.apiToken - The API token.
 * @returns {void} - No return value.
 */


export const allMembers = async ({members, requestss, coHoste, coHostRes, parameters,consume_sockets, apiUserName, apiKey, apiToken }) => {


    let {
        participantsAll,
        participants,
        dispActiveNames,
        requestList,
        coHost,
        coHostResponsibility,
        lock_screen,
        firstAll,
        membersReceived,
        roomRecvIPs,
        deferScreenReceived,
        screenId,
        shareScreenStarted,
        meetingDisplayType,
        hostFirstSwitch,
        eventType,
        waitingRoomList,
        islevel,
        


        
        
  
        updateParticipantsAll,
        updateParticipants,
        updateRequestList,
        updateCoHost,
        updateCoHostResponsibility,
        updateFirstAll,
        updateMembersReceived,
        updateDeferScreenReceived,
        updateShareScreenStarted,
        updateHostFirstSwitch,
        updateMeetingDisplayType,
        updateConsume_sockets,
        updateRoomRecvIPs,
        updateIsLoadingModalVisible,
        updateTotalReqWait,
        
        //mediasfu functions
        onScreenChanges,
        connectIps,
        formatNumber,
        sleep,
        reorderStreams,

       
    } = parameters;

           //filter out the participant that isBanned == true or isSuspended == true
      participantsAll = await members
      //remove every field other than isBanned and isSuspended and name from participantsAll
      participantsAll = await participantsAll.map(participant => ({ isBanned: participant.isBanned, isSuspended: participant.isSuspended, name: participant.name }))
      updateParticipantsAll(participantsAll)
  
      participants = await members.filter(participant => participant.isBanned == false && participant.isSuspended == false)
      updateParticipants(participants)


  
      //check if dispActivenames is not empty and contains the name of the participant that is not in the participants array
      if (dispActiveNames.length > 0) {
        //check if the participant that is not in the participants array is in the dispActiveNames array
        let dispActiveNames_ = await dispActiveNames.filter(name => !participants.map(participant => participant.name).includes(name))
        if (dispActiveNames_.length > 0) {
          //remove the participant that is not in the participants array from the dispActiveNames array
          await reorderStreams({ add: false, screenChanged: true, parameters })
        }
      }
  
      //operations to update the ui; make sure we are connected to the server before updating the ui
      // allMembers might get called before we are connected to the server
      if (!membersReceived) {
        if (roomRecvIPs.length < 1) {
          //keep checking every 0.005s
          let checkIPs = setInterval(async () => {
            if (roomRecvIPs.length > 0) {
              clearInterval(checkIPs)
  
              if (deferScreenReceived && screenId != null) {
                shareScreenStarted = true
                updateShareScreenStarted(shareScreenStarted)
              }
  
            const [sockets_,ips_]  =  await connectIps({
                consume_sockets: consume_sockets,
                remIP: roomRecvIPs,
                consume_sockets,
                parameters: parameters,
                apiUserName: apiUserName,
                apiKey: apiKey,
                apiToken: apiToken
              })

              if (sockets_ && ips_){

                updateConsume_sockets(sockets_)
                updateRoomRecvIPs(ips_)
              }
              
              membersReceived = true
              updateMembersReceived(membersReceived)
  
              await sleep(250)
              updateIsLoadingModalVisible(false)
              deferScreenReceived = false
              updateDeferScreenReceived(deferScreenReceived)
  
  
            }
          }, 10);
  
        } else {
  
         const [sockets_,ips_] =  await connectIps({
                consume_sockets: consume_sockets,
                remIP: roomRecvIPs,
                consume_sockets,
                parameters: parameters,
                apiUserName: apiUserName,
                apiKey: apiKey,
                apiToken: apiToken
              })

          if (sockets_ && ips_){
            updateConsume_sockets(sockets_)
           updateRoomRecvIPs(ips_)
          }
          membersReceived = true
            updateMembersReceived(membersReceived)
  
          if (deferScreenReceived && screenId != null) {
            shareScreenStarted = true
            updateShareScreenStarted(shareScreenStarted)
          }
  
          await sleep(250)
          updateIsLoadingModalVisible(false)
          deferScreenReceived = false
          updateDeferScreenReceived(deferScreenReceived)
        }
      } else {
            if (screenId != null) { 
              let host = await participants.find((participant) => participant.ScreenID == screenId && participant.ScreenOn == true);
              if (deferScreenReceived && screenId != null && host) {
                  shareScreenStarted = true
                  updateShareScreenStarted(shareScreenStarted)
              }
            }
      }
  
      // return requests for only ids that are in the participants array and update the count badge, that is .request-count
      requestList = await requestss.filter(request => participants.some(participant => participant.id == request.id))
      updateRequestList(requestList)

      updateTotalReqWait(requestList.length + waitingRoomList.length)
    
      coHost = await coHoste
      updateCoHost(coHost)
      coHostResponsibility = await coHostRes
      updateCoHostResponsibility(coHostResponsibility)
  
      
  
      try {
        if (!lock_screen && !firstAll) {
          await onScreenChanges({parameters})
  
          if (meetingDisplayType != 'all') {
            firstAll = true
            updateFirstAll(firstAll)
          }
  
        } else {
  
          if (islevel == '2') {
            if (!hostFirstSwitch) {
              await onScreenChanges({parameters})
              hostFirstSwitch = true //get self display
            updateHostFirstSwitch(hostFirstSwitch)
            }
          }
  
        }
      } catch (error) {
          console.log('allMembers OnScreen', error)
      }

}