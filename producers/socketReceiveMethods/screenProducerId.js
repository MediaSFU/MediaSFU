/**
 * Updates the screen producer ID and related UI states upon receiving information about a screen participant.
 *
 * @param {Object} options - Options for updating screen producer ID and related states.
 * @param {string} options.producerId - The producer ID of the screen participant.
 * @param {Object} options.parameters - Object containing various functions and state related to the screen participant.
 * @param {string} options.parameters.screenId - Current screen participant's ID.
 * @param {boolean} options.parameters.shareScreenStarted - Flag indicating whether screen sharing has started.
 * @param {boolean} options.parameters.deferScreenReceived - Flag indicating whether screen data has been received.
 * @param {Array} options.parameters.participants - List of participants in the event.
 * @param {Function} options.parameters.updateScreenId - Function to update the screen participant's ID.
 * @param {Function} options.parameters.updateShareScreenStarted - Function to update the flag indicating screen sharing status.
 * @param {Function} options.parameters.updateDeferScreenReceived - Function to update the flag indicating screen data reception status.
 * @param {Function} options.parameters.membersReceived - Function to update the flag indicating whether members data has been received.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the screenProducerId function
 * screenProducerId({
 *   producerId: 'screen123',
 *   parameters: {
 *     screenId,
 *    membersReceived,
 *     shareScreenStarted,
 *     deferScreenReceived,
 *     participants,
 *     updateScreenId,
 *     updateShareScreenStarted,
 *     updateDeferScreenReceived,
 *   },
 * });
 */
export const screenProducerId = ({ producerId, parameters }) => {
  // Update screen producer ID and related UI states
  let {
      screenId,
      membersReceived,
      shareScreenStarted,
      deferScreenReceived,
      participants,
      updateScreenId,
      updateShareScreenStarted,
      updateDeferScreenReceived,
  } = parameters;

  // Check if members data has been received with the screenId participant in it
  let host = participants.find((participant) => participant.ScreenID == screenId && participant.ScreenOn == true);

  // Operations to update the UI
  if (host && membersReceived) {
      screenId = producerId;
      shareScreenStarted = true;
      deferScreenReceived = false;

      updateScreenId(screenId);
      updateShareScreenStarted(shareScreenStarted);
      updateDeferScreenReceived(deferScreenReceived);
  } else {
      deferScreenReceived = true;
      screenId = producerId;

      updateScreenId(screenId);
      updateDeferScreenReceived(deferScreenReceived);
  }
};
