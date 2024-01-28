/**
 * Displays an alert message indicating the time left for recording.
 * @function
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {number} params.timeLeft - The time left for recording in seconds.
 * @param {Object} params.parameters - Additional parameters required for the function.
 * @param {function} params.showAlert - Function to display an alert message.
 * @throws {Error} Throws an error if there is an issue displaying the alert message.
 */
export const timeLeftRecording = ({ timeLeft, parameters }) => {
    // Function to display an alert message indicating the time left for recording

    let {
        showAlert,
    } = parameters;

    try {
        // Display alert message
        if (showAlert) {
            showAlert({
                message: `The recording will stop in less than ${timeLeft} seconds.`,
                duration: 3000,
                type: 'danger',
            });
        }
    } catch (error) {
        console.log("Error in timeLeftRecording: ", error);
        // throw new Error("Failed to display the time left alert message.");
    }
};
