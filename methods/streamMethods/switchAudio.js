export const switchAudio = async ({ audioPreference,parameters }) => {

    let {
        audioInputDropdown,
        defAudioID,
        userDefaultAudioInputDevice,
        prevAudioInputDevice,
        

        updateDefAudioID,
        updateUserDefaultAudioInputDevice,
        updatePrevAudioInputDevice,

        //mediasfu functions
        switchUserAudio,
    } = parameters;
        
    if (audioPreference !== defAudioID) {
        

        prevAudioInputDevice = userDefaultAudioInputDevice
        updatePrevAudioInputDevice(prevAudioInputDevice)
        userDefaultAudioInputDevice = audioPreference
        updateUserDefaultAudioInputDevice(userDefaultAudioInputDevice)


        if (defAudioID) {
            await switchUserAudio({ audioPreference, parameters })
        }
   
    }

}

   