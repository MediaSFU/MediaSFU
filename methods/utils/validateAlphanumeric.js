// validateAlphanumeric.js

/**
 * Validates if the input string is alphanumeric.
 *
 * @param {string} str - The string to validate.
 * @returns {Promise<boolean>} - A Promise that resolves with true if the string is alphanumeric, false otherwise.
 */
const validateAlphanumeric = async (str) => {
    let code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };
  
  export { validateAlphanumeric };
  