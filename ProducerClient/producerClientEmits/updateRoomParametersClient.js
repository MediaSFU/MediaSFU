/**
 * Update Room Parameters Client after the user has joined the room and the room parameters have been received from the server.
 *
 * @param {Object} parameters - An object containing various parameters and update functions.
 *   @property {Object} rtpCapabilities - RTP capabilities from mediasoup.
 *   @property {Array} roomRecvIPs - Receiving IPs (domains) for the room consumer.
 *   @property {Object} meetingRoomParams - Room parameters for the meeting/event room.
 *   @property {number} itemPageLimit - Number of items to show per page in the media display.
 *   @property {boolean} audioOnlyRoom - True if the room is audio-only and does not support video.
 *   @property {boolean} addForBasic - True if the room supports few producers (broadcasting and chatting only).
 *   @property {number} screenPageLimit - Number of people on the side-view of screen share.
 *   @property {boolean} shareScreenStarted - True if screen share has started and started remotely.
 *   @property {boolean} shared - True if screen share has started and started locally.
 *   @property {string} targetOrientation - Orientation of the media to be captured (neutral, portrait, or landscape).
 *   @property {Array} vidCons - Constraints for video capture.
 *   @property {boolean} recordingVideoSupport - True if the room supports recording video.
 *   @property {number} frameRate - Frame rate for video capture.
 *   @property {string} adminPasscode - Admin passcode or secure code for the room.
 *   @property {string} eventType - Type of the meeting/event room (e.g., chat, broadcast, conference).
 *   @property {boolean} youAreCoHost - True if the user is a co-host.
 *   @property {boolean} autoWave - True if auto-wave is enabled.
 *   @property {boolean} forceFullDisplay - True if force full display is enabled.
 *   @property {boolean} chatSetting - Chat setting for the room.
 *   @property {string} meetingDisplayType - Type of meeting display (e.g., 'all').
 *   @property {string} audioSetting - Audio setting for the room.
 *   @property {string} videoSetting - Video setting for the room.
 *   @property {string} screenshareSetting - Screenshare setting for the room.
 *   @property {Object} hParams - Host parameters for video capture.
 *   @property {Object} vParams - Video parameters for video capture.
 *   @property {Object} screenParams - Screen parameters for video capture.
 *   @property {Object} aParams - Audio parameters for audio sharing.
 *   @property {boolean} showAlert - Function to show alerts.
 *   @property {Object} data - Additional data.
 *   @property {Function} updateRtpCapabilities - Function to update RTP capabilities.
 *   @property {Function} updateRoomRecvIPs - Function to update room receiving IPs.
 *   @property {Function} updateMeetingRoomParams - Function to update meeting room parameters.
 *   @property {Function} updateItemPageLimit - Function to update item page limit.
 *   @property {Function} updateAudioOnlyRoom - Function to update audio-only room status.
 *   @property {Function} updateAddForBasic - Function to update add-for-basic status.
 *   @property {Function} updateScreenPageLimit - Function to update screen page limit.
 *   @property {Function} updateShareScreenStarted - Function to update share screen started status.
 *   @property {Function} updateShared - Function to update shared status.
 *   @property {Function} updateTargetOrientation - Function to update target orientation.
 *   @property {Function} updateVidCons - Function to update video constraints.
 *   @property {Function} updateRecordingVideoSupport - Function to update recording video support status.
 *   @property {Function} updateFrameRate - Function to update frame rate.
 *   @property {Function} updateAdminPasscode - Function to update admin passcode.
 *   @property {Function} updateEventType - Function to update event type.
 *   @property {Function} updateYouAreCoHost - Function to update "you are a co-host" status.
 *   @property {Function} updateAutoWave - Function to update auto-wave status.
 *   @property {Function} updateForceFullDisplay - Function to update force full display status.
 *   @property {Function} updateChatSetting - Function to update chat setting.
 *   @property {Function} updateMeetingDisplayType - Function to update meeting display type.
 *   @property {Function} updateAudioSetting - Function to update audio setting.
 *   @property {Function} updateVideoSetting - Function to update video setting.
 *   @property {Function} updateScreenshareSetting - Function to update screenshare setting.
 *   @property {Function} updateHParams - Function to update host parameters.
 *   @property {Function} updateVParams - Function to update video parameters.
 *   @property {Function} updateScreenParams - Function to update screen parameters.
 *   @property {Function} updateAParams - Function to update audio parameters.
 *   @property {Function} updateRecordingAudioPausesLimit - Function to update recording audio pauses limit.
 *   @property {Function} updateRecordingAudioPausesCount - Function to update recording audio pauses count.
 *   @property {Function} updateRecordingAudioSupport - Function to update recording audio support status.
 *   @property {Function} updateRecordingAudioPeopleLimit - Function to update recording audio people limit.
 *   @property {Function} updateRecordingAudioParticipantsTimeLimit - Function to update recording audio participants time limit.
 *   @property {Function} updateRecordingVideoPausesCount - Function to update recording video pauses count.
 *   @property {Function} updateRecordingVideoPausesLimit - Function to update recording video pauses limit.
 *   @property {Function} updateRecordingVideoSupport - Function to update recording video support status.
 *   @property {Function} updateRecordingVideoPeopleLimit - Function to update recording video people limit.
 *   @property {Function} updateRecordingVideoParticipantsTimeLimit - Function to update recording video participants time limit.
 *   @property {Function} updateRecordingAllParticipantsSupport - Function to update recording all participants support status.
 *   @property {Function} updateRecordingVideoParticipantsSupport - Function to update recording video participants support status.
 *   @property {Function} updateRecordingAllParticipantsFullRoomSupport - Function to update recording all participants full room support status.
 *   @property {Function} updateRecordingVideoParticipantsFullRoomSupport - Function to update recording video participants full room support status.
 *   @property {Function} updateRecordingPreferredOrientation - Function to update recording preferred orientation.
 *   @property {Function} updateRecordingSupportForOtherOrientation - Function to update recording support for other orientation.
 *   @property {Function} updateRecordingMultiFormatsSupport - Function to update recording multi-formats support status.
 *  @property {Function} updateMainHeightWidth - Function to update main height and width.
 *
 * @throws {Error} If any operation encounters an error.
 */

