
import MediasfuConference from './components/mediasfuComponents/MediasfuConference';
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
  // Whether to use seed data for generating random participants and messages
  const useSeed = true;
  let seedData = {};


  // If using seed data, generate random participants and messages
  if (useSeed) {
    
    
    // Name of the member
    const memberName = 'Alice';
    
    // Name of the host (same as member if the member is the host)
    const hostName = 'Alice';

    // Generate random participants with Alice as member and Fred as host
    const participants_ = generateRandomParticipants(memberName, "", hostName, false);
    
    // Generate random messages for the generated participants
    const messages_ = generateRandomMessages(participants_, memberName, "", hostName, false);

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
    };
  }


  // Whether to use local UI mode; prevents making requests to the Mediasfu servers during UI development
  const useLocalUIMode = useSeed ? true : false;

  // Render the MediasfuBroadcast component with specified props
  return (
    <MediasfuConference useLocalUIMode={useLocalUIMode} useSeed={useSeed} seedData={useSeed ? seedData : {}} />
  );
}

export default App;