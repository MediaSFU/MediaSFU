import MiniCard from '../components/displayComponents/MiniCard'
import VideoCard from '../components/displayComponents/VideoCard'
import AudioCard from '../components/displayComponents/AudioCard'
import MiniAudioPlayer from '../methods/utils/MiniAudioPlayer/MiniAudioPlayer'
import { RTCView } from '../methods/utils/webrtc/webrtc'

/**
 * Adds video components to the main and alternate video grids based on the provided parameters.
 *
 * @param {Object} options - The options object containing parameters for adding videos.
 * @param {Array} options.mainGridStreams - List of participants for the main video grid.
 * @param {Array} options.altGridStreams - List of participants for the alternate video grid.
 * @param {number} options.numtoadd - Number of videos to add to the grids.
 * @param {number} options.numRows - Number of rows in the grid.
 * @param {number} options.numCols - Number of columns in the grid.
 * @param {number} options.remainingVideos - Number of remaining videos.
 * @param {number} options.actualRows - Actual number of rows.
 * @param {boolean} options.removeAltGrid - Whether to remove the alternate video grid.
 * @param {number} options.ind - Index value.
 * @param {boolean} options.forChat - Indicates if the operation is for a chat.
 * @param {boolean} options.forChatMini - Indicates if the operation is for a chat mini view.
 * @param {Object} options.forChatCard - The chat card object.
 * @param {string} options.forChatID - The ID for chat.
 * @param {Object} options.parameters - Additional parameters required for the operation.
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */

