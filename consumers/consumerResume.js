
import MiniAudioPlayer from "../methods/utils/MiniAudioPlayer/MiniAudioPlayer";
import {RTCView,MediaStream} from '../methods/utils/webrtc/webrtc'
import MiniAudio from '../components/displayComponents/MiniAudio'

/**
 * Resumes a consumer, making it ready for use.
 *
 * @param {Object} options - The options object.
 * @param {MediaStreamTrack} options.track - The media stream track associated with the resumed consumer.
 * @param {string} options.kind - The type of media ('audio' or 'video') being resumed.
 * @param {string} options.remoteProducerId - The ID of the remote producer associated with the resumed consumer.
 * @param {Object} options.params - Additional parameters related to the resumed consumer.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Object} options.parameters.nsock - The socket associated with the consumer.
 * @throws Throws an error if an issue occurs during the consumer resumption.
 */
export const consumerResume = async ({ track, kind, remoteProducerId, params, parameters, nsock }) => {
  try {
    // Consumer resumed and ready to be used
     let {getUpdatedAllParams} = parameters;

    // Get updated parameters
    parameters = await getUpdatedAllParams();

    // Destructure parameters
    let {
      nStream,
      allAudioStreams,
      allVideoStreams,
      streamNames,
      audStreamNames,
      updateMainWindow,
      shared,
      shareScreenStarted,
      screenId,
      participants,
      eventType,
      meetingDisplayType,
      mainScreenFilled,
      first_round,
      lock_screen,
      oldAllStreams,
      adminIDStream,
      adminNameStream,
      screenShareIDStream,
      screenShareNameStream,
      adminVidID,
      mainHeightWidth,
      member,
      audioOnlyStreams,
      gotAllVids,
      defer_receive,
      firstAll,
      remoteScreenStream,
      hostLabel,
      updateAudioProducer,
      updateVideoProducer,
      updateScreenProducer,
      updateUpdateMainWindow,
      updateParticipants,
      updateAllAudioStreams,
      updateAllVideoStreams,
      updateStreamNames,
      updateAudStreamNames,
      updateShared,
      updateNStream,
      updateMainHeightWidth,
      updateLock_screen,
      updateFirstAll,
      updateRemoteScreenStream,
      updateOldAllStreams,
      updateAudioOnlyStreams,
      updateShareScreenStarted,
      updateGotAllVids,
      updateScreenId,


      //mediasfu functions
      reorderStreams,
      prepopulateUserMedia,
    } = parameters;


    if (params.kind === 'audio') {
      // Audio resumed

      // Check if the participant with audioID == remoteProducerId has a valid videoID
      let participant = await participants.filter((participant) => participant.audioID == remoteProducerId);
      let name__ = '';
      if (participant.length > 0) {
        name__ = await participant[0].name;
      }

      if (name__ == member) {
        return;
      }

      //find any participants with ScreenID not null and ScreenOn == true
      let screenParticipant_alt = await participants.filter((participant) => participant.ScreenID != null   && participant.ScreenOn == true && participant.ScreenID != "");
      if (screenParticipant_alt.length > 0) {
        screenId = await screenParticipant_alt[0].ScreenID;
        updateScreenId(screenId);
        if (!shared){
          shareScreenStarted = true;
          updateShareScreenStarted(shareScreenStarted);
        }
      } else{
        screenId = null;
        updateScreenId(screenId);
        updateShareScreenStarted(false);
      }

      // Media display and UI update to prioritize audio/video
      nStream = new MediaStream([track]);
      updateNStream(nStream);

      // Create MiniAudioPlayer track
      let nTrack = <MiniAudioPlayer stream={nStream ? nStream : null} remoteProducerId={remoteProducerId} parameters={parameters} RTCView={RTCView} MiniAudioComponent={MiniAudio} 
      miniAudioProps={ { customStyle: { backgroundColor: 'gray' },
      name: name__,
      showWaveform: true,
      overlayPosition: 'topRight',
      barColor: 'white',
      textColor: 'white',
      imageSource: "https://mediasfu.com/images/logo192.png",
      roundedImage: true,
      imageStyle: {}}} />;

      // Add to audioOnlyStreams array
      audioOnlyStreams.push(nTrack);
      updateAudioOnlyStreams(audioOnlyStreams);

      // Add to allAudioStreams array; add producerId, stream
      allAudioStreams = await [...allAudioStreams, { producerId: remoteProducerId, stream: nStream }];
      updateAllAudioStreams(allAudioStreams);

      let name;

      try {
        name = await participant[0].name;
      } catch (error) {}

      if (name) {
        // Add to audStreamNames array; add producerId, name
        audStreamNames = await [...audStreamNames, { producerId: remoteProducerId, name: name }];
        updateAudStreamNames(audStreamNames);

        if (!mainScreenFilled && participant[0].islevel == '2') {
          updateMainWindow = true;
          updateUpdateMainWindow(updateMainWindow);
          await prepopulateUserMedia({ name: hostLabel, parameters :{...parameters, audStreamNames,allAudioStreams} });
          updateMainWindow = false;
          updateUpdateMainWindow(updateMainWindow);
        }
      } else {
        return;
      }

      // Checks for display type and updates the UI
      let checker;
      let alt_checker = false;

      if (meetingDisplayType == 'video') {
        checker = participant[0].videoID != null && participant[0].videoID != '' && participant[0].videoID != undefined;
      } else {
        checker = true;
        alt_checker = true;
      }

      if (checker) {
        if (shareScreenStarted || shared) {
          if (!alt_checker) {
            await reorderStreams({ parameters: {...parameters, audStreamNames,allAudioStreams} });
          }
        } else {
          if (alt_checker && meetingDisplayType != 'video') {
            await reorderStreams({ add: false, screenChanged: true, parameters: {...parameters, audStreamNames,allAudioStreams} });
          }
        }
      }
    } else {
      // Video resumed
      nStream = new MediaStream([track]);
      updateNStream(nStream);

      //find any participants with ScreenID not null and ScreenOn == true
      let screenParticipant_alt = await participants.filter((participant) => participant.ScreenID != null   && participant.ScreenOn == true && participant.ScreenID != "");
      if (screenParticipant_alt.length > 0) {
        screenId = await screenParticipant_alt[0].ScreenID;
        updateScreenId(screenId);
        if (!shared){
          shareScreenStarted = true;
          updateShareScreenStarted(shareScreenStarted);
        }
      } else{
        screenId = null;
        updateScreenId(screenId);
        updateShareScreenStarted(false);
      }

      // Check for display type and update the UI
      if (remoteProducerId == screenId) {
        // Put on main screen for screen share
        updateMainWindow = true;
        updateUpdateMainWindow(updateMainWindow);
        remoteScreenStream = await [{ producerId: remoteProducerId, stream: nStream }];
        updateRemoteScreenStream(remoteScreenStream);

        if (eventType == 'conference') {
          if (shared || shareScreenStarted) {
            if (mainHeightWidth == 0) {
              updateMainHeightWidth(84);
            }
          } else {
            if (mainHeightWidth > 0) {
              updateMainHeightWidth(0);
            }
          }
        }

        if (!lock_screen) {
          await prepopulateUserMedia({ name: hostLabel, parameters });
          await reorderStreams({ add: false, screenChanged: true, parameters :{...parameters, remoteScreenStream,allVideoStreams} });
        } else {
          if (!first_round) {
            await prepopulateUserMedia({ name: hostLabel, parameters: {...parameters, remoteScreenStream,allVideoStreams} });
            await reorderStreams({ add: false, screenChanged: true, parameters: {...parameters, remoteScreenStream,allVideoStreams} });
          }
        }

        lock_screen = true;
        updateLock_screen(lock_screen);
        firstAll = true;
        updateFirstAll(firstAll);
      } else {
        // Non-screen share video resumed

        // Operations to add video to the UI (either main screen or mini screen)
        parameters = await getUpdatedAllParams();

        // Get the name of the participant with videoID == remoteProducerId
        let participant = await participants.filter((participant) => participant.videoID == remoteProducerId);

        if (participant.length > 0 && participant[0].name != null && participant[0].name != '' && participant[0].name != undefined && participant[0].name !== member) {
          allVideoStreams = await [...allVideoStreams, { producerId: remoteProducerId, stream: nStream, socket_: nsock }];
          updateAllVideoStreams(allVideoStreams);
        }

        let admin = await participants.filter((participant) => participant.isAdmin == true && participant.islevel == '2');

        if (participant.length > 0) {
          let name = await participant[0].name;
          streamNames = await [...streamNames, { producerId: remoteProducerId, name: name }];
          updateStreamNames(streamNames);
        }

        // If not screenshare, filter out the stream that belongs to the participant with isAdmin = true and islevel == '2' (host)
        // Find the ID of the participant with isAdmin = true and islevel == '2'
        if (!shareScreenStarted) {
          let admin = await participants.filter((participant) => participant.isAdmin == true && participant.islevel == '2');
          // Remove video stream with producerId == admin.id
          // Get the videoID of the admin

          if (admin.length > 0) {
            adminVidID = await admin[0].videoID;

            if (adminVidID != null && adminVidID != '') {
              let oldAllStreams_ = [];
              // Check if the length of allVideoStreams is > 0
              if (oldAllStreams.length > 0) {
                oldAllStreams_ = await oldAllStreams;
              }

              oldAllStreams = await allVideoStreams.filter((streame) => streame.producerId == adminVidID);
              updateOldAllStreams(oldAllStreams);

              if (oldAllStreams.length < 1) {
                oldAllStreams = await oldAllStreams_;
                updateOldAllStreams(oldAllStreams);
              }

              allVideoStreams = await allVideoStreams.filter((streame) => streame.producerId != adminVidID);
              updateAllVideoStreams(allVideoStreams);

              adminIDStream = adminVidID;
              adminNameStream = admin[0].name;

              if (remoteProducerId == adminVidID) {
                updateMainWindow = true;
              }
            }

            gotAllVids = true;
            updateGotAllVids(gotAllVids);
          }
        } else {
          // Check if the videoID is either that of the admin or that of the screen participant
          let admin = await participants.filter((participant) => participant.islevel == '2');
          let screenParticipant = await participants.filter((participant) => participant.ScreenID == screenId);

          // See if producerId is that of admin videoID or screenParticipant videoID
          let adminVidID;
          if (admin.length > 0) {
            let adminVidID = await admin[0].videoID;
          }

          let screenParticipantVidID;
          if (screenParticipant.length > 0) {
            screenParticipantVidID = await screenParticipant[0].videoID;
          }

          if (adminVidID != null && adminVidID != '') {
            adminIDStream = adminVidID;
            adminNameStream = admin[0].name;
          }

          if (screenParticipantVidID != null && screenParticipantVidID != '') {
            screenShareIDStream = screenParticipantVidID;
            screenShareNameStream = screenParticipant[0].name;
          }

          if ((adminVidID != null && adminVidID != '') || (screenParticipantVidID != null && screenParticipantVidID != '')) {
            if (adminVidID == remoteProducerId || screenParticipantVidID == remoteProducerId) {
              await reorderStreams({ parameters :{...parameters, allVideoStreams} });
              return;
            }
          }
        }

        // Update the UI
        if (lock_screen || shared) {
          defer_receive = true;

          if (!first_round) {
            await reorderStreams({ add: false, screenChanged: true, parameters :{...parameters, allVideoStreams} });
          }
        } else {
          await reorderStreams({ add: false, screenChanged: true, parameters :{...parameters, allVideoStreams} });
        }
      }
    }
  } catch (error) {
    console.log('consumerResume error', error);
    // throw error;
  }
};
