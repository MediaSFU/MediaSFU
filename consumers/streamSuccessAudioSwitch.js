/**
 * Handles the success of switching audio devices in a streaming context.
 * @async
 * @function
 * @param {Object} parameters - The parameters object containing necessary variables.
 * @param {MediaStream} stream - The new MediaStream with the switched audio device.
 */

import { MediaStream } from '../methods/utils/webrtc/webrtc'

export const streamSuccessAudioSwitch = async ({ stream, parameters }) => {
    let {
        audioProducer,
        socket,
        roomName,
        localStream,
        localStreamAudio,
        audioParams,
        audioPaused,
        audioAlreadyOn,
        transportCreated,
        audioParamse,
        defAudioID,
        userDefaultAudioInputDevice,
        HostLabel,
        updateMainWindow,
        videoAlreadyOn,
        islevel,
        member,
        lock_screen,
        shared,
        updateAudioProducer,
        updateLocalStream,
        updateLocalStreamAudio,
        updateAudioParams,
        updateAudioPaused,
        updateAudioAlreadyOn,
        updateTransportCreated,
        updateDefAudioID,
        updateUserDefaultAudioInputDevice,
        updateUpdateMainWindow,

        //mediasfu functions
        sleep,
        prepopulateUserMedia,
        createSendTransport,
        connectSendTransportAudio,
    } = parameters;

    // Get the new default audio device ID
    let newDefAudioID = await stream.getAudioTracks()[0].getSettings().deviceId;

    // Check if the audio device has changed
    if (newDefAudioID != defAudioID) {

        // Close the current audioProducer
        if (audioProducer){
            await audioProducer.close();
            updateAudioProducer(audioProducer);
        }

        // Emit a pauseProducerMedia event to pause the audio media
        await socket.emit('pauseProducerMedia', { mediaTag: 'audio', roomName: roomName, force: true });

        // Update the localStreamAudio with the new audio tracks
        localStreamAudio = await stream;

        // If localStream is null, create a new MediaStream with the new audio track
        if (localStream == null) {
            localStream = await new MediaStream([localStreamAudio.getAudioTracks()[0]]);
        } else {
            // Remove all existing audio tracks from localStream and add the new audio track
            await localStream.getAudioTracks().forEach((track) => {
                localStream.removeTrack(track);
            });
            await localStream.addTrack(localStreamAudio.getAudioTracks()[0]);
        }

        // Update localStream
        updateLocalStream(localStream);

        // Get the new default audio device ID from the new audio track
        const audioTracked = await localStream.getAudioTracks()[0];
        defAudioID = await audioTracked.getSettings().deviceId;
        await updateDefAudioID(defAudioID);

        // Update userDefaultAudioInputDevice
        userDefaultAudioInputDevice = await defAudioID;
        await updateUserDefaultAudioInputDevice(userDefaultAudioInputDevice);

        // Update audioParams with the new audio track
        audioParams = await { track: localStream.getAudioTracks()[0], ...audioParamse };
        updateAudioParams(audioParams);

        // Sleep for 500 milliseconds
        await sleep(500);

        // Create a new send transport if not created, otherwise, connect the existing transport
        if (!transportCreated) {
            try {
                await createSendTransport({
                    parameters: {
                        ...parameters,
                        audioParams: audioParams,
                    },
                    option: 'audio',
                });
            } catch (error) {
                // Handle error, if needed
            }
        } else {
            await connectSendTransportAudio({
                audioParams,
                parameters,
            });
        }

        // If audio is paused and not already on, pause the audioProducer and emit a pauseProducerMedia event
        if (audioPaused == true && !audioAlreadyOn) {
            await audioProducer.pause();
            updateAudioProducer(audioProducer);
            await socket.emit('pauseProducerMedia', { mediaTag: 'audio', roomName: roomName });
        }
    }

    // Update the UI based on the participant's level and screen lock status
    if (videoAlreadyOn == false && islevel == '2') {
        if (!lock_screen && !shared) {
            // Set updateMainWindow to true, prepopulate user media, and set updateMainWindow back to false
            updateMainWindow = true;
            updateUpdateMainWindow(updateMainWindow);
            await prepopulateUserMedia({ name: HostLabel, parameters });
            updateMainWindow = false;
            updateUpdateMainWindow(updateMainWindow);
        }
    }
};
