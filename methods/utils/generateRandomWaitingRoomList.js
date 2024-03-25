/**
 * Generates a waiting room list with randomly assigned names and mute statuses for participants.
 * 
 * @param {array} participants - An array containing information about all participants.
 * @returns {array} - An array containing participants in the waiting room with their names, mute statuses, and IDs.
 */
const generateRandomWaitingRoomList = (participants) => {
    // Array of random names to assign to participants in the waiting room
    let names = ['Dimen', 'Nore', 'Ker', 'Lor', 'Mik'];

    // Loop through the names array and add participants to the waiting room list
    let waitingRoomList = [];
    for (let i = 0; i < names.length; i++) {
      const randomName = names[i];
      const randomMuted = Math.random() < 0.5; // Randomly assign mute status
      waitingRoomList.push({
        name: randomName,
        muted: randomMuted,
        id: i.toString(),
      });
    }

    return waitingRoomList;
  };

export { generateRandomWaitingRoomList };
