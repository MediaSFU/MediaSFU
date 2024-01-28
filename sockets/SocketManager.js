//Socket manager for media socket.
import io from 'socket.io-client';

let socket;

/**
 * Validates the provided API key or token.
 * @param {string} value - The API key or token to validate.
 * @returns {Boolean} - True if the API key or token is valid, false otherwise.
 */
async function validateApiKeyToken(value) {
  // validate inputs

  // api key or token must be alphanumeric and length 64
  if (!/^[a-z0-9]{64}$/i.test(value)) {
    throw new Error('Invalid API key or token.');
  }

  return true;
}

/**
 * Connects to a socket using the provided credentials and joins a room.
 *
 * @param {string} apiUserName - The API username associated with the user's account (required and replaceable with meetingID (roomName)).
 * @param {string} apiKey - The API key associated with the user's account (required if apiToken is not provided).
 * @param {string} apiToken - The API token (secret) associated with the user's account (required if apiKey is not provided).
 * @param {string} link - The link to the socket server.
 * @returns {Promise<Socket>} - A Promise that resolves with the socket instance when the connection is established.
 */
async function connectSocket(apiUserName, apiKey, apiToken, link) {
  // validate inputs
  if (!apiUserName) {
    throw new Error('API username required.');
  }
  if (!(apiKey || apiToken)) {
    throw new Error('API key or token required.');
  }
  if (!link) {
    throw new Error('Socket link required.');
  }

  // validate the api key or token
  let useKey = false;
  try {
    if (apiKey && apiKey.length == 64) {
      await validateApiKeyToken(apiKey);
      useKey = true;
    } else {
      await validateApiKeyToken(apiToken);
      useKey = false;
    }
  } catch (error) {
    throw new Error('Invalid API key or token.');
  }
 

  return new Promise((resolve, reject) => {
    // Connect to socket using the link provided
    if (useKey) {
        socket = io(`${link}/media`, {
        transports: ['websocket'],
        query: `apiUserName=${apiUserName}&apiKey=${apiKey}`,
        });
    } else {
        socket = io(`${link}/media`, {
        transports: ['websocket'],
        query: `apiUserName=${apiUserName}&apiToken=${apiToken}`,
         });
    }

    // Handle socket connection events
    socket.on('connection-success', ({ socketId }) => {
      console.log('Connected to media socket.', socketId);
      resolve(socket);

      
    });

    socket.on('connect_error', (error) => {
      reject(new Error('Error connecting to media socket.'));
    });

 
  });
}

/**
 * Disconnects from the socket.
 */
async function disconnectSocket(socket) {
  if (socket) {
    await socket.disconnect(true);
 }

  return true;
}

export { connectSocket, disconnectSocket };

