/**
 * Capture the canvas stream.
 * @param {Object} parameters - The parameters object.
 * @param {boolean} [start=true] - Indicates whether to start capturing the stream.
 * @returns {Promise<void>} - A promise that resolves when the canvas stream is captured.
 */
export const captureCanvasStream = async ({parameters, start=true}) => {
    try {

        let { canvasWhiteboard, 
              canvasStream,
             updateCanvasStream, 
             screenProducer,
             transportCreated,
             updateScreenProducer,

             
             //mediasfu functions
                sleep,
             createSendTransport,
              connectSendTransportScreen, 
              disconnectSendTransportScreen
             } = parameters;
     

      if (start && !canvasStream) {
        const stream = canvasWhiteboard.captureStream(30);
        canvasStream = stream;
        updateCanvasStream(stream);

        if (!transportCreated) {
          await createSendTransport({option: 'screen', parameters});
        } else {
          try {
            await screenProducer.close();
            updateScreenProducer(null);
            await sleep(500);
          } catch (error) {
            //console.log(error);
          }
          await connectSendTransportScreen({ stream, parameters });
        }
      } else {
        if (canvasStream) {
          canvasStream.getTracks().forEach(track => track.stop());
          canvasStream = null;
          updateCanvasStream(null);
          disconnectSendTransportScreen({ parameters });
        }
      }
    } catch (error) {
      console.log(error,'error in captureCanvasStream');
    }
  };