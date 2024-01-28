/**
 * Joins a consumption room by sending a request to the server and handles the necessary setup.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string} params.remote_sock - The remote socket information.
 * @param {string} params.apiToken - The API token for authentication.
 * @param {string} params.apiUserName - The API username for authentication.
 * @param {Object} params.parameters - Additional parameters required for the function.
 * @param {string} params.roomName - The name of the room to join.
 * @param {string} params.islevel - The level of the participant.
 * @param {Object} params.member - Information about the participant.
 * @param {Object} params.device - The media device used by the participant.
 * @param {Object} params.mediasoupClient - The mediasoup client object.
 * @param {Object} params.rtpCapabilities - The RTP capabilities.
 * @param {function} params.receiveAllPipedTransports - Function to receive all piped transports.
 * @param {function} params.createDeviceClient - Function to create a device client.
 * @param {function} params.joinConRoom - Function to join a consumption room.
 * @returns {Object} - An object containing data related to the success of joining the room.
 * @throws {Error} Throws an error if there is an issue joining the room or setting up the necessary components.
 */

import { joinConRoom } from '../../producers/producerEmits/joinConRoom'
import * as mediasoupClient from 'mediasoup-client';


export const joinConsumeRoom = async ({ remote_sock, apiToken, apiUserName, parameters }) => {
    // Joins a consumption room and handles necessary setup

    let {
        roomName,
        islevel,
        member,
        rtpCapabilities,
        device,
        updateDevice,

        // Mediasfu functions
        receiveAllPipedTransports,
        createDeviceClient,
    } = parameters;

    try {
        // Join the consumption room
        let data = await joinConRoom(remote_sock, roomName, islevel, member, apiToken, apiUserName);

        if (data && data.success) {
            // Setup media device if not already set
            if (!device) {
                if (data.rtpCapabilities) {
                    let device_ = await createDeviceClient({
                        rtpCapabilities: data.rtpCapabilities,
                        mediasoupClient,
                    });

                    if (device_) {
                        updateDevice(device_);
                    }
                }
            }

            // Receive all piped transports
            await receiveAllPipedTransports({ nsock: remote_sock, parameters });
        }

        return data;
    } catch (error) {
        console.log('Error in joinConsumeRoom:', error);
        throw new Error('Failed to join the consumption room or set up necessary components.');
    }
};
