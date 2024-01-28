import { recordStartTimer } from "./recordStartTimer";
import { recordResumeTimer } from "./recordResumeTimer";

/**
 * Initiates the recording process based on the provided parameters.
 * @function
 * @async
 * @param {Object} parameters - The parameters for the recording process.
 * @param {string} parameters.roomName - The name of the room where the recording will take place.
 * @param {Object} parameters.userRecordingParams - User-specific recording parameters.
 * @param {Object} parameters.socket - The socket for communication with the server.
 * @param {Function} parameters.updateIsRecordingModalVisible - Function to update the visibility state of the recording modal.
 * @param {boolean} parameters.IsRecordingModalVisible - The current visibility state of the recording modal.
 * @param {string} parameters.islevel - The level of the user.
 * @param {boolean} parameters.confirmedToRecord - Indicates whether the recording is confirmed to start.
 * @param {Function} parameters.showAlert - Function to display alerts.
 * @param {string} parameters.recordingMediaOptions - The media type for recording (audio, video, etc.).
 * @param {boolean} parameters.videoAlreadyOn - Indicates if the video is already turned on.
 * @param {boolean} parameters.audioAlreadyOn - Indicates if the audio is already turned on.
 * @param {boolean} parameters.clearedToRecord - Indicates whether the user is cleared to start recording.
 * @param {boolean} parameters.recordStarted - Indicates if the recording has started.
 * @param {boolean} parameters.recordPaused - Indicates if the recording is paused.
 * @param {boolean} parameters.recordResumed - Indicates if the recording is resumed.
 * @param {boolean} parameters.recordStopped - Indicates if the recording is stopped.
 * @param {Function} parameters.updateClearedToRecord - Function to update the clearedToRecord state.
 * @param {Function} parameters.updateRecordStarted - Function to update the recordStarted state.
 * @param {Function} parameters.updateRecordPaused - Function to update the recordPaused state.
 * @param {Function} parameters.updateRecordResumed - Function to update the recordResumed state.
 * @param {Function} parameters.updateRecordStopped - Function to update the recordStopped state.
 * @param {Function} parameters.updateRecordState - Function to update the overall recording state.
 * @param {Function} parameters.updateStartReport - Function to update the start report state.
 * @param {Function} parameters.updateEndReport - Function to update the end report state.
 * @param {Function} parameters.updateCanRecord - Function to update the canRecord state.
 * @param {Function} parameters.rePort - Function to handle the reporting during recording.
 * @returns {void}
 */



export const startRecording = async ({ parameters }) => {

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
        startReport,
        endReport,
        canRecord,
        

        updateClearedToRecord,
        updateRecordStarted,
        updateRecordPaused,
        updateRecordResumed,
        updateRecordStopped,
        updateRecordState,
        updateStartReport,
        updateEndReport,
        updateCanRecord,

        //mediasfu Functions
        rePort,
    
    } = parameters;

    // Check if recording is confirmed before starting
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

    // Set clearedToRecord to true
    updateClearedToRecord(true);

    let action = 'startRecord';
    if (recordStarted && recordPaused && !recordResumed && !recordStopped) {
        action = 'resumeRecord';
    } else {
        action = 'startRecord';
    }

    let recAttempt;

    await new Promise((resolve) => {
        socket.emit(action, { roomName, userRecordingParams }, async ({ success, reason, recordState }) => {

            if (success) {
                recordStarted = true;
                startReport = true;
                endReport = false;
                recordPaused = false;
                recAttempt = true;

                updateRecordStarted(recordStarted);
                updateStartReport(startReport);
                updateEndReport(endReport);
                updateRecordPaused(recordPaused);

                if (action === 'startRecord') {
                    
                    await rePort({ parameters });
                    await recordStartTimer({ parameters });
                } else {
                    recordResumed = await true;
                    await rePort({ restart: true, parameters });
                    await recordResumeTimer({ parameters });
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
};
