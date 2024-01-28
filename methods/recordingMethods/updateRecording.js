
 import { checkPauseState } from './checkPauseState';
import { checkResumeState } from './checkResumeState';
import { recordPauseTimer } from './recordPauseTimer';
import { recordResumeTimer } from './recordResumeTimer';
import { recordStartTimer } from './recordStartTimer';

 
/**
 * Updates the recording state and interacts with the recording server.
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables and functions.
 * @param {string} parameters.roomName - The name of the room for recording.
 * @param {Object} parameters.userRecordingParams - User-specific recording parameters.
 * @param {Object} parameters.socket - The socket for communicating with the recording server.
 * @param {Function} parameters.updateIsRecordingModalVisible - Function to update the visibility of the recording modal.
 * @param {boolean} parameters.IsRecordingModalVisible - Indicates whether the recording modal is currently visible.
 * @param {boolean} parameters.islevel - Indicates the recording level.
 * @param {boolean} parameters.confirmedToRecord - Indicates whether the recording is confirmed to start.
 * @param {Function} parameters.showAlert - Function to show an alert message.
 * @param {string} parameters.recordingMediaOptions - The selected recording media option (e.g., 'video' or 'audio').
 * @param {boolean} parameters.videoAlreadyOn - Indicates whether video is already turned on.
 * @param {boolean} parameters.audioAlreadyOn - Indicates whether audio is already turned on.
 * @param {boolean} parameters.clearedToRecord - Indicates whether the recording is cleared to start.
 * @param {boolean} parameters.recordStarted - Indicates whether the recording has started.
 * @param {boolean} parameters.recordPaused - Indicates whether the recording is paused.
 * @param {boolean} parameters.recordResumed - Indicates whether the recording is resumed.
 * @param {boolean} parameters.recordStopped - Indicates whether the recording is stopped.
 * @param {number} parameters.recordChangeSeconds - The time duration in seconds before certain recording actions are allowed.
 * @param {number} parameters.pauseRecordCount - The count of pause actions during recording.
 * @param {boolean} parameters.startReport - Indicates the start report state.
 * @param {boolean} parameters.endReport - Indicates the end report state.
 * @param {boolean} parameters.recAttempt - Indicates a recording attempt.
 * @param {boolean} parameters.canPauseResume - Indicates whether pause/resume actions are allowed.
 * @param {boolean} parameters.canResume - Indicates whether resume actions are allowed.
 * @param {boolean} parameters.canRecord - Indicates whether recording actions are allowed.
 * @param {Function} parameters.updateCanPauseResume - Function to update the canPauseResume state.
 * @param {Function} parameters.updateCanResume - Function to update the canResume state.
 * @param {Function} parameters.updatePauseRecordCount - Function to update the pauseRecordCount state.
 * @param {Function} parameters.updateClearedToRecord - Function to update the clearedToRecord state.
 * @param {Function} parameters.updateRecordStarted - Function to update the recordStarted state.
 * @param {Function} parameters.updateRecordPaused - Function to update the recordPaused state.
 * @param {Function} parameters.updateRecordResumed - Function to update the recordResumed state.
 * @param {Function} parameters.updateRecordStopped - Function to update the recordStopped state.
 * @param {Function} parameters.updateRecordState - Function to update the recordState.
 * @param {Function} parameters.updateStartReport - Function to update the startReport state.
 * @param {Function} parameters.updateEndReport - Function to update the endReport state.
 * @param {Function} parameters.updateCanRecord - Function to update the canRecord state.
 * @param {Function} parameters.checkPauseState - Function to check the state before pausing.
 * @param {Function} parameters.checkResumeState - Function to check the state before resuming.
 * @param {Function} parameters.rePort - Function to send a report to the recording server.
 * @param {Function} parameters.recordPauseTimer - Function to pause the recording timer.
 * @param {Function} parameters.recordResumeTimer - Function to resume the recording timer.
 * @returns {Promise<void>} - A promise that resolves after the recording state is updated.
 */
 
 export const updateRecording = async ({ parameters }) => {

    let {
        roomName,
        userRecordingParams,
        socket,
        updateIsRecordingModalVisible,
        IsRecordingModalVisible,
        islevel,
        confirmedToRecord,
        showAlert,
        recordingMediaOptions,
        videoAlreadyOn,
        audioAlreadyOn,
        clearedToRecord,
        recordStarted,
        recordPaused,
        recordResumed,
        recordStopped,
        recordChangeSeconds,
        pauseRecordCount,
        startReport,
        endReport,
        canPauseResume,
        canResume,
        canRecord,



        updateCanPauseResume,
        updateCanResume,
        updatePauseRecordCount,
        updateClearedToRecord,
        updateRecordStarted,
        updateRecordPaused,
        updateRecordResumed,
        updateRecordStopped,
        updateRecordState,
        updateStartReport,
        updateEndReport,
        updateCanRecord,

        //mediasfu cuntions
        // checkPauseState,
        // checkResumeState,
        rePort,
        // recordPauseTimer,
        // recordResumeTimer,


    } = parameters;

    let recAttempt;

    // Check if recording is confirmed before starting
    if (recordStopped) {
        if (showAlert) {
            showAlert({
                message: 'Recording has already stopped',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
    }

    // Check for recordingMediaOptions for video
    if (recordingMediaOptions === 'video' && !videoAlreadyOn) {
        if (showAlert) {
            showAlert({
                message: 'You must turn on your video before you can start recording',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
    }

    // Check for recordingMediaOptions for audio
    if (recordingMediaOptions === 'audio' && !audioAlreadyOn) {
        if (showAlert) {
            showAlert({
                message: 'You must turn on your audio before you can start recording',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
    }


    if (recordStarted && !recordPaused && !recordStopped) {


        let proceed = false;

        proceed = await checkPauseState({ parameters })

        if (!proceed) {
            return
        }

        let record = recordPauseTimer({ parameters })
        if (record) {
            
            let action = 'pauseRecord';

            await new Promise((resolve) => {
                socket.emit(action, { roomName }, async ({ success, reason, recordState,pauseCount }) => {
                    
                    pauseRecordCount = pauseCount
                    updatePauseRecordCount(pauseRecordCount)
                    
                    if (success) {

                        startReport = false;
                        endReport = true;
                        recordPaused = true;
                        updateStartReport(startReport);
                        updateEndReport(endReport);
                        updateRecordPaused(recordPaused);
                        
                        if (showAlert) {
                            showAlert({
                                message: 'Recording paused',
                                type: 'success',
                                duration: 3000,
                            });
                        }

                         
                        // Set isRecordingModalVisible to false
                        updateIsRecordingModalVisible(false);
                        setTimeout(() => {
                            canPauseResume = true;
                            updateCanPauseResume(true);
                        }, recordChangeSeconds);
                       
                    } else {
                        let reasonMessage = `Recording Pause Failed: ${reason}; the current state is: ${recordState}`
                        if (showAlert) {
                            showAlert({
                                message: reasonMessage,
                                type: 'danger',
                                duration: 3000,
                            });
                        }
                       
                    }

                    resolve();
                });
            });



        }
    } else if (recordStarted && recordPaused && !recordStopped) {

        if (!confirmedToRecord) {
            if (showAlert) {
                showAlert({
                    message: 'You must click confirm before you can start recording',
                    type: 'danger',
                    duration: 3000,
                });
            }
            return;
        }

        let proceed = false;

        proceed = await checkResumeState({ parameters })

        if (!proceed) {
            return
        }

        let resume = recordResumeTimer({ parameters })
        if (resume) {

            // Set clearedToRecord to true
            updateClearedToRecord(true);

            let action = 'startRecord';
            if (recordStarted && recordPaused && !recordResumed && !recordStopped) {
                action = 'resumeRecord';
            } else {
                action = 'startRecord';
            }
            action = 'resumeRecord';

            await new Promise((resolve) => {
                socket.emit(action, { roomName, userRecordingParams }, async ({ success, reason, recordState }) => {

                    if (success) {

                        recordPaused = false;
                        recordResumed = true;
                        updateRecordPaused(recordPaused);
                        updateRecordResumed(recordResumed);

                        if (action === 'startRecord') {
                            await rePort({ parameters });
                        } else {
                            recordResumed = await true;
                            await rePort({ restart: true, parameters });
                        }
                    } else {
                        if (showAlert) {
                            showAlert({
                                message: `Recording could not start - ${reason}`,
                                type: 'danger',
                                duration: 3000,
                            });
                        }
                        canRecord = true;
                        startReport = false;
                        endReport = true;
                        recAttempt = false;

                        updateCanRecord(canRecord);
                        updateStartReport(startReport);
                        updateEndReport(endReport);
                    }

                    resolve();
                });
            });

            // Set isRecordingModalVisible to false
            updateIsRecordingModalVisible(false);


            setTimeout(() => {
                canPauseResume = true;
                updateCanPauseResume(true);
            }, recordChangeSeconds);

        }

    }


};
