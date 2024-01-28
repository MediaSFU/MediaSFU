// muteParticipants methods
export const muteParticipants = async({
  
    parameters
  }
    ) => {
  
      const {socket, coHostResponsibility, participant, member,islevel,showAlert,coHost, roomName } = parameters;

      let mediaValue = false;
  

      try {
        mediaValue = coHostResponsibility.find((item) => item.name === 'media').value;
      } catch (error) {}
  
      if (islevel === '2' || (coHost === member && mediaValue === true)) {
        if (!participant.muted && participant.islevel !== '2') {
          const participantId = participant.id;
          await socket.emit('controlMedia', ({ participantId, participantName:participant.name, type:'all', roomName }));

        }
      } else {
        if (showAlert) {
            showAlert({
               message: 'You are not allowed to mute other participants',
                type: 'danger',
                duration: 3000,
            });
        }

      }

      
     
};
