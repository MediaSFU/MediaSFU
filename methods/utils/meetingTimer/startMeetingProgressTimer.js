/**
 * Starts the meeting progress timer with a custom start time.
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables and functions.
 * @param {number} startTime - The custom start time for the meeting progress timer.
 * @param {Function} parameters.updateMeetingProgressTime - Function to update the meeting progress time state.
 * @returns {void}
 */
export function startMeetingProgressTimer({ startTime, parameters }) {
    let { updateMeetingProgressTime, validated,getUpdatedAllParams } = parameters;

    /**
     * Calculate the elapsed time based on the start time.
     * @param {number} startTime - The custom start time for the meeting progress timer.
     * @returns {number} - The elapsed time in seconds.
     */
    function calculateElapsedTime(startTime) {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        return currentTime - startTime;
    }

    /**
     * Utility function to pad single-digit numbers with leading zeros.
     * @param {number} number - The number to pad.
     * @returns {string} - The padded number as a string.
     */
    function padNumber(number) {
        return number.toString().padStart(2, '0');
    }

    /**
     * Format the time in HH:MM:SS format.
     * @param {number} time - The time in seconds.
     * @returns {string} - The formatted time string.
     */
    function formatTime(time) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = (time % 60).toFixed(0).padStart(2, '0'); // Use toFixed(0) to remove decimal places
        return padNumber(hours) + ':' + padNumber(minutes) + ':' + padNumber(seconds);
    }

    let elapsedTime = calculateElapsedTime(startTime);

    // Update the timer and indicator every second
    let timeProgress = setInterval(() => {
        elapsedTime++;
        const formattedTime = formatTime(elapsedTime);
        updateMeetingProgressTime(formattedTime);

        parameters = getUpdatedAllParams();


        if (!parameters.validated  || (parameters.roomName =="" || parameters.roomName ==null)) {
            clearInterval(timeProgress);
            timeProgress = null;
        }
    }, 1000);

}
