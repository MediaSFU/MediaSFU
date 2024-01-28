import {closeAndResize} from '../closeAndResize'

export const producerClosed = async ({ remoteProducerId, parameters }) => {

    let {
        consumerTransports,
        closeAndResize,
        screenId,

        updateConsumerTransports,

    } = parameters;
    

     //handle producer closed
     const producerToClose = await consumerTransports.find(transportData => transportData.producerId === remoteProducerId)

     if (!producerToClose) {
       return
     }
     // check if the ID of the producer to close is == screenId
     let kind = producerToClose.consumer.kind

     if (producerToClose.producerId == screenId) {
       kind = 'screenshare'
     }
     try {
       await producerToClose.consumerTransport.close()
     } catch (error) {

     }

     try {
       await producerToClose.consumer.close()
     } catch (error) {

     }

     consumerTransports = await consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId)
      updateConsumerTransports(consumerTransports)
     //close and resize the videos 
     await closeAndResize({ producerId: remoteProducerId, kind: kind, parameters: parameters })

}