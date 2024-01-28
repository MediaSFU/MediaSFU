/**
 * Joins a room using the provided parameters to produce media.
 *
 * @param {Socket} socket - The socket instance.
 * @param {string} roomName - The name of the room to join.
 * @param {boolean} islevel - The level of the room.
 * @param {string} member - The name of the user joining the room.
 * @param {string} sec - The apiToken.
 * @param {string} apiUserName - The API username associated with the user's account.
 * @returns {Promise<object>} - A Promise that resolves with the data received from the 'joinRoom' event.
 */



import { validateAlphanumeric } from '../../methods/utils/validateAlphanumeric.js'; // Import the validateAlphanumeric function from the validateAlphanumeric.js file

async function joinRoom(socket, roomName, islevel, member, sec, apiUserName) {
   
    return new Promise((resolve, reject) => {
      // Validate inputs
      if (!(sec && roomName && islevel && apiUserName && member)) {
        const validationError = {success:false, rtpCapabilities: null, reason: 'Missing required parameters' };
        reject(validationError);
        return;
      }
  
      // Validate alphanumeric for roomName, apiUserName, and member
      try {
         validateAlphanumeric(roomName);
         validateAlphanumeric(apiUserName);
         validateAlphanumeric(member);
      } catch (error) {
        const validationError = { success:false, rtpCapabilities: null, reason: 'Invalid roomName or apiUserName or member' };
        reject(validationError);
        return;
      }
  
      // Validate roomName starts with 's' or 'p'
      if (!(roomName.startsWith('s') || roomName.startsWith('p'))) {
        const validationError = {success:false, rtpCapabilities: null, reason: 'Invalid roomName, must start with s or p' };
        reject(validationError);
        return;
      }
  
      // Validate other conditions for sec, roomName, islevel, apiUserName
      if (!(sec.length === 64 && roomName.length >= 8 && islevel.length === 1 && apiUserName.length >= 6
        && (islevel === '0' || islevel === '1' || islevel === '2'))) {
        const validationError = {success:false, rtpCapabilities: null, reason: 'Invalid roomName or islevel or apiUserName or secret' };
        reject(validationError);
        return;
      }


      socket.emit('joinRoom', { roomName, islevel, member,sec,apiUserName }, async (data) => {

        try {
          // Check if rtpCapabilities is null
          if (data.rtpCapabilities === null) {
            // Check if banned, suspended, or noAdmin
            if (data.banned) {
              throw new Error('User is banned.');
            }
            if (data.suspended) {
              throw new Error('User is suspended.');
            }
            if (data.noAdmin) {
              throw new Error('Host has not joined the room yet.');
            }
  
            // If not null, create device or perform other actions as needed
            // ...
  
            // Resolve with the data received from the 'joinRoom' event
            resolve(data);
          } else {
            // Handle other cases or perform additional actions
            // ...
  
            // Resolve with the data received from the 'joinRoom' event
            resolve(data);
          }
        } catch (error) {
          // Handle errors during the joinRoom process
          console.log('Error joining room:', error);
          reject(error);
        }
      });
    });
  }
  
  export { joinRoom };
  