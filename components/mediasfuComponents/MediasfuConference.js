import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Platform, Dimensions, Animated } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import * as mediasoupClient from 'mediasoup-client';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

//initial values
import { initialValuesState } from '../../methods/utils/initialValuesState';

//import components for display (samples)

import MainAspectComponent from '../displayComponents/MainAspectComponent';
import LoadingModal from '../displayComponents/LoadingModal';
import ControlButtonsComponent from '../displayComponents/ControlButtonsComponent';
import ControlButtonsAltComponent from '../displayComponents/ControlButtonsAltComponent';
import ControlButtonsComponentTouch from '../displayComponents/ControlButtonsComponentTouch';
import OthergridComponent from '../displayComponents/OtherGridComponent';
import MainScreenComponent from '../displayComponents/MainScreenComponent';
import MainGridComponent from '../displayComponents/MainGridComponent';
import SubAspectComponent from '../displayComponents/SubAspectComponent';
import MainContainerComponent from '../displayComponents/MainContainerComponent';
import AlertComponent from '../displayComponents/AlertComponent';
import MenuModal from '../menuComponents/MenuModal';
import RecordingModal from '../recordingComponents/RecordingModal';
import RequestsModal from '../requestsComponents/RequestsModal';
import WaitingRoomModal from '../waitingComponents/WaitingModal';
import DisplaySettingsModal from '../displaySettingsComponents/DisplaySettingsModal';
import EventSettingsModal from '../eventSettingsComponents/EventSettingsModal';
import CoHostModal from '../coHostComponents/CoHostModal';
import ParticipantsModal from '../participantsComponents/ParticipantsModal';
import MessagesModal from '../messageComponents/MessagesModal';
import MediaSettingsModal from '../mediaSettingsComponents/MediaSettingsModal';
import ConfirmExitModal from '../exitComponents/ConfirmExitModal';
import ConfirmHereModal from '../miscComponents/ConfirmHereModal';
import ShareEventModal from '../miscComponents/ShareEventModal';
import WelcomePage from '../miscComponents/WelcomePage';

//pagination and display of media (samples)
import Pagination from '../displayComponents/Pagination';
import FlexibleGrid from '../displayComponents/FlexibleGrid';
import FlexibleVideo from '../displayComponents/FlexibleVideo';
import AudioGrid from '../displayComponents/AudioGrid';

//import methods for control (samples)
import { launchMenuModal } from '../../methods/menuMethods/launchMenuModal';
import { launchRecording } from '../../methods/recordingMethods/launchRecording';
import { startRecording } from '../../methods/recordingMethods/startRecording';
import { confirmRecording } from '../../methods/recordingMethods/confirmRecording';
import { launchWaiting } from '../../methods/waitingMethods/launchWaiting';
import { launchCoHost } from '../../methods/coHostMethods/launchCoHost';
import { launchMediaSettings } from '../../methods/mediaSettingsMethods/launchMediaSettings';
import { launchDisplaySettings } from '../../methods/displaySettingsMethods/launchDisplaySettings';
import { launchSettings } from '../../methods/settingsMethods/launchSettings';
import { launchRequests } from '../../methods/requestsMethods/launchRequests';
import { launchParticipants } from '../../methods/participantsMethods/launchParticipants';
import { launchMessages } from '../../methods/messageMethods/launchMessages';
import { launchConfirmExit } from '../../methods/exitMethods/launchConfirmExit';

// Import the platform-specific WebRTC module (options are for ios, android, web)
import { mediaDevices, RTCView, registerGlobals, MediaStream, MediaStreamTrack } from '../../methods/utils/webrtc/webrtc';

// mediasfu functions -- examples
import { connectSocket, disconnectSocket } from '../../sockets/SocketManager';
import { joinRoomClient } from '../../ProducerClient/producerClientEmits/joinRoomClient';
import { updateRoomParametersClient } from '../../ProducerClient/producerClientEmits/updateRoomParametersClient';
import { createDeviceClient } from '../../ProducerClient/producerClientEmits/createDeviceClient';

import { switchVideoAlt } from '../../methods/streamMethods/switchVideoAlt';
import { clickVideo } from '../../methods/streamMethods/clickVideo';
import { clickAudio } from '../../methods/streamMethods/clickAudio';
import { clickScreenShare } from '../../methods/streamMethods/clickScreenShare';
import { streamSuccessVideo } from '../../consumers/streamSuccessVideo';
import { streamSuccessAudio } from '../../consumers/streamSuccessAudio';
import { streamSuccessScreen } from '../../consumers/streamSuccessScreen';
import { streamSuccessAudioSwitch } from '../../consumers/streamSuccessAudioSwitch';
import { checkPermission } from '../../consumers/checkPermission';
import { producerClosed } from '../../consumers/socketReceiveMethods/producerClosed';
import { newPipeProducer } from '../../consumers/socketReceiveMethods/newPipeProducer';


//mediasfu functions
import { updateMiniCardsGrid } from '../../consumers/updateMiniCardsGrid';
import { mixStreams } from '../../consumers/mixStreams';
import { dispStreams } from '../../consumers/dispStreams';
import { stopShareScreen } from '../../consumers/stopShareScreen';
import { checkScreenShare } from '../../consumers/checkScreenShare';
import { startShareScreen } from '../../consumers/startShareScreen';
import { requestScreenShare } from '../../consumers/requestScreenShare';
import { reorderStreams } from '../../consumers/reorderStreams';
import { prepopulateUserMedia } from '../../consumers/prepopulateUserMedia';
import { getVideos } from '../../consumers/getVideos';
import { rePort } from '../../consumers/rePort';
import { trigger } from '../../consumers/trigger';
import { consumerResume } from '../../consumers/consumerResume';
import { connectSendTransportAudio } from '../../consumers/connectSendTransportAudio';
import { connectSendTransportVideo } from '../../consumers/connectSendTransportVideo';
import { connectSendTransportScreen } from '../../consumers/connectSendTransportScreen';
import { processConsumerTransports } from '../../consumers/processConsumerTransports';
import { resumePauseStreams } from '../../consumers/resumePauseStreams';
import { readjust } from '../../consumers/readjust';
import { checkGrid } from '../../consumers/checkGrid';
import { GetEstimate } from '../../consumers/getEstimate';
import { calculateRowsAndColumns } from '../../consumers/calculateRowsAndColumns';
import { addVideosGrid } from '../../consumers/addVideosGrid';
import { onScreenChanges } from '../../consumers/onScreenChanges';
import { sleep } from '../../methods/utils/sleep';
import { changeVids } from '../../consumers/changeVids';
import { compareActiveNames } from '../../consumers/compareActiveNames';
import { compareScreenStates } from '../../consumers/compareScreenStates';
import { createSendTransport } from '../../consumers/createSendTransport';
import { resumeSendTransportAudio } from '../../consumers/resumeSendTransportAudio';
import { receiveAllPipedTransports } from '../../consumers/receiveAllPipedTransports';
import { disconnectSendTransportVideo } from '../../consumers/disconnectSendTransportVideo';
import { disconnectSendTransportAudio } from '../../consumers/disconnectSendTransportAudio';
import { disconnectSendTransportScreen } from '../../consumers/disconnectSendTransportScreen';
import { connectSendTransport } from '../../consumers/connectSendTransport';
import { getPipedProducersAlt } from '../../consumers/getPipedProducersAlt';
import { signalNewConsumerTransport } from '../../consumers/signalNewConsumerTransport';
import { connectRecvTransport } from '../../consumers/connectRecvTransport';
import { reUpdateInter } from '../../consumers/reUpdateInter';
import { updateParticipantAudioDecibels } from '../../consumers/updateParticipantAudioDecibels';
import { closeAndResize } from '../../consumers/closeAndResize';
import { autoAdjust } from '../../consumers/autoAdjust';
import { switchUserVideoAlt } from '../../consumers/switchUserVideoAlt';
import { switchUserVideo } from '../../consumers/switchUserVideo';
import { switchUserAudio } from '../../consumers/switchUserAudio';
import { receiveRoomMessages } from '../../consumers/receiveRoomMessages';
import { formatNumber } from '../../methods/utils/formatNumber';
import { connectIps } from '../../consumers/connectIps';

import { startMeetingProgressTimer } from '../../methods/utils/meetingTimer/startMeetingProgressTimer';
import { updateRecording } from '../../methods/recordingMethods/updateRecording';
import { stopRecording } from '../../methods/recordingMethods/stopRecording';

import { userWaiting } from '../../producers/socketReceiveMethods/userWaiting';
import { personJoined } from '../../producers/socketReceiveMethods/personJoined';
import { allWaitingRoomMembers } from '../../producers/socketReceiveMethods/allWaitingRoomMembers';
import { roomRecordParams } from '../../producers/socketReceiveMethods/roomRecordParams';
import { banParticipant } from '../../producers/socketReceiveMethods/banParticipant';
import { updatedCoHost } from '../../producers/socketReceiveMethods/updatedCoHost';
import { participantRequested } from '../../producers/socketReceiveMethods/participantRequested';
import { screenProducerId } from '../../producers/socketReceiveMethods/screenProducerId';
import { updateMediaSettings } from '../../producers/socketReceiveMethods/updateMediaSettings';
import { producerMediaPaused } from '../../producers/socketReceiveMethods/producerMediaPaused';
import { producerMediaResumed } from '../../producers/socketReceiveMethods/producerMediaResumed';
import { producerMediaClosed } from '../../producers/socketReceiveMethods/producerMediaClosed';
import { controlMediaHost } from '../../producers/socketReceiveMethods/controlMediaHost';
import { meetingEnded } from '../../producers/socketReceiveMethods/meetingEnded';
import { disconnectUserSelf } from '../../producers/socketReceiveMethods/disconnectUserSelf';
import { receiveMessage } from '../../producers/socketReceiveMethods/receiveMessage';
import { meetingTimeRemaining } from '../../producers/socketReceiveMethods/meetingTimeRemaining';
import { meetingStillThere } from '../../producers/socketReceiveMethods/meetingStillThere';
import { startRecords } from '../../producers/socketReceiveMethods/startRecords';
import { reInitiateRecording } from '../../producers/socketReceiveMethods/reInitiateRecording';
import { getDomains } from '../../producers/socketReceiveMethods/getDomains';
import { updateConsumingDomains } from '../../producers/socketReceiveMethods/updateConsumingDomains';
import { RecordingNotice } from '../../producers/socketReceiveMethods/recordingNotice';
import { timeLeftRecording } from '../../producers/socketReceiveMethods/timeLeftRecording';
import { stoppedRecording } from '../../producers/socketReceiveMethods/stoppedRecording';
import { hostRequestResponse } from '../../producers/socketReceiveMethods/hostRequestResponse';
import { allMembers } from '../../producers/socketReceiveMethods/allMembers';
import { allMembersRest } from '../../producers/socketReceiveMethods/allMembersRest';
import { disconnect } from '../../producers/socketReceiveMethods/disconnect';

