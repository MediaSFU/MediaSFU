/**
 * Bans a participant from the event by removing them from the active participant list and updating streams.
 *
 * @param {Object} options - Options for banning a participant.
 * @param {string} options.name - The name of the participant to be banned.
 * @param {Object} options.parameters - Object containing various participant-related functions for updates.
 * @param {Array} options.parameters.activeNames - Array of active participant names.
 * @param {Array} options.parameters.dispActiveNames - Array of display names for active participants.
 * @param {Array} options.parameters.participants - Array of participant objects.
 * @param {Function} options.parameters.reorderStreams - Function to reorder streams after participant removal.
 * @param {Function} options.parameters.updateParticipants - Function to update the participants array.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the banParticipant function
 * banParticipant({
 *   name: 'JohnDoe',
 *   parameters: {
 *     activeNames,
 *     dispActiveNames,
 *     participants,
 *     reorderStreams,
 *     updateParticipants,
 *   },
 * });
 */
export const banParticipant = async ({ name, parameters }) => {
  // Ban a participant by removing them from the active participant list and updating streams
  let {
      activeNames,
      dispActiveNames,
      participants,
      updateParticipants,

      //mediasfu functions
      reorderStreams,
  } = parameters;

  
  // Check if the participant is in the active or display names array
  if (activeNames.includes(name) || dispActiveNames.includes(name)) {
      // Filter out the banned participant from the participants array
      participants = await participants.filter(participant => participant.name !== name);
      // Update the participants array
      updateParticipants(participants);
      // Reorder streams after participant removal
      await reorderStreams({add:false,screenChanged:true,parameters});
  }
};
