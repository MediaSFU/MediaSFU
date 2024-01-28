/**
 * Updates the recording timer and progress time.
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables and functions.
 * @param {number} parameters.recordElapsedTime - The elapsed time for the recording in seconds.
 * @param {number} parameters.recordStartTime - The timestamp when the recording started.
 * @param {Function} parameters.updateRecordElapsedTime - Function to update the recordElapsedTime state.
 * @param {Function} parameters.updateRecordStartTime - Function to update the recordStartTime state.
 * @param {Function} parameters.updateRecordingProgressTime - Function to update the recording progress time.
 */
export function recordUpdateTimer({ parameters }) {
    let {
        recordElapsedTime,
        recordStartTime,
        updateRecordElapsedTime,
        updateRecordStartTime,
        updateRecordingProgressTime,
    } = parameters;

    /**
     * Utility function to pad single-digit numbers with leading zeros.
     * @param {number} number - The number to pad.
     * @returns {string} The padded number as a string.
     */
    function padNumber(number) {
        return number.toString().padStart(2, '0');
    }
    
    const currentTime = new Date().getTime(); // Get the current timestamp
    recordElapsedTime = Math.floor((currentTime - recordStartTime) / 1000); // Calculate the elapsed time in seconds
    updateRecordElapsedTime(recordElapsedTime);

    // Format the time in HH:MM:SS format
    const hours = Math.floor(recordElapsedTime / 3600);
    const minutes = Math.floor((recordElapsedTime % 3600) / 60);
    const seconds = recordElapsedTime % 60;
    const formattedTime = padNumber(hours) + ':' + padNumber(minutes) + ':' + padNumber(seconds);

    updateRecordingProgressTime(formattedTime);
}
