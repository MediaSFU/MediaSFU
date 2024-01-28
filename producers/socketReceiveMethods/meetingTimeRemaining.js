/**
 * Updates and displays the remaining time for a meeting/event.
 * @function
 * @async
 * @param {Object} options - The options object.
 * @param {number} options.timeRemaining - The remaining time for the event in milliseconds.
 * @param {Object} options.parameters - The parameters object containing various state variables and utility functions.
 * @param {function} options.showAlert - The function to display an alert message.
 * @param {string} options.eventType - The type of event, e.g., 'chat'.
 * @returns {void}
 */
export const meetingTimeRemaining = async ({ timeRemaining, parameters }) => {
  // Destructure options
  let {
      showAlert,
      eventType
  } = parameters;

  // Update the meeting time remaining

  // Convert time from milliseconds to readable format of minutes and seconds
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
  const timeRemainingString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Show alert with time remaining
  if (eventType !== 'chat') {
      if (showAlert) {
          showAlert({
              message: `The event will end in ${timeRemainingString} minutes.`,
              type: 'success',
              duration: 3000,
          });
      }
  }
};
