/**
 * Updates the co-host information, co-host responsibility, and user's co-host status.
 *
 * @param {Object} options - Options for updating co-host information.
 * @param {string} options.coHost - The updated co-host.
 * @param {string} options.coHostResponsibility - The updated co-host responsibility.
 * @param {Object} options.parameters - Object containing various co-host-related functions and state.
 * @param {Function} options.parameters.showAlert - Function to display alerts.
 * @param {string} options.parameters.eventType - Type of the event.
 * @param {string} options.parameters.islevel - Level of the user.
 * @param {string} options.parameters.member - Username of the user.
 * @param {boolean} options.parameters.youAreCoHost - User's co-host status.
 * @param {Function} options.parameters.updateCoHost - Function to update the co-host information.
 * @param {Function} options.parameters.updateCoHostResponsibility - Function to update co-host responsibility.
 * @param {Function} options.parameters.updateYouAreCoHost - Function to update user's co-host status.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the updatedCoHost function
 * updatedCoHost({
 *   coHost: 'NewCoHost',
 *   coHostResponsibility: 'CoHostResponsibility',
 *   parameters: {
 *     showAlert,
 *     eventType,
 *     islevel,
 *     member,
 *     coHost,
 *     youAreCoHost,
 *     updateCoHost,
 *     updateCoHostResponsibility,
 *     updateYouAreCoHost,
 *   },
 * });
 */
export const updatedCoHost = async ({ coHost, coHostResponsibility, parameters }) => {
  // Update co-host information, responsibility, and user's co-host status
  let {
      showAlert,
      eventType,
      islevel,
      member,
    
      youAreCoHost,
      updateCoHost,
      updateCoHostResponsibility,
      updateYouAreCoHost,

  } = parameters;

  if (eventType !== 'broadcast' && eventType !== 'chat') {
      // Only update the co-host if the event type is not broadcast or chat
      updateCoHost(coHost);
      coHostResponsibility = await coHostResponsibility;
      updateCoHostResponsibility(coHostResponsibility);

      if (member === coHost) {
          if (!youAreCoHost) {
              youAreCoHost = true;
              updateYouAreCoHost(youAreCoHost);

              if (showAlert) {
                  showAlert({
                      message: 'You are now a co-host.',
                      type: 'success',
                      duration: 3000,
                  });
              }
          }
      } else {
          youAreCoHost = false;
          updateYouAreCoHost(youAreCoHost);
      }

      
  } else {
      if (islevel !== '2') {
          youAreCoHost = true;
          updateYouAreCoHost(youAreCoHost);
      }
  }
};
