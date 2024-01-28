/**
 * Update media settings to close the video or screenshare of a participant.
 *
 * @param {Object} options - The options for closing video or screenshare.
 * @param {string} options.producerId - The id of the producer.
 * @param {string} options.kind - The kind of media ('video' or 'screenshare').
 * @param {Object} options.parameters - The parameters object containing update functions and state variables.
 *
 * @example
 * // Example usage of producerMediaClosed function
 * const options = {
 *   producerId: '12345', // ID of the producer
 *   kind: 'video', // Kind of media ('video' or 'screenshare')
 *   parameters: {
 *     consumerTransports: [], // Array of consumer transports
 *     updateConsumerTransports: (consumerTransports) => {}, // Function to update consumer transports
 *     closeAndResize: (producerId, kind) => {}, // Function to close and resize media
 *   },
 * };
 * await producerMediaClosed(options);
 */

export const producerMediaClosed = async ({ producerId, kind, parameters }) => {
    //update to close the video, screenshare of a participant
    //producerId is the id of the producer
    //kind is the kind of media (video, screenshare)
    //never emitted for audio

    let {getUpdatedAllParams} = parameters
    parameters = await getUpdatedAllParams()

    let {
        consumerTransports,
        updateConsumerTransports,
        HostLabel,
        shared,
        updateShared,
        updateShareScreenStarted,
        updateScreenId,
        updateShareEnded,

       //mediasfu functions
       closeAndResize,
       prepopulateUserMedia,
        reorderStreams,
    } = parameters;


    //opertaions to update ui to optimize interest levels and close the video or screenshare
    const producerToClose = await consumerTransports.find(transportData => transportData.producerId === producerId)

    if (producerToClose) {

      try {
        await producerToClose.consumerTransport.close()
      } catch (error) {

      }

      try {
        await producerToClose.consumer.close()
      } catch (error) {

      }

      consumerTransports = await consumerTransports.filter(transportData => transportData.producerId !== producerId)
      updateConsumerTransports(consumerTransports)
     
      await closeAndResize({ producerId: producerId, kind: kind, parameters: parameters })

    } else{
      //added to react native only
        if (kind == 'screenshare' || kind == 'screen') {
          if (shared){
            await updateShared(false)
          }else{
            await updateShareScreenStarted(false)
            await updateScreenId('')
          }
          await updateShareEnded(true)
          await prepopulateUserMedia({name: HostLabel,parameters})
          await reorderStreams({add: false, screenChanged: true, parameters})
        }
    }

}