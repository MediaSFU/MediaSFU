/**
 * Generates an array of random chat messages for a meeting.
 *
 * @param {Array} participants - Array of participant objects containing name, level, muted status, and ID.
 * @param {string} member - The name of the meeting member.
 * @param {string} coHost - The name of the meeting co-host.
 * @param {string} host - The name of the meeting host.
 * @param {boolean} [forChatBroadcast=false] - Indicates whether the messages are for chat broadcast or individual chat.
 * @returns {Array} An array of message objects containing sender, receivers, message content, timestamp, and group flag.
 */
const generateRandomMessages = (participants, member, coHost, host, forChatBroadcast = false) => {
    const messages = [];

    // Function to get a random participant other than the sender
    const getRandomReceiver = (sender) => {
        const potentialReceivers = participants.filter((participant) => participant.name !== sender);
        const randomReceiver = potentialReceivers[Math.floor(Math.random() * potentialReceivers.length)];
        return randomReceiver.name;
    };

    // Force add messages for specific participants
    let refNames = [];
    if (forChatBroadcast) {
        refNames = [member, host];
    } else {
        if (coHost) {
            refNames = [member, coHost, host, ...participants.map((participant) => participant.name)];
        } else {
            refNames = [member, host, ...participants.map((participant) => participant.name)];
        }
    }


    // Return unique names for the refNames
    refNames = [...new Set(refNames)];

    // Generate messages
    let timeIncrement = 0;
    refNames.forEach((sender, index) => {
        // Send direct messages
        const directMessage = {
            sender: sender,
            receivers: [getRandomReceiver(sender)],
            message: `Direct message from ${sender}`,
            timestamp: new Date(Date.now() + timeIncrement).toLocaleTimeString(),
            group: false,
        };

        messages.push(directMessage);

        // Send group messages
        const groupMessage = {
            sender: sender,
            receivers: participants.map((participant) => participant.name),
            message: `Group message from ${sender}`,
            timestamp: new Date(Date.now() + timeIncrement).toLocaleTimeString(),
            group: true,
        };
        messages.push(groupMessage);

        timeIncrement += 15000; // Increment time by 15 seconds for each message
    });

    return messages;

    return messages;
};

export { generateRandomMessages };