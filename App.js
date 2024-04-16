import MediasfuGeneric from './components/mediasfuComponents/MediasfuGeneric';
import PreJoinPage from './components/miscComponents/PreJoinPage';

import { generateRandomParticipants } from './methods/utils/generateRandomParticipants';
import { generateRandomMessages } from './methods/utils/generateRandomMessages';
import { generateRandomRequestList } from './methods/utils/generateRandomRequestList';
import { generateRandomWaitingRoomList } from './methods/utils/generateRandomWaitingRoomList';

/**
 * Main component of the application.
 * 
 * @returns {JSX.Element} The rendered React element.
 */
function App() {

  // The API username and API key for the Mediasfu account; needed for MediaSFU default PreJoinPage
  const credentials = {apiUserName: "yourApiUserName", apiKey: "yourAPiKey"};


  // Whether to use seed data for generating random participants and messages
  const useSeed = false;
  let seedData = {};
  
  //inidcate the UI display type
  let eventType  = 'broadcast' // 'broadcast', 'chat', 'webinar', 'conference'


  // If using seed data, generate random participants and messages
  if (useSeed) {
    
    
    // Name of the member
    const memberName = 'Prince';
    
    // Name of the host (same as member if the member is the host)
    const hostName = 'Prince';

    // Generate random participants with Alice as member and Fred as host
    const participants_ = generateRandomParticipants(memberName, "", hostName, eventType==="broadcast" || eventType==="chat" ? true : false);
    
    // Generate random messages for the generated participants
    const messages_ = generateRandomMessages(participants_, memberName, "", hostName, eventType==="broadcast" || eventType==="chat" ? true : false);

    // Generate random requests for the generated participants
    const requests_ = generateRandomRequestList(participants_, memberName, "", 3);

    // Generate random waiting list for the generated participants
    const waitingList_ = generateRandomWaitingRoomList(participants_, memberName, "", 3);
  
    // Assign the generated participants and messages to seedData
    seedData = {
      participants: participants_,
      messages: messages_,
      requests: requests_,
      waitingList: waitingList_,
      member: memberName,
      host: hostName,
      eventType: eventType
    };
  }


  // Whether to use local UI mode; prevents making requests to the Mediasfu servers during UI development
  const useLocalUIMode = useSeed ? true : false;

  // Render the MediasfuBroadcast component with specified props
  return (
    <MediasfuGeneric PrejoinPage={PreJoinPage} credentials={credentials} useLocalUIMode={useLocalUIMode} useSeed={useSeed} seedData={useSeed ? seedData : {}} />
  );
}

export default App;



