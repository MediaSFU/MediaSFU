import { getPipedProducersAlt  }  from '../getPipedProducersAlt'

export const createReceiveAllPipedTransports = async ({nsock, parameters}) => {

    let {
        roomName,
        member,
        } = parameters;
    

    // receive transports from an IP (nsock)
    await nsock.emit('createReceiveAllTransportsPiped', { roomName, member }, async ({ producersExist }) => {
  
      let options = ['0', '1', '2']
      if (producersExist) {
        for (let i = 0; i < options.length; i++) {
          let islevel = options[i]
          await getPipedProducersAlt({nsock,islevel, parameters})
        }
      }

    })

  }