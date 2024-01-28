/**
 * joinRoomClient is a function that emits a joinRoom event to the server using the provided socket.
 *
 * @param {Object} socket - The socket connection to the server.
 * @param {string} roomName - The name or identifier of the room to join.
 * @param {string} islevel - The access level or permission level of the user joining the room.
 * @param {Object} member - The name of the user joining the room.
 * @param {string} sec - The security code or password for joining a secured room.
 * @param {string} apiUserName - The API user name, if applicable.
 * @param {boolean} consume - Whether to join as a consumer or not.
 *
 * @returns {Promise<Object>} A Promise that resolves with the data received after joining the room.
 * @throws {Error} If there is an error during the joinRoom process.
 *
 * @example
 * const socket = connectSocket(); // Establish a socket connection to the server
 * const roomName = 'exampleRoom';
 * const islevel = '2'; // Access level, e.g., '1' for regular user, '2' for co-host
 * const member = 'exampleUser'; // name of the user joining the room
 * const sec = '1234'; // Security code or password for joining a secured room
 * const apiUserName = 'exampleAPIUser'; // API user name
 * const consume = true; // Whether to join as a consumer or not
 *
 * try {
 *   const joinRoomData = await joinRoomClient(socket, roomName, islevel, member, sec, apiUserName);
 *   // Handle the data received after successfully joining the room
 * } catch (error) {
 *   console.log(error.message); // Handle errors during the joinRoom process
 * } finally {
 *   disconnectSocket(socket); // Disconnect the socket after the joinRoom process
 * }
 */

import { joinRoom } from '../../producers/producerEmits/joinRoom.js'; // Import the joinRoom function from the joinRoom.js file
import { joinConRoom  } from '../../producers/producerEmits/joinConRoom.js'; // Import the joinConRoom function from the joinConRoom.js file

export const joinRoomClient = async ({socket, roomName, islevel, member, sec, apiUserName,consume=false}) => {
    try {

      // Emit the joinRoom event to the server using the provided socket
      let data 
      
      if (consume) {
        data = await joinConRoom(socket, roomName, islevel, member, sec, apiUserName);
      } else {
        data = await joinRoom(socket, roomName, islevel, member, sec, apiUserName);
      }

      return data;
    } catch (error) {
      // Handle and log errors during the joinRoom process
      console.log(error);
      throw new Error('Failed to join the room. Please check your connection and try again.');
    }
  };
  
  // Example usage:
  // const socket = connectSocket(); // Establish a socket connection to the server
  // const roomName = 'exampleRoom';
  // const islevel = '2'; // Access level, e.g., '1' for regular user, '2' for co-host
  // const member = 'exampleUser'; // name of the user joining the room
  // const sec = '1234'; // Security code or password for joining a secured room
  // const apiUserName = 'exampleAPIUser'; // API user name
  //
  // try {
  //   const joinRoomData = await joinRoomClient(socket, roomName, islevel, member, sec, apiUserName);
  //   // Handle the data received after successfully joining the room
  // } catch (error) {
  //   console.log(error.message); // Handle errors during the joinRoom process
  // } finally {
  //   disconnectSocket(socket); // Disconnect the socket after the joinRoom process
  // }
  