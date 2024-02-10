/**
 * Triggers the updateScreen event based on certain conditions.
 *
 * @param {Object} options - The function parameters.
 * @param {Array<string>} options.ref_ActiveNames - Array of active participant names.
 * @param {Object} options.parameters - Additional parameters needed for the function.
 * @param {Object} options.parameters.socket - The socket used for communication.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {Array<Object>} options.parameters.screenStates - Array containing information about the screen state.
 * @param {Array<Object>} options.parameters.participants - Array containing information about participants.
 * @param {function} options.parameters.updateDateState - Function to update the date state.
 * @param {string} options.parameters.lastUpdate - The last update timestamp.
 * @param {number} options.parameters.nForReadjust - The number used for readjustment.
 * @param {string} options.parameters.eventType - The type of event ('conference', etc.).
 * @param {boolean} options.parameters.shared - Indicates if screen sharing is active.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if video is already being used.
 * @param {function} options.parameters.updateScreenStates - Function to update the screen states.
 * @param {function} options.parameters.updateUpdateDateState - Function to update the update date state.
 * @param {function} options.parameters.updateLastUpdate - Function to update the last update timestamp.
 * @param {function} options.parameters.updateNForReadjust - Function to update the nForReadjust variable.
 * @param {function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {function} options.parameters.GetEstimate - Function to get the estimate.
 * @param {function} options.parameters.autoAdjust - Function to auto-adjust values.
 * @param {function} options.parameters.checkGrid - Function to check the grid.
 * @returns {Promise<void>} - A Promise that resolves after triggering the updateScreen event.
 */
export async function trigger({ ref_ActiveNames, parameters }) {
    // Function to trigger the updateScreen event

    // Get updated parameters
    parameters = await parameters.getUpdatedAllParams();

    let {
        socket,
        roomName,
        screenStates,
        participants,
        updateDateState,
        lastUpdate,
        nForReadjust,
        eventType,
        shared,
        shareScreenStarted,

        updateScreenStates,
        updateUpdateDateState,
        updateLastUpdate,
        updateNForReadjust,

        // Media functions
        GetEstimate,
        autoAdjust,
    } = parameters;

    let personOnMainScreen = screenStates[0].mainScreenPerson;
    let mainfilled = screenStates[0].mainScreenFilled;
    let adminOnMain = screenStates[0].adminOnMainScreen
    let mainScreenID = screenStates[0].mainScreenProducerId;
    let nForReadjust_
    let val1
    let val2

    let noww = new Date().getTime();
    //get now in seconds
    let timestamp = Math.floor(noww / 1000);


    let eventPass = false
    let mainPercent = 0
    if (eventType == 'conference' && !(shared || shareScreenStarted)) {
        eventPass = true

        const admin = await participants.filter(participant => participant.isAdmin == true && participant.islevel == '2')
        let adminName = ""
        if (admin.length > 0) {
            adminName = await admin[0].name;
        }

        personOnMainScreen = await adminName
        
        if (!ref_ActiveNames.includes(adminName)) {
            ref_ActiveNames.unshift(adminName)
        }
    }

    if ((mainfilled && personOnMainScreen != null && adminOnMain) || eventPass) {
        //check if the person on main screen is still in the room

        const admin = await participants.filter(participant => participant.isAdmin == true && participant.islevel == '2')
        let adminName = ""
        if (admin.length > 0) {
            adminName = await admin[0].name;
        }

        //   ss = false

        if (eventType == 'conference') {
            nForReadjust = nForReadjust + 1;
            updateNForReadjust(nForReadjust)
        }

        nForReadjust_ = ref_ActiveNames.length


        if (nForReadjust_ == 0 && eventType == 'webinar') {
            val1 = 0
            val2 = 12 //main

        } else {

            const [val11, val22] = await autoAdjust({ n: nForReadjust_, parameters });

            val1 = val11
            val2 = val22
        }

        let calc1 = await Math.floor((val1 / 12) * 100);
        let calc2 = await 100 - calc1;




        //check if lastUpdate is not null and at least same seconds
        if (lastUpdate == null || (updateDateState != timestamp)) {

            let now = await new Date();

            await socket.emit('updateScreenClient', { roomName, names: ref_ActiveNames, mainPercent: calc2, mainScreenPerson: personOnMainScreen, viewType: eventType }, ({ success, reason }) => {
                updateDateState = timestamp
                updateUpdateDateState(updateDateState)
                lastUpdate = now
                updateLastUpdate(lastUpdate)
                if (success) {
                  

                } else {
                    console.log(reason, 'updateScreenClient failed')
                }

            });

        }

    } else if (mainfilled && personOnMainScreen != null && !adminOnMain) {
        //check if the person on main screen is still in the room
        const admin = await participants.filter(participant => participant.isAdmin == true && participant.islevel == '2')
        let adminName = ""
        if (admin.length > 0) {
            adminName = await admin[0].name;
        }

        //   ss = true

        nForReadjust_ = ref_ActiveNames.length

        if (!ref_ActiveNames.includes(adminName)) {
            ref_ActiveNames.unshift(adminName)
            nForReadjust_ = ref_ActiveNames.length
        }

        const [val11, val22] = await autoAdjust({ n: nForReadjust_, parameters });
        val1 = val11
        val2 = val22

        const calc1 = await Math.floor((val1 / 12) * 100);
        const calc2 = await 100 - calc1;


        if (lastUpdate == null || (updateDateState != timestamp)) {

            let now = await new Date();

         

            await socket.emit('updateScreenClient', { roomName, names: ref_ActiveNames, mainPercent: calc2, mainScreenPerson: personOnMainScreen, viewType: eventType }, ({ success, reason }) => {
                updateDateState = timestamp
                updateUpdateDateState(updateDateState)
                lastUpdate = now
                updateLastUpdate(lastUpdate)
                if (success) {

                } else {
                    console.log(reason, 'updateScreenClient failed')
                }

            });

        }

    } else {
        //stop recording
        console.log('trigger stopRecording')
    }

}