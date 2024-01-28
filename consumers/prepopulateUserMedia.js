
import MiniCard from '../components/displayComponents/MiniCard'
import VideoCard from '../components/displayComponents/VideoCard'
import AudioCard from '../components/displayComponents/AudioCard'
import {RTCView} from '../methods/utils/webrtc/webrtc'

/**
 * Prepares and populates the main screen with video, audio, or mini cards based on the user's role and screen sharing status.
 *
 * @param {Object} options - The options object.
 * @param {string} options.name - The name of the user.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Function} options.getUpdatedAllParams - Function to get updated parameters.
 * @param {Array} options.participants - An array of participants.
 * @param {Array} options.allVideoStreams - An array of all video streams.
 * @param {string} options.islevel - The user's level.
 * @param {string} options.member - The user's member information.
 * @param {boolean} options.shared - Indicates whether the screen is being shared.
 * @param {boolean} options.shareScreenStarted - Indicates whether screen sharing has started.
 * @param {string} options.eventType - The type of event (e.g., broadcast, chat, conference).
 * @param {string} options.screenId - The ID of the screen.
 * @param {boolean} options.forceFullDisplay - Indicates whether to force full display.
 * @param {Function} options.updateMainWindow - Function to update the main window status.
 * @param {boolean} options.mainScreenFilled - Indicates whether the main screen is filled.
 * @param {boolean} options.adminOnMainScreen - Indicates whether the admin is on the main screen.
 * @param {string} options.mainScreenPerson - The name of the person on the main screen.
 * @param {boolean} options.videoAlreadyOn - Indicates whether video is already on.
 * @param {boolean} options.audioAlreadyOn - Indicates whether audio is already on.
 * @param {Array} options.oldAllStreams - An array of old video streams.
 * @param {Function} options.checkOrientation - Function to check the orientation of the screen.
 * @param {boolean} options.prevForceFullDisplay - The previous forceFullDisplay status.
 * @param {boolean} options.screenForceFullDisplay - The forceFullDisplay status for the screen.
 * @param {MediaStream} options.localStream - The local screen sharing media stream.
 * @param {MediaStream} options.remoteScreenStream - The remote screen sharing media stream.
 * @param {MediaStream} options.localStreamVideo - The local video media stream.
 * @param {number} options.mainGridHeightWidth - The height and width of the main grid.
 * @param {boolean} options.isWideScreen - Indicates whether the screen is wide.
 * @param {boolean} options.isSmallScreen - Indicates whether the screen is small.
 * @param {Function} options.updateForceFullDisplay - Function to update the forceFullDisplay status.
 * @param {Function} options.updateMainScreenPerson - Function to update the person on the main screen.
 * @param {Function} options.updateMainScreenFilled - Function to update the filled status of the main screen.
 * @param {Function} options.updateAdminOnMainScreen - Function to update the admin on the main screen.
 * @param {Function} options.updateMainGridHeightWidth - Function to update the height and width of the main grid.
 * @param {Function} options.updateScreenForceFullDisplay - Function to update the forceFullDisplay status for the screen.
 * @param {Function} options.updateUpdateMainWindow - Function to update the updateMainWindow status.
 * @param {Function} options.updateMainGridStream - Function to update the main grid with new components.
 * @returns {Array} An array of components for the main grid.
 * @throws Throws an error if there is an issue during the process of preparing and populating the main screen.
 */
