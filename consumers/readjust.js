import { onScreenChanges } from "./onScreenChanges";

/**
 * Function to readjust the grid sizes.
 *
 * @param {Object} options - The options object.
 * @param {number} options.n - The value of 'n'.
 * @param {number} options.state - The state value.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @param {number} options.parameters.eventType - The type of the event.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing is started.
 * @param {boolean} options.parameters.shared - Indicates if screen is shared.
 * @param {number} options.parameters.mainHeightWidth - The main height width value.
 * @param {number} options.parameters.prevMainHeightWidth - The previous main height width value.
 * @param {number} options.parameters.nForReadjust - The value used for readjustment.
 * @param {string} options.parameters.HostLabel - The label for the host.
 * @param {boolean} options.parameters.first_round - Indicates if it's the first round.
 * @param {boolean} options.parameters.lock_screen - Indicates if the screen is locked.
 * @param {boolean} options.parameters.isBrowserBarHidden - Indicates if the browser bar is hidden.
 * @param {Function} options.parameters.updateMainHeightWidth - Function to update the main height width.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 * @throws Throws an error if there is an issue during the process of updating grid sizes.
 */
export async function readjust({ n, state, parameters }) {

  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams()
  
  try {
    // Destructure parameters
    let {
        eventType,
        shareScreenStarted,
        shared,
        mainHeightWidth,
        prevMainHeightWidth,
        nForReadjust,
        HostLabel,
        first_round,
        lock_screen,

        isBrowserBarHidden,
        updateMainHeightWidth,
        
        //media functions
        prepopulateUserMedia,
        onScreenChanges
    } = parameters;
    

   if (state == 0) {
     nForReadjust = await n
     prevMainHeightWidth = await mainHeightWidth
   }

   let val1 = 6
   let val2 = 12 - val1
   let cal1 = Math.floor((val1 / 12) * 100)
   let cal2 = 100 - cal1

   if (eventType == 'broadcast') {
     val1 = await 0
     val2 = await 12 - val1

     if (n == 0) {
       val1 = await 0
       val2 = await 12 - val1
     }

   } else if (eventType == 'chat' || (eventType == 'conference' && !(shareScreenStarted || shared))) {
     val1 = await 12
     val2 = await 12 - val1

   } else {

     if (shareScreenStarted || shared) {
       val2 = await 10
       val1 = await 12 - val2

     } else {

       if (n == 0) {
         val1 = await 1
         val2 = await 12 - val1
       } else if (n >= 1 && n < 4) {
         val1 = await 4
         val2 = await 12 - val1
       } else if (n >= 4 && n < 6) {
         val1 = await 6
         val2 = await 12 - val1

       } else if (n >= 6 && n < 9) {
         val1 = await 6
         val2 = await 12 - val1
       } else if (n >= 9 && n < 12) {
         val1 = await 6
         val2 = await 12 - val1
       } else if (n >= 12 && n < 20) {
         val1 = await 8
         val2 = await 12 - val1
       } else if (n >= 20 && n < 50) {
         val1 = await 8
         val2 = await 12 - val1
       } else {
         val1 = await 10
         val2 = await 12 - val1
       }
     }
   }

   if (state == 0) {
     mainHeightWidth = await val2
   }

   cal1 = await Math.floor((val1 / 12) * 100)
   cal2 = await 100 - cal1

   updateMainHeightWidth(cal2)

   if (prevMainHeightWidth != mainHeightWidth) {

     if (!lock_screen && !shared) {
       await prepopulateUserMedia({name: HostLabel,parameters})
     } else {
       if (!first_round) {
         await prepopulateUserMedia({name: HostLabel,parameters})
       }
     }

   }

 } catch (error) {
    // Handle errors during the process of updating grid sizes
    console.log('Error updating grid sizes:', error.message);
    // throw error;
  }
}