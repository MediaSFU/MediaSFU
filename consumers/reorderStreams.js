/**
 * Reorders streams on the UI.
 *
 * @param {object} parameters - Object containing necessary parameters and update methods.
 * @param {boolean} parameters.add - Flag indicating whether to add streams.
 * @param {boolean} parameters.screenChanged - Flag indicating whether the screen has changed.
 * @param {array} parameters.allVideoStreams - Array of all video streams.
 * @param {array} parameters.participants - Array of participants.
 * @param {array} parameters.oldAllStreams - Array of old all streams.
 * @param {string} parameters.screenId - ID of the current screen.
 * @param {string} parameters.adminVidID - ID of the admin's video.
 * @param {function} parameters.updateNewLimitedStreams - State update function for newLimitedStreams.
 * @param {function} parameters.updateNewLimitedStreamsIDs - State update function for newLimitedStreamsIDs.
 * @param {function} parameters.updateActiveSounds - State update function for activeSounds.
 * @param {function} parameters.updateScreenShareIDStream - State update function for screenShareIDStream.
 * @param {function} parameters.updateScreenShareNameStream - State update function for screenShareNameStream.
 * @param {function} parameters.updateAdminIDStream - State update function for adminIDStream.
 * @param {function} parameters.updateAdminNameStream - State update function for adminNameStream.
 * @param {function} parameters.updateYouYouStream - State update function for youYouStream.
 * @param {function} parameters.updateYouYouStreamIDs - State update function for youYouStreamIDs.
 */

