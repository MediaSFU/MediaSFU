/**
 * Attempts to start or resume recording in the specified room using provided parameters.
 *
 * @param {object} options - The function parameters.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {string} options.parameters.socket - The socket used for communication.
 * @param {function} options.parameters.showAlert - Function to display alerts.
 * @param {string} options.parameters.roomName - The name of the room for recording.
 * @param {object} options.parameters.userRecordingParams - Parameters for user recording.
 * @param {boolean} options.parameters.recordStarted - Indicates if recording has started.
 * @param {boolean} options.parameters.recordPaused - Indicates if recording is paused.
 * @param {boolean} options.parameters.recordResumed - Indicates if recording is resumed.
 * @param {boolean} options.parameters.recordStopped - Indicates if recording is stopped.
 * @param {boolean} options.parameters.canRecord - Indicates if recording is allowed.
 * @param {boolean} options.parameters.startReport - Indicates the start of recording report.
 * @param {boolean} options.parameters.endReport - Indicates the end of recording report.
 * @param {function} options.parameters.rePort - Function to report active names and screen states.
 * @param {function} options.parameters.updateRecordStarted - Function to update recordStarted variable.
 * @param {function} options.parameters.updateRecordPaused - Function to update recordPaused variable.
 * @param {function} options.parameters.updateRecordResumed - Function to update recordResumed variable.
 * @param {function} options.parameters.updateRecordStopped - Function to update recordStopped variable.
 * @param {function} options.parameters.updateCanRecord - Function to update canRecord variable.
 * @param {function} options.parameters.updateStartReport - Function to update startReport variable.
 * @param {function} options.parameters.updateEndReport - Function to update endReport variable.
 * @returns {boolean} recAttempt - Indicates if the recording attempt was successful.
 */
 export async function startRecordings({ parameters }) {

    let {
        socket,
        showAlert,
        roomName,
        userRecordingParams,
        recordStarted,
        recordPaused,
        recordResumed,
        recordStopped,
        canRecord,
        startReport,
        endReport,
        rePort,

        //update functions
        updateRecordStarted,
        updateRecordPaused,
        updateRecordResumed,
        updateRecordStopped,
        updateCanRecord,
        updateStartReport,
        updateEndReport,



    } = parameters;


    //attempt to start recording and return true if successful
    let recAttempt;

    let action = 'startRecord';
    if (recordStarted && recordPaused && !recordResumed && !recordStopped) {
      action = 'resumeRecord';
    } else {
      action = 'startRecord';
    }

    await new Promise((resolve) => {
      socket.emit(action, { roomName, userRecordingParams }, async ({ success, reason, recordState }) => {

        if (success) {
          recordStarted = true;
          startReport = true;
          endReport = false;
          recordPaused = false;
          recAttempt = true;

          if (action == 'startRecord') {
            await rePort({restart: false,parameters:{...parameters,recordResumed:recordResumed,recordStarted:recordStarted,recordPaused:recordPaused,recordStopped:recordStopped,canRecord:canRecord,startReport:startReport,endReport:endReport}});
          } else {
            recordResumed = await true;
            await rePort({restart: true,parameters:{...parameters,recordResumed:recordResumed,recordStarted:recordStarted,recordPaused:recordPaused,recordStopped:recordStopped,canRecord:canRecord,startReport:startReport,endReport:endReport}});

          }
        } else {
           if (showAlert) {
            showAlert({
                message: `Recording Failed: ${reason}; the current state is: ${recordState}`,
                type: 'danger',
                duration: 3000,
            });
        }
          canRecord = true;
          startReport = false;
          endReport = true;
          recAttempt = false;
        }

        resolve();
      });
    });

    //update the recordStarted variable
    updateRecordStarted(recordStarted);
    updateRecordPaused(recordPaused);
    updateRecordResumed(recordResumed);
    updateRecordStopped(recordStopped);
    updateCanRecord(canRecord);
    updateStartReport(startReport);
    updateEndReport(endReport);


    return recAttempt;
  }