export async function addVideosGrid({ mainGridStreams, altGridStreams, numtoadd, numRows, numCols, remainingVideos, actualRows, lastrowcols, removeAltGrid, ind, forChat = false, forChatMini = false, forChatCard = null, forChatID = null, parameters }) {
    let { getUpdatedAllParams } = parameters;
    parameters = await getUpdatedAllParams()
  
    let {
      participants,
      dispActiveNames,
      ref_participants,
      localStreamVideo,
      eventType,
      islevel,
      videoAlreadyOn,
      clickTimeout,
      clickCount,
      forceFullDisplay,
      windowWidth,
      windowHeight,
      componentSizes,
      otherGridStreams,
      updateOtherGridStreams,
      updateAddAltGrid,
      keepBackground,
      virtualStream,
      
  
      //mediasfu Functions
      updateMiniCardsGrid,
    } = parameters;
  
    let name
  
  
    windowWidth = componentSizes.width
    windowHeight = componentSizes.height
  
    //function to add videos to the grid
    let newComponents = [[], []]
  
    let participant_
    let participant
    let remoteProducerId
  
    numtoadd = await mainGridStreams.length
  
    let part_with_video = 0
    if (eventType == 'chat' && forChat) {
      //count number of participants with video on
      await participants.forEach((participant) => {
        if (participant.videoOn) {
          part_with_video = part_with_video + 1
        }
      })
    }
  
    if (removeAltGrid){
      await updateAddAltGrid(false)
    }
  
    // take the first numtoadd participants with video on - perfect fit
    for (var i = 0; i < numtoadd; i++) {
  
  
      participant = await mainGridStreams[i];
      remoteProducerId = await participant.producerId;
  
      let pseudoName
  
      //check if there is .name in the participant object and if it is null
      if ((participant.hasOwnProperty('producerId') && participant.producerId != null && participant.producerId !== "")) {
        //actual video
        pseudoName = false
      } else {
        pseudoName = true
      }
  
      if (pseudoName) {
  
        participant_ = participant
        remoteProducerId = await participant.name
  
        //check if the participant has an audioID  
        if ((participant.hasOwnProperty('audioID') && participant.audioID != null && participant.audioID !== "")) {
  
          await newComponents[0].push(<AudioCard
            name={participant.name}
            barColor={'white'}
            textColor={'white'}
            customStyle={{ backgroundColor: 'transparent' }}
            controlsPosition={'topLeft'}
            infoPosition={'topRight'}
            showWaveform={true}
            roundedImage={true}
            parameters={parameters}
            backgroundColor={"transparent"}
            showControls={eventType != 'chat'}
            participant={participant}
          />)
  
        } else {
  
          await newComponents[0].push(<MiniCard
            initials={participant.name}
            fontSize={20}
            customStyle={{ backgroundColor: 'transparent', border: '2px solid black' }}
          />)
  
        }
  
      } else {
  
        //check if the remoteProducerId is null and the stream is null
        if (remoteProducerId == 'youyou' || remoteProducerId == 'youyouyou') {
  
          if (!videoAlreadyOn) {
            name = 'You'
            if (islevel == '2' && eventType != 'chat') {
              name = 'You (Host)'
            }
  
            await newComponents[0].push(<MiniCard
              initials={name}
              fontSize={20}
              customStyle={{ backgroundColor: 'transparent', border: '2px solid black' }}
            />)
  
          } else {

            participant = { id: 'youyouyou', stream: keepBackground && virtualStream ? virtualStream : localStreamVideo, name: 'youyouyou' };
            participant_ = { id: 'youyou', videoID: 'youyou', name: 'youyouyou', stream: keepBackground && virtualStream ? virtualStream : localStreamVideo };
            participant.muted = true
            remoteProducerId = await 'youyouyou'
  
            await newComponents[0].push(<VideoCard
  
              videoStream={participant.stream ? participant.stream : null}
              remoteProducerId={participant.stream ? participant.stream.id : null}
              eventType={eventType}
              forceFullDisplay={eventType == 'webinar' ? false : forceFullDisplay}
              participant={participant}
              RTCView={RTCView}
              backgroundColor={"transparent"}
              showControls={false}
              showInfo={false}
              name={participant.name}
              doMirror={true}
              parameters={parameters}
  
            />)
  
  
  
          }
  
          //to do //chat miniview
  
        } else {
  
          //get from participants the participant with the remoteProducerId
          participant_ = await ref_participants.find(obj => {
            return obj.videoID === remoteProducerId
          })
  
          if (participant_) {
  
            let card
            let miniCard
  
            let elementSize = {
              width: windowWidth / 2,
              height: windowHeight / 2
            };
  
            await newComponents[0].push(<VideoCard
  
              videoStream={participant.stream ? participant.stream : null}
              remoteProducerId={remoteProducerId}
              eventType={eventType}
              forceFullDisplay={forceFullDisplay}
              participant={participant_}
              RTCView={RTCView}
              backgroundColor={"transparent"}
              showControls={eventType == 'chat' ? false : true}
              showInfo={true}
              name={participant_.name}
              doMirror={false}
              parameters={parameters}
            />)
  
  
          }
  
          //to do //chat miniview
        }
      }
  
      if (i == numtoadd - 1) {
  
        otherGridStreams[0] = await newComponents[0]
        
  
        await updateMiniCardsGrid({
          rows: numRows,
          cols: numCols,
          defal: true,
          actualRows: actualRows,
          ind: ind,
          parameters: parameters
        })
  
        await updateOtherGridStreams(otherGridStreams)
  
        await updateMiniCardsGrid({
          rows: numRows,
          cols: numCols,
          defal: true,
          actualRows: actualRows,
          ind: ind,
          parameters: parameters
        })
  
        
  
  
      }
  
  
    }
  
  
  
    //if we have more than 4 videos, we need to add a new row
    numtoadd = await altGridStreams.length;
  
    if (!removeAltGrid) {
  
      for (var i = 0; i < numtoadd; i++) {
  
        let participant = await altGridStreams[i];
  
        let remoteProducerId = await participant.producerId;
  
        let pseudoName
        let participant_
  
        //check if there is .name in the participant object and if it is null
        if ((participant.hasOwnProperty('producerId') && participant.producerId != null && participant.producerId !== "")) {
          //actual video
          pseudoName = false
        } else {
          pseudoName = true
        }
  
        if (pseudoName) {
  
          participant_ = participant
          remoteProducerId = await participant.name
  
  
          if ((participant.hasOwnProperty('audioID') && participant.audioID != null && participant.audioID !== "")) {
  
            await newComponents[1].push(<AudioCard
              name={participant.name}
              barColor={'white'}
              textColor={'white'}
              customStyle={{ backgroundColor: 'transparent' }}
              controlsPosition={'topLeft'}
              infoPosition={'topRight'}
              showWaveform={true}
              roundedImage={true}
              parameters={parameters}
              backgroundColor={"transparent"}
              showControls={eventType != 'chat'}
              participant={participant}
            />)
  
          } else {
  
            await newComponents[1].push(<MiniCard
              initials={participant.name}
              fontSize={20}
              customStyle={{ backgroundColor: 'transparent' , border: '2px solid black'}}
            />)
  
          }
  
        } else {
  
          participant_ = await ref_participants.find(obj => {
            return obj.videoID === remoteProducerId
          })
  
          await newComponents[1].push(<VideoCard
  
            videoStream={participant.stream ? participant.stream : null}
            remoteProducerId={remoteProducerId}
            eventType={eventType}
            forceFullDisplay={forceFullDisplay}
            participant={participant_}
            RTCView={RTCView}
            backgroundColor={"transparent"}
            showControls={eventType == 'chat' ? false : true}
            showInfo={true}
            name={participant.name}
            doMirror={false}
            parameters={parameters}
          />)
  
        }
  
        //if is the last one, updateMiniCardsGrid(activeVideos); compare with actives-numtoadd
        if (i == numtoadd - 1) {
  
          otherGridStreams[1] = await newComponents[1]
  
          await updateMiniCardsGrid({
            rows: 1,
            cols: lastrowcols,
            defal: false,
            actualRows: actualRows,
            ind: ind,
            parameters: parameters
          })
  
          await updateOtherGridStreams(otherGridStreams)
  
          await updateMiniCardsGrid({
            rows: 1,
            cols: lastrowcols,
            defal: false,
            actualRows: actualRows,
            ind: ind,
            parameters: parameters
          })
         
  
   
  
        }
  
      }
    } else {
      await updateAddAltGrid(false)
      otherGridStreams[1] = []
      
      await updateMiniCardsGrid({
        rows: 0,
        cols: 0,
        defal: false,
        actualRows: actualRows,
        ind: ind,
        parameters: parameters
      })
      await updateOtherGridStreams(otherGridStreams)
      await updateMiniCardsGrid({
        rows: 0,
        cols: 0,
        defal: false,
        actualRows: actualRows,
        ind: ind,
        parameters: parameters
      })
      
    }

 
}