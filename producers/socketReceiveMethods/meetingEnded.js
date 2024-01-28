/**
 * Function to handle the logic when a meeting or event has ended.
 *
 * @function
 * @async
 * @param {Object} params - Parameters for the meetingEnded function.
 * @param {Object} params.parameters - Additional parameters for meetingEnded logic.
 * @param {Function} params.parameters.showAlert - Function to display an alert to the user.
 * @param {string} params.parameters.redirectURL - URL to redirect to after the meeting has ended.
 * @param {boolean} params.parameters.onWeb - Flag indicating if the application is running on the web.
 * @param {string} params.parameters.eventType - Type of the event (e.g., 'chat').
 * @param {Function} params.parameters.updateValidated - Function to update the validated state.
 * @returns {Promise<void>} - Promise that resolves after handling the meetingEnded logic.
 *
 * @example
 * // Example usage of meetingEnded function
 * meetingEnded({
 *   parameters: {
 *     showAlert: customShowAlertFunction,
 *     redirectURL: 'https://example.com',
 *     onWeb: true,
 *     eventType: 'meeting',
 *   },
 * });
 */
export const meetingEnded = async ({ parameters }) => {

  //update that the meeting(event) has ended

  let {
      showAlert,
      redirectURL,
      onWeb,
      eventType,
      updateValidated,
  } = parameters;

  // Show an alert that the meeting has ended and wait for 2 seconds before redirecting to the home page
  if (eventType !== 'chat') {
      if (showAlert) {
          showAlert({
              message: 'The event has ended. You will be redirected to the home page in 2 seconds.',
              type: 'danger',
              duration: 2000,
          });
      }

      if (onWeb) {
          setTimeout(async function () {
              window.location.href = await redirectURL;
          }, 2000);
      } else {
        //    setTimeout(async function () {
        //       updateValidated(false);
        //   }, 2000);
      }
  }
};
