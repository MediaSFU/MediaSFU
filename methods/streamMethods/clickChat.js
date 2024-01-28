/**
 * Toggles the visibility of the chat modal based on the current state and event settings.
 *
 * @param {Object} options - Options for handling the chat button action.
 * @param {Object} options.parameters - Object containing various states and functions related to the chat button action.
 * @param {boolean} options.parameters.isMessagesModalVisible - Flag indicating whether the chat modal is currently visible.
 * @param {Function} options.parameters.updateIsMessagesModalVisible - Function to update the visibility of the chat modal.
 * @param {string} options.parameters.chatSetting - Chat setting for the current event.
 * @param {string} options.parameters.islevel - The level of the current participant.
 * @param {Function} options.parameters.showAlert - Function to display alerts.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the clickChat function
 * clickChat({
 *   parameters: {
 *     isMessagesModalVisible,
 *     updateIsMessagesModalVisible,
 *     chatSetting,
 *     islevel,
 *     showAlert,
 *   },
 * });
 */
export const clickChat = async ({ parameters }) => {
    // Function implementation for handling the chat button action
    let {
        isMessagesModalVisible,
        updateIsMessagesModalVisible,
        chatSetting,
        islevel,
        showAlert,
    } = parameters;

    // Toggle chat modal visibility
    if (isMessagesModalVisible) {
        updateIsMessagesModalVisible(false);
    } else {
        // Check if chat is allowed based on event settings and participant level
        if (chatSetting !== 'allow' && islevel !== '2') {
            updateIsMessagesModalVisible(false);
            showAlert({
                message: 'Chat is disabled for this event.',
                type: 'error',
                duration: 3000,
            });
        } else {
            updateIsMessagesModalVisible(true);
        }
    }
};
