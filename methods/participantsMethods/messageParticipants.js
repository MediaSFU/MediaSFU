// messageParticipants methods
export const messageParticipants = ({
    // isLevel='1',
    // roomName,
    // adminPasscode,
    // coHostResponsibility,
    parameters
  }
    ) => {
  
      const { 
        coHostResponsibility, participant, member,islevel,showAlert,coHost,
        updateIsMessagesModalVisible,updateDirectMessageDetails,updateStartDirectMessage
    
     } = parameters;

        let chatValue = false;

        try {
            chatValue = coHostResponsibility.find((item) => item.name === 'chat').value;
            }
        catch (error) {}

        if (islevel === '2' || (coHost === member && chatValue === true)) {
            if (participant.islevel !== '2') {
                let senderId = participant.name;
                console.log('messageParticipants', senderId);
                updateDirectMessageDetails(participant);
                updateStartDirectMessage(true);
                updateIsMessagesModalVisible(true);
                
            }
        } else {
            if (showAlert) {
                showAlert({
                    message: 'You are not allowed to send this message',
                    type: 'danger',
                    duration: 3000,
                });


            }

            return;
        }

     
};