function MediasfuConference({PrejoinPage=WelcomePage, credentials={credentials}, useLocalUIMode = false, seedData = {}, useSeed = false }) {

    //validated is true if the user has entered the correct details and checked from the server
    const [validated, setValidated] = useState(useLocalUIMode); // Validated
    const localUIMode = useRef(useLocalUIMode); // Local UI mode (desktop or touch)

    const updateStatesToInitialValues = async () => {
        //update states (variables) to initial values

        for (const key in initialValuesState) {
            const updateFunctions = { ...getAllParams() };
            try {

                const updateFunction = updateFunctions[`update${key.charAt(0).toUpperCase() + key.slice(1)}`];
                await updateFunction(initialValuesState[key]);
            } catch (error) {

            }

        }
    };


    //update states (variables) to initial values
    const socket = useRef(null); // Socket for the media server
    const roomData = useRef(null);
    const device = useRef(null);

    const apiKey = useRef(''); // API key
    const apiUserName = useRef(''); // API username
    const apiToken = useRef(''); // API token
    const link = useRef(''); // Link to the media server

    const updateSocket = (value) => {
        socket.current = value;
    }

    const updateDevice = (value) => {
        device.current = value;
    }

    const updateRoomData = (value) => {
        roomData.current = value;
    }

    const updateValidated = (value) => {
        setValidated(value);
    }

    const updateApiKey = (value) => {
        apiKey.current = value;
    }

    const updateApiUserName = (value) => {
        apiUserName.current = value;
    }

    const updateApiToken = (value) => {
        apiToken.current = value;
    }

    const updateLink = (value) => {
        link.current = value;
    }


    //logic to join room using socket
    async function joinRoom({ socket, roomName, islevel, member, sec, apiUserName }) {
        try {
            // Emit the joinRoom event to the server using the provided socket
            const data = await joinRoomClient({ socket, roomName, islevel, member, sec, apiUserName });
            return data;
        } catch (error) {
            // Handle and log errors during the joinRoom process
            console.log('error', error);

            // throw new Error('Failed to join the room. Please check your connection and try again.');
        }
    };

    registerGlobals(); // Register globals for WebRTC

    //Room Details
    const roomName = useRef(""); // Room name
    const member = useRef(useSeed && seedData?.member ? seedData?.member : ''); // Member name
    const adminPasscode = useRef(''); // Admin passcode
    const islevel = useRef(useSeed && seedData?.member ? seedData.member == seedData?.host ? '2' : '1' : '1'); // Level of the user
    const coHost = useRef(""); // Co-host
    const coHostResponsibility = useRef([
        { name: 'participants', value: false, dedicated: false },
        { name: 'media', value: false, dedicated: false },
        { name: 'waiting', value: false, dedicated: false },
        { name: 'chat', value: false, dedicated: false },
    ]); // Co-host responsibility
    const youAreCoHost = useRef(coHost.current ? coHost.current == member.current : false); // True if the user is a co-host
    const youAreHost = useRef(islevel ? islevel == '2' : false); // True if the user is a host
    const confirmedToRecord = useRef(false); // True if the user has confirmed to record
    const meetingDisplayType = useRef('media'); // Meeting display type, i.e., 'media', 'video', or 'all'
    const meetingVideoOptimized = useRef(false); // True if the meeting video is optimized
    const eventType = useRef('conference'); // Event type
    const participants = useRef(useSeed && seedData?.participants ? seedData?.participants : []); // Participants
    const filteredParticipants = useRef(participants.current); // Filtered participants
    const participantsCounter = useRef(0); // Participants counter
    const participantsFilter = useRef(''); // Participants filter

    //more room details - media
    const consume_sockets = useRef([]); // Array of sockets connected to the remote IPs
    const rtpCapabilities = useRef({}); // RTP capabilities from MediaSoup
    const roomRecvIPs = useRef([]); // Receiving IPs (domains) for the room consumer
    const meetingRoomParams = useRef(null); // Room parameters for the meeting/event room
    const itemPageLimit = useRef(4); // Number of items to show per page in the media display
    const audioOnlyRoom = useRef(false); // True if the room is audio-only and does not support video
    const addForBasic = useRef(false); // True if the room supports few producers (i.e., broadcasting and chatting only)
    const screenPageLimit = useRef(4); // Number of people on the side-view of screen share
    const shareScreenStarted = useRef(false); // True if screen share has started and started remotely
    const shared = useRef(false); // True if screen share has started and started locally
    const targetOrientation = useRef('landscape'); // Orientation of the media to be captured (neutral, portrait, or landscape)
    const vidCons = useRef([]); // Constraints for video capture
    const frameRate = useRef(5); // Frame rate for video capture
    const hParams = useRef(null); // Host video encoding parameters
    const vParams = useRef(null); // Rest of members video encoding parameters
    const screenParams = useRef(null); // Screen share encoding parameters
    const aParams = useRef(null); // Audio encoding parameters


    //more room details - recording
    const recordingAudioPausesLimit = useRef(0); // Number of pauses allowed for audio recording
    const recordingAudioPausesCount = useRef(0); // Number of pauses for audio recording
    const recordingAudioSupport = useRef(false); // True if the room supports audio recording
    const recordingAudioPeopleLimit = useRef(0); // Number of people allowed for audio recording
    const recordingAudioParticipantsTimeLimit = useRef(0); // Time limit for audio recording
    const recordingVideoPausesCount = useRef(0); // Number of pauses for video recording
    const recordingVideoPausesLimit = useRef(0); // Number of pauses allowed for video recording
    const recordingVideoSupport = useRef(false); // True if the room supports video recording
    const recordingVideoPeopleLimit = useRef(0); // Number of people allowed for video recording
    const recordingVideoParticipantsTimeLimit = useRef(0); // Time limit for video recording
    const recordingAllParticipantsSupport = useRef(false); // True if the room supports recording all participants
    const recordingVideoParticipantsSupport = useRef(false); // True if the room supports recording video participants
    const recordingAllParticipantsFullRoomSupport = useRef(false); // True if the room supports recording all participants in full room
    const recordingVideoParticipantsFullRoomSupport = useRef(false); // True if the room supports recording video participants in full room
    const recordingPreferredOrientation = useRef('landscape'); // Preferred orientation for recording
    const recordingSupportForOtherOrientation = useRef(false); // True if the room supports recording for other orientations
    const recordingMultiFormatsSupport = useRef(false); // True if the room supports recording multiple formats

    const userRecordingParams = useRef({
        mainSpecs: {
            mediaOptions: 'video', // 'audio', 'video', 
            audioOptions: 'all', //'all', 'onScreen', 'host'
            videoOptions: 'all', //'all', 'mainScreen'
            videoType: "fullDisplay", // 'all', 'bestDisplay', 'fullDisplay'
            videoOptimized: false, // true, false
            recordingDisplayType: 'media', // 'media', 'video', 'all'
            addHLS: false, // true, false
        },
        dispSpecs: {
            nameTags: true, // true, false
            backgroundColor: '#000000', // '#000000', '#ffffff'
            nameTagsColor: '#ffffff', // '#000000', '#ffffff'
            orientationVideo: 'portrait', // 'landscape', 'portrait', 'all'
        }
    }); // User recording parameters


    //more room details - recording
    const canRecord = useRef(false); // True if the user can record
    const startReport = useRef(false); // True if the user has started recording
    const endReport = useRef(false); // True if the user has stopped recording
    const recordTimerInterval = useRef(null); // Interval for the recording timer
    const recordStartTime = useRef(null); // Start time for the recording timer
    const recordElapsedTime = useRef(0); // Elapsed time for the recording timer
    const isTimerRunning = useRef(false); // True if the recording timer is running
    const canPauseResume = useRef(false); // True if the user can pause/resume recording
    const recordChangeSeconds = useRef(15000); // Number of seconds to change the recording timer by
    const pauseLimit = useRef(0); // Number of pauses allowed for recording
    const pauseRecordCount = useRef(0); // Number of pauses for recording
    const canLaunchRecord = useRef(true); // True if the user can launch recording
    const stopLaunchRecord = useRef(false); // True if the user can stop recording

    //-- All Participants -- more room details 
    const participantsAll = useRef([]); // All participants (messages)


    //update Room Details
    const updateMember = (value) => {
        member.current = value;
    }

    const updateYouAreCoHost = (value) => {
        youAreCoHost.current = value;
    }

    const updateYouAreHost = (value) => {
        youAreHost.current = value;
    }

    const updateParticipantsCounter = (value) => {
        participantsCounter.current = value;
    }

    const updateParticipantsFilter = (value) => {
        participantsFilter.current = value;
    }

    const updateParticipants = (value) => {

        participants.current = value;
        filteredParticipants.current = value;
        participantsCounter.current = value.length;
    }

    const onParticipantsFilterChange = (value) => {
        //filter the participants list based on the value

        if (value !== '' && value.length > 0) {
            let filteredParts = participants.current.filter((participant) => {
                return participant.name.toLowerCase().includes(value.toLowerCase());
            });
            filteredParticipants.current = filteredParts
            participantsCounter.current = filteredParts.length;
        } else {
            filteredParticipants.current = participants.current;
            participantsCounter.current = participants.current.length;
        }


    }

    const updateRoomName = (value) => {
        roomName.current = value;
    };

    const updateAdminPasscode = (value) => {
        adminPasscode.current = value;
    }

    const updateIslevel = (value) => {
        islevel.current = value;
    }

    const updateCoHost = (value) => {
        coHost.current = value;
    }

    const updateCoHostResponsibility = (value) => {
        coHostResponsibility.current = value;
    }

    const updateConfirmedToRecord = (value) => {
        confirmedToRecord.current = value;
    }

    const updateMeetingDisplayType = (value) => {
        meetingDisplayType.current = value;
    }

    const updateMeetingVideoOptimized = (value) => {
        meetingVideoOptimized.current = value;
    }

    const updateEventType = (value) => {
        eventType.current = value;
    }

    const updateRecordingAudioPausesLimit = (value) => {
        recordingAudioPausesLimit.current = value;
    };

    const updateRecordingAudioPausesCount = (value) => {
        recordingAudioPausesCount.current = value;
    };

    const updateRecordingAudioSupport = (value) => {
        recordingAudioSupport.current = value;
    };

    const updateRecordingAudioPeopleLimit = (value) => {
        recordingAudioPeopleLimit.current = value;
    };

    const updateRecordingAudioParticipantsTimeLimit = (value) => {
        recordingAudioParticipantsTimeLimit.current = value;
    };

    const updateRecordingVideoPausesCount = (value) => {
        recordingVideoPausesCount.current = value;
    };

    const updateRecordingVideoPausesLimit = (value) => {
        recordingVideoPausesLimit.current = value;
    };

    const updateRecordingVideoSupport = (value) => {
        recordingVideoSupport.current = value;
    };

    const updateRecordingVideoPeopleLimit = (value) => {
        recordingVideoPeopleLimit.current = value;
    };

    const updateRecordingVideoParticipantsTimeLimit = (value) => {
        recordingVideoParticipantsTimeLimit.current = value;
    };

    const updateRecordingAllParticipantsSupport = (value) => {
        recordingAllParticipantsSupport.current = value;
    };

    const updateRecordingVideoParticipantsSupport = (value) => {
        recordingVideoParticipantsSupport.current = value;
    };

    const updateRecordingAllParticipantsFullRoomSupport = (value) => {
        recordingAllParticipantsFullRoomSupport.current = value;
    };

    const updateRecordingVideoParticipantsFullRoomSupport = (value) => {
        recordingVideoParticipantsFullRoomSupport.current = value;
    };

    const updateRecordingPreferredOrientation = (value) => {
        recordingPreferredOrientation.current = value;
    };

    const updateRecordingSupportForOtherOrientation = (value) => {
        recordingSupportForOtherOrientation.current = value;
    };

    const updateRecordingMultiFormatsSupport = (value) => {
        recordingMultiFormatsSupport.current = value;
    };

    const updateUserRecordingParams = (value) => {
        userRecordingParams.current = value;
    };

    const updateCanRecord = (value) => {
        canRecord.current = value;
    };

    const updateStartReport = (value) => {
        startReport.current = value;
    };

    const updateEndReport = (value) => {
        endReport.current = value;
    };

    const updateRecordTimerInterval = (value) => {
        recordTimerInterval.current = value;
    };

    const updateRecordStartTime = (value) => {
        recordStartTime.current = value;
    };

    const updateRecordElapsedTime = (value) => {
        recordElapsedTime.current = value;
    }

    const updateIsTimerRunning = (value) => {
        isTimerRunning.current = value;
    }

    const updateCanPauseResume = (value) => {
        canPauseResume.current = value;
    }

    const updateRecordChangeSeconds = (value) => {
        recordChangeSeconds.current = value;
    }

    const updatePauseLimit = (value) => {
        pauseLimit.current = value;
    }

    const updatePauseRecordCount = (value) => {
        pauseRecordCount.current = value;
    }

    const updateCanLaunchRecord = (value) => {
        canLaunchRecord.current = value;
    }

    const updateStopLaunchRecord = (value) => {
        stopLaunchRecord.current = value;
    }

    const updateParticipantsAll = (value) => {
        participantsAll.current = value;
    }


    const updateConsume_sockets = (value) => {
        consume_sockets.current = value;
    };

    const updateRtpCapabilities = (value) => {
        rtpCapabilities.current = value;
    };

    const updateRoomRecvIPs = (value) => {
        roomRecvIPs.current = value;
    };

    const updateMeetingRoomParams = (value) => {
        meetingRoomParams.current = value;
    };

    const updateItemPageLimit = (value) => {
        itemPageLimit.current = value;
    };

    const updateAudioOnlyRoom = (value) => {
        audioOnlyRoom.current = value;
    };

    const updateAddForBasic = (value) => {
        addForBasic.current = value;
    };

    const updateScreenPageLimit = (value) => {
        screenPageLimit.current = value;
    };

    const updateShareScreenStarted = (value) => {
        shareScreenStarted.current = value;
    };

    const updateShared = (value) => {
        shared.current = value;
    };

    const updateTargetOrientation = (value) => {
        targetOrientation.current = value;
    };

    const updateVidCons = (value) => {
        vidCons.current = value;
    };

    const updateFrameRate = (value) => {
        frameRate.current = value;
    };

    const updateHParams = (value) => {
        hParams.current = value;
    };

    const updateVParams = (value) => {
        vParams.current = value;
    };

    const updateScreenParams = (value) => {
        screenParams.current = value;
    };

    const updateAParams = (value) => {
        aParams.current = value;
    };


    //misc variables
    const firstAll = useRef(false); // True if it is the first time getting all parameters
    const updateMainWindow = useRef(false); // Update main window
    const first_round = useRef(false); // True if it is the first round of screen share
    const landScaped = useRef(false); // True if the screen share is in landscape mode
    const lock_screen = useRef(false); // True if the screen is locked in place for screen share
    const screenId = useRef(null); // Screen share producer ID
    const allVideoStreams = useRef([]); // Array of all video streams
    const newLimitedStreams = useRef([]); // Array of new limited streams
    const newLimitedStreamsIDs = useRef([]); // Array of new limited stream IDs
    const activeSounds = useRef([]); // Array of active sounds
    const screenShareIDStream = useRef(null); // Screen share stream ID
    const screenShareNameStream = useRef(null); // Screen share stream name
    const adminIDStream = useRef(null); // Admin stream ID
    const adminNameStream = useRef(null); // Admin stream name
    const youYouStream = useRef(null); // YouYou (own) stream
    const youYouStreamIDs = useRef([]); // Array of YouYou (own) stream IDs
    const localStream = useRef(null); // Local stream
    const recordStarted = useRef(false); // True if recording has started
    const recordResumed = useRef(false); // True if recording has resumed
    const recordPaused = useRef(false); // True if recording has paused
    const recordStopped = useRef(false); // True if recording has stopped
    const adminRestrictSetting = useRef(false); // Admin's restrict setting
    const videoRequestState = useRef('none'); // Video request state
    const videoRequestTime = useRef(0); // Video request time
    const videoAction = useRef(''); // Video action
    const localStreamVideo = useRef(null); // Local stream video
    const userDefaultVideoInputDevice = useRef(null); // User's default video input device
    const currentFacingMode = useRef('user'); // Current facing mode of the video input device
    const prevFacingMode = useRef('user'); // Previous facing mode of the video input device
    const defVideoID = useRef(null); // Default video ID
    const allowed = useRef(false); // True if the user is allowed to turn on their camera
    const dispActiveNames = useRef([]); // Display active names
    const p_dispActiveNames = useRef([]); // Display active names (previous)
    const activeNames = useRef([]); // Active names
    const prevActiveNames = useRef([]); // Active names (previous)
    const p_activeNames = useRef([]); // Active names (previous)
    const membersReceived = useRef(false); // True if members have been received
    const deferScreenReceived = useRef(false); // True if receiving the screen share has been deferred
    const hostFirstSwitch = useRef(false); // True if the host has switched to the main screen
    const micAction = useRef(false); // True if the user has requested to unmute
    const screenAction = useRef(false); // True if the user has requested to share their screen
    const chatAction = useRef(false); // True if the user has requested to chat
    const audioRequestState = useRef('none'); // Audio request state
    const screenRequestState = useRef('none'); // Screen request state
    const chatRequestState = useRef('none'); // Chat request state
    const audioRequestTime = useRef(0); // Audio request time
    const screenRequestTime = useRef(0); // Screen request time
    const chatRequestTime = useRef(0); // Chat request time
    const updateRequestIntervalSeconds = useRef(240); // Update request interval in seconds
    const oldSoundIds = useRef([]); // Array of old sound IDs
    const HostLabel = useRef('Host'); // Host label
    const mainScreenFilled = useRef(false); // True if the main screen is filled
    const localStreamScreen = useRef(null); // Local stream screen
    const [screenAlreadyOn, setScreenAlreadyOn] = useState(false); // True if the screen is already on
    const [chatAlreadyOn, setChatAlreadyOn] = useState(false); // True if the chat is already on
    const redirectURL = useRef(null); // Redirect URL
    const oldAllStreams = useRef([]); // Array of old all streams
    const adminVidID = useRef(null); // Admin video ID
    const streamNames = useRef([]); // Array of stream names
    const non_alVideoStreams = useRef([]); // Array of non-al video streams
    const sortAudioLoudness = useRef(false); // True if audio loudness is sorted
    const audioDecibels = useRef([]); // Array of audio decibels
    const mixed_alVideoStreams = useRef([]); // Array of mixed al video streams
    const non_alVideoStreams_muted = useRef([]); // Array of non-al video streams muted
    const paginatedStreams = useRef([]); // Array of paginated streams
    const localStreamAudio = useRef(null); // Local stream audio
    const defAudioID = useRef(null); // Default audio ID
    const userDefaultAudioInputDevice = useRef(null); // User's default audio input device
    const userDefaultAudioOutputDevice = useRef(null); // User's default audio output device
    const prevAudioInputDevice = useRef(null); // Previous audio input device
    const prevVideoInputDevice = useRef(null); // Previous video input device
    const audioPaused = useRef(false); // True if audio is paused
    const mainScreenPerson = useRef(null); // Main screen person
    const adminOnMainScreen = useRef(false); // True if the admin is on the main screen
    const screenStates = useRef([{ mainScreenPerson: null, mainScreenProducerId: null, mainScreenFilled: false, adminOnMainScreen: false }]); // Array of screen states
    const prevScreenStates = useRef([{ mainScreenPerson: null, mainScreenProducerId: null, mainScreenFilled: false, adminOnMainScreen: false }]); // Array of previous screen states
    const updateDateState = useRef(null); // Date state for updating the screen states
    const lastUpdate = useRef(null); // Last update time for updating the screen states
    const nForReadjustRecord = useRef(0); // Number of times for readjusting the recording
    const fixedPageLimit = useRef(4); // Fixed page limit for pagination
    const removeAltGrid = useRef(false); // True if the alt grid should be removed
    const nForReadjust = useRef(0); // Number of times for readjusting the recording
    const reOrderInterval = useRef(30000); // Reorder interval
    const fastReOrderInterval = useRef(10000); // Fast reorder interval
    const lastReOrderTime = useRef(0); // Last reorder time
    const audStreamNames = useRef([]); // Array of audio stream names
    const currentUserPage = useRef(0); // Current user page
    const [mainHeightWidth, setMainHeightWidth] = useState(eventType.current == 'webinar' ? 67 : eventType.current == 'broadcast' ? 100 : 0); // Main height and width
    const prevMainHeightWidth = useRef(mainHeightWidth); // Previous main height and width
    const prevDoPaginate = useRef(false); // Previous doPaginate
    const doPaginate = useRef(false); // Do paginate
    const shareEnded = useRef(false); // True if the share has ended
    const lStreams = useRef([]); // Array of limited streams
    const chatRefStreams = useRef([]); // Array of chat ref streams
    const [controlHeight, setControlHeight] = useState((eventType.current == 'webinar' || eventType.current == 'conference') ? 0 : 0.06); // Control height
    const isWideScreen = useRef(false); // True if the screen is wide
    const isMediumScreen = useRef(false); // True if the screen is medium
    const isSmallScreen = useRef(false); // True if the screen is small
    const addGrid = useRef(false); // True if the grid should be added
    const addAltGrid = useRef(false); // True if the alt grid should be added
    const [gridRows, setGridRows] = useState(0); // Grid rows
    const [gridCols, setGridCols] = useState(0); // Grid columns
    const [altGridRows, setAltGridRows] = useState(0); // Alt grid rows
    const [altGridCols, setAltGridCols] = useState(0); // Alt grid columns
    const [numberPages, setNumberPages] = useState(0); // Number of pages
    const currentStreams = useRef([]); // Array of current streams
    const [showMiniView, setShowMiniView] = useState(false); // True if the mini view should be shown
    const nStream = useRef(0); // Number of streams
    const defer_receive = useRef(false); // True if receiving the stream has been deferred
    const allAudioStreams = useRef([]); // Array of all audio streams
    const remoteScreenStream = useRef([]); // Remote screen stream
    const screenProducer = useRef(null); // Screen producer
    const gotAllVids = useRef(false); // True if all videos have been received
    const paginationHeightWidth = useRef(40); // Pagination height/width
    const paginationDirection = useRef('horizontal'); // Pagination direction
    const gridSizes = useRef({ gridWidth: 0, gridHeight: 0, altGridWidth: 0, altGridHeight: 0 }); // Grid sizes
    const screenForceFullDisplay = useRef(false); // True if the screen should be forced to full display
    const mainGridStream = useRef([]); // Main grid stream
    const [otherGridStreams, setOtherGridStreams] = useState([[], []]); // Other grid streams
    const audioOnlyStreams = useRef([]); // Array of audio only streams
    const [videoInputs, setVideoInputs] = useState([]); // Video inputs
    const [audioInputs, setAudioInputs] = useState([]); // Audio inputs
    const [meetingProgressTime, setMeetingProgressTime] = useState('00:00:00'); // Meeting progress time
    const meetingElapsedTime = useRef(0); // Meeting elapsed time

    const ref_participants = useRef([]); // Array of participants

    const updateFirstAll = (value) => {
        firstAll.current = value;
    }

    const updateUpdateMainWindow = (value) => {
        updateMainWindow.current = value;
    }

    const updateFirst_round = (value) => {
        first_round.current = value;
    }

    const updateLandScaped = (value) => {
        landScaped.current = value;
    }

    const updateLock_screen = (value) => {
        lock_screen.current = value;
    }

    const updateScreenId = (value) => {
        screenId.current = value;
    }

    const updateAllVideoStreams = (value) => {
        allVideoStreams.current = value;
    }

    const updateNewLimitedStreams = (value) => {
        newLimitedStreams.current = value;
    }

    const updateNewLimitedStreamsIDs = (value) => {
        newLimitedStreamsIDs.current = value;
    }

    const updateActiveSounds = (value) => {
        activeSounds.current = value;
    }

    const updateScreenShareIDStream = (value) => {
        screenShareIDStream.current = value;
    }

    const updateScreenShareNameStream = (value) => {
        screenShareNameStream.current = value;
    }

    const updateAdminIDStream = (value) => {
        adminIDStream.current = value;
    }

    const updateAdminNameStream = (value) => {
        adminNameStream.current = value;
    }

    const updateYouYouStream = (value) => {
        youYouStream.current = value;
    }

    const updateYouYouStreamIDs = (value) => {
        youYouStreamIDs.current = value;
    }


    const updateLocalStream = (value) => {
        localStream.current = value;
    }

    const updateRecordStarted = (value) => {
        recordStarted.current = value;
    }

    const updateRecordResumed = (value) => {
        recordResumed.current = value;
    }

    const updateRecordPaused = (value) => {
        recordPaused.current = value;
    }

    const updateRecordStopped = (value) => {
        recordStopped.current = value;
    }

    const updateAdminRestrictSetting = (value) => {
        adminRestrictSetting.current = value;
    }

    const updateVideoRequestState = (value) => {
        videoRequestState.current = value;
    }

    const updateVideoRequestTime = (value) => {
        videoRequestTime.current = value;
    }

    const updateVideoAction = (value) => {
        videoAction.current = value;
    }

    const updateLocalStreamVideo = (value) => {
        localStreamVideo.current = value;
    }

    const updateUserDefaultVideoInputDevice = (value) => {
        userDefaultVideoInputDevice.current = value;
    }

    const updateCurrentFacingMode = (value) => {
        currentFacingMode.current = value;
    }

    const updatePrevFacingMode = (value) => {
        prevFacingMode.current = value;
    }

    const updateDefVideoID = (value) => {
        defVideoID.current = value;
    }

    const updateAllowed = (value) => {
        allowed.current = value;
    }

    const updateDispActiveNames = (value) => {
        dispActiveNames.current = value;
    }

    const updateP_dispActiveNames = (value) => {
        p_dispActiveNames.current = value;
    }

    const updateActiveNames = (value) => {
        activeNames.current = value;
    }

    const updatePrevActiveNames = (value) => {
        prevActiveNames.current = value;
    }

    const updateP_activeNames = (value) => {
        p_activeNames.current = value;
    }

    const updateMembersReceived = (value) => {
        membersReceived.current = value;
    }

    const updateDeferScreenReceived = (value) => {
        deferScreenReceived.current = value;
    }

    const updateHostFirstSwitch = (value) => {
        hostFirstSwitch.current = value;
    }

    const updateMicAction = (value) => {
        micAction.current = value;
    }

    const updateScreenAction = (value) => {
        screenAction.current = value;
    }

    const updateChatAction = (value) => {
        chatAction.current = value;
    }

    const updateAudioRequestState = (value) => {
        audioRequestState.current = value;
    }

    const updateScreenRequestState = (value) => {
        screenRequestState.current = value;
    }

    const updateChatRequestState = (value) => {
        chatRequestState.current = value;
    }

    const updateAudioRequestTime = (value) => {
        audioRequestTime.current = value;
    }

    const updateScreenRequestTime = (value) => {
        screenRequestTime.current = value;
    }

    const updateChatRequestTime = (value) => {
        chatRequestTime.current = value;
    }

    const updateOldSoundIds = (value) => {
        oldSoundIds.current = value;
    }

    const updateHostLabel = (value) => {
        HostLabel.current = value;
    }

    const updateMainScreenFilled = (value) => {
        mainScreenFilled.current = value;
    }

    const updateLocalStreamScreen = (value) => {
        localStreamScreen.current = value;
    }

    const updateScreenAlreadyOn = (value) => {
        setScreenAlreadyOn(value);
    }

    const updateChatAlreadyOn = (value) => {
        setChatAlreadyOn(value);
    }

    const updateRedirectURL = (value) => {
        redirectURL.current = value;
    }

    const updateOldAllStreams = (value) => {
        oldAllStreams.current = value;
    }

    const updateAdminVidID = (value) => {
        adminVidID.current = value;
    }

    const updateStreamNames = (value) => {
        streamNames.current = value;
    }

    const updateNon_alVideoStreams = (value) => {
        non_alVideoStreams.current = value;
    }

    const updateSortAudioLoudness = (value) => {
        sortAudioLoudness.current = value;
    }

    const updateAudioDecibels = (value) => {
        audioDecibels.current = value;
    }

    const updateMixed_alVideoStreams = (value) => {
        mixed_alVideoStreams.current = value;
    }

    const updateNon_alVideoStreams_muted = (value) => {
        non_alVideoStreams_muted.current = value;
    }

    const updatePaginatedStreams = (value) => {
        paginatedStreams.current = value;
    }

    const updateLocalStreamAudio = (value) => {
        localStreamAudio.current = value;
    }

    const updateDefAudioID = (value) => {
        defAudioID.current = value;
    }

    const updateUserDefaultAudioInputDevice = (value) => {
        userDefaultAudioInputDevice.current = value;
    }

    const updateUserDefaultAudioOutputDevice = (value) => {
        userDefaultAudioOutputDevice.current = value;
    }

    const updatePrevAudioInputDevice = (value) => {
        prevAudioInputDevice.current = value;
    }

    const updatePrevVideoInputDevice = (value) => {
        prevVideoInputDevice.current = value;
    }

    const updateAudioPaused = (value) => {
        audioPaused.current = value;
    }

    const updateMainScreenPerson = (value) => {
        mainScreenPerson.current = value;
    }

    const updateAdminOnMainScreen = (value) => {
        adminOnMainScreen.current = value;
    }

    const updateScreenStates = (value) => {
        screenStates.current = value;
    }

    const updatePrevScreenStates = (value) => {
        prevScreenStates.current = value;
    }

    const updateUpdateDateState = (value) => {
        updateDateState.current = value;
    }

    const updateLastUpdate = (value) => {
        lastUpdate.current = value;
    }

    const updateNForReadjustRecord = (value) => {
        nForReadjustRecord.current = value;
    }

    const updateFixedPageLimit = (value) => {
        fixedPageLimit.current = value;
    }

    const updateRemoveAltGrid = (value) => {
        removeAltGrid.current = value;
    }

    const updateNForReadjust = (value) => {
        nForReadjust.current = value;
    }

    const updateLastReOrderTime = (value) => {
        lastReOrderTime.current = value;
    }

    const updateAudStreamNames = (value) => {
        audStreamNames.current = value;
    }

    const updateCurrentUserPage = (value) => {
        currentUserPage.current = value;
    }

    const updateMainHeightWidth = (value) => {
        setMainHeightWidth(value);
    }

    const updatePrevMainHeightWidth = (value) => {
        prevMainHeightWidth.current = value;
    }

    const updatePrevDoPaginate = (value) => {
        prevDoPaginate.current = value;
    }

    const updateDoPaginate = (value) => {
        doPaginate.current = value;
    }

    const updateShareEnded = (value) => {
        shareEnded.current = value;
    }

    const updateLStreams = (value) => {
        lStreams.current = value;
    }

    const updateChatRefStreams = (value) => {
        chatRefStreams.current = value;
    }

    const updateControlHeight = (value) => {
        setControlHeight(value);
    }

    const updateIsWideScreen = (value) => {
        isWideScreen.current = value;
    }

    const updateIsMediumScreen = (value) => {
        isMediumScreen.current = value;
    }

    const updateIsSmallScreen = (value) => {
        isSmallScreen.current = value;
    }

    const updateAddGrid = (value) => {
        addGrid.current = value;
    }

    const updateAddAltGrid = (value) => {
        addAltGrid.current = value;
    }

    const updateGridRows = (value) => {
        setGridRows(value);
    }

    const updateGridCols = (value) => {
        setGridCols(value);
    }

    const updateAltGridRows = (value) => {
        setAltGridRows(value);
    }

    const updateAltGridCols = (value) => {
        setAltGridCols(value);
    }

    const updateNumberPages = (value) => {
        setNumberPages(value);
    }

    const updateCurrentStreams = (value) => {
        currentStreams.current = value;
    }

    const updateShowMiniView = (value) => {
        setShowMiniView(value);
    }

    const updateNStream = (value) => {
        nStream.current = value;
    }

    const updateDefer_receive = (value) => {
        defer_receive.current = value;
    }

    const updateAllAudioStreams = (value) => {
        allAudioStreams.current = value;
    }

    const updateRemoteScreenStream = (value) => {
        remoteScreenStream.current = value;
    }

    const updateScreenProducer = (value) => {
        screenProducer.current = value;
    }

    const updateGotAllVids = (value) => {
        gotAllVids.current = value;
    }

    const updatePaginationHeightWidth = (value) => {
        paginationHeightWidth.current = value;
    }

    const updatePaginationDirection = (value) => {
        paginationDirection.current = value;
    }

    const updateGridSizes = (value) => {
        gridSizes.current = value;
    }

    const updateScreenForceFullDisplay = (value) => {
        screenForceFullDisplay.current = value;
    }

    const updateMainGridStream = (value) => {
        mainGridStream.current = value;
    }

    const updateOtherGridStreams = (value) => {
        setOtherGridStreams(value);
    }

    const updateAudioOnlyStreams = (value) => {
        audioOnlyStreams.current = value;
    }

    const updateVideoInputs = (value) => {
        setVideoInputs(value);
    }

    const updateAudioInputs = (value) => {
        setAudioInputs(value);
    }

    const updateMeetingProgressTime = (value) => {
        setMeetingProgressTime(value);
    }

    const updateMeetingElapsedTime = (value) => {
        meetingElapsedTime.current = value;
    }

    const updateRef_participants = (value) => {
        ref_participants.current = value;
    }


    //messages
    const messages = useRef(useSeed && seedData?.messages ? seedData?.messages : []); // Messages
    const startDirectMessage = useRef(false); // Start direct message
    const directMessageDetails = useRef({}); // Direct message details
    const [showMessagesBadge, setShowMessagesBadge] = useState(false); // True if the messages badge should be shown


    const updateMessages = (value) => {
        messages.current = value;
    }

    const updateStartDirectMessage = (value) => {
        startDirectMessage.current = value;
    }

    const updateDirectMessageDetails = (value) => {
        directMessageDetails.current = value;
    }

    const updateShowMessagesBadge = (value) => {
        setShowMessagesBadge(value);
    }

    //event settings related variables
    const audioSetting = useRef('allow'); // User's audio setting
    const videoSetting = useRef('allow'); // User's video setting
    const screenshareSetting = useRef('allow'); // User's screenshare setting
    const chatSetting = useRef('allow'); // User's chat setting

    // Update functions
    const updateAudioSetting = (value) => {
        audioSetting.current = value;
    };

    const updateVideoSetting = (value) => {
        videoSetting.current = value;
    };

    const updateScreenshareSetting = (value) => {
        screenshareSetting.current = value;
    };

    const updateChatSetting = (value) => {
        chatSetting.current = value;
    };


    //display settings related variables
    const displayOption = useRef(meetingDisplayType.current ? meetingDisplayType.current : 'media'); // Display option
    const autoWave = useRef(true); // Auto wave setting
    const forceFullDisplay = useRef((eventType.current == 'webinar' || eventType.current == 'conference') ? false : true); // Force full display setting

    const prevForceFullDisplay = useRef(false); // Previous force full display setting
    const prevMeetingDisplayType = useRef('video'); // Previous meeting display type

    // Update functions
    const updateDisplayOption = (value) => {
        displayOption.current = value;
    };

    const updateAutoWave = (value) => {
        autoWave.current = value;
    };

    const updateForceFullDisplay = (value) => {
        forceFullDisplay.current = value;
    };

    const updatePrevForceFullDisplay = (value) => {
        prevForceFullDisplay.current = value;
    };

    const updatePrevMeetingDisplayType = (value) => {
        prevMeetingDisplayType.current = value;
    };


    //waiting room
    const waitingRoomFilter = useRef(''); // Filter for the waiting room

    const waitingRoomList = useRef(useSeed && seedData?.waitingList ? seedData?.waitingList : []); // Waiting room list

    const waitingRoomCounter = useRef(0); // Waiting room counter

    const filteredWaitingRoomList = useRef(waitingRoomList.current); // Filtered waiting room list

    const updateWaitingRoomCounter = (value) => {
        waitingRoomCounter.current = value;
    }

    const updateWaitingRoomFilter = (value) => {
        waitingRoomFilter.current = value;
    }

    const updateWaitingRoomList = (value) => {
        waitingRoomList.current = value;
        filteredWaitingRoomList.current = value;
        waitingRoomCounter.current = value.length;
    }

    const onWaitingRoomFilterChange = (value) => {
        //filter the waiting room list based on the value
        if (value !== '' && value.length > 0) {
            let filteredWaitingRoom = waitingRoomList.current.filter((waitingRoom) => {
                return waitingRoom.name.toLowerCase().includes(value.toLowerCase());
            }
            );
            filteredWaitingRoomList.current = filteredWaitingRoom;
            waitingRoomCounter.current = filteredWaitingRoom.length;
        } else {
            filteredWaitingRoomList.current = waitingRoomList.current;
            waitingRoomCounter.current = waitingRoomList.current.length;
        }
    }

    const onWaitingRoomClose = () => {
        updateIsWaitingModalVisible(false);
    }

    //Requests
    const requestFilter = useRef(''); // Filter for the requests
    const requestList = useRef(useSeed && seedData?.requests ? seedData?.requests : []); // Request list

    const requestCounter = useRef(0); // Request counter
    const filteredRequestList = useRef(requestList.current); // Filtered request list


    const updateRequestCounter = (value) => {
        requestCounter.current = value;
    }

    const updateRequestFilter = (value) => {
        requestFilter.current = value;
    }

    const updateRequestList = (value) => {
        requestList.current = value;
        filteredRequestList.current = value;
        requestCounter.current = value.length;
    }


    const onRequestFilterChange = (value) => {
        //filter the request list based on the value
        if (value !== '' && value.length > 0) {
            let filteredRequest = requestList.current.filter((request) => {
                return request.name.toLowerCase().includes(value.toLowerCase());
            }
            );
            filteredRequestList.current = filteredRequest;
            requestCounter.current = filteredRequest.length;
        } else {
            filteredRequestList.current = requestList.current;
            requestCounter.current = requestList.current.length;
        }
    }

    const onRequestClose = () => {
        updateIsRequestsModalVisible(false);
    }

    //total requests and waiting room
    const totalReqWait = useRef(0); // Total requests and waiting room

    const updateTotalReqWait = (value) => {
        totalReqWait.current = value;
    }

    //showAlert modal
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');
    const [alertDuration, setAlertDuration] = useState(3000);


    //Progress Timer
    const [progressTimerVisible, setProgressTimerVisible] = useState(true);
    const [progressTimerValue, setProgressTimerValue] = useState(0);

    //Menu modals
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [isRequestsModalVisible, setIsRequestsModalVisible] = useState(false);
    const [isWaitingModalVisible, setIsWaitingModalVisible] = useState(false);
    const [isCoHostModalVisible, setIsCoHostModalVisible] = useState(false);
    const [isMediaSettingsModalVisible, setIsMediaSettingsModalVisible] = useState(false);
    const [isDisplaySettingsModalVisible, setIsDisplaySettingsModalVisible] = useState(false);


    const updateIsMenuModalVisible = (value) => {
        setIsMenuModalVisible(value);
    }

    const updateIsRecordingModalVisible = (value) => {
        setIsRecordingModalVisible(value);
        if (value == true) {
            updateConfirmedToRecord(false);
        } else {
            if (clearedToRecord.current == true && clearedToResume.current == true && recordStarted.current == true) {
                updateShowRecordButtons(true);
            }
        }
    }

    const updateIsSettingsModalVisible = (value) => {
        setIsSettingsModalVisible(value);
    }

    const updateIsRequestsModalVisible = (value) => {
        setIsRequestsModalVisible(value);
    }

    const updateIsWaitingModalVisible = (value) => {
        setIsWaitingModalVisible(value);
    }

    const updateIsCoHostModalVisible = (value) => {
        setIsCoHostModalVisible(value);
    }

    const updateIsMediaSettingsModalVisible = (value) => {
        setIsMediaSettingsModalVisible(value);
    }

    const updateIsDisplaySettingsModalVisible = (value) => {
        setIsDisplaySettingsModalVisible(value);
    }

    //Other Modals
    const [isParticipantsModalVisible, setIsParticipantsModalVisible] = useState(false);
    const [isMessagesModalVisible, setIsMessagesModalVisible] = useState(false);
    const [isConfirmExitModalVisible, setIsConfirmExitModalVisible] = useState(false);
    const [isConfirmHereModalVisible, setIsConfirmHereModalVisible] = useState(false);
    const [isShareEventModalVisible, setIsShareEventModalVisible] = useState(false);

    const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);

    const updateIsParticipantsModalVisible = (value) => {
        setIsParticipantsModalVisible(value);
    }

    const updateIsMessagesModalVisible = (value) => {
        setIsMessagesModalVisible(value);
        if (value == false) {
            updateShowMessagesBadge(false);
        }
    }

    const updateIsConfirmExitModalVisible = (value) => {
        setIsConfirmExitModalVisible(value);
    }

    const updateIsConfirmHereModalVisible = (value) => {
        setIsConfirmHereModalVisible(value);
    }

    const updateIsLoadingModalVisible = (value) => {
        setIsLoadingModalVisible(value);
    }

    const updateIsShareEventModalVisible = (value) => {
        setIsShareEventModalVisible(value);
    }

    //recording related variables 
    const recordingMediaOptions = useRef('video'); // Media type for recording
    const recordingAudioOptions = useRef('all'); // Audio options for recording
    const recordingVideoOptions = useRef('all'); // Video options for recording
    const recordingVideoType = useRef('fullDisplay'); // Type of video for recording
    const recordingVideoOptimized = useRef(false); // Whether video recording is optimized
    const recordingDisplayType = useRef('media'); // Type of recording display, media, video,all
    const recordingAddHLS = useRef(true); // Whether to add HLS for recording
    const recordingNameTags = useRef(true); // Whether to include name tags in recording
    const [recordingBackgroundColor, setRecordingBackgroundColor] = useState('#83c0e9'); // Background color for recording
    const [recordingNameTagsColor, setRecordingNameTagsColor] = useState('#ffffff'); // Name tag color for recording
    const recordingAddText = useRef(false); // Whether to add text to recording
    const recordingCustomText = useRef('Add Text'); // Custom text for recording
    const recordingCustomTextPosition = useRef('top'); // Custom text position for recording
    const [recordingCustomTextColor, setRecordingCustomTextColor] = useState('#ffffff'); // Custom text color for recording
    const recordingOrientationVideo = useRef('landscape'); // Orientation for video recording
    const clearedToResume = useRef(true); // True if cleared to resume recording
    const clearedToRecord = useRef(true); // True if cleared to record
    const [recordState, setRecordState] = useState('green') // no recording, green, red, yellow
    const [showRecordButtons, setShowRecordButtons] = useState(false) // show record buttons
    const [recordingProgressTime, setRecordingProgressTime] = useState('00:00:00') // recording progress time
    const [audioSwitching, setAudioSwitching] = useState(false); // True if audio is switching
    const [videoSwitching, setVideoSwitching] = useState(false); // True if video is switching

    // Update Options
    const updateRecordingMediaOptions = (value) => {
        recordingMediaOptions.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingAudioOptions = (value) => {
        recordingAudioOptions.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingVideoOptions = (value) => {
        recordingVideoOptions.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingVideoType = (value) => {
        recordingVideoType.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingVideoOptimized = (value) => {
        recordingVideoOptimized.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingDisplayType = (value) => {
        recordingDisplayType.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingAddHLS = (value) => {
        recordingAddHLS.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingAddText = (value) => {
        recordingAddText.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingCustomText = (value) => {
        recordingCustomText.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingCustomTextPosition = (value) => {
        recordingCustomTextPosition.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingCustomTextColor = (value) => {
        setRecordingCustomTextColor(value);
        clearedToRecord.current = false;
    };

    const updateRecordingNameTags = (value) => {
        recordingNameTags.current = value;
        clearedToRecord.current = false;
    };

    const updateRecordingBackgroundColor = (value) => {
        setRecordingBackgroundColor(value);
        clearedToRecord.current = false;
    };

    const updateRecordingNameTagsColor = (value) => {
        setRecordingNameTagsColor(value);
        clearedToRecord.current = false;
    };

    const updateRecordingOrientationVideo = (value) => {
        recordingOrientationVideo.current = value;
        clearedToRecord.current = false;
    };

    const updateClearedToResume = (value) => {
        clearedToResume.current = value;
    };

    const updateClearedToRecord = (value) => {
        clearedToRecord.current = value;
    };

    const updateRecordState = (value) => {
        setRecordState(value);
    }

    const updateShowRecordButtons = (value) => {
        setShowRecordButtons(value);
    }

    const updateRecordingProgressTime = (value) => {
        setRecordingProgressTime(value);
    }

    const updateAudioSwitching = (value) => {
        setAudioSwitching(value);
    }

    const updateVideoSwitching = (value) => {
        setVideoSwitching(value);
    }

    //media related variables  
    const videoAlreadyOn = useRef(false);
    const audioAlreadyOn = useRef(false);

    const componentSizes = useRef({
        // Component sizes, main (main) and other (mini or minor) components (grids)
        mainHeight: 0,
        otherHeight: 0,
        mainWidth: 0,
        otherWidth: 0,
    });

    const updateVideoAlreadyOn = (value) => {
        videoAlreadyOn.current = value;
        setVideoActive(value);
    }

    const updateAudioAlreadyOn = (value) => {
        audioAlreadyOn.current = value;
        setMicActive(value);
    }

    const updateComponentSizes = (sizes) => {
        componentSizes.current = sizes;
    };

    //permissions related variables
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasAudioPermission, setHasAudioPermission] = useState(false);

    const updateHasCameraPermission = (value) => {
        setHasCameraPermission(value);
    }

    const updateHasAudioPermission = (value) => {
        setHasAudioPermission(value);
    }

    const requestPermissionCamera = async () => {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();

        if (cameraStatus === 'granted') {
            setHasCameraPermission(true);
        }

        return cameraStatus;
    }

    const requestPermissionAudio = async () => {
        // Request audio permissions
        const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
        //Audio.requestPermissionsAsync();

        if (audioStatus === 'granted') {
            setHasAudioPermission(true);
        }

        return audioStatus;
    }

    //transports related variables
    const transportCreated = useRef(false); // True if the transport has been created
    const transportCreatedVideo = useRef(false); // True if the transport has been created for video
    const transportCreatedAudio = useRef(false); // True if the transport has been created for audio
    const transportCreatedScreen = useRef(false); // True if the transport has been created for screen share
    const producerTransport = useRef(null); // Producer transport
    const videoProducer = useRef(null); // Video producer
    const params = useRef(null); // Parameters for the producer transport
    const videoParams = useRef(null); // Parameters for the video producer
    const audioParams = useRef(null); // Parameters for the audio producer
    const audioProducer = useRef(null); // Audio producer
    const consumerTransports = useRef([]); // Consumer transports
    const consumingTransports = useRef([]); // Consuming transports


    const updateTransportCreated = (value) => {
        transportCreated.current = value;
    }

    const updateTransportCreatedVideo = (value) => {
        transportCreatedVideo.current = value;
    }

    const updateTransportCreatedAudio = (value) => {
        transportCreatedAudio.current = value;
    }

    const updateTransportCreatedScreen = (value) => {
        transportCreatedScreen.current = value;
    }

    const updateProducerTransport = (value) => {
        producerTransport.current = value;
    }

    const updateVideoProducer = (value) => {
        videoProducer.current = value;
    }

    const updateParams = (value) => {
        params.current = value;
    }

    const updateVideoParams = (value) => {
        videoParams.current = value;
    }

    const updateAudioParams = (value) => {
        audioParams.current = value;
    }

    const updateAudioProducer = (value) => {
        audioProducer.current = value;
    }

    const updateConsumerTransports = (value) => {
        consumerTransports.current = value;
    }

    const updateConsumingTransports = (value) => {
        consumingTransports.current = value;
    }

    function checkOrientation() {
        // Check the device orientation using react-native-orientation-locker
        const isPortrait = Orientation?.getInitialOrientation() === 'PORTRAIT';

        return isPortrait ? 'portrait' : 'landscape';
    }

    const getUpdatedAllParams = () => {
        // Get all the params for the room as well as the update functions for them and Media SFU functions and return them

        return {
            ...getAllParams(),
            ...mediaSFUFunctions(),
        }
    }

    const mediaSFUFunctions = () => {
        // Media SFU functions

        return {
            updateMiniCardsGrid,
            mixStreams,
            dispStreams,
            stopShareScreen,
            checkScreenShare,
            startShareScreen,
            requestScreenShare,
            reorderStreams,
            prepopulateUserMedia,
            getVideos,
            rePort,
            trigger,
            consumerResume,
            connectSendTransport,
            connectSendTransportAudio,
            connectSendTransportVideo,
            connectSendTransportScreen,
            processConsumerTransports,
            resumePauseStreams,
            readjust,
            checkGrid,
            GetEstimate,
            calculateRowsAndColumns,
            addVideosGrid,
            onScreenChanges,
            sleep,
            changeVids,
            compareActiveNames,
            compareScreenStates,
            createSendTransport,
            resumeSendTransportAudio,
            receiveAllPipedTransports,
            disconnectSendTransportVideo,
            disconnectSendTransportAudio,
            disconnectSendTransportScreen,
            getPipedProducersAlt,
            signalNewConsumerTransport,
            connectRecvTransport,
            reUpdateInter,
            updateParticipantAudioDecibels,
            closeAndResize,
            autoAdjust,
            switchUserVideoAlt,
            switchUserVideo,
            switchUserAudio,
            getDomains,
            formatNumber,
            connectIps,
            createDeviceClient,

        }
    }

    const getAllParams = () => {

        //get all the params for the room as well as the update functions for them and return them

        return {

            localUIMode : localUIMode.current, // Local UI Development mode

            //Room Details
            roomName: roomName.current,
            member: member.current,
            adminPasscode: adminPasscode.current,
            youAreCoHost: youAreCoHost.current,
            youAreHost: youAreHost.current,
            islevel: islevel.current,
            confirmedToRecord: confirmedToRecord.current,
            meetingDisplayType: meetingDisplayType.current,
            meetingVideoOptimized: meetingVideoOptimized.current,
            eventType: eventType.current,
            participants: participants.current,
            filteredParticipants: filteredParticipants.current,
            participantsCounter: participantsCounter.current,
            participantsFilter: participantsFilter.current,

            //more room details - media
            consume_sockets: consume_sockets.current,
            rtpCapabilities: rtpCapabilities.current,
            roomRecvIPs: roomRecvIPs.current,
            meetingRoomParams: meetingRoomParams.current,
            itemPageLimit: itemPageLimit.current,
            audioOnlyRoom: audioOnlyRoom.current,
            addForBasic: addForBasic.current,
            screenPageLimit: screenPageLimit.current,
            shareScreenStarted: shareScreenStarted.current,
            shared: shared.current,
            targetOrientation: targetOrientation.current,
            vidCons: vidCons.current,
            frameRate: frameRate.current,
            hParams: hParams.current,
            vParams: vParams.current,
            screenParams: screenParams.current,
            aParams: aParams.current,

            //more room details - recording
            recordingAudioPausesLimit: recordingAudioPausesLimit.current,
            recordingAudioPausesCount: recordingAudioPausesCount.current,
            recordingAudioSupport: recordingAudioSupport.current,
            recordingAudioPeopleLimit: recordingAudioPeopleLimit.current,
            recordingAudioParticipantsTimeLimit: recordingAudioParticipantsTimeLimit.current,
            recordingVideoPausesCount: recordingVideoPausesCount.current,
            recordingVideoPausesLimit: recordingVideoPausesLimit.current,
            recordingVideoSupport: recordingVideoSupport.current,
            recordingVideoPeopleLimit: recordingVideoPeopleLimit.current,
            recordingVideoParticipantsTimeLimit: recordingVideoParticipantsTimeLimit.current,
            recordingAllParticipantsSupport: recordingAllParticipantsSupport.current,
            recordingVideoParticipantsSupport: recordingVideoParticipantsSupport.current,
            recordingAllParticipantsFullRoomSupport: recordingAllParticipantsFullRoomSupport.current,
            recordingVideoParticipantsFullRoomSupport: recordingVideoParticipantsFullRoomSupport.current,
            recordingPreferredOrientation: recordingPreferredOrientation.current,
            recordingSupportForOtherOrientation: recordingSupportForOtherOrientation.current,
            recordingMultiFormatsSupport: recordingMultiFormatsSupport.current,

            userRecordingParams: userRecordingParams.current,
            canRecord: canRecord.current,
            startReport: startReport.current,
            endReport: endReport.current,
            recordStartTime: recordStartTime.current,
            recordElapsedTime: recordElapsedTime.current,
            isTimerRunning: isTimerRunning.current,
            canPauseResume: canPauseResume.current,
            recordChangeSeconds: recordChangeSeconds.current,
            pauseLimit: pauseLimit.current,
            pauseRecordCount: pauseRecordCount.current,
            canLaunchRecord: canLaunchRecord.current,
            stopLaunchRecord: stopLaunchRecord.current,

            participantsAll: participantsAll.current,

            firstAll: firstAll.current,
            updateMainWindow: updateMainWindow.current,
            first_round: first_round.current,
            landScaped: landScaped.current,
            lock_screen: lock_screen.current,
            screenId: screenId.current,
            allVideoStreams: allVideoStreams.current,
            newLimitedStreams: newLimitedStreams.current,
            newLimitedStreamsIDs: newLimitedStreamsIDs.current,
            activeSounds: activeSounds.current,
            screenShareIDStream: screenShareIDStream.current,
            screenShareNameStream: screenShareNameStream.current,
            adminIDStream: adminIDStream.current,
            adminNameStream: adminNameStream.current,
            youYouStream: youYouStream.current,
            youYouStreamIDs: youYouStreamIDs.current,
            localStream: localStream.current,
            recordStarted: recordStarted.current,
            recordResumed: recordResumed.current,
            recordPaused: recordPaused.current,
            recordStopped: recordStopped.current,
            adminRestrictSetting: adminRestrictSetting.current,
            videoRequestState: videoRequestState.current,
            videoRequestTime: videoRequestTime.current,
            videoAction: videoAction.current,
            localStreamVideo: localStreamVideo.current,
            userDefaultVideoInputDevice: userDefaultVideoInputDevice.current,
            currentFacingMode: currentFacingMode.current,
            prevFacingMode: prevFacingMode.current,
            defVideoID: defVideoID.current,
            allowed: allowed.current,
            dispActiveNames: dispActiveNames.current,
            p_dispActiveNames: p_dispActiveNames.current,
            activeNames: activeNames.current,
            prevActiveNames: prevActiveNames.current,
            p_activeNames: p_activeNames.current,
            membersReceived: membersReceived.current,
            deferScreenReceived: deferScreenReceived.current,
            hostFirstSwitch: hostFirstSwitch.current,
            micAction: micAction.current,
            screenAction: screenAction.current,
            chatAction: chatAction.current,
            audioRequestState: audioRequestState.current,
            screenRequestState: screenRequestState.current,
            chatRequestState: chatRequestState.current,
            audioRequestTime: audioRequestTime.current,
            screenRequestTime: screenRequestTime.current,
            chatRequestTime: chatRequestTime.current,
            updateRequestIntervalSeconds: updateRequestIntervalSeconds.current,
            oldSoundIds: oldSoundIds.current,
            HostLabel: HostLabel.current,
            mainScreenFilled: mainScreenFilled.current,
            localStreamScreen: localStreamScreen.current,
            screenAlreadyOn: screenAlreadyOn,
            chatAlreadyOn: chatAlreadyOn,
            redirectURL: redirectURL.current,
            oldAllStreams: oldAllStreams.current,
            adminVidID: adminVidID.current,
            streamNames: streamNames.current,
            non_alVideoStreams: non_alVideoStreams.current,
            sortAudioLoudness: sortAudioLoudness.current,
            audioDecibels: audioDecibels.current,
            mixed_alVideoStreams: mixed_alVideoStreams.current,
            non_alVideoStreams_muted: non_alVideoStreams_muted.current,
            paginatedStreams: paginatedStreams.current,
            localStreamAudio: localStreamAudio.current,
            defAudioID: defAudioID.current,
            userDefaultAudioInputDevice: userDefaultAudioInputDevice.current,
            userDefaultAudioOutputDevice: userDefaultAudioOutputDevice.current,
            prevAudioInputDevice: prevAudioInputDevice.current,
            prevVideoInputDevice: prevVideoInputDevice.current,
            audioPaused: audioPaused.current,
            mainScreenPerson: mainScreenPerson.current,
            adminOnMainScreen: adminOnMainScreen.current,
            screenStates: screenStates.current,
            prevScreenStates: prevScreenStates.current,
            updateDateState: updateDateState.current,
            lastUpdate: lastUpdate.current,
            nForReadjustRecord: nForReadjustRecord.current,
            fixedPageLimit: fixedPageLimit.current,
            removeAltGrid: removeAltGrid.current,
            nForReadjust: nForReadjust.current,
            lastReOrderTime: lastReOrderTime.current,
            reOrderInterval: reOrderInterval.current,
            fastReOrderInterval: fastReOrderInterval.current,
            audStreamNames: audStreamNames.current,
            currentUserPage: currentUserPage.current,
            mainHeightWidth: mainHeightWidth,
            prevMainHeightWidth: prevMainHeightWidth.current,
            prevDoPaginate: prevDoPaginate.current,
            doPaginate: doPaginate.current,
            shareEnded: shareEnded.current,
            lStreams: lStreams.current,
            chatRefStreams: chatRefStreams.current,
            controlHeight: controlHeight,
            isWideScreen: isWideScreen.current,
            isMediumScreen: isMediumScreen.current,
            isSmallScreen: isSmallScreen.current,
            addGrid: addGrid.current,
            addAltGrid: addAltGrid.current,
            gridRows: gridRows,
            gridCols: gridCols,
            altGridRows: altGridRows,
            altGridCols: altGridCols,
            numberPages: numberPages,
            currentStreams: currentStreams,
            showMiniView: showMiniView,
            nStream: nStream.current,
            defer_receive: defer_receive.current,
            allAudioStreams: allAudioStreams.current,
            screenProducer: screenProducer.current,
            remoteScreenStream: remoteScreenStream.current,
            gotAllVids: gotAllVids.current,
            paginationHeightWidth: paginationHeightWidth.current,
            paginationDirection: paginationDirection.current,
            gridSizes: gridSizes.current,
            screenForceFullDisplay: screenForceFullDisplay.current,
            mainGridStream: mainGridStream.current,
            otherGridStreams: otherGridStreams,
            audioOnlyStreams: audioOnlyStreams.current,
            videoInputs: videoInputs,
            audioInputs: audioInputs,
            meetingProgressTime: meetingProgressTime,
            meetingElapsedTime: meetingElapsedTime.current,

            ref_participants: ref_participants.current,

            messages: messages.current,
            startDirectMessage: startDirectMessage.current,
            directMessageDetails: directMessageDetails.current,
            coHost: coHost.current,
            coHostResponsibility: coHostResponsibility.current,

            //event settings
            audioSetting: audioSetting.current,
            videoSetting: videoSetting.current,
            screenshareSetting: screenshareSetting.current,
            chatSetting: chatSetting.current,

            //display settings
            meetingDisplayType: meetingDisplayType.current,
            autoWave: autoWave.current,
            forceFullDisplay: forceFullDisplay.current,
            prevForceFullDisplay: prevForceFullDisplay.current,
            prevMeetingDisplayType: prevMeetingDisplayType.current,

            //waiting room
            waitingRoomFilter: waitingRoomFilter.current,
            waitingRoomList: waitingRoomList.current,
            waitingRoomCounter: waitingRoomCounter.current,
            filteredWaitingRoomList: filteredWaitingRoomList.current,


            //Requests
            requestFilter: requestFilter.current,
            requestList: requestList.current,
            requestCounter: requestCounter.current,
            filteredRequestList: filteredRequestList.current,

            //total requests and waiting room
            totalReqWait: totalReqWait.current,


            //alerts
            alertVisible: alertVisible,
            alertMessage: alertMessage,
            alertType: alertType,
            alertDuration: alertDuration,


            //Progress Timer
            progressTimerVisible: progressTimerVisible,
            progressTimerValue: progressTimerValue,


            //Menu modals
            isMenuModalVisible: isMenuModalVisible,
            isRecordingModalVisible: isRecordingModalVisible,
            isSettingsModalVisible: isSettingsModalVisible,
            isRequestsModalVisible: isRequestsModalVisible,
            isWaitingModalVisible: isWaitingModalVisible,
            isCoHostModalVisible: isCoHostModalVisible,
            isMediaSettingsModalVisible: isMediaSettingsModalVisible,
            isDisplaySettingsModalVisible: isDisplaySettingsModalVisible,


            //Other Modals
            isParticipantsModalVisible: isParticipantsModalVisible,
            isMessagesModalVisible: isMessagesModalVisible,
            isConfirmExitModalVisible: isConfirmExitModalVisible,
            isConfirmHereModalVisible: isConfirmHereModalVisible,
            isLoadingModalVisible: isLoadingModalVisible,

            //recording Options
            recordingMediaOptions: recordingMediaOptions.current,
            recordingAudioOptions: recordingAudioOptions.current,
            recordingVideoOptions: recordingVideoOptions.current,
            recordingVideoType: recordingVideoType.current,
            recordingVideoOptimized: recordingVideoOptimized.current,
            recordingDisplayType: recordingDisplayType.current,
            recordingAddHLS: recordingAddHLS.current,
            recordingAddText: recordingAddText.current,
            recordingCustomText: recordingCustomText.current,
            recordingCustomTextPosition: recordingCustomTextPosition.current,
            recordingCustomTextColor: recordingCustomTextColor,
            recordingNameTags: recordingNameTags.current,
            recordingBackgroundColor: recordingBackgroundColor,
            recordingNameTagsColor: recordingNameTagsColor,
            recordingOrientationVideo: recordingOrientationVideo.current,
            clearedToResume: clearedToResume.current,
            clearedToRecord: clearedToRecord.current,
            recordState: recordState,
            showRecordButtons: showRecordButtons,
            recordingProgressTime: recordingProgressTime,
            audioSwitching: audioSwitching,
            videoSwitching: videoSwitching,

            //media states
            videoAlreadyOn: videoAlreadyOn.current,
            audioAlreadyOn: audioAlreadyOn.current,
            componentSizes: componentSizes.current,

            //permissions
            hasCameraPermission: hasCameraPermission,
            hasAudioPermission: hasAudioPermission,

            //transports
            transportCreated: transportCreated.current,
            transportCreatedVideo: transportCreatedVideo.current,
            transportCreatedAudio: transportCreatedAudio.current,
            transportCreatedScreen: transportCreatedScreen.current,
            producerTransport: producerTransport.current,
            videoProducer: videoProducer.current,
            params: params.current,
            videoParams: videoParams.current,
            audioParams: audioParams.current,
            audioProducer: audioProducer.current,
            consumerTransports: consumerTransports.current,
            consumingTransports: consumingTransports.current,

            componentSizes: componentSizes.current,

            validated: validated,


            device: device.current,
            socket: socket.current,


            //update functions
            //Room Details
            updateRoomName,
            updateMember,
            updateAdminPasscode,
            updateYouAreCoHost,
            updateYouAreHost,
            updateIslevel,
            updateCoHost,
            updateCoHostResponsibility,
            updateConfirmedToRecord,
            updateMeetingDisplayType,
            updateMeetingVideoOptimized,
            updateEventType,
            updateParticipants,
            updateParticipantsCounter,
            updateParticipantsFilter,

            //more room details - media
            updateConsume_sockets,
            updateRtpCapabilities,
            updateRoomRecvIPs,
            updateMeetingRoomParams,
            updateItemPageLimit,
            updateAudioOnlyRoom,
            updateAddForBasic,
            updateScreenPageLimit,
            updateShareScreenStarted,
            updateShared,
            updateTargetOrientation,
            updateVidCons,
            updateFrameRate,
            updateHParams,
            updateVParams,
            updateScreenParams,
            updateAParams,

            //more room details - recording
            updateRecordingAudioPausesLimit,
            updateRecordingAudioPausesCount,
            updateRecordingAudioSupport,
            updateRecordingAudioPeopleLimit,
            updateRecordingAudioParticipantsTimeLimit,
            updateRecordingVideoPausesCount,
            updateRecordingVideoPausesLimit,
            updateRecordingVideoSupport,
            updateRecordingVideoPeopleLimit,
            updateRecordingVideoParticipantsTimeLimit,
            updateRecordingAllParticipantsSupport,
            updateRecordingVideoParticipantsSupport,
            updateRecordingAllParticipantsFullRoomSupport,
            updateRecordingVideoParticipantsFullRoomSupport,
            updateRecordingPreferredOrientation,
            updateRecordingSupportForOtherOrientation,
            updateRecordingMultiFormatsSupport,

            updateUserRecordingParams,
            updateCanRecord,
            updateStartReport,
            updateEndReport,
            updateRecordTimerInterval,
            updateRecordStartTime,
            updateRecordElapsedTime,
            updateIsTimerRunning,
            updateCanPauseResume,
            updateRecordChangeSeconds,
            updatePauseLimit,
            updatePauseRecordCount,
            updateCanLaunchRecord,
            updateStopLaunchRecord,

            updateParticipantsAll,

            updateFirstAll,
            updateUpdateMainWindow,
            updateFirst_round,
            updateLandScaped,
            updateLock_screen,
            updateScreenId,
            updateAllVideoStreams,
            updateNewLimitedStreams,
            updateNewLimitedStreamsIDs,
            updateActiveSounds,
            updateScreenShareIDStream,
            updateScreenShareNameStream,
            updateAdminIDStream,
            updateAdminNameStream,
            updateYouYouStream,
            updateYouYouStreamIDs,
            updateLocalStream,
            updateRecordStarted,
            updateRecordResumed,
            updateRecordPaused,
            updateRecordStopped,
            updateAdminRestrictSetting,
            updateVideoRequestState,
            updateVideoRequestTime,
            updateVideoAction,
            updateLocalStreamVideo,
            updateUserDefaultVideoInputDevice,
            updateCurrentFacingMode,
            updateRef_participants,
            updateDefVideoID,
            updateAllowed,
            updateDispActiveNames,
            updateP_dispActiveNames,
            updateActiveNames,
            updatePrevActiveNames,
            updateP_activeNames,
            updateMembersReceived,
            updateDeferScreenReceived,
            updateHostFirstSwitch,
            updateMicAction,
            updateScreenAction,
            updateChatAction,
            updateAudioRequestState,
            updateScreenRequestState,
            updateChatRequestState,
            updateAudioRequestTime,
            updateScreenRequestTime,
            updateChatRequestTime,
            updateOldSoundIds,
            updateHostLabel,
            updateMainScreenFilled,
            updateLocalStreamScreen,
            updateScreenAlreadyOn,
            updateChatAlreadyOn,
            updateRedirectURL,
            updateOldAllStreams,
            updateAdminVidID,
            updateStreamNames,
            updateNon_alVideoStreams,
            updateSortAudioLoudness,
            updateAudioDecibels,
            updateMixed_alVideoStreams,
            updateNon_alVideoStreams_muted,
            updatePaginatedStreams,
            updateLocalStreamAudio,
            updateDefAudioID,
            updateUserDefaultAudioInputDevice,
            updateUserDefaultAudioOutputDevice,
            updatePrevAudioInputDevice,
            updatePrevVideoInputDevice,
            updateAudioPaused,
            updateMainScreenPerson,
            updateAdminOnMainScreen,
            updateScreenStates,
            updatePrevScreenStates,
            updateUpdateDateState,
            updateLastUpdate,
            updateNForReadjustRecord,
            updateFixedPageLimit,
            updateRemoveAltGrid,
            updateNForReadjust,
            updateLastReOrderTime,
            updateAudStreamNames,
            updateCurrentUserPage,
            updatePrevFacingMode,
            updateMainHeightWidth,
            updatePrevMainHeightWidth,
            updatePrevDoPaginate,
            updateDoPaginate,
            updateShareEnded,
            updateLStreams,
            updateChatRefStreams,
            updateControlHeight,
            updateIsWideScreen,
            updateIsMediumScreen,
            updateIsSmallScreen,
            updateAddGrid,
            updateAddAltGrid,
            updateGridRows,
            updateGridCols,
            updateAltGridRows,
            updateAltGridCols,
            updateNumberPages,
            updateCurrentStreams,
            updateShowMiniView,
            updateNStream,
            updateDefer_receive,
            updateAllAudioStreams,
            updateRemoteScreenStream,
            updateScreenProducer,
            updateGotAllVids,
            updatePaginationHeightWidth,
            updatePaginationDirection,
            updateGridSizes,
            updateScreenForceFullDisplay,
            updateMainGridStream,
            updateOtherGridStreams,
            updateAudioOnlyStreams,
            updateVideoInputs,
            updateAudioInputs,
            updateMeetingProgressTime,
            updateMeetingElapsedTime,

            updateMessages,
            updateStartDirectMessage,
            updateDirectMessageDetails,
            updateShowMessagesBadge,


            //event settings
            updateAudioSetting,
            updateVideoSetting,
            updateScreenshareSetting,
            updateChatSetting,

            //display settings
            updateDisplayOption,
            updateAutoWave,
            updateForceFullDisplay,
            updatePrevForceFullDisplay,
            updatePrevMeetingDisplayType,

            //waiting room
            updateWaitingRoomFilter,
            updateWaitingRoomList,
            updateWaitingRoomCounter,

            //Requests
            updateRequestFilter,
            updateRequestList,
            updateRequestCounter,

            //total requests and waiting room
            updateTotalReqWait,

            //showAlert modal
            updateIsMenuModalVisible,
            updateIsRecordingModalVisible,
            updateIsSettingsModalVisible,
            updateIsRequestsModalVisible,
            updateIsWaitingModalVisible,
            updateIsCoHostModalVisible,
            updateIsMediaSettingsModalVisible,
            updateIsDisplaySettingsModalVisible,


            //Other Modals
            updateIsParticipantsModalVisible,
            updateIsMessagesModalVisible,
            updateIsConfirmExitModalVisible,
            updateIsConfirmHereModalVisible,
            updateIsLoadingModalVisible,

            //recording Options
            updateRecordingMediaOptions,
            updateRecordingAudioOptions,
            updateRecordingVideoOptions,
            updateRecordingVideoType,
            updateRecordingVideoOptimized,
            updateRecordingDisplayType,
            updateRecordingAddHLS,
            updateRecordingAddText,
            updateRecordingCustomText,
            updateRecordingCustomTextPosition,
            updateRecordingCustomTextColor,
            updateRecordingNameTags,
            updateRecordingBackgroundColor,
            updateRecordingNameTagsColor,
            updateRecordingOrientationVideo,
            updateClearedToResume,
            updateClearedToRecord,
            updateRecordState,
            updateShowRecordButtons,
            updateRecordingProgressTime,
            updateAudioSwitching,
            updateVideoSwitching,


            //media states
            updateVideoAlreadyOn,
            updateAudioAlreadyOn,
            updateComponentSizes,

            //permissions
            updateHasCameraPermission,
            updateHasAudioPermission,

            //transports
            updateTransportCreated,
            updateTransportCreatedVideo,
            updateTransportCreatedAudio,
            updateTransportCreatedScreen,
            updateProducerTransport,
            updateVideoProducer,
            updateParams,
            updateVideoParams,
            updateAudioParams,
            updateAudioProducer,
            updateConsumerTransports,
            updateConsumingTransports,

            checkOrientation,

            updateDevice,
            updateSocket,
            updateValidated,

            showAlert,
            getUpdatedAllParams,
        }

    }

    const showAlert = ({ message, type, duration }) => {
        // Show an alert message, type is 'danger', 'success', duration is in milliseconds 
        setAlertMessage(message);
        setAlertType(type);
        setAlertDuration(duration);
        setAlertVisible(true);
    };

    //state variables for the control buttons
    const [micActive, setMicActive] = useState(audioAlreadyOn.current ? audioAlreadyOn.current : false); // True if the mic is active
    const [videoActive, setVideoActive] = useState(videoAlreadyOn.current ? videoAlreadyOn.current : false); // True if the video is active
    const [screenShareActive, setScreenShareActive] = useState(true); // True if the screen share is active
    const [endCallActive, setEndCallActive] = useState(false); // True if the end call button is active
    const [participantsActive, setParticipantsActive] = useState(false); // True if the participants button is active
    const [menuActive, setMenuActive] = useState(false); // True if the menu button is active
    const [commentsActive, setCommentsActive] = useState(false); // True if the comments button is active


    const recordButton = [
        //recording button (to launch recording modal)
        //Replace or remove any of the buttons as you wish
        {
            icon: 'record-vinyl',
            text: 'Record',
            onPress: () => {
                // Action for the Record button
                launchRecording({
                    parameters: {
                        ...getAllParams(),

                    }
                });
            },
            activeColor: 'black',
            inActiveColor: 'black',
            show: true,
        }
    ]


    const recordButtons = [
        //recording state control and recording timer buttons
        //Replace or remove any of the buttons as you wish

        //Refer to ControlButtonsAltComponent.js for more details on how to add custom buttons

        {
            // name: 'Pause',
            icon: 'play-circle',
            active: recordPaused.current == false,
            onPress: () => { updateRecording({ parameters: { ...getAllParams(), ...mediaSFUFunctions() } }); },
            activeColor: 'black',
            inActiveColor: 'black',
            alternateIcon: 'pause-circle',
            show: true,
        },
        {
            // name: 'Stop',
            icon: 'stop-circle',
            active: false,
            onPress: () => { stopRecording({ parameters: { ...getAllParams(), ...mediaSFUFunctions() } }); },
            activeColor: 'green',
            inActiveColor: 'black',
            show: true,
        },
        {
            // name: 'Timer',
            customComponent: (
                <View style={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0, margin: 2 }}>
                    <Text style={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0, margin: 0 }}>
                        {recordingProgressTime}
                    </Text>
                </View>
            ),
            show: true,
        },
        {
            // name: 'Status',
            icon: 'dot-circle',
            active: false,
            onPress: () => console.log('Status pressed'),
            activeColor: 'black',
            inActiveColor: recordPaused.current == false ? 'red' : 'yellow',
            show: true,
        },
        {
            // name: 'Settings',
            icon: 'cog',
            active: false,
            onPress: () => {
                launchRecording({
                    parameters: {
                        ...getAllParams(),

                    }
                });
            },
            activeColor: 'green',
            inActiveColor: 'black',
            show: true,
        },
    ];


    const customMenuButtons = [
        //buttons for the custom menu modal (as used for webinars and conferences)
        //Replace or remove any of the buttons as you wish

        //Refer to customButtons.js for more details on how to add custom buttons


        {
            icon: 'record-vinyl',
            text: 'Record',
            action: () => {
                // Action for the Record button
                launchRecording({
                    parameters: {
                        ...getAllParams(),

                    }
                });
            },
            show: !showRecordButtons && islevel.current == '2',
        },
        {
            customComponent: <ControlButtonsAltComponent buttons={recordButtons} direction={'horizontal'} showAspect={true} />,
            show: showRecordButtons && islevel.current == '2',
            action: () => { console.log('record buttons pressed') },
        },
        {
            icon: 'cog', // Use any Font Awesome 5 icon here
            text: 'Event Settings',
            modalId: 'settingsModal', // Use this to open a modal
            action: () => {
                // Action for the Event Settings button
                launchSettings({
                    parameters: {
                        updateIsSettingsModalVisible: updateIsSettingsModalVisible,
                        IsSettingsModalVisible: isSettingsModalVisible
                    }
                });
            },
            show: islevel.current == '2',

        },
        {
            icon: 'users',
            text: 'Requests',
            modalId: 'requestsModal',
            action: () => {
                // Action for the Requests button
                launchRequests({
                    parameters: {
                        updateIsRequestsModalVisible: updateIsRequestsModalVisible,
                        IsRequestsModalVisible: isRequestsModalVisible
                    }
                });
            },
            show: islevel.current == '2' || (coHostResponsibility.current && coHost.current && coHost.current == member.current && coHostResponsibility.current.find(item => item.name === 'media').value == true),
        },
        {
            icon: 'clock',
            text: 'Waiting',
            modalId: 'waitingRoomModal',
            action: () => {
                // Action for the Waiting button
                launchWaiting({
                    parameters: {
                        updateIsWaitingModalVisible: updateIsWaitingModalVisible,
                        IsWaitingModalVisible: isWaitingModalVisible
                    }
                });
            },
            show: islevel.current == '2' || (coHostResponsibility.current && coHost.current && coHost.current == member.current && coHostResponsibility.current.find(item => item.name === 'waiting').value == true),
        },
        {
            icon: 'user-plus',
            text: 'Co-host',
            modalId: 'cohostModal',
            action: () => {
                // Action for the Co-host button
                launchCoHost({
                    parameters: {
                        updateIsCoHostModalVisible: updateIsCoHostModalVisible,
                        IsCoHostModalVisible: isCoHostModalVisible
                    }
                });
            },
            show: islevel.current == '2',
        },
        {
            icon: 'tools',
            text: 'Set Media',
            modalId: 'mediaSettingsModal',
            action: () => {
                // Action for the Set Media button
                launchMediaSettings({
                    parameters: {
                        ...getAllParams(),
                        ...mediaSFUFunctions(),
                        mediaDevices,
                        device: device.current,
                        socket: socket.current,
                        showAlert,
                        checkPermission,
                        streamSuccessVideo,
                        hasCameraPermission,
                        requestPermissionCamera,
                        checkMediaPermission: Platform.OS != 'web',
                        streamSuccessAudioSwitch,
                        hasAudioPermission,
                        requestPermissionAudio,
                        streamSuccessAudio,
                    }
                });
            },
            show: true,
        },
        {
            icon: 'desktop',
            text: 'Display',
            modalId: 'displaySettingsModal',
            action: () => {
                // Action for the Display button
                launchDisplaySettings({
                    parameters: {
                        updateIsDisplaySettingsModalVisible: updateIsDisplaySettingsModalVisible,
                        IsDisplaySettingsModalVisible: isDisplaySettingsModalVisible,
                    }
                });
            },
            show: true,
        },
    ]

    const controlButtons = [
        // control buttons for webinar and conference events
        //Replace or remove any of the buttons as you wish

        //Refer to ControlButtonsComponent.js for more details on how to add custom buttons

        {
            // name: 'Microphone',
            icon: 'microphone-slash',
            alternateIcon: 'microphone',
            active: micActive,
            onPress: () => clickAudio({
                parameters: {
                    ...getAllParams(),
                    ...mediaSFUFunctions(),
                    //others
                    MediaStream,
                    MediaStreamTrack,
                    mediaDevices,
                    device: device.current,
                    socket: socket.current,
                    showAlert,
                    checkPermission,
                    streamSuccessAudio,
                    hasAudioPermission,
                    requestPermissionAudio,
                    checkMediaPermission: Platform.OS != 'web'
                }
            }),
            activeColor: 'green',
            inActiveColor: 'red',
            disabled: audioSwitching,
        },

        {
            // name: 'Video',
            icon: 'video-slash',
            alternateIcon: 'video',
            active: videoActive,
            onPress: () => clickVideo({
                parameters: {
                    ...getAllParams(),
                    ...mediaSFUFunctions(),
                    //others
                    MediaStream,
                    MediaStreamTrack,
                    mediaDevices,
                    device: device.current,
                    socket: socket.current,
                    showAlert,
                    checkPermission,
                    streamSuccessVideo,
                    hasCameraPermission,
                    requestPermissionCamera,
                    checkMediaPermission: Platform.OS != 'web'
                }

            }),
            activeColor: 'green',
            inActiveColor: 'red',
            disabled: videoSwitching,
        },
        {
            // name: 'Screen Share',
            icon: 'desktop',
            alternateIconComponent: <MaterialIcons name="desktop-access-disabled" size={24} color="red" />,
            active: screenShareActive,
            onPress: () => {
                clickScreenShare({
                    parameters: {
                        ...getAllParams(),
                        ...mediaSFUFunctions(),
                        MediaStream,
                        MediaStreamTrack,
                        mediaDevices,
                        device: device.current,
                        streamSuccessScreen,
                        onWeb: Platform.OS == 'web',
                        checkPermission,

                    }
                });
            },
            activeColor: 'green',
            inActiveColor: 'red',
            disabled: false,
        },
        {
            // name: 'End Call',
            icon: 'phone',
            active: endCallActive,
            onPress: () => launchConfirmExit({ updateIsConfirmExitModalVisible: updateIsConfirmExitModalVisible, IsConfirmExitModalVisible: isConfirmExitModalVisible }),
            activeColor: 'green',
            inActiveColor: 'red',
            disabled: false,
        },
        {
            // name: 'Participants',
            icon: 'users',
            active: participantsActive,
            onPress: () => launchParticipants({ updateIsParticipantsModalVisible: updateIsParticipantsModalVisible, IsParticipantsModalVisible: isParticipantsModalVisible }),
            activeColor: 'black',
            inActiveColor: 'black',
            disabled: false,
        },
        {
            customComponent: <View style={{ position: 'relative' }}>
                <FontAwesome5 name="bars" size={24} color="black" />
                <View
                    style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'red',
                            borderRadius: 12,
                            paddingHorizontal: 4,
                            paddingVertical: 4,
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                            {totalReqWait.current}
                        </Text>
                    </View>
                </View>
            </View>,
            onPress: () => launchMenuModal({ updateIsMenuModalVisible: updateIsMenuModalVisible, IsMenuModalVisible: isMenuModalVisible }),
        },
        {
            customComponent: <View style={{ position: 'relative' }}>
                {/* Your icon */}
                <FontAwesome5 name="comments" size={24} color="black" />
                {/* Conditionally render a badge */}
                {showMessagesBadge && (
                    <View
                        style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'red',
                                borderRadius: 12,
                                paddingHorizontal: 4,
                                paddingVertical: 2,
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>

                            </Text>
                        </View>
                    </View>
                )}
            </View>,

            onPress: () => launchMessages({ updateIsMessagesModalVisible: updateIsMessagesModalVisible, IsMessagesModalVisible: isMessagesModalVisible }),

        },
    ];


    useEffect(() => {
        //listen to changes in recording state and update the recording status indicator accordingly
        //red - recording, yellow - paused, green - stopped (not recording)
        if (recordStarted && !recordStopped) {
            if (!recordPaused) {
                setRecordState('red');
            } else {
                setRecordState('yellow');
            }
        } else {
            setRecordState('green');
        }
    }, [recordStarted, recordPaused, recordStopped]);


    useEffect(() => {
        //listen to changes in dimensions and update the height of control buttons accordingly
        // only affects webinar and conference event types as they have fixed control buttons

        //default height might be too small for some devices that are on landscape mode
        ///the reverse is also true for some devices on portrait mode

        ScreenOrientation.addOrientationChangeListener((e) => {
            if ((e.orientationInfo.orientation == 4 || e.orientationInfo.orientation == 3) && (eventType.current == 'webinar' || eventType.current == 'conference')) {
                const minValue = Math.min(componentSizes.current.otherHeight + componentSizes.current.mainHeight, componentSizes.current.otherWidth + componentSizes.current.mainWidth);
                setControlHeight(0.12);

            } else {
                setControlHeight(0.06);
            }
        })
    }, [])

    const computeDimensionsMethod = ({
        containerWidthFraction = 1,
        containerHeightFraction = 1,
        mainSize,
        doStack = true,
        defaultFraction,
    }) => {


        const marginTop = Platform.OS === 'ios' ? 0 : Constants.statusBarHeight
        const parentWidth = Dimensions.get('window').width * containerWidthFraction;
        const parentHeight = (Dimensions.get('window').height * containerHeightFraction * defaultFraction) //- marginTop;

        const isWideScreen = parentWidth > 768;

        const computeDimensions = () => {
            if (doStack) {
                return isWideScreen
                    ? {
                        mainHeight: parentHeight,
                        otherHeight: parentHeight,
                        mainWidth: (mainSize / 100) * parentWidth,
                        otherWidth: ((100 - mainSize) / 100) * parentWidth,
                        height: parentHeight,
                        width: parentWidth,
                    }
                    : {
                        mainHeight: (mainSize / 100) * parentHeight,
                        otherHeight: ((100 - mainSize) / 100) * parentHeight,
                        mainWidth: parentWidth,
                        otherWidth: parentWidth,
                        height: parentHeight,
                        width: parentWidth,
                    };
            } else {
                return {
                    mainHeight: parentHeight,
                    otherHeight: parentHeight,
                    mainWidth: parentWidth,
                    otherWidth: parentWidth,
                    height: parentHeight,
                    width: parentWidth,
                };
            }
        };

        return computeDimensions();
    };

    useEffect(() => {
        //set control buttons for event types. Webinar and conference have different and fixed control buttons. 
        //Broadcast and chat have unfixed (floating) control buttons so they need no screen height adjustment
        setMainHeightWidth(eventType.current == 'webinar' ? 67 : eventType.current == 'broadcast' ? 100 : 0)
        setControlHeight((eventType.current == 'webinar' || eventType.current == 'conference') ? 0.06 : 0)

    }, []);


    useEffect(() => {
        //listen to changes in dimensions and update the grids accordingly

        const handleResize = async () => {
            const { mainHeight, otherHeight, mainWidth, otherWidth } = computeDimensionsMethod({
                containerWidthFraction: 1,
                containerHeightFraction: 1,
                mainSize: mainHeightWidth,
                doStack: true,
                defaultFraction: (eventType.current == 'webinar' || eventType.current == 'conference') ? 1 - controlHeight : 1,
            });


            // Use the computed dimensions as needed
            updateComponentSizes({ mainHeight, otherHeight, mainWidth, otherWidth });

            const orientation = await checkOrientation();
            if (orientation === 'portrait') {
                if (!isWideScreen.current) {
                    if (shareScreenStarted.current || shared.current) {
                        updateScreenForceFullDisplay(true);
                    }
                }
            }

            //updates the mini grid view
            await onScreenChanges({ changed: true, parameters: { ...getAllParams(), ...mediaSFUFunctions() } });
            //updates the main grid view
            await prepopulateUserMedia({ name: HostLabel.current, parameters: { ...getAllParams(), ...mediaSFUFunctions() } });
        };

        const onResize = async () => {
            await handleResize();
        };

        // Add event listener for dimension changes (window resize)
        Dimensions.addEventListener('change', onResize);

        // Clean up the event listener when the component unmounts
        return () => {
            Dimensions.removeEventListener('change', onResize);
        };
    }, []);


    useEffect(() => {
        //listen to changes in dimensions and update the main video size accordingly

        if (!lock_screen && !shared) {
            prepopulateUserMedia({ name: HostLabel.current, parameters: { ...getAllParams(), ...mediaSFUFunctions() } })
        } else {
            if (!first_round) {
                prepopulateUserMedia({ name: HostLabel.current, parameters: { ...getAllParams(), ...mediaSFUFunctions() } })
            }
        }

    }, [mainHeightWidth]);


    async function join_Room({ socket, roomName, islevel, member, sec, apiUserName }) {
        //join room and get data from server

        let data = await joinRoom({ socket, roomName, islevel, member, sec, apiUserName });


        if (data && data.success) {
            //update roomData
            roomData.current = data;

            //update room parameters
            try {

                try {
                    await updateRoomParametersClient({
                        parameters: {
                            ...getAllParams(),
                            ...mediaSFUFunctions(),
                            data: data,

                        }
                    })
                } catch (error) {

                }

                if (data.isHost) {
                    updateIslevel('2')
                } else {
                    updateIslevel('1')
                }

                if (data.secureCode && data.secureCode != '') {
                    updateAdminPasscode(data.secureCode)
                }

                if (data.rtpCapabilities) {

                    try {
                        let device_ = await createDeviceClient({
                            rtpCapabilities: data.rtpCapabilities, mediasoupClient
                        });

                        if (device_) {
                            updateDevice(device_)
                        }

                    } catch (error) {
                        console.log('error Device', error);
                    }
                }

            } catch (error) {
                console.log('error updateRoomParametersClient', error);
            }

        } else {

            //might be a wrong room name or room is full or other error; check reason in data object if available
            updateValidated(false);
            try {

                if (showAlert) {
                    showAlert({ message: data.reason, type: 'danger', duration: 3000 });
                }
            } catch (error) {

            }
        }

    }

    async function disconnectAllSockets(consume_sockets) {
        //function to disconnect all sockets consuming media (consume_sockets)

        for (const socket of consume_sockets) {

            try {
                const ip = Object.keys(socket)[0];

                // Assuming each socket has a disconnect method
                await socket[ip].disconnect(true);
            } catch (error) {
                console.error(`Error disconnecting socket with IP: ${Object.keys(socket)[0]}`, error);
            }
        }
    }

    async function closeAndReset() {
        //close and clean up all sockets, modals,... and reset all states to initial values

        await updateIsMessagesModalVisible(false);
        await updateIsParticipantsModalVisible(false);
        await updateIsWaitingModalVisible(false);
        await updateIsRequestsModalVisible(false);
        await updateIsCoHostModalVisible(false);
        await updateIsSettingsModalVisible(false);
        await updateIsDisplaySettingsModalVisible(false);
        await updateIsMediaSettingsModalVisible(false);
        await updateIsMenuModalVisible(false);
        await updateIsShareEventModalVisible(false);
        await updateIsConfirmExitModalVisible(false);
        await disconnectAllSockets(consume_sockets.current)
        await updateStatesToInitialValues();
        await updateMeetingProgressTime('00:00:00');
        await updateMeetingElapsedTime(0);
        await updateRecordingProgressTime('00:00:00');
        await updateRecordElapsedTime(0);
        await updateShowRecordButtons(false);

        setTimeout(async function () {
            updateValidated(false);
        }, 500);
    }


    async function connect_Socket(apiUserName, apiKey, apiToken, link) {
        //connect socket and attach events listeners to socket
        //Refer to https://www.mediasfu.com/documentation for full documentation of each event and its parameters as well uasage

        if (socket.current.id) {

            socket.current.on('disconnect', async () => {

                await disconnect({ parameters: { showAlert, redirectURL:redirectURL.current, onWeb: Platform.OS == 'web', updateValidated } });
                if (videoAlreadyOn.current) {
                    await clickVideo({ parameters: { ...getAllParams(), ...mediaSFUFunctions(), MediaStream, MediaStreamTrack, mediaDevices, device: device.current, socket: socket.current, showAlert, checkPermission, streamSuccessVideo, hasCameraPermission, requestPermissionCamera, checkMediaPermission: Platform.OS != 'web' } })
                }
                if (audioAlreadyOn.current) {
                    await clickAudio({ parameters: { ...getAllParams(), ...mediaSFUFunctions(), MediaStream, MediaStreamTrack, mediaDevices, device: device.current, socket: socket.current, showAlert, checkPermission, streamSuccessAudio, hasAudioPermission, requestPermissionAudio, checkMediaPermission: Platform.OS != 'web' } })
                }

                await closeAndReset()
            });

            socket.current.on('allMembers', async (membersData) => {

                if (membersData) {
                    await allMembers({
                        apiUserName: apiUserName,
                        apiKey: null, //not recommended - use apiToken instead. Use for testing/development only
                        apiToken: apiToken,
                        members: membersData.members,
                        requestss: membersData.requests ? membersData.requests : membersData.requestss ? membersData.requestss : requestList.current, //attend
                        coHoste: membersData.coHost ? membersData.coHost : membersData.coHoste ? membersData.coHoste : coHost.current, //attend
                        coHostRes: membersData.coHostResponsibilities ? membersData.coHostResponsibilities : membersData.coHostRes ? membersData.coHostRes : coHostResponsibility.current, //attend
                        parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                        consume_sockets: consume_sockets.current
                    });
                }

            })

            socket.current.on('allMembersRest', async (membersData) => {

                if (membersData) {
                    await allMembersRest({
                        apiUserName: apiUserName,
                        apiKey: null, //not recommended - use apiToken instead. Use for testing/development only
                        members: membersData.members,
                        apiToken: apiToken,
                        settings: membersData.settings,
                        coHoste: membersData.coHost ? membersData.coHost : membersData.coHoste ? membersData.coHoste : coHost.current, //attend
                        coHostRes: membersData.coHostResponsibilities ? membersData.coHostResponsibilities : membersData.coHostRes ? membersData.coHostRes : coHostResponsibility.current,//attend
                        parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                        consume_sockets: consume_sockets.current
                    });
                }

            })

            socket.current.on('userWaiting', async ({ name }) => {
                await userWaiting({

                    name,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            })

            socket.current.on('personJoined', async ({ name }) => {
                await personJoined({
                    name,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('allWaitingRoomMembers', async (waiting_data) => {

                await allWaitingRoomMembers({
                    waitingParticipants: waiting_data.waitingParticipants ? waiting_data.waitingParticipants : waiting_data.waitingParticipantss ? waiting_data.waitingParticipantss : waitingRoomList.current, //attend
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('roomRecordParams', async ({ recordParams }) => {
                await roomRecordParams({
                    recordParams,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('ban', async ({ name }) => {
                await banParticipant({
                    name,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('updatedCoHost', async (cohost_data) => {
                // let { coHost, coHostResponsibilities } = cohost_data;
                await updatedCoHost({
                    coHost: cohost_data.coHost ? cohost_data.coHost : cohost_data.coHoste ? cohost_data.coHoste : coHost.current, //attend
                    coHostResponsibility: cohost_data.coHostResponsibilities ? cohost_data.coHostResponsibilities : cohost_data.coHostRes ? cohost_data.coHostRes : coHostResponsibility.current,//attend
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            })

            socket.current.on('participantRequested', async ({ userRequest }) => {
                await participantRequested({
                    userRequest,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('screenProducerId', async ({ producerId }) => {
                await screenProducerId({
                    producerId,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('updateMediaSettings', async ({ settings }) => {
                await updateMediaSettings({
                    settings,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('producer-media-paused', async ({ producerId, kind, name }) => {
                await producerMediaPaused({
                    producerId,
                    kind,
                    name,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('producer-media-resumed', async ({ kind, name }) => {
                await producerMediaResumed({
                    kind,
                    name,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('producer-media-closed', async ({ producerId, kind }) => {
                if (producerId && kind) {
                    await producerMediaClosed({
                        producerId,
                        kind,
                        parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                    });
                }
            });


            socket.current.on('controlMediaHost', async ({ type }) => {
                await controlMediaHost({
                    type,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                });

            });

            socket.current.on('meetingEnded', async function () {

                await meetingEnded({
                    parameters: {
                        showAlert,
                        redirectURL: redirectURL.current,
                        onWeb: Platform.OS == 'web',
                        eventType: eventType.current,
                        updateValidated,
                    }
                });

                if (videoAlreadyOn.current) {
                    await clickVideo({ parameters: { ...getAllParams(), ...mediaSFUFunctions(), MediaStream, MediaStreamTrack, mediaDevices, device: device.current, socket: socket.current, showAlert, checkPermission, streamSuccessVideo, hasCameraPermission, requestPermissionCamera, checkMediaPermission: Platform.OS != 'web' } })
                }
                if (audioAlreadyOn.current) {
                    await clickAudio({ parameters: { ...getAllParams(), ...mediaSFUFunctions(), MediaStream, MediaStreamTrack, mediaDevices, device: device.current, socket: socket.current, showAlert, checkPermission, streamSuccessAudio, hasAudioPermission, requestPermissionAudio, checkMediaPermission: Platform.OS != 'web' } })
                }

                await closeAndReset()

            });

            socket.current.on('disconnectUserSelf', async function () {
                await disconnectUserSelf({
                    parameters: {
                        socket: socket.current,
                        member: member.current,
                        roomName: roomName.current,
                    }
                });
            });

            socket.current.on('receiveMessage', async ({ message }) => {
                await receiveMessage({
                    message,
                    parameters: { ...getAllParams(), ...mediaSFUFunctions() },
                    messages: messages.current,
                });

            });

            socket.current.on('meetingTimeRemaining', async ({ timeRemaining }) => {
                await meetingTimeRemaining({
                    timeRemaining,
                    parameters: { eventType: eventType.current, showAlert },
                });

            });

            socket.current.on('meetingStillThere', async ({ timeRemaining }) => {
                await meetingStillThere({
                    timeRemaining,
                    parameters: { updateIsConfirmHereModalVisible, isConfirmHereModalVisible }
                });

            })

            socket.current.on('startRecords', async () => {
                await startRecords({
                    parameters: {
                        roomName: roomName.current,
                        member: member.current,
                        socket: socket.current,
                    }
                });

            });

            socket.current.on('reInitiateRecording', async () => {
                await reInitiateRecording({
                    parameters: {
                        roomName: roomName.current,
                        member: member.current,
                        socket: socket.current,
                        adminRestrictSetting: adminRestrictSetting.current,
                    }
                });

            });

            socket.current.on('updateConsumingDomains', async ({ domains, alt_domains }) => {

                await updateConsumingDomains({
                    domains,
                    alt_domains,
                    apiUserName,
                    apiKey: null, //not recommended - use apiToken instead. Use for testing/development only
                    apiToken,
                    parameters: {
                        ...getAllParams(),
                        ...mediaSFUFunctions(),
                        apiUserName,
                        apiKey: null, //not recommended - use apiToken instead. Use for testing/development only
                        apiToken,
                    }
                });

            });

            socket.current.on('RecordingNotice', async ({ state, userRecordingParam, pauseCount, timeDone }) => {
                await RecordingNotice({
                    state,
                    userRecordingParam,
                    pauseCount,
                    timeDone,
                    parameters: {
                        ...getAllParams(),
                        ...mediaSFUFunctions(),

                    }
                });

            });

            socket.current.on('timeLeftRecording', async ({ timeLeft }) => {
                await timeLeftRecording({
                    timeLeft,
                    parameters: {
                        showAlert

                    }
                });

            });

            socket.current.on('stoppedRecording', async ({ state, reason }) => {
                await stoppedRecording({
                    state,
                    reason,
                    parameters: {
                        showAlert

                    }
                });
            });

            socket.current.on('hostRequestResponse', ({ requestResponse }) => {
                hostRequestResponse({
                    requestResponse,
                    parameters: {
                        ...getAllParams(),
                        ...mediaSFUFunctions(),

                    }
                });
            });


            await join_Room({
                socket: socket.current,
                roomName: roomName.current,
                islevel: islevel.current,
                member: member.current,
                sec: apiToken,
                apiUserName: apiUserName,
            });


            await receiveRoomMessages({
                socket: socket.current,
                parameters: {
                    roomName: roomName.current,
                    messages: messages.current,
                    updateMessages,
                }
            });

            await prepopulateUserMedia({ name: HostLabel.current, parameters: { ...getAllParams(), ...mediaSFUFunctions() } });

        }

        return socket.current;
    }


    useEffect(() => {

        //update allVideoStreams
        updateAllVideoStreams([
            { producerId: 'youyou', stream: null, id: 'youyou', name: 'youyou' }]);

        //update StreamNames 
        updateStreamNames([{
            id: 'youyou', name: 'youyou'
        }])


        //if socket is connected, join the room
        const connectAndaAddSocketMethods = async () => {
            socket.current = await connect_Socket(apiUserName.current, "", apiToken.current, link.current);
        }


        if (validated) {

            updateIsLoadingModalVisible(true);

            try {

                if (localUIMode.current === false) {
                    connectAndaAddSocketMethods();
                }
            } catch (error) {
                console.log('error connectAndaAddSocketMethods', error);
            }

            startMeetingProgressTimer({ startTime: Date.now() / 1000, parameters: { ...getAllParams(), ...mediaSFUFunctions() } });

            updateIsLoadingModalVisible(false);
        }


    }, [validated]);



    return (
        <SafeAreaProvider style={{ marginTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>

            <StatusBar
                animated={true}
                hidden={false}
                networkActivityIndicatorVisible={true}
                translucent={true}
                barStyle="light-content" // Change barStyle to "light-content"
            />


            {/* MainContainerComponent displays the room and controls */}
            {/* WelcomePage is for authentication of room credentials */}

            {validated ? (

                <MainContainerComponent >

                    {/* Main aspect component containsa ll but the control buttons (as used for webinar and conference) */}
                    <MainAspectComponent backgroundColor="rgba(217, 227, 234, 0.99)" defaultFraction={1 - controlHeight}
                        updateIsWideScreen={updateIsWideScreen}
                        updateIsMediumScreen={updateIsMediumScreen}
                        updateIsSmallScreen={updateIsSmallScreen}
                        showControls={eventType.current == 'webinar' || eventType.current == 'conference'}

                    >

                        {/* MainScreenComponent contains the main grid view and the minor grid view */}
                        <MainScreenComponent
                            doStack={true}
                            mainSize={mainHeightWidth}
                            updateComponentSizes={updateComponentSizes}
                            defaultFraction={1 - controlHeight}
                            componentSizes={componentSizes.current}
                            showControls={eventType.current == 'webinar' || eventType.current == 'conference'}
                        >

                            {/* MainGridComponent shows the main grid view - not used at all in chat event type  and conference event type when screenshare is not active*/}
                            {/* MainGridComponent becomes the dominant grid view in broadcast and webinar event types */}
                            {/* MainGridComponent becomes the dominant grid view in conference event type when screenshare is active */}

                            <MainGridComponent height={componentSizes.current.mainHeight} width={componentSizes.current.mainWidth} backgroundColor="rgba(217, 227, 234, 0.99)" mainSize={mainHeightWidth}
                                defaultFraction={1 - controlHeight}
                                showAspect={mainHeightWidth > 0 ? true : false}
                                timeBackgroundColor={recordState}
                                meetingProgressTime={meetingProgressTime}
                            >


                                <FlexibleVideo
                                    customWidth={componentSizes.current.mainWidth}
                                    customHeight={componentSizes.current.mainHeight}
                                    rows={1}
                                    columns={1}
                                    componentsToRender={mainGridStream.current ? mainGridStream.current : []}
                                    showAspect={mainGridStream.current.length > 0}
                                />

                            </MainGridComponent>

                            {/* OthergridComponent shows the minor grid view - not used at all in broadcast event type */}
                            {/* OthergridComponent becomes the dominant grid view in conference (the main grid only gets re-introduced during screenshare) and chat event types */}
                            <OthergridComponent height={componentSizes.current.otherHeight} width={componentSizes.current.otherWidth} backgroundColor={"rgba(217, 227, 234, 0.99)"} mainSize={mainHeightWidth}
                                defaultFraction={1 - controlHeight}
                                showAspect={mainHeightWidth == 100 ? false : true}
                                timeBackgroundColor={recordState}
                                showTimer={mainHeightWidth == 0 ? true : false}
                                meetingProgressTime={meetingProgressTime}
                            >

                                {/* Pagination is only used in conference and webinar event types */}
                                <View style={{ width: paginationDirection.current == 'horizontal' ? '100%' : paginationHeightWidth.current, height: paginationDirection.current == 'horizontal' ? paginationHeightWidth.current : '100%', padding: 0, margin: 0, display: doPaginate.current ? 'flex' : 'none', flexDirection: paginationDirection.current == 'horizontal' ? 'row' : 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Pagination
                                        totalPages={numberPages}
                                        currentUserPage={currentUserPage.current}
                                        showAspect={doPaginate.current}
                                        paginationHeight={paginationHeightWidth.current}
                                        direction={paginationDirection.current}
                                        parameters={{ ...getAllParams(), ...mediaSFUFunctions() }}

                                    />
                                </View>

                                {/* AudioGrid contains all the audio only streams */}
                                {/* If broadcasting and there are audio only streams (just one), the audio only streams are displayed in the main grid view */}
                                {/* If webinar and you are the host, the audio only streams (just one), are displayed in the main grid view */}
                                <AudioGrid
                                    componentsToRender={audioOnlyStreams.current ? audioOnlyStreams.current : []}
                                    showAspect={audioOnlyStreams.current.length > 0}
                                />

                                <FlexibleGrid
                                    customWidth={gridSizes.current.gridWidth}
                                    customHeight={gridSizes.current.gridHeight}
                                    rows={gridRows}
                                    columns={gridCols}
                                    componentsToRender={otherGridStreams[0]}
                                    backgroundColor={"rgba(217, 227, 234, 0.99)"}
                                    showAspect={addGrid && otherGridStreams[0].length > 0}
                                />

                                <FlexibleGrid
                                    customWidth={gridSizes.current.altGridWidth}
                                    customHeight={gridSizes.current.altGridHeight}
                                    rows={altGridRows}
                                    columns={altGridCols}
                                    componentsToRender={otherGridStreams[1]}
                                    backgroundColor={"rgba(217, 227, 234, 0.99)"}
                                    showAspect={addAltGrid.current && otherGridStreams[1].length > 0}

                                />

                            </OthergridComponent>

                        </MainScreenComponent>


                    </MainAspectComponent>

                    {/* SubAspectComponent is used for webinar and conference events only to display fixed control buttons */}
                    <SubAspectComponent backgroundColor="rgba(217, 227, 234, 0.99)" showControls={eventType.current == 'webinar' || eventType.current == 'conference'} defaultFractionSub={controlHeight}>
                        <ControlButtonsComponent
                            buttons={controlButtons}
                            buttonColor="black" // Set the background color for buttons
                            buttonBackgroundColor={{ default: 'transparent', pressed: 'transparent' }} // Set background color options
                            alignment="space-between"
                            vertical // Set to true for vertical layout
                            buttonsContainerStyle={{ marginVertical: 2, backgroundColor: 'transparent' }} // Set styles for the buttons container
                            defaultFractionSub={controlHeight}
                        />

                    </SubAspectComponent>

                </MainContainerComponent>

            ) : (

                <PrejoinPage parameters={{
                    showAlert, isLoadingModalVisible, updateIsLoadingModalVisible, onWeb: Platform.OS == 'web', eventType: eventType.current, connectSocket, socket: socket.current,
                    updateSocket, updateValidated, updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember, validated: validated
                }} credentials={credentials} />

            )}


            <MenuModal backgroundColor="rgba(181, 233, 229, 0.97)" isVisible={isMenuModalVisible} updateIsMenuModalVisible={updateIsMenuModalVisible} onClose={() => updateIsMenuModalVisible(false)}
                setIsRecordingModalVisible={setIsRecordingModalVisible}
                customButtons={customMenuButtons}
                roomName={roomName.current}
                adminPasscode={adminPasscode.current}
                islevel={islevel.current}
            />

            <RecordingModal backgroundColor="rgba(217, 227, 234, 0.99)" isRecordingModalVisible={isRecordingModalVisible} updateIsRecordingModalVisible={updateIsRecordingModalVisible} onClose={() => updateIsRecordingModalVisible(false)}
                startRecording={startRecording}
                confirmRecording={confirmRecording}
                parameters={
                    {
                        ...getAllParams(),
                        ...mediaSFUFunctions(),
                    }

                }
            />

            <RequestsModal backgroundColor="rgba(217, 227, 234, 0.99)" isRequestsModalVisible={isRequestsModalVisible} updateIsRequestsModalVisible={updateIsRequestsModalVisible} onRequestClose={() => updateIsRequestsModalVisible(false)}
                requestCounter={requestCounter.current}
                onRequestFilterChange={onRequestFilterChange}
                updateRequestList={updateRequestList}
                requestList={filteredRequestList.current}
                roomName={roomName.current}
                socket={socket.current}
                parameters={
                    {
                        updateRequestCounter: updateRequestCounter,
                        updateRequestFilter: updateRequestFilter,
                        updateRequestList: updateRequestList,
                    }
                }
            />

            <WaitingRoomModal backgroundColor="rgba(217, 227, 234, 0.99)" isWaitingModalVisible={isWaitingModalVisible} updateIsWaitingModalVisible={updateIsWaitingModalVisible} onWaitingRoomClose={() => updateIsWaitingModalVisible(false)}
                waitingRoomCounter={waitingRoomCounter.current}
                onWaitingRoomFilterChange={onWaitingRoomFilterChange}
                waitingRoomList={filteredWaitingRoomList.current}
                updateWaitingList={updateWaitingRoomList}
                roomName={roomName.current}
                socket={socket.current}
                parameters={
                    {
                        updateWaitingRoomCounter: updateWaitingRoomCounter,
                        updateWaitingRoomFilter: updateWaitingRoomFilter,
                        updateWaitingRoomList: updateWaitingRoomList,
                    }
                }
            />

            <DisplaySettingsModal backgroundColor="rgba(217, 227, 234, 0.99)" isDisplaySettingsModalVisible={isDisplaySettingsModalVisible} updateIsDisplaySettingsModalVisible={updateIsDisplaySettingsModalVisible} onDisplaySettingsClose={() => updateIsDisplaySettingsModalVisible(false)}
                parameters={
                    {
                        ...getAllParams(),
                        ...mediaSFUFunctions(),

                    }
                }

            />

            <EventSettingsModal backgroundColor="rgba(217, 227, 234, 0.99)" isEventSettingsModalVisible={isSettingsModalVisible} updateIsSettingsModalVisible={updateIsSettingsModalVisible} onEventSettingsClose={() => updateIsSettingsModalVisible(false)}
                parameters={
                    {

                        ...getAllParams(),
                        ...mediaSFUFunctions(),

                    }
                }

            />

            <CoHostModal backgroundColor="rgba(217, 227, 234, 0.99)" isCoHostModalVisible={isCoHostModalVisible} updateIsCoHostModalVisible={updateIsCoHostModalVisible} onCoHostClose={() => updateIsCoHostModalVisible(false)}
                coHostResponsibility={coHostResponsibility.current}
                participants={participants.current}
                currentCohost={coHost.current}
                parameters={
                    {
                        updateCoHost: updateCoHost,
                        updateCoHostResponsibility: updateCoHostResponsibility,
                        updateIsCoHostModalVisible: updateIsCoHostModalVisible,

                        showAlert: showAlert,

                        coHost: coHost.current,
                        coHostResponsibility: coHostResponsibility.current,
                        roomName: roomName.current,
                        member: member.current,
                        socket: socket.current,
                    }
                }

            />

            <ParticipantsModal backgroundColor="rgba(217, 227, 234, 0.99)" isParticipantsModalVisible={isParticipantsModalVisible} updateIsParticipantsModalVisible={updateIsParticipantsModalVisible} onParticipantsClose={() => updateIsParticipantsModalVisible(false)}
                participantsCounter={participantsCounter.current}
                onParticipantsFilterChange={onParticipantsFilterChange}
                parameters={
                    {
                        updateParticipants: updateParticipants,
                        updateIsParticipantsModalVisible: updateIsParticipantsModalVisible,

                        updateDirectMessageDetails,
                        updateStartDirectMessage,
                        updateIsMessagesModalVisible,

                        showAlert: showAlert,

                        participants: filteredParticipants.current,
                        roomName: roomName.current,
                        islevel: islevel.current,
                        member: member.current,
                        coHostResponsibility: coHostResponsibility.current,
                        coHost: coHost.current,
                        eventType: eventType.current,

                        startDirectMessage: startDirectMessage.current,
                        directMessageDetails: directMessageDetails.current,
                        socket: socket.current,


                    }
                }

            />

            <MessagesModal backgroundColor={eventType.current == 'webinar' || eventType.current == 'conference' ? "#f5f5f5" : "rgba(255, 255, 255, 0.25)"}
                isMessagesModalVisible={isMessagesModalVisible} updateIsMessagesModalVisible={updateIsMessagesModalVisible} onMessagesClose={() => updateIsMessagesModalVisible(false)}
                messages={messages.current}
                parameters={
                    {
                        updateIsMessagesModalVisible: updateIsMessagesModalVisible,
                        participantsAll: participantsAll.current,
                        youAreHost: youAreHost.current,
                        eventType: eventType.current,
                        chatSetting: chatSetting.current,
                        member: member.current,
                        islevel: islevel.current,
                        coHostResponsibility: coHostResponsibility.current,
                        coHost: coHost.current,
                        showAlert: showAlert,
                        startDirectMessage: startDirectMessage.current,
                        updateStartDirectMessage: updateStartDirectMessage,
                        directMessageDetails: directMessageDetails.current,
                        updateDirectMessageDetails: updateDirectMessageDetails,
                        islevel: islevel.current,
                        coHostResponsibility: coHostResponsibility.current,
                        coHost: coHost.current,
                        socket: socket.current,
                        roomName: roomName.current,

                    }
                }
            />

            <MediaSettingsModal backgroundColor="rgba(181, 233, 229, 0.97)" isMediaSettingsModalVisible={isMediaSettingsModalVisible} updateIsMediaSettingsModalVisible={updateIsMediaSettingsModalVisible} onMediaSettingsClose={() => updateIsMediaSettingsModalVisible(false)}
                parameters={
                    {
                        ...getAllParams(),
                        ...mediaSFUFunctions(),
                        mediaDevices,
                        device: device.current,
                        socket: socket.current,
                        showAlert,
                        checkPermission,
                        streamSuccessVideo,
                        hasCameraPermission,
                        requestPermissionCamera,
                        checkMediaPermission: Platform.OS != 'web',
                        streamSuccessAudioSwitch,
                        hasAudioPermission,
                        requestPermissionAudio,
                        streamSuccessAudio,
                    }
                }
            />

            <ConfirmExitModal backgroundColor="rgba(181, 233, 229, 0.97)" isConfirmExitModalVisible={isConfirmExitModalVisible} updateIsConfirmExitModalVisible={updateIsConfirmExitModalVisible} onConfirmExitClose={() => updateIsConfirmExitModalVisible(false)}
                parameters={
                    {
                        islevel: islevel.current,
                        updateIsConfirmExitModalVisible: updateIsConfirmExitModalVisible,
                        isConfirmExitModalVisible: isConfirmExitModalVisible,
                        showAlert: showAlert,
                        roomName: roomName.current,
                        member: member.current,
                        socket: socket.current,
                    }

                }
            />

            <ConfirmHereModal backgroundColor="rgba(181, 233, 229, 0.97)" isConfirmHereModalVisible={isConfirmHereModalVisible} updateIsConfirmHereModalVisible={updateIsConfirmHereModalVisible} onConfirmHereClose={() => updateIsConfirmHereModalVisible(false)}
                parameters={
                    {
                        updateIsConfirmHereModalVisible: updateIsConfirmHereModalVisible,
                        isConfirmHereModalVisible: isConfirmHereModalVisible,
                        showAlert: showAlert,
                        roomName: roomName.current,
                        socket: socket.current,
                        member: member.current,
                    }
                }
            />

            <ShareEventModal isShareEventModalVisible={isShareEventModalVisible} updateIsShareEventModalVisible={updateIsShareEventModalVisible} onShareEventClose={() => updateIsShareEventModalVisible(false)}
                parameters={
                    {
                        ...getAllParams(),
                        socket: socket.current,
                        showAlert: showAlert,
                    }
                }
                roomName={roomName.current}
                member={member.current}
                islevel={islevel.current}
                adminPasscode={adminPasscode.current}
            />


            <AlertComponent
                visible={alertVisible}
                message={alertMessage}
                type={alertType}
                duration={alertDuration}
                onHide={() => setAlertVisible(false)}
                textColor={'#ffffff'}
            />
            <LoadingModal isVisible={isLoadingModalVisible} backgroundColor="rgba(217, 227, 234, 0.99)" displayColor="black" />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MediasfuConference;