/**
 * Handles changes related to screen sharing events, adjusting UI elements and triggering stream reordering.
 *
 * @param {Object} options - The options object.
 * @param {boolean} options.changed - Indicates whether there is a change in screen sharing status.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {string} options.eventType - The type of event (e.g., broadcast, chat, conference).
 * @param {boolean} options.shareScreenStarted - Indicates whether screen sharing has started.
 * @param {boolean} options.shared - Indicates whether the screen is being shared.
 * @param {boolean} options.addForBasic - Indicates whether to add basic elements.
 * @param {Function} options.updateAddForBasic - Function to update the state of adding basic elements.
 * @param {number} options.itemPageLimit - The limit of items per page.
 * @param {Function} options.updateItemPageLimit - Function to update the item page limit.
 * @param {Function} options.updateMainHeightWidth - Function to update the main height and width.
 * @param {Function} options.reorderStreams - Function to reorder streams based on screen changes.
 * @throws Throws an error if there is an issue during the process of handling screen changes.
 */
export async function onScreenChanges({ changed, parameters }) {
  try {
    // Destructure parameters
    let {
      eventType,
      shareScreenStarted,
      shared,
      addForBasic,
      updateMainHeightWidth,
      updateAddForBasic,
      itemPageLimit,
      updateItemPageLimit,

      //mediasfu functions
      reorderStreams,
    } = parameters;

    // Remove element with id 'controlButtons'
    addForBasic = false;
    updateAddForBasic(addForBasic);

    if (eventType === 'broadcast' || eventType === 'chat') {
      addForBasic = true;
      updateAddForBasic(addForBasic);

      itemPageLimit = eventType === 'broadcast' ? 1 : 2;
      updateItemPageLimit(itemPageLimit);
      updateMainHeightWidth(eventType === 'broadcast' ? 100 : 0);
    } else {
      if (eventType === 'conference' && !(shareScreenStarted || shared)) {
        updateMainHeightWidth(0);
      }
    }

    // Update the mini cards grid
    await reorderStreams({ add: false, screenChanged: changed, parameters });
  } catch (error) {
    // Handle errors during the process of handling screen changes
    console.log('Error handling screen changes:', error.message);
    // throw error;
  }
}
