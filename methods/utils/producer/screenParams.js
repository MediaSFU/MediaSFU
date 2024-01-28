/**
 * Screen parameters for video encoding for screen sharing
 */
export const screenParams = {
    encodings: [
      {
        rid: 'r7',
        maxBitrate: 3000000,
        initialAvailableBitrate: 1500000,
      }
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000
    }
  };
  
 
  