export async function pauseRecording({ parameters }) {
    //attempt to pause recording and return true if successful

    let {
        socket,
        showAlert,
        roomName,
        recordStarted,
        recordPaused,
        recordResumed,
        recordStopped,
        canRecord,
        startReport,
        endReport,
        rePort,
        pauseRecordCount,
        //update functions
        updateRecordStarted,
        updateRecordPaused,
        updateRecordResumed,
        updateRecordStopped,
        updateCanRecord,
        updateStartReport,
        updateEndReport,
        updatePauseRecordCount,
        } = parameters;

    let action = 'pauseRecord'

    let recAttempt

    await new Promise((resolve) => {

      socket.emit('pauseRecord', { roomName }, ({ success, reason, recordState, pauseCount }) => {

        pauseRecordCount = pauseCount

        if (success) {

          startReport = false;
          endReport = true;
          recordPaused = true;

          if (showAlert) {
            showAlert({
              message: `Recording Paused`,
              type: 'success',
              duration: 3000,
            });
          }

          recAttempt = true

        } else {
          let reasonMessage = `Recording Pause Failed: ${reason}; the current state is: ${recordState}`
          if (showAlert) {
            showAlert({
              message: reasonMessage,
              type: 'danger',
              duration: 3000,
            });
          }
          recAttempt = false
        }

        resolve()
      });

    });

    //update the recordStarted variable
    updateRecordStarted(recordStarted)


    return recAttempt
  }