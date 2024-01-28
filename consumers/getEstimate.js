/**
 * Gets an estimate for the number of rows and columns based on the total number of elements.
 *
 * @param {Object} options - The options object.
 * @param {number} options.n - The total number of elements to estimate for.
 * @param {Object} options.parameters - The parameters object containing various utility functions and state.
 * @returns {Array} An array containing the estimated number of elements to add, rows, and columns.
 * @throws Throws an error if there is an issue during estimation.
 */
export function GetEstimate({ n, parameters }) {
  try {
    // Destructure parameters
    let {
      fixedPageLimit,
      screenPageLimit,
      shareScreenStarted,
      shared,
      eventType,
      removeAltGrid,
      isWideScreen,
      isMediumScreen,
      updateRemoveAltGrid,
      
      //mediaSfu functions
      calculateRowsAndColumns,
    } = parameters;

    // Calculate rows and columns
    const [rows, cols] = calculateRowsAndColumns(n);

    // Check conditions for removing alt grid
    if (n < fixedPageLimit || ((shareScreenStarted || shared) && n < screenPageLimit + 1)) {
      removeAltGrid = true;
      updateRemoveAltGrid(removeAltGrid);

      // Return estimated values based on screen width
      if (!(isMediumScreen || isWideScreen)) {
        return eventType === 'chat' || (eventType === 'conference' && !(shareScreenStarted || shared))
          ? [n, n, 1]
          : [n, 1, n];
      } else {
        return eventType === 'chat' || (eventType === 'conference' && !(shareScreenStarted || shared))
          ? [n, 1, n]
          : [n, n, 1];
      }
    }

    return [rows * cols, rows, cols];
  } catch (error) {
    // Handle errors during estimation
    console.log('Error estimating rows and columns:', error.message);
    // throw error;
  }
}