import {
    QnHDCons,
    sdCons,
    hdCons,
    QnHDConsPort,
    sdConsPort,
    hdConsPort,
    QnHDConsNeu,
    sdConsNeu,
    hdConsNeu,
    QnHDFrameRate,
  sdFrameRate,
    hdFrameRate,
    screenFrameRate
} from '../../methods/utils/producer/videoCaptureConstraints'; // Import the video capture constraints from the videoCaptureConstraints.js file

// import the media encoding parameters for video, audio and screen
import  {hParams as host_Params} from '../../methods/utils/producer/hParams';
import  {vParams as video_Params} from '../../methods/utils/producer/vParams';
import  {screenParams as screen_Params} from '../../methods/utils/producer/screenParams';
import  {aParams as audio_Params} from '../../methods/utils/producer/aParams';

export const updateRoomParametersClient = ({
    parameters

}) => {

    try {

        const { rtpCapabilities,
            roomRecvIPs,
            meetingRoomParams,
            itemPageLimit,
            audioOnlyRoom,
            addForBasic,
            screenPageLimit,
            shareScreenStarted,
            shared,
            targetOrientation,
            vidCons,
            frameRate,
            adminPasscode,
            eventType,
            youAreCoHost,
            autoWave,
            forceFullDisplay,
            chatSetting,
            meetingDisplayType,
            audioSetting,
            videoSetting,
            screenshareSetting,
            hParams=host_Params,
            vParams=video_Params,
            screenParams=screen_Params,
            aParams=audio_Params,
    
    
            recordingAudioPausesLimit,
            recordingAudioPausesCount,
            recordingAudioSupport,
            recordingAudioPeopleLimit,
            recordingAudioParticipantsTimeLimit,
            recordingVideoPausesCount,
            recordingVideoPausesLimit,
            recordingVideoSupport,
            recordingVideoPeopleLimit,
            recordingVideoParticipantsTimeLimit,
            recordingAllParticipantsSupport,
            recordingVideoParticipantsSupport,
            recordingAllParticipantsFullRoomSupport,
            recordingVideoParticipantsFullRoomSupport,
            recordingPreferredOrientation,
            recordingSupportForOtherOrientation,
            recordingMultiFormatsSupport,
     
    
    
    
            islevel,
            showAlert,
            data,
    
            //updates
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
            updateAdminPasscode,
            updateEventType,
            updateYouAreCoHost,
            updateAutoWave,
            updateForceFullDisplay,
            updateChatSetting,
            updateMeetingDisplayType,
            updateAudioSetting,
            updateVideoSetting,
            updateScreenshareSetting,
            updateHParams,
            updateVParams,
            updateScreenParams,
            updateAParams,
    
    
            //updates
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
            updateMainHeightWidth,
    
    
    
        } = parameters;
    
    
        if (data.rtpCapabilities === null) {
            let reason = '';
            if (data.reason) {
                reason = data.reason;
            }
            if (showAlert) {
                showAlert({
                    message: 'Sorry, you are not allowed to join this room. ' + reason,
                    type: 'danger',
                    duration: 3000,
                });
            }
            return;
        } else {
            //update all values
            updateRtpCapabilities(data.rtpCapabilities);
            updateAdminPasscode(data.secureCode);
            updateRoomRecvIPs(data.roomRecvIPs);
            updateMeetingRoomParams(data.meetingRoomParams);
    
            //update all recording values
            updateRecordingAudioPausesLimit(data.recordingParams.recordingAudioPausesLimit);
            updateRecordingAudioPausesCount(data.recordingParams.recordingAudioPausesCount);
            updateRecordingAudioSupport(data.recordingParams.recordingAudioSupport);
            updateRecordingAudioPeopleLimit(data.recordingParams.recordingAudioPeopleLimit);
            updateRecordingAudioParticipantsTimeLimit(data.recordingParams.recordingAudioParticipantsTimeLimit);
            updateRecordingVideoPausesCount(data.recordingParams.recordingVideoPausesCount);
            updateRecordingVideoPausesLimit(data.recordingParams.recordingVideoPausesLimit);
            updateRecordingVideoSupport(data.recordingParams.recordingVideoSupport);
            updateRecordingVideoPeopleLimit(data.recordingParams.recordingVideoPeopleLimit);
            updateRecordingVideoParticipantsTimeLimit(data.recordingParams.recordingVideoParticipantsTimeLimit);
            updateRecordingAllParticipantsSupport(data.recordingParams.recordingAllParticipantsSupport);
            updateRecordingVideoParticipantsSupport(data.recordingParams.recordingVideoParticipantsSupport);
            updateRecordingAllParticipantsFullRoomSupport(data.recordingParams.recordingAllParticipantsFullRoomSupport);
            updateRecordingVideoParticipantsFullRoomSupport(data.recordingParams.recordingVideoParticipantsFullRoomSupport);
            updateRecordingPreferredOrientation(data.recordingParams.recordingPreferredOrientation);
            updateRecordingSupportForOtherOrientation(data.recordingParams.recordingSupportForOtherOrientation);
            updateRecordingMultiFormatsSupport(data.recordingParams.recordingMultiFormatsSupport);
    
            //update all values
            updateItemPageLimit(data.meetingRoomParams.itemPageLimit);
            updateEventType(data.meetingRoomParams.type);
    
            if (data.meetingRoomParams.type == 'chat' && islevel != '2') {
                updateYouAreCoHost(true);
            }
    
            if (data.meetingRoomParams.type == 'chat' || data.meetingRoomParams.type == 'broadcast') {
                updateAutoWave(false);
                updateMeetingDisplayType('all');
                updateForceFullDisplay(true);
                updateChatSetting(true);

            }
    
            updateAudioSetting(data.meetingRoomParams.audioSetting);
            updateVideoSetting(data.meetingRoomParams.videoSetting);
            updateScreenshareSetting(data.meetingRoomParams.screenshareSetting);
            updateChatSetting(data.meetingRoomParams.chatSetting);
    
            if (data.meetingRoomParams.mediaType == 'video') {
                updateAudioOnlyRoom(false);
            } else {
                updateAudioOnlyRoom(true);
            }
    
            if (data.meetingRoomParams.type == 'chat' || data.meetingRoomParams.type == 'broadcast') {
    
                if (data.meetingRoomParams.type == 'broadcast') {
                    updateAddForBasic(true);
                    updateItemPageLimit(1);
    
                } else {
                    updateAddForBasic(false);
                    updateItemPageLimit(2);
                }
    
               
    
            } else if (data.meetingRoomParams.type == 'conference') {
    
                if (shared || shareScreenStarted) {
                    updateMainHeightWidth(100)
                } else {
                    updateMainHeightWidth(0)
                }
            }
    
            updateScreenPageLimit(Math.min(data.meetingRoomParams.itemPageLimit, screenPageLimit));
    
            //assign resolution and orientation
            let targetOrientation_
            let targetResolution_
            if (islevel == '2') {
                targetOrientation_ = data.meetingRoomParams.targetOrientationHost;
                targetResolution_ = data.meetingRoomParams.targetResolutionHost;
    
            } else {
                targetOrientation_ = data.meetingRoomParams.targetOrientation;
                targetResolution_ = data.meetingRoomParams.targetResolution;
            }
    
    
            //assign media capture constraints
            let vdCons_
            if (targetOrientation_ == 'landscape') {
                if (targetResolution_ == 'hd') {
                    vdCons_ = hdCons;
                } else if (targetResolution_ == 'QnHD') {
                    vdCons_ = QnHDCons;
                } else {
                    vdCons_ = sdCons;
                }
    
            } else if (targetOrientation_ == 'neutral') {
                if (targetResolution_ == 'hd') {
                    vdCons_ = hdConsNeu;
                } else if (targetResolution_ == 'QnHD') {
                    vdCons_ = QnHDConsNeu;
                } else {
                    vdCons_ = sdConsNeu;
                }
    
            } else {
                if (targetResolution_ == 'hd') {
                    vdCons_ = hdConsPort;
                } else if (targetResolution_ == 'QnHD') {
                    vdCons_ = QnHDConsPort;
                } else {
                    vdCons_ = sdConsPort;
                }
            }
    
            //assign frame rate
            let frameRate_
            let h_params = hParams ? { ...hParams } : { ...host_Params };
            let v_params = vParams ? { ...vParams } : { ...video_Params };
            let screen_params = screenParams ? { ...screenParams } : { ...screen_Params };
            let a_params = aParams ? { ...aParams } : { ...audio_Params };

            if (targetResolution_ == 'hd') {
                frameRate_ = hdFrameRate;
    
                v_params.encodings.forEach(encoding => {
                    if (encoding.maxBitrate) {
                        encoding.maxBitrate *= 4; // Multiply by 4 for "hd" resolution
                        encoding.initialAvailableBitrate *= 4;
                    }
                });
    
                h_params.encodings.forEach(encoding => {
                    if (encoding.maxBitrate) {
                        encoding.maxBitrate *= 4; // Multiply by 4 for "hd" resolution
                        encoding.initialAvailableBitrate *= 4;
                    }
                });
    
            } else if (targetResolution_ == 'QnHD') {
                frameRate_ = QnHDFrameRate;
    
                v_params.encodings.forEach(encoding => {
                    if (encoding.maxBitrate) {
                        encoding.maxBitrate *= 0.25; // Multiply by 0.25 for QnHD resolution
                        encoding.minBitrate *= 0.25; // Multiply by 0.25 for QnHD resolution
                        encoding.initialAvailableBitrate *= 0.25;
                    }
                })
    
                h_params.encodings.forEach(encoding => {
                    if (encoding.maxBitrate) {
                        encoding.maxBitrate *= 0.25; // Multiply by 0.25 for QnHD resolution
                        encoding.minBitrate *= 0.25; // Multiply by 0.25 for QnHD resolution
                        encoding.initialAvailableBitrate *= 0.25;
                    }
                })
    
                h_params.codecOptions.videoGoogleStartBitrate *= 0.25;
                v_params.codecOptions.videoGoogleStartBitrate *= 0.25;
            }
    
    
            if (data.recordingParams.recordingVideoSupport) {
                //add more bitrate for recording
                v_params.encodings.forEach(encoding => {
                    if (encoding.maxBitrate) {
                        encoding.maxBitrate *= 1.2; // Multiply by 1.2 
                        encoding.minBitrate *= 1.2; // Multiply by 1.2
                        encoding.initialAvailableBitrate *= 1.2;
                    }
                });
    
    
                h_params.encodings.forEach(encoding => {
                    if (encoding.maxBitrate) {
                        encoding.maxBitrate *= 1.2; // Multiply by 1.2
                        encoding.minBitrate *= 1.2; // Multiply by 1.2
                        encoding.initialAvailableBitrate *= 1.2;
                    }
                });
    
                h_params.codecOptions.videoGoogleStartBitrate *= 1.2;
                v_params.codecOptions.videoGoogleStartBitrate *= 1.2;
    
            }
    
            //let us update the new parameters
            updateVidCons(vdCons_);
            updateFrameRate(frameRate_);
            updateHParams(h_params);
            updateVParams(v_params);
            updateScreenParams(screen_params);
            updateAParams(a_params);
    
        }
        
    } catch (error) {
        console.log('updateRoomParametersClient error', error)
         try {
            const { showAlert } = parameters;
            if (showAlert) {
                showAlert({
                    message: error.message,
                    type: 'danger',
                    duration: 3000,
                });
            }
        } catch (error) {
           
        }
    }

}