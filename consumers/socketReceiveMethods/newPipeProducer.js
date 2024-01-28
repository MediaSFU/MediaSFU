
import {signalNewConsumerTransport} from  '../../consumers/signalNewConsumerTransport';


export const newPipeProducer = async ({ producerId, islevel,nsock, parameters }) => {
    
    let {
        first_round,
        shareScreenStarted,
        shared,
        landScaped,
        showAlert,
        isWideScreen,

        updateFirstRound,
        updateLandScaped,
        

    } = parameters;
    //to dos
    await signalNewConsumerTransport({ remoteProducerId: producerId, islevel: islevel, nsock: nsock, parameters: parameters })

    first_round = false;
    if (shareScreenStarted || shared) {

      if (!isWideScreen) {

        if (!landScaped) {
          if (showAlert) {
            showAlert({
                message: 'Please rotate your device to landscape mode for better experience',
                type: 'success',
                duration: 3000,
            });
            }
          landScaped = true;
          updateLandScaped(landScaped)
        }

      }

      first_round = true;
      updateFirstRound(first_round)
    }

}