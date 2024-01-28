/**
 * Sends a chat message in the specified room using the provided parameters.
 * @function
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {Object} params.parameters - Additional parameters required for the function.
 * @param {Object} params.member - The information about the member sending the message.
 * @param {string} params.islevel - The level of the participant.
 * @param {function} params.showAlert - Function to display an alert.
 * @param {Object} params.coHostResponsibility - Information about co-host responsibilities.
 * @param {string} params.coHost - The co-host of the room.
 * @param {string} params.type - The type of the message.
 * @param {string} params.chatSetting - The chat setting for the room.
 * @param {string} params.message - The message content.
 * @param {string} params.roomName - The name of the room where the message is sent.
 * @param {number} params.messagesLength - The current length of messages in the room.
 * @param {Array} params.receivers - The list of message receivers.
 * @param {boolean} params.group - Indicates if the message is a group message.
 * @param {string} params.sender - The sender of the message.
 * @param {Object} params.socket - The socket object for communication.
 * @param {function} params.updateIsMessagesModalVisible - Function to update the visibility state of the messages modal.
 * @throws {Error} Throws an error if the message is not valid or if the user is not allowed to send a message.
 */
export const sendMessage = async({
    parameters,
}) => {
    const {
        member,
        islevel,
        showAlert,
        coHostResponsibility,
        coHost,
        type,
        chatSetting,
        message,
        roomName,
        messagesLength,
        receivers,
        group,
        sender,
        socket,

        updateIsMessagesModalVisible,
    } = parameters;

    let chatValue = false;

    // Check message count limit based on the room type
    if (
        (messagesLength > 100 && roomName.startsWith('d')) ||
        (messagesLength > 500 && roomName.startsWith('s')) ||
        (messagesLength > 100000 && roomName.startsWith('p'))
    ) {
        if (showAlert) {
            showAlert({
                message: 'You have reached the maximum number of messages allowed.',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
    }

    // Validate message, sender, and receivers
    if (!message || !receivers || (!member && !sender)) {
        if (showAlert) {
            showAlert({
                message: 'Message is not valid.',
                type: 'danger',
                duration: 3000,
            });
        }
        return;
    }

    // Create the message object
    const messageObject = {
        sender: sender ? sender : member,
        receivers: receivers,
        message: message,
        timestamp: new Date().toLocaleTimeString(),
        group: group !== undefined && group !== null ? group : false,
    };

    try {
        // Check co-host responsibility for chat
        chatValue = coHostResponsibility.find((item) => item.name === 'chat').value;
    } catch (error) {}

    if (islevel === '2' || (coHost === member && chatValue === true)) {
        // Allow sending message
    } else {
        // Check if user is allowed to send a message in the event room
        if (!chatSetting) {
            if (showAlert) {
                showAlert({
                    message: 'You are not allowed to send a message in this event room',
                    type: 'danger',
                    duration: 3000,
                });
            }
            return;
        }
    }

    // Send the message to the server
    await socket.emit('sendMessage', {
        messageObject: messageObject,
        roomName: roomName,
    });


};
