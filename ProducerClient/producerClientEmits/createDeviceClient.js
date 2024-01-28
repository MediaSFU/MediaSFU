/**
 * Creates a mediasoup client device and loads the specified RTP capabilities.
 * This function initializes the device used for media processing in the client.
 *
 * @param {Object} rtpCapabilities - The RTP capabilities to load into the device.
 * @param {Object} mediasoupClient - The mediasoup client library.
 *
 * @returns {Promise<mediasoupClient.Device>} A Promise that resolves with the created mediasoup client device.
 * @throws {UnsupportedError} If the device creation is not supported by the browser.
 *
 * @example
 * const rtpCapabilities = {...}; // RTP capabilities obtained from the server
 * const mediasoupClient = require('mediasoup-client');
 *
 * try {
 *   const device = await createDevice(rtpCapabilities, mediasoupClient);
 *   // Use the created device for further media processing
 * } catch (error) {
 *   if (error.name === 'UnsupportedError') {
 *     // Handle unsupported device creation
 *   }
 * }
 */
    export const createDeviceClient = async ({rtpCapabilities, mediasoupClient}) => {
    try {
      
      // Validate input parameters
      if (!rtpCapabilities || !mediasoupClient) {
        throw new Error('Both rtpCapabilities and mediasoupClient must be provided.');
      }
  
      // Create a mediasoup client device
      const device = await new mediasoupClient.Device();
      
     
      //remove orientation capabilities
      rtpCapabilities.headerExtensions = rtpCapabilities.headerExtensions.filter(
        ext => ext.uri !== 'urn:3gpp:video-orientation'
      )
     
      // Load the provided RTP capabilities into the device
      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });
  
      // Perform additional initialization, e.g., loading spinner and retrieving messages
  
      return device;
    } catch (error) {
      // Handle specific errors, e.g., UnsupportedError
      if (error.name === 'UnsupportedError') {
        // Handle unsupported device creation
      }
  
      throw error; // Propagate other errors
    }
  };
  
  // Example usage:
  // const rtpCapabilities = {...}; // RTP capabilities obtained from the server
  // const mediasoupClient = require('mediasoup-client');
  // try {
  //   const device = await createDevice(rtpCapabilities, mediasoupClient);
  //   // Use the created device for further media processing
  // } catch (error) {
  //   if (error.name === 'UnsupportedError') {
  //     // Handle unsupported device creation
  //   }
  // }
  