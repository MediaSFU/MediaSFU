/**
 * Handles the event when a person joins the event.
 *
 * @param {Object} options - Options for handling the person joined event.
 * @param {string} options.name - The name of the person who joined the event.
 * @param {Object} options.parameters - Object containing various parameters and functions.
 * @param {Function} options.parameters.showAlert - Function to display an alert/notification.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the personJoined function
 * personJoined({
 *   name: 'John Doe',
 *   parameters: {
 *     showAlert: showNotification,
 *   },
 * });
 */
export const personJoined = async ({ name, parameters }) => {
    let {
        showAlert,
    } = parameters;

    // Display an alert/notification about the person joining the event
    if (showAlert) {
        showAlert({
            message: `${name} joined the event.`,
            type: 'success',
            duration: 3000,
        });
    }
};
