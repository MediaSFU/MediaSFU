/**
 * Handles the reception of a new message.
 * @function
 * @async
 * @param {Object} options - The options object.
 * @param {Object} options.message - The received message object containing details like sender, receivers, message content, timestamp, and group.
 * @param {Object} options.parameters - The parameters object containing various state variables and update functions.
 * @param {Array} options.messages - The array containing existing messages.
 * @param {Array} options.participantsAll - The array containing information about all participants.
 * @param {boolean} options.hideSpannedMessages - A boolean indicating whether to hide messages from blocked senders.
 * @param {string} options.member - The name of the current member.
 * @param {string} options.eventType - The type of event, e.g., 'broadcast', 'chat'.
 * @param {string} options.islevel - The level of the current member.
 * @param {string} options.coHost - The name of the co-host, if any.
 * @param {function} options.updateMessages - The function to update the messages state variable.
 * @param {function} options.updateShowMessagesBadge - The function to update the state variable indicating whether to show the message count badge.

 * @returns {void}
 */
export const receiveMessage = async ({ message, parameters }) => {
   
  let { getUpdatedAllParams } = parameters;
  parameters = await getUpdatedAllParams()

  // Destructure options
  let {
      messages,
      participantsAll,
      hideSpannedMessages,
      member,
      eventType,
      islevel,
      coHost,
      updateMessages,
      updateShowMessagesBadge,
  } = parameters;


  // Add the received message to the messages array
  const { sender, receivers, message: content, timestamp, group } = message;
  let oldMessages = messages;
  messages =  [...messages, { sender, receivers, message: content, timestamp, group }];

  // Filter out messages with banned senders in the participants array; keep others that are not banned and not in the participants array
  if (eventType !== 'broadcast' && eventType !== 'chat') {
      messages = await messages.filter((message) => participantsAll.some(participant => participant.name == message.sender && participant.isBanned == false));
      await updateMessages(messages);
  } else {
      messages = await messages.filter((message) => {
          const participant = participantsAll.find((participant) => participant.name === message.sender);
          return !participant || !participant.isBanned;
      });
     await updateMessages(messages);
  }

  // Separate group and direct messages
  const oldGroupMessages = await oldMessages.filter((message) => message.group === true);
  const oldDirectMessages = await oldMessages.filter((message) => message.group === false);

  // Render and update counts for group messages
  const groupMessages = await messages.filter((message) => message.group === true);

  if (eventType !== 'broadcast' && eventType !== 'chat') {
      // Check if oldGroupMessages length is different from groupMessages length
      if (oldGroupMessages.length !== groupMessages.length) {
          // Identify new messages
          const newGroupMessages = await groupMessages.filter((message) => {
              const isDuplicate = oldGroupMessages.some((oldMessage) => oldMessage.timestamp === message.timestamp);
              return !isDuplicate;
          });

          // Check if newGroupMessages sender is the member or receivers include the member
          const newGroupMessages2 = await newGroupMessages.filter((message) => message.sender === member || message.receivers.includes(member));

          // Check if member is the sender of any newGroupMessages
          let newGroupMessages3 = await newGroupMessages2.filter((message) => message.sender === member);

          // Check if member is the receiver of any newGroupMessages
          if (newGroupMessages.length > 0) {
              if (newGroupMessages.length !== newGroupMessages3.length) {
                  // Show the message-count
                  updateShowMessagesBadge(true);
              }
          }
      }
  }

  // Render and update counts for direct messages
  const directMessages = await messages.filter((message) => message.group === false);

  if (eventType !== 'broadcast' && eventType !== 'chat') {
      // Check if oldDirectMessages length is different from directMessages length
      if (oldDirectMessages.length !== directMessages.length) {
          // Identify new direct messages
          const newDirectMessages = directMessages.filter((message) => {
              const isDuplicate = oldDirectMessages.some((oldMessage) => oldMessage.timestamp === message.timestamp);
              return !isDuplicate;
          });

          // Check if newDirectMessages sender is the member or receivers include the member
          const newDirectMessages2 = await newDirectMessages.filter((message) => message.sender === member || message.receivers.includes(member));

          // Check if member is the sender of any newDirectMessages
          const newDirectMessages3 = await newDirectMessages2.filter((message) => message.sender === member);

          if ((newDirectMessages.length > 0 && newDirectMessages2.length > 0) || (newDirectMessages.length > 0 && (islevel === '2') || coHost === member)) {
              if ((islevel === '2') || coHost === member) {
                  if (newDirectMessages.length !== newDirectMessages3.length) {
                      // Show the message-count
                      updateShowMessagesBadge(true);
                  }
              } else {
                  if (newDirectMessages2.length > 0) {
                      if (newDirectMessages.length !== newDirectMessages3.length) {
                          // Show the message-count
                          updateShowMessagesBadge(true);
                      }
                  }
              }
          }
      }
  }
};
