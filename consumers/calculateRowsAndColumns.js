/**
 * Calculates the number of rows and columns needed to display a given number of videos.
 *
 * @param {number} n - The total number of videos to be displayed.
 * @returns {Array<number>} - An array containing two values: the number of rows and the number of columns.
 */
export function calculateRowsAndColumns(n) {
  // Calculate the square root of n
  const sqrt = Math.sqrt(n);

  // Initialize columns based on the floor of the square root
  let cols = Math.floor(sqrt);

  // Calculate the number of rows needed to display n videos
  let rows = Math.ceil(n / cols);

  // Calculate the product of rows and columns
  let prod = rows * cols;

  // Adjust rows and columns until the product is greater than or equal to n
  while (prod < n) {
    if (cols < rows) {
      cols++;
    } else {
      rows++;
    }
    prod = rows * cols;
  }

  // Return an array with the calculated number of rows and columns
  return [rows, cols];
}
