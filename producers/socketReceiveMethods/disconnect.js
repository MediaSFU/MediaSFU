/**
 * Disconnects the user from the session, updating the necessary state and triggering alerts if needed.
 * @param {Object} parameters - The parameters object containing required information.
 * @param {Function} parameters.showAlert - A function to display alerts.
 * @param {string} parameters.redirectURL - The URL to redirect to after disconnection (applicable on the web).
 * @param {boolean} parameters.onWeb - Indicates whether the application is running on the web.
 * @param {Function} parameters.updateValidated - A function to update the validation state after disconnection.
 */
export const disconnect = async ({ parameters }) => {
    // Update that the socket has disconnected
  
    let { showAlert, redirectURL, onWeb, updateValidated } = parameters;
  
    // Redirect to the specified URL on the web
    if (onWeb) {
      window.location.href = await redirectURL;
    } else {
      // Display an alert and update the validated state
      if (showAlert) {
        showAlert({
          message: 'You have been disconnected from the session.',
          type: 'danger',
          duration: 2000,
        });
      }
  
      // setTimeout(async function () {
      //   updateValidated(false);
      // }, 2000);
    }
  };
  