export async function prepopulateUserMedia({ name, parameters }) {

  try {
    // Destructure parameters
    
    let {getUpdatedAllParams} = parameters
    parameters = await getUpdatedAllParams()

    let {
      
      participants,
      allVideoStreams,
      islevel,
      member,
      shared,
      shareScreenStarted,
      eventType,
      screenId,
      forceFullDisplay,
      updateMainWindow,
      mainScreenFilled,
      adminOnMainScreen,
      mainScreenPerson,
      videoAlreadyOn,
      audioAlreadyOn,
      oldAllStreams,
      checkOrientation,
      prevForceFullDisplay,
      screenForceFullDisplay,
      localStream,
      localStreamScreen,
      remoteScreenStream,
      localStreamVideo,
      mainGridHeightWidth,
      isWideScreen,
      isSmallScreen,
      updateForceFullDisplay,
      updateMainScreenPerson,
      updateMainScreenFilled,
      updateAdminOnMainScreen,
      updateMainGridHeightWidth,
      updateScreenForceFullDisplay,
      updateUpdateMainWindow,
      updateMainGridStream,
    } = parameters;

    // If the event type is 'chat', return early
    if (eventType === 'chat') {
      return;
    }

    // Initialize variables
    let host = null;
    let hostStream;
    let newComponent = [];

    // Check if screen sharing is started or shared
    if (shareScreenStarted || shared) {
      // Handle main grid visibility based on the event type
      if (eventType === 'conference') {
        if (shared || shareScreenStarted) {
          if (mainGridHeightWidth === 0) {
            // Add the main grid if not present
            updateMainGridHeightWidth(84);
          }
        } else {
          // Remove the main grid if not shared or started
          updateMainGridHeightWidth(0);
        }
      }

      // Switch display to optimize for screen share
      prevForceFullDisplay = forceFullDisplay;
      screenForceFullDisplay = forceFullDisplay;

      // Get the orientation and adjust forceFullDisplay
      let orientation = checkOrientation();
      if (orientation === 'portrait' || !isWideScreen) {
        if (shareScreenStarted || shared) {
          screenForceFullDisplay = false;
          updateScreenForceFullDisplay(screenForceFullDisplay);
        }
      }

      // Check if the user is sharing the screen
      if (shared) {
        // User is sharing
        host = { name: member };
        hostStream = localStreamScreen;

        // Update admin on the main screen
        adminOnMainScreen = islevel === '2';
        updateAdminOnMainScreen(adminOnMainScreen);

        // Update main screen person
        mainScreenPerson = host.name;
        updateMainScreenPerson(mainScreenPerson);
      } else {
        //someone else is sharing
        host = await participants.find((participant) => participant.ScreenID == screenId && participant.ScreenOn == true);

        if (host == null) {
          // remoteScreenStream
          host = await participants.find((participant) => participant.ScreenOn == true);
        }

        // check remoteScreenStream
        if (host != null) {
          if (remoteScreenStream.length == 0) {

            hostStream = await allVideoStreams.find((stream) => stream.producerId == host.ScreenID);
          } else {
            hostStream = await remoteScreenStream[0]
          }
        }
   


        // Update admin on the main screen
        adminOnMainScreen = host && host.islevel === '2';
        updateAdminOnMainScreen(adminOnMainScreen);

        // Update main screen person
        mainScreenPerson = host && host.name;
        updateMainScreenPerson(mainScreenPerson);
      }
    } else {
      // Screen share not started
      if (eventType === 'conference') {
        // No main grid for conferences
        return;
      }

      // Find the host with level '2'
      host = participants.find((participant) => participant.islevel === '2');

      // Update main screen person
      mainScreenPerson = host && host.name;
      updateMainScreenPerson(mainScreenPerson);
    }

    // If host is not null, check if host videoIsOn
    if (host) {
      // Populate the main screen with the host video
      if (shareScreenStarted || shared) {
        forceFullDisplay = screenForceFullDisplay;
        newComponent.push(
          <VideoCard
            key={host.ScreenID}
            videoStream={shared ? hostStream : hostStream.stream}
            remoteProducerId={host.ScreenID}
            eventType={eventType}
            forceFullDisplay={forceFullDisplay}
            participant={host}
            RTCView={RTCView}
            backgroundColor="rgba(217, 227, 234, 0.99)"
            showControls={false}
            showInfo={true}
            name={host.name}
            doMirror={false}
            parameters={parameters}
          />
        );

        updateMainGridStream(newComponent);

        mainScreenFilled = true;
        updateMainScreenFilled(mainScreenFilled);
        adminOnMainScreen = host.islevel === '2';
        updateAdminOnMainScreen(adminOnMainScreen);
        mainScreenPerson = host.name;
        updateMainScreenPerson(mainScreenPerson);

        return newComponent;
      }

      // Check if video is already on or not
      if ((islevel != '2' && !host.videoOn) || (islevel == '2' && (!host.videoOn || !videoAlreadyOn))) {
        // Video is off
        if (islevel === '2' && videoAlreadyOn) {
          // Admin's video is on
          newComponent.push(
            <VideoCard
              key={host.videoID}
              videoStream={localStreamVideo}
              remoteProducerId={host.videoID}
              eventType={eventType}
              forceFullDisplay={forceFullDisplay}
              participant={host}
              RTCView={RTCView}
              backgroundColor="rgba(217, 227, 234, 0.99)"
              showControls={false}
              showInfo={true}
              name={host.name}
              doMirror={true}
              parameters={parameters}
            />
          );

          updateMainGridStream(newComponent);

          mainScreenFilled = true;
          updateMainScreenFilled(mainScreenFilled);
          adminOnMainScreen = true;
          updateAdminOnMainScreen(adminOnMainScreen);
          mainScreenPerson = host.name;
          updateMainScreenPerson(mainScreenPerson);
        } else {
          // Video is off and not admin
          let audOn

          if ((islevel == '2' && audioAlreadyOn)) {

            audOn = true
          } else {
            if (host != null && islevel != '2') {
              audOn = host.muted == false
            }
          }

          
          if (audOn) {
            // Audio is on
            try {
              newComponent.push(
                <AudioCard
                  key={host.name}
                  name={host.name}
                  barColor={'white'}
                  textColor={'white'}
                  customStyle={{ backgroundColor: 'transparent' }}
                  controlsPosition={'topLeft'}
                  infoPosition={'topRight'}
                  showWaveform={true}
                  roundedImage={true}
                  parameters={parameters}
                  showControls={islevel != '2'}
                />
              );

              updateMainGridStream(newComponent);
            } catch (error) {
              // Handle audio card creation error
            }

            mainScreenFilled = true;
            updateMainScreenFilled(mainScreenFilled);
            adminOnMainScreen = islevel === '2';
            updateAdminOnMainScreen(adminOnMainScreen);
            mainScreenPerson = host.name;
            updateMainScreenPerson(mainScreenPerson);
          } else {
            // Audio is off
             try {
              newComponent.push(
                <MiniCard
                  key={name}
                  initials={name}
                  fontSize={20}
                  customStyle={{ backgroundColor: 'transparent' }}
                />
              );

              updateMainGridStream(newComponent);
            } catch (error) {
              // Handle mini card creation error
            }

            mainScreenFilled = false;
            updateMainScreenFilled(mainScreenFilled);
            adminOnMainScreen = islevel === '2';
            updateAdminOnMainScreen(adminOnMainScreen);
            mainScreenPerson = host.name;
            updateMainScreenPerson(mainScreenPerson);
          }
        }
      } else {
        // Video is on
        if (shareScreenStarted || shared) {
          // Screen share is on
          try {
            newComponent.push(
              <VideoCard
                key={host.ScreenID}
                videoStream={shared ? hostStream : hostStream.stream}
                remoteProducerId={host.ScreenID}
                eventType={eventType}
                forceFullDisplay={forceFullDisplay}
                participant={host}
                RTCView={RTCView}
                backgroundColor="rgba(217, 227, 234, 0.99)"
                showControls={false}
                showInfo={true}
                name={host.name}
                doMirror={false}
                parameters={parameters}
              />
            );

            updateMainGridStream(newComponent);

            mainScreenFilled = true;
            updateMainScreenFilled(mainScreenFilled);
            adminOnMainScreen = host.islevel === '2';
            updateAdminOnMainScreen(adminOnMainScreen);
            mainScreenPerson = host.name;
            updateMainScreenPerson(mainScreenPerson);
          } catch (error) {
            // Handle video card creation error
          }
        } else {
          // Screen share is off
          let streame;
          if (islevel === '2') {
            host.stream = localStreamVideo;
          } else {
            streame = oldAllStreams.find((streame) => streame.producerId === host.videoID);
            host.stream = streame && streame.stream;
          }

          try {

            if (host.stream) {
              newComponent.push(
                <VideoCard
                  key={host.videoID}
                  videoStream={host.stream || null}
                  remoteProducerId={host.videoID}
                  eventType={eventType}
                  forceFullDisplay={forceFullDisplay}
                  participant={host}
                  RTCView={RTCView}
                  backgroundColor="rgba(217, 227, 234, 0.99)"
                  showControls={false}
                  showInfo={true}
                  name={host.name}
                  doMirror={member === host.name}
                  parameters={parameters}
                />
              );

              updateMainGridStream(newComponent);
              mainScreenFilled = true;
              adminOnMainScreen = host.islevel === '2';
              mainScreenPerson = host.name;
            } else {

              newComponent.push(
                <MiniCard key={name} initials={name} fontSize={20} customStyle={{ backgroundColor: 'transparent' }} />
              );

              updateMainGridStream(newComponent);
              mainScreenFilled = false;
              adminOnMainScreen = islevel === '2';
              mainScreenPerson = host.name;
            }

            
            updateMainScreenFilled(mainScreenFilled);
           
            updateAdminOnMainScreen(adminOnMainScreen);
           
            updateMainScreenPerson(mainScreenPerson);
          } catch (error) {
            // Handle video card creation error
          }
        }
      }
    } else {
      // Host is null, add a mini card
      try {
    
        newComponent.push(
          <MiniCard key={name} initials={name} fontSize={20} customStyle={{ backgroundColor: 'transparent' }} />
        );

        updateMainGridStream(newComponent);

        mainScreenFilled = false;
        adminOnMainScreen = false;
        mainScreenPerson = null;
        updateMainScreenFilled(mainScreenFilled);
        updateAdminOnMainScreen(adminOnMainScreen);
        updateMainScreenPerson(mainScreenPerson);
      } catch (error) {
        // Handle mini card creation error
      }
    }

    updateMainWindow = false;
    updateUpdateMainWindow(updateMainWindow);

    return newComponent;
  } catch (error) {
    // Handle errors during the process of preparing and populating the main screen
    console.log('Error preparing and populating the main screen:', error.message);
    // throw error;
  }
}