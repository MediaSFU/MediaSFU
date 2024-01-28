/**
 * Video parameters for regular video encoding for video sharing (other members - not host)
 */
export const vParams = {
    encodings: [
      {
        rid: 'r3',
        maxBitrate: 200000,
        initialAvailableBitrate: 80000,
        minBitrate: 40000,
        scalabilityMode: 'L1T3',
        scaleResolutionDownBy: 4.0,
      },
      {
        rid: 'r4',
        maxBitrate: 400000,
        initialAvailableBitrate: 160000,
        minBitrate: 80000,
        scalabilityMode: 'L1T3',
        scaleResolutionDownBy: 2.0,
      },
      {
        rid: 'r5',
        maxBitrate: 800000,
        initialAvailableBitrate: 320000,
        minBitrate: 160000,
        scalabilityMode: 'L1T3',
      },
    ],
  
    codecOptions: {
      videoGoogleStartBitrate: 320
    }
  };
  

  