export const reorderStreams = async ({add=false,screenChanged=false,parameters}) => {
   
  let {getUpdatedAllParams} = parameters;
  parameters = await getUpdatedAllParams()

    let {
      allVideoStreams,
      participants,
      oldAllStreams,
      screenId,
      adminVidID,
      newLimitedStreams,
      newLimitedStreamsIDs,
      activeSounds,
      screenShareIDStream,
      screenShareNameStream,
      adminIDStream,
      adminNameStream,
   

      updateNewLimitedStreams,
      updateNewLimitedStreamsIDs,
      updateActiveSounds,
      updateScreenShareIDStream,
      updateScreenShareNameStream,
      updateAdminIDStream,
      updateAdminNameStream,
      updateYouYouStream,
      updateYouYouStreamIDs,

      //mediasfu functions
      changeVids
    } = parameters;
  
    // function to reorder streams on the ui
    if (!add) {

      newLimitedStreams = []
      newLimitedStreamsIDs = []
      activeSounds = [] // get actives back in

    }

    let youyou = await allVideoStreams.filter(stream => stream.producerId == 'youyou')
    let admin = await participants.filter(participant => participant.islevel == '2')

    if (admin.length > 0)
      adminVidID = await admin[0].videoID;
    else {
      adminVidID = null;
    }

    if (!(adminVidID === null || adminVidID === "")) {

      let adminStream = await allVideoStreams.find(stream => stream.producerId === adminVidID);

      if (!add) {
        newLimitedStreams = await [...newLimitedStreams, ...youyou];
        newLimitedStreamsIDs = await [...newLimitedStreamsIDs, ...youyou.map(stream => stream.producerId)];

      } else {

        // first check if youyou is in newLimitedStreams, use the newLimitedStreams
        let youyouStream = await newLimitedStreams.find(stream => stream.producerId === 'youyou');

        if (!youyouStream) {
          //add it to the newLimitedStreams
          newLimitedStreams = await [...newLimitedStreams, ...youyou];
          newLimitedStreamsIDs = await [...newLimitedStreamsIDs, ...youyou.map(stream => stream.producerId)];
        }
      }

      if (adminStream) {

        adminIDStream = adminVidID;

        if (!add) {

          newLimitedStreams = await [...newLimitedStreams, adminStream];
          newLimitedStreamsIDs = await [...newLimitedStreamsIDs, adminStream.producerId];

        } else {

          // first check if admin is in newLimitedStreams, use the newLimitedStreams
          let adminStreamer = await newLimitedStreams.find(stream => stream.producerId === adminVidID);

          if (!adminStreamer) {
            //add it to the newLimitedStreams
            newLimitedStreams = await [...newLimitedStreams, adminStream];
            newLimitedStreamsIDs = await [...newLimitedStreamsIDs, adminStream.producerId];
          }

        }

      } else {
        //find in oldAllStreams
        let oldAdminStream = await oldAllStreams.find(stream => stream.producerId === adminVidID);


        if (oldAdminStream) {
          //add it to the allVideoStream

          adminIDStream = adminVidID;
          adminNameStream = admin[0].name;

          if (!add) {

            newLimitedStreams = await [...newLimitedStreams, oldAdminStream];
            newLimitedStreamsIDs = await [...newLimitedStreamsIDs, oldAdminStream.producerId];

          } else {

            // first check if admin is in newLimitedStreams, use the newLimitedStreams
            let adminStreamer = await newLimitedStreams.find(stream => stream.producerId === adminVidID);
            if (!adminStreamer) {
              //add it to the newLimitedStreams
              newLimitedStreams = await [...newLimitedStreams, oldAdminStream];
              newLimitedStreamsIDs = await [...newLimitedStreamsIDs, oldAdminStream.producerId];
            }
          }
        }
      }

      //find the participant with the screenID same as screenId and put the videoID it in the newLimitedStreams array if it is not already there
      //look in participants array for the participant with the screenID same as screenId
      let screenParticipant = await participants.filter(participant => participant.ScreenID == screenId)

      if (screenParticipant.length > 0) {
        // get the videoID of the screenParticipant
        let screenParticipantVidID = await screenParticipant[0].videoID;
        // check if the screenParticipantVidID is already in the newLimitedStreams array and not null
        let screenParticipantVidID_ = await newLimitedStreams.filter(stream => stream.producerId == screenParticipantVidID)
        if (screenParticipantVidID_.length < 1 && screenParticipantVidID != null) {
          screenShareIDStream = screenParticipantVidID;
          screenShareNameStream = screenParticipant[0].name;
          // add the screenParticipantVidID to the newLimitedStreams array
          let screenParticipantVidID__ = await allVideoStreams.filter(stream => stream.producerId == screenParticipantVidID)
          newLimitedStreams = await [...newLimitedStreams, ...screenParticipantVidID__]
          newLimitedStreamsIDs = await [...newLimitedStreamsIDs, ...screenParticipantVidID__.map(stream => stream.producerId)];
        }
      }

    } else {

      if (!add) {
        newLimitedStreams = await [...newLimitedStreams, ...youyou]
        newLimitedStreamsIDs = await [...newLimitedStreamsIDs, ...youyou.map(stream => stream.producerId)];
      } else {
        // first check if youyou is in newLimitedStreams, use the newLimitedStreams
        let youyouStream = await newLimitedStreams.find(stream => stream.producerId === 'youyou');

        if (!youyouStream) {
          //add it to the newLimitedStreams
          newLimitedStreams = await [...newLimitedStreams, ...youyou];
          newLimitedStreamsIDs = await [...newLimitedStreamsIDs, ...youyou.map(stream => stream.producerId)];
        }

      }

      //find the participant with the screenID same as screenId and put the videoID it in the newLimitedStreams array if it is not already there
      //look in participants array for the participant with the screenID same as screenId
      let screenParticipant = await participants.filter(participant => participant.ScreenID == screenId)

      if (screenParticipant.length > 0) {
        // get the videoID of the screenParticipant
        let screenParticipantVidID = await screenParticipant[0].videoID;
        // check if the screenParticipantVidID is already in the newLimitedStreams array and not null
        let screenParticipantVidID_ = await newLimitedStreams.filter(stream => stream.producerId == screenParticipantVidID)
        if (screenParticipantVidID_.length < 1 && screenParticipantVidID != null) {
          screenShareIDStream = screenParticipantVidID;
          screenShareNameStream = screenParticipant[0].name;
          // add the screenParticipantVidID to the newLimitedStreams array
          let screenParticipantVidID__ = await allVideoStreams.filter(stream => stream.producerId == screenParticipantVidID)
          newLimitedStreams = await [...newLimitedStreams, ...screenParticipantVidID__]
          newLimitedStreamsIDs = await [...newLimitedStreamsIDs, ...screenParticipantVidID__.map(stream => stream.producerId)];
        }

      }
    }

    //update all the states
    updateNewLimitedStreams(newLimitedStreams);
    updateNewLimitedStreamsIDs(newLimitedStreamsIDs);
    updateActiveSounds(activeSounds);
    updateScreenShareIDStream(screenShareIDStream);
    updateScreenShareNameStream(screenShareNameStream);
    updateAdminIDStream(adminIDStream);
    updateAdminNameStream(adminNameStream);
    updateYouYouStream(youyou);
    
  
    //reflect the changes on the ui
    await changeVids({screenChanged,parameters})
  };
  

  