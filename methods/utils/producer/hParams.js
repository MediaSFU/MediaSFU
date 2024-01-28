/**
 * Host parameters for video encoding for video sharing
 */
export const hParams = {
    encodings: [
      {
        rid: 'r8',
        maxBitrate: 240000,
        initialAvailableBitrate: 96000,
        minBitrate: 48000,
        scalabilityMode: 'L1T3',
        scaleResolutionDownBy: 4.0,
      },
      {
        rid: 'r9',
        maxBitrate: 480000,
        initialAvailableBitrate: 192000,
        minBitrate: 96000,
        scalabilityMode: 'L1T3',
        scaleResolutionDownBy: 2.0,
      },
      {
        rid: 'r10',
        maxBitrate: 960000,
        initialAvailableBitrate: 384000,
        minBitrate: 192000,
        scalabilityMode: 'L1T3',
      },
    ],
  
    codecOptions: {
      videoGoogleStartBitrate: 384
    }
  };
  

  