/**
 * Generates an array of random participants for a meeting.
 *
 * @param {string} member - The name of the meeting member.
 * @param {string} coHost - The name of the meeting co-host.
 * @param {string} host - The name of the meeting host.
 * @param {boolean} [forChatBroadcast=false] - Indicates whether the participants are for chat or broadcast.
 * @returns {Array} An array of participant objects containing name, level, muted status, and ID.
 */
const generateRandomParticipants = (member, coHost, host, forChatBroadcast = false) => {
    const participants = [];
    let names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack', 'Kate', 'Liam', 'Mia', 'Nina', 'Olivia', 'Pete', 'Quinn', 'Rachel', 'Steve', 'Tina',
        'Ursula', 'Vince', 'Wendy', 'Xander', 'Yvonne', 'Zack'];

    // Limit names to 2 for chat broadcast
    if (forChatBroadcast) {
        names.splice(2);
    }

    // Place member, coHost, and host at the beginning if not already included
    if (!names.includes(member)) {
        names.unshift(member);
    }
    if (!names.includes(coHost) && !forChatBroadcast) {
        names.unshift(coHost);
    }
    if (!names.includes(host)) {
        names.unshift(host);
    }

    // Limit names to 2 for chat broadcast
    if (forChatBroadcast) {
        names.splice(2);
    }

    //remov names of length 1 or less
    names = names.filter(name => name.length > 1);

    // Shuffle the names array to ensure unique names for each participant
    const shuffledNames = [...names];
    for (let i = shuffledNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }

    let hasLevel2Participant = false;

    // Generate participant objects
    for (let i = 0; i < shuffledNames.length; i++) {
        const randomName = shuffledNames[i];
        const randomLevel = hasLevel2Participant ? '1' : randomName == host ? '2' : '1'; // Set islevel to '2' only once
        const randomMuted = forChatBroadcast ? true : Math.random() < 0.5; // Set muted to false for chat broadcast

        if (randomLevel === '2') {
            hasLevel2Participant = true;
        }

        participants.push({
            name: randomName,
            islevel: randomLevel,
            muted: randomMuted,
            id: i.toString(),
        });
    }

    return participants;
};

export { generateRandomParticipants };
