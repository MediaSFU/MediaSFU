/**
 * Updates the audio decibels for a participant with the specified name.
 *
 * @param {object} options - The function parameters.
 * @param {string} options.name - The name of the participant.
 * @param {number} options.averageLoudness - The average loudness value to update.
 * @param {object} options.parameters - Additional parameters needed for the function.
 * @param {array} options.parameters.audioDecibels - Array containing audio decibel information for participants.
 * @param {function} options.parameters.updateAudioDecibels - Function to update the audio decibels array.
 */

export function updateParticipantAudioDecibels({name, averageLoudness, parameters }) {

   let {
         audioDecibels,
         updateAudioDecibels,
        } = parameters;

    // Function to update the audioDecibels array
    // Check if the entry already exists in audioDecibels
    const existingEntry = audioDecibels.find(entry => entry.name === name);

    if (existingEntry) {
      // Entry exists, update the averageLoudness
      existingEntry.averageLoudness = averageLoudness;
    } else {
      // Entry doesn't exist, add a new entry to audioDecibels
      audioDecibels.push({ name, averageLoudness });
    }

    // Update the audioDecibels array
    updateAudioDecibels(audioDecibels);


  }