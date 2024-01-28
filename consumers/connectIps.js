/**
 * Connects to remote IPs (subdomains) and establishes WebSocket connections.
 *
 * @param {Array} consume_sockets - An array of WebSocket connections to remote sockets.
 * @param {string[]} remIP - An array of remote IPs (subdomains).
 * @param {object} rtpCapabilities - RTP capabilities object.
 * @param {function} newProducerMethod - A method to handle new pipe producer events.
 * @param {function} closedProducerMethod - A method to handle producer closed events.
 * @param {function} joinConsumeRoomMethod - A method to join a consuming room.
 * @returns {Array} - Updated array of WebSocket connections (consume_sockets).
 */

import { connectSocket,disconnectSocket } from '../sockets/SocketManager';
import { joinConRoom } from '../producers/producerEmits/joinConRoom';
import { newPipeProducer } from './socketReceiveMethods/newPipeProducer';
import { producerClosed } from './socketReceiveMethods/producerClosed';
import { joinConsumeRoom } from './socketReceiveMethods/joinConsumeRoom';

export const connectIps = async ({
  consume_sockets,
   remIP, 
   apiUserName, 
   apiKey,
    apiToken, 

      //mediasfu methods
      newProducerMethod=newPipeProducer,
      closedProducerMethod=producerClosed,
      joinConsumeRoomMethod=joinConsumeRoom,
      parameters}) => {
     
    try {
        const {roomName, islevel, member, roomRecvIPs,showAlert,rtpCapabilities,updateRoomRecvIPs,
            updateConsume_sockets
        } = parameters;

        if (!consume_sockets || !remIP || !apiUserName || (!apiKey && !apiToken)) {
            const { showAlert } = parameters;

            // if (showAlert) {
            //     showAlert({
            //         message: 'Missing required parameters - consume_sockets, remIP, apiUserName, apiKey, apiToken',
            //         type: 'danger',
            //         duration: 3000,
            //     });
            // }
            console.log('Missing required parameters' , consume_sockets, remIP, apiUserName, apiKey, apiToken)
            console.log('Missing required parameters - consume_sockets, remIP, apiUserName, apiKey, apiToken')
            return [consume_sockets, roomRecvIPs];
         }

        await remIP.forEach(async ip => {
            try {
              // Check if the IP is already connected
              const matching = await consume_sockets.find((socketObj) => Object.keys(socketObj)[0] == ip);
        
              if (matching || (!ip || ip == '' || ip == null || ip == undefined)) {
                // Skip if the IP is already connected
                return;
              } else {
                // Connect to the remote socket using socket.io-client
                const remote_sock = await connectSocket(apiUserName, apiKey, apiToken, `https://${ip}.mediasfu.com`);
        
                // Handle successful connection to the remote socket
                if (remote_sock.id) {
                    
                    let socketId = remote_sock.id;
                    console.log('connection-success',socketId)
                  // Check if the IP is in the roomRecvIPs, if not, add it
                  if (!roomRecvIPs.includes(ip)) {
                    roomRecvIPs.push(ip);
                    updateRoomRecvIPs(roomRecvIPs);
                  }
        
                  // Handle new pipe producer event
                 await remote_sock.on('new-pipe-producer', async ({ producerId,  islevel }) => {
                    // Handle new producer
                    if (newProducerMethod){
                        await newProducerMethod({ producerId, islevel, nsock:remote_sock, parameters });
                    }
                  });
        
                  // Handle producer closed event
                 await remote_sock.on('producer-closed', async ({ remoteProducerId }) => {
                    // Handle producer closed
                    if (closedProducerMethod){
                        await closedProducerMethod({ remoteProducerId, parameters });
                    }
                  });
        
                  // Handle new consuming room by joining the room
                  if (joinConsumeRoomMethod){
                      let data = await joinConsumeRoomMethod({ remote_sock, apiToken, apiUserName, parameters });
                      if (!data.rtpCapabilities){
                          return;
                      }
                  }else{
                    try {
                       console.log('joinConsumeRoomMethod', roomName, islevel, member, apiToken, apiUserName)
                       let data =  await joinConsumeRoomMethod({ remote_sock, apiToken, apiUserName, parameters });
                      //  let data  =  await joinConRoom(remote_sock, roomName, islevel, member, apiToken, apiUserName);  
                       if (!data.rtpCapabilities){
                           return;
                       }
                    } catch (error) {
                         console.log('joinConsumeRoomMethod error',error)
                         const { showAlert } = parameters;
                         if (showAlert) {
                             showAlert({
                                 message: error.message,
                                 type: 'danger',
                                 duration: 3000,
                             });
                         }
                    }
                      
                  }
                  
        
                  // Add the remote socket to the consume_sockets array
                  await consume_sockets.push({ [ip]: remote_sock });
                  updateConsume_sockets(consume_sockets);
                };
              }
            } catch (error) {
              // Handle the error
              console.log(error,'connectIps error')
            }
          });
        
          return [consume_sockets, roomRecvIPs];
          
    } catch (error) {
        // Handle the error
        console.log(error,'connectIps error')
        // try {
            
        //     const { showAlert } = parameters;
        //     if (showAlert) {
        //         showAlert({
        //             message: error.message,
        //             type: 'danger',
        //             duration: 3000,
        //         });
        //     }
        // } catch (error) {
           
        // }
        
    }
    
  
  };
  