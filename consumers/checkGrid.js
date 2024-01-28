/**
 * Checks if an additional grid needs to be added or removed based on the number of rows, columns, and active items.
 *
 * @param {number} rows - The current number of rows in the grid.
 * @param {number} cols - The current number of columns in the grid.
 * @param {number} actives - The total number of active items in the grid.
 * @returns {Array} An array containing information about whether to remove the alternative grid, the number of items to add, the new number of rows, columns, remaining videos, and actual rows.
 */
export async function checkGrid(rows, cols, actives) {
  try {
    let numRows = 0;
    let numCols = 0;
    let lastrow = 0;
    let lastrowcols = 0;
    let remainingVideos = 0;
    let numtoadd = 0;
    let actualRows = 0;
    let removeAltGrid = false;

    if (rows * cols !== actives) {
      if (rows * cols > actives) {
        const res = actives - (rows - 1) * cols;
        if (cols * 0.5 < res) {
          lastrow = rows;
          lastrowcols = res;
          remainingVideos = lastrowcols;
        } else {
          lastrowcols = res + cols;
          lastrow = rows - 1;
          remainingVideos = lastrowcols;
        }

        numRows = lastrow - 1;
        numCols = cols;
        numtoadd = (lastrow - 1) * numCols;
        actualRows = lastrow;

        removeAltGrid = false;
      }
    } else {
      // Perfect fit
      numCols = cols;
      numRows = rows;
      lastrow = rows;
      lastrowcols = cols;
      remainingVideos = 0;
      numtoadd = lastrow * numCols;
      actualRows = lastrow;
      removeAltGrid = true;
    }

    return [removeAltGrid, numtoadd, numRows, numCols, remainingVideos, actualRows, lastrowcols];
  } catch (error) {
    console.log('checkGrid error', error);
    // throw error;
  }
}
