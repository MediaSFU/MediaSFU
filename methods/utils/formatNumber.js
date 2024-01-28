/**
 * Formats a numerical value to a human-readable string representation with abbreviated units (K, M, B).
 * @function
 * @async
 * @param {number} number - The numerical value to be formatted.
 * @returns {Promise<string | undefined>} - A Promise that resolves to the formatted string or undefined if the input is falsy.
 */
export const formatNumber = async (number) => {
        if (number) {
            if (number < 1e3) {
                return number.toString();
            } else if (number < 1e6) {
                return (number / 1e3).toFixed(1) + 'K';
            } else if (number < 1e9) {
                return (number / 1e6).toFixed(1) + 'M';
            } else if (number < 1e12) {
                return (number / 1e9).toFixed(1) + 'B';
            }
        }
        // Return undefined for falsy input values
    }
    