/**
 * Generates a random list of requests for each participant with unique icons.
 * 
 * @param {array} participants - An array containing information about all participants.
 * @param {string} hostName - The name of the host participant.
 * @param {string} coHostName - The name of the co-host participant.
 * @param {number} numberOfRequests - The number of requests to generate for each participant.
 * @returns {array} - An array containing random requests with unique icons for each participant.
 */
const generateRandomRequestList = (participants, hostName, coHostName, numberOfRequests) => {
    // Filter out the host and co-host from the participants
    const filteredParticipants = participants.filter(participant => participant.name !== hostName && participant.name !== coHostName);

    // Create an array with three possible request icons
    let requestIcons = ['fa-video', 'fa-desktop', 'fa-microphone'];

    // Shuffle the request icons array to ensure unique icons for each participant and randomly select minumum of 1 and maximum of 3 icons
    for (let i = requestIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [requestIcons[i], requestIcons[j]] = [requestIcons[j], requestIcons[i]];
    }

    // Generate unique requests for each participant with unique icons
    const requestList = filteredParticipants.flatMap(participant => {
      const uniqueIcons = new Set(); // To ensure unique icons for each participant

      const requests = [];
      for (let i = 0; i < numberOfRequests; i++) {
        let randomIcon;
        do {
          randomIcon = requestIcons[Math.floor(Math.random() * requestIcons.length)];
        } while (uniqueIcons.has(randomIcon));

        uniqueIcons.add(randomIcon);

        requests.push({
          id: participant.id,
          name: participant.name.toLowerCase().replace(/\s/g, '_'),
          icon: randomIcon,
          username: participant.name.toLowerCase().replace(/\s/g, '_'),
        });
      }

      return requests;
    });

    return requestList;
  };

export { generateRandomRequestList };
