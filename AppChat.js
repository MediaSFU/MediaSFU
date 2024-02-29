
import MediasfuChat from './components/mediasfuComponents/MediasfuChat';
import { generateRandomParticipants } from './methods/utils/generateRandomParticipants';
import { generateRandomMessages } from './methods/utils/generateRandomMessages';

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
    const hostName = 'Fred';

    // Generate random participants with Alice as member and Fred as host
    const participants_ = generateRandomParticipants(memberName, "", hostName, true);
    
    // Generate random messages for the generated participants
    const messages_ = generateRandomMessages(participants_, memberName, "", hostName, true);
  
    // Assign the generated participants and messages to seedData
    seedData = {
      participants: participants_,
      messages: messages_,
      member: memberName,
      host: hostName,
    };
  }

  // Whether to use local UI mode; prevents making requests to the Mediasfu servers during UI development
  const useLocalUIMode = useSeed ? true : false;

  // Render the MediasfuChat component with specified props
  return (
    <MediasfuChat useLocalUIMode={useLocalUIMode} useSeed={useSeed} seedData={useSeed ? seedData : {}} />
  );
}

export default App;