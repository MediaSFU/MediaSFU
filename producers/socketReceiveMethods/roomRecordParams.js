/**
 * Updates the recording parameters for the room based on the provided recordParams.
 *
 * @param {Object} options - Options for updating room recording parameters.
 * @param {Object} options.recordParams - Object containing recording parameters for the room.
 * @param {Object} options.parameters - Object containing various update functions for recording parameters.
 * @param {Function} options.parameters.updateRecordingAudioPausesLimit - Function to update recording audio pauses limit.
 * @param {Function} options.parameters.updateRecordingAudioPausesCount - Function to update recording audio pauses count.
 * @param {Function} options.parameters.updateRecordingAudioSupport - Function to update recording audio support.
 * @param {Function} options.parameters.updateRecordingAudioPeopleLimit - Function to update recording audio people limit.
 * @param {Function} options.parameters.updateRecordingAudioParticipantsTimeLimit - Function to update recording audio participants time limit.
 * @param {Function} options.parameters.updateRecordingVideoPausesCount - Function to update recording video pauses count.
 * @param {Function} options.parameters.updateRecordingVideoPausesLimit - Function to update recording video pauses limit.
 * @param {Function} options.parameters.updateRecordingVideoSupport - Function to update recording video support.
 * @param {Function} options.parameters.updateRecordingVideoPeopleLimit - Function to update recording video people limit.
 * @param {Function} options.parameters.updateRecordingVideoParticipantsTimeLimit - Function to update recording video participants time limit.
 * @param {Function} options.parameters.updateRecordingAllParticipantsSupport - Function to update recording support for all participants.
 * @param {Function} options.parameters.updateRecordingVideoParticipantsSupport - Function to update recording support for video participants.
 * @param {Function} options.parameters.updateRecordingAllParticipantsFullRoomSupport - Function to update recording full room support for all participants.
 * @param {Function} options.parameters.updateRecordingVideoParticipantsFullRoomSupport - Function to update recording full room support for video participants.
 * @param {Function} options.parameters.updateRecordingPreferredOrientation - Function to update recording preferred orientation.
 * @param {Function} options.parameters.updateRecordingSupportForOtherOrientation - Function to update recording support for other orientations.
 * @param {Function} options.parameters.updateRecordingMultiFormatsSupport - Function to update recording multi-formats support.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of the roomRecordParams function
 * roomRecordParams({
 *   recordParams: {
 *     // Provide recording parameters here
 *   },
 *   parameters: {
 *     updateRecordingAudioPausesLimit,
 *     updateRecordingAudioPausesCount,
 *     updateRecordingAudioSupport,
 *     // ... other recording parameter update functions
 *   },
 * });
 */
export const roomRecordParams = async ({ recordParams, parameters }) => {
    let {
        updateRecordingAudioPausesLimit,
        updateRecordingAudioPausesCount,
        updateRecordingAudioSupport,
        updateRecordingAudioPeopleLimit,
        updateRecordingAudioParticipantsTimeLimit,
        updateRecordingVideoPausesCount,
        updateRecordingVideoPausesLimit,
        updateRecordingVideoSupport,
        updateRecordingVideoPeopleLimit,
        updateRecordingVideoParticipantsTimeLimit,
        updateRecordingAllParticipantsSupport,
        updateRecordingVideoParticipantsSupport,
        updateRecordingAllParticipantsFullRoomSupport,
        updateRecordingVideoParticipantsFullRoomSupport,
        updateRecordingPreferredOrientation,
        updateRecordingSupportForOtherOrientation,
        updateRecordingMultiFormatsSupport,
    } = parameters;

    // Update each recording parameter based on the provided recordParams
    updateRecordingAudioPausesLimit(recordParams.recordingAudioPausesLimit);
    updateRecordingAudioPausesCount(recordParams.recordingAudioPausesCount);
    updateRecordingAudioSupport(recordParams.recordingAudioSupport);
    updateRecordingAudioPeopleLimit(recordParams.recordingAudioPeopleLimit);
    updateRecordingAudioParticipantsTimeLimit(recordParams.recordingAudioParticipantsTimeLimit);
    updateRecordingVideoPausesCount(recordParams.recordingVideoPausesCount);
    updateRecordingVideoPausesLimit(recordParams.recordingVideoPausesLimit);
    updateRecordingVideoSupport(recordParams.recordingVideoSupport);
    updateRecordingVideoPeopleLimit(recordParams.recordingVideoPeopleLimit);
    updateRecordingVideoParticipantsTimeLimit(recordParams.recordingVideoParticipantsTimeLimit);
    updateRecordingAllParticipantsSupport(recordParams.recordingAllParticipantsSupport);
    updateRecordingVideoParticipantsSupport(recordParams.recordingVideoParticipantsSupport);
    updateRecordingAllParticipantsFullRoomSupport(recordParams.recordingAllParticipantsFullRoomSupport);
    updateRecordingVideoParticipantsFullRoomSupport(recordParams.recordingVideoParticipantsFullRoomSupport);
    updateRecordingPreferredOrientation(recordParams.recordingPreferredOrientation);
    updateRecordingSupportForOtherOrientation(recordParams.recordingSupportForOtherOrientation);
    updateRecordingMultiFormatsSupport(recordParams.recordingMultiFormatsSupport);
};
