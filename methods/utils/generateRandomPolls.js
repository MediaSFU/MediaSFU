/**
 * Generates random seed polls for testing purposes.
 *
 * @param {number} numberOfPolls - The number of seed polls to generate.
 * @returns {Array} An array of poll objects containing question, type, options, votes, and status.
 */
const generateRandomPolls = (numberOfPolls) => {
  const pollTypes = ['trueFalse', 'yesNo', 'custom'];
  const polls = [];

  for (let i = 0; i < numberOfPolls; i++) {
    const type = pollTypes[Math.floor(Math.random() * pollTypes.length)];
    let options;

    switch (type) {
      case 'trueFalse':
        options = ['True', 'False'];
        break;
      case 'yesNo':
        options = ['Yes', 'No'];
        break;
      case 'custom':
        options = Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, idx) => `Option ${idx + 1}`);
        break;
      default:
        options = [];
    }

    const poll = {
      id: i + 1, // Incremental number as ID
      question: `Random Question ${i + 1}`,
      type,
      options,
      votes: Array(options.length).fill(0),
      status: 'inactive', // or 'active'
      voters: {},
    };

    polls.push(poll);
  }

  return polls;
};

export { generateRandomPolls };
