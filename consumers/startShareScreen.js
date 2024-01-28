

/**
 * Attempts to start screen sharing using the mediaDevices API.
 *
 * @param {object} options - The function parameters.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {boolean} options.parameters.shared - Indicates if screen sharing is currently active.
 * @param {function} options.parameters.showAlert - Function to display alerts.
 * @param {object} options.parameters.socket - The socket used for communication.
 * @param {function} options.parameters.updateShared - Function to update the shared variable.
 * @param {object} options.parameters.mediaDevices - The mediaDevices API for accessing media streams.
 * @param {function} options.parameters.streamSuccessScreen - Callback function for a successful screen sharing stream.
 * @returns {void}
 */

export async function startShareScreen({parameters}) {
    // start screen share function
    //attempt to start screen share and return true if successful
  
    let {
        shared,
        showAlert,
        socket,
        updateShared,
        mediaDevices,
        onWeb,

        

        //mediasfu functions
        streamSuccessScreen,
        } = parameters;


    try {

      if (!onWeb) {
        if (showAlert) {
            showAlert({
                message: 'You cannot share screen while on mobile',
                type: 'danger',
                duration: 3000,
            });
        }
        return
      }
      
      if (mediaDevices && mediaDevices.getDisplayMedia) {
        shared = true;
        await mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always',
            width: 1280,
            height: 720,
            frameRate: 30
          },
          audio: false
        }).then(async (stream) => {
          await streamSuccessScreen({ stream, parameters });
        }).catch(async err => {
          shared = false;
          if (showAlert) {
              showAlert({
                  message: 'Could not share screen, check and retry',
                  type: 'danger',
                  duration: 3000,
              });
  
          }
        })
      } else {

          if (showAlert) {
              showAlert({
                  message: 'Could not share screen, check and retry',
                  type: 'danger',
                  duration: 3000,
              });
  
  
          }
      }
  
      //update the shared variable
      updateShared(shared)
    } catch (error) {
       console.log('Error starting screen share', error);
    }



  }
