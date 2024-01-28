/**
 * Displays an alert message indicating that the recording has stopped.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string} params.state - The state of the recording, can only be 'stop'.
 * @param {string} params.reason - The reason for stopping the recording.
 * @param {Object} params.parameters - Additional parameters required for the function.
 * @param {function} params.showAlert - Function to display an alert message.
 * @throws {Error} Throws an error if there is an issue displaying the alert message.
 */
export const stoppedRecording = async ({ state, reason, parameters }) => {
    // Function to display an alert message indicating that the recording has stopped

    let {
        showAlert,
    } = parameters;

    try {
        // Display alert message
        if (showAlert) {
            showAlert({
                message: `The recording has stopped - ${reason}.`,
                duration: 3000,
                type: 'danger',
            });
        }
    } catch (error) {
        console.log("Error in stoppedRecording: ", error);
        // throw new Error("Failed to display the recording stopped alert message.");
    }
};
