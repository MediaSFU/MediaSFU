/**
 * Checks the permission setting for a specific type (audio, video, screenshare, or chat).
 *
 * @param {Object} options - The options object.
 * @param {string} options.permissionType - The type of permission to check (audioSetting, videoSetting, screenshareSetting, chatSetting).
 * @param {Object} options.parameters - The parameters object containing settings for audio, video, screenshare, and chat.
 * @returns {number} Returns 0 for 'allow', 1 for 'approval', and 2 for 'deny'.
 * @throws Throws an error if an invalid permissionType is provided.
 */
export async function checkPermission({ permissionType, parameters }) {
  try {
    let { audioSetting, videoSetting, screenshareSetting, chatSetting } = parameters;

    // PermissionType is audioSetting, videoSetting, screenshareSetting, chatSetting
    // Perform a switch case to check for the permissionType and return the response
    switch (permissionType) {
      case 'audioSetting':
        if (audioSetting === 'allow') {
          return 0;
        } else if (audioSetting === 'approval') {
          return 1;
        } else {
          return 2;
        }
      case 'videoSetting':
        if (videoSetting === 'allow') {
          return 0;
        } else if (videoSetting === 'approval') {
          return 1;
        } else {
          return 2;
        }
      case 'screenshareSetting':
        if (screenshareSetting === 'allow') {
          return 0;
        } else if (screenshareSetting === 'approval') {
          return 1;
        } else {
          return 2;
        }
      case 'chatSetting':
        if (chatSetting === 'allow') {
          return 0;
        } else if (chatSetting === 'approval') {
          return 1;
        } else {
          return 2;
        }
      default:
        // throw new Error(`Invalid permissionType: ${permissionType}`);
        return 2;
    }
  } catch (error) {
    // console.log('checkPermission error', error);
    // throw error;
  }
}
