/**
 * Disconnects the send transport for screen sharing and updates the UI accordingly.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {Object} options.parameters.screenProducer - The screen producer associated with the send transport.
 * @param {Object} options.parameters.socket - The socket used for communication.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {Function} options.parameters.updateScreenProducer - The function to update the screen producer state.
 * @throws Throws an error if there is an issue during the disconnection process.
 */
export const disconnectSendTransportScreen = async ({ parameters }) => {

    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams()

    try {
        // Destructure parameters
        let {
            screenProducer,
            socket,
            roomName,
            updateScreenProducer,
        } = parameters;

        // Close the screen producer and update the state
        await screenProducer.close();
        updateScreenProducer(screenProducer);

        // Notify the server about closing the screen producer and pausing screen sharing
        await socket.emit('closeScreenProducer');
        await socket.emit('pauseProducerMedia', { mediaTag: 'screen', roomName: roomName });
    } catch (error) {
        // Handle errors during the disconnection process
        console.log('Error disconnecting send transport for screen:', error.message);

    }
};
