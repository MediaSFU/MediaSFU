/**
 * PreJoinPage Component
 * 
 * The PreJoinPage component provides a user interface for users to either create or join a room for a media session. It allows users to input their display name, specify the duration, event type, and room capacity. Users can either create a new room or join an existing room.
 * 
 * Props:
 *   - parameters: An object containing parameters such as showAlert, updateIsLoadingModalVisible, onWeb, connectSocket, socket, updateSocket, updateValidated, updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember, and validated.
 *   - credentials: An object containing the API username and API key for the user's account.
 * State:
 *   The component manages the following state variables:
 *   - isCreateMode: A boolean indicating whether the component is in create mode (true) or join mode (false).
 *   - name: The display name entered by the user.
 *   - duration: The duration of the event in minutes entered by the user.
 *   - eventType: The type of event selected by the user (broadcast, chat, webinar, conference).
 *   - capacity: The room capacity entered by the user.
 *   - eventID: The event ID entered by the user.
 *   - mediasfuURL: The URL of the media server.
 *   - error: Any error message to be displayed to the user.
 * 
 * Methods:
 *   The component defines the following methods:
 *   - handleToggleMode(): Toggles between create mode and join mode.
 *   - handleCreateRoom(): Handles the creation of a new room based on user input.
 *   - handleJoinRoom(): Handles joining an existing room based on user input.
 *   - checkLimitsAndMakeRequest(): Checks API request limits and makes a request to connect to the room.
 *   - useEffect(): Manages screen orientation lock and unlock based on component lifecycle.
 * 
 * Styles:
 *   The component uses the following styles:
 *   - container: Styles for the main container.
 *   - inputContainer: Styles for the input container.
 *   - inputField: Styles for text input fields.
 *   - actionButton: Styles for action buttons.
 *   - toggleContainer: Styles for the toggle mode container.
 *   - toggleButton: Styles for the toggle mode button.
 *   - error: Styles for error messages.
 *   - logoContainer: Styles for the logo container.
 *   - logoImage: Styles for the logo image.
 *   - orContainer: Styles for the "OR" text container.
 *   - orText: Styles for the "OR" text.
 */


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';

const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const apiKey = 'yourAPIKEY'
const apiUserName = 'yourAPIUSERNAME'
const user_credentials = { apiUserName, apiKey };


async function joinRoomOnMediaSFU(payload, apiUserName, apiKey) {
    try {

        const response = await fetch('https://mediasfu.com/v1/rooms/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiUserName + ':' + apiKey,
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return { data, success: true };
    } catch (error) {

        return { data: null, success: false };
    }
}

async function createRoomOnMediaSFU(payload, apiUserName, apiKey) {
    try {

        const response = await fetch('https://mediasfu.com/v1/rooms/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiUserName + ':' + apiKey,
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return { data, success: true };
    } catch (error) {

        return { data: null, success: false };
    }
}

const PreJoinPage = ({ parameters, credentials = user_credentials }) => {

    const [isCreateMode, setIsCreateMode] = useState(false);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [eventType, setEventType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [eventID, setEventID] = useState('');
    const [error, setError] = useState('');

    let { showAlert, updateIsLoadingModalVisible, onWeb, connectSocket, socket, updateSocket, updateValidated,
        updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember, validated } = parameters;


    const checkLimitsAndMakeRequest = async ({ apiUserName, apiToken, link, apiKey = "", userName }) => {
        const TIMEOUT_DURATION = 10000; // 10 seconds

        let unsuccessfulAttempts = parseInt((await AsyncStorage.getItem('unsuccessfulAttempts')) || 0);
        let lastRequestTimestamp = parseInt((await AsyncStorage.getItem('lastRequestTimestamp')) || 0);

        if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
            if (Date.now() - lastRequestTimestamp < RATE_LIMIT_DURATION) {
                if (showAlert) {
                    showAlert({
                        message: 'Too many unsuccessful attempts. Please try again later.',
                        type: 'danger',
                        duration: 3000,
                    });
                }
                await AsyncStorage.setItem('lastRequestTimestamp', Date.now().toString());
                return;
            } else {
                unsuccessfulAttempts = 0;
                await AsyncStorage.setItem('unsuccessfulAttempts', unsuccessfulAttempts.toString());
                await AsyncStorage.setItem('lastRequestTimestamp', Date.now().toString());
            }
        }

        try {
            updateIsLoadingModalVisible(true);

            const socketPromise = connectSocket(apiUserName, apiKey, apiToken, link);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), TIMEOUT_DURATION)
            );

            const socket = await Promise.race([socketPromise, timeoutPromise]);


            if (socket && socket.id) {
                unsuccessfulAttempts = 0;
                await AsyncStorage.setItem('unsuccessfulAttempts', unsuccessfulAttempts.toString());
                await AsyncStorage.setItem('lastRequestTimestamp', Date.now().toString());
                await updateSocket(socket);
                await updateApiUserName(apiUserName);
                await updateApiToken(apiToken);
                await updateLink(link);
                await updateRoomName(apiUserName);
                await updateMember(userName);
                Orientation.unlockAllOrientations();
                await updateValidated(true);
            } else {
                unsuccessfulAttempts += 1;
                await AsyncStorage.setItem('unsuccessfulAttempts', unsuccessfulAttempts.toString());
                await AsyncStorage.setItem('lastRequestTimestamp', Date.now().toString());
                updateIsLoadingModalVisible(false);

                if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
                    if (showAlert) {
                        showAlert({
                            message: 'Too many unsuccessful attempts. Please try again later.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                } else {
                    if (showAlert) {
                        showAlert({
                            message: 'Invalid credentials.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                }
            }
        } catch (error) {


            if (showAlert) {
                showAlert({
                    message: 'Unable to connect. Check your credentials and try again.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            unsuccessfulAttempts += 1;
            await AsyncStorage.setItem('unsuccessfulAttempts', unsuccessfulAttempts.toString());
            await AsyncStorage.setItem('lastRequestTimestamp', Date.now().toString());
            updateIsLoadingModalVisible(false);
        }
    };

    const handleToggleMode = () => {
        setIsCreateMode(prevMode => !prevMode);
        setError('');
    };

    const handleCreateRoom = async () => {

        try {

            setError('');

            if (!name || !duration || !eventType || !capacity) {
                setError('Please fill all the fields.');
                return;
            }


            //must be one of 'broadcast', 'chat', 'webinar', 'conference'
            if (eventType.toLowerCase() !== 'broadcast' && eventType.toLowerCase() !== 'chat' && eventType.toLowerCase() !== 'webinar' && eventType.toLowerCase() !== 'conference') {
                setError('Event type must be one of "broadcast", "chat", "webinar", or "conference".');
                return;
            }

            // Call API to create room
            const payload = {
                action: 'create',
                duration: parseInt(duration),
                capacity: parseInt(capacity),
                eventType: eventType.toLowerCase(),
                userName: name
            };

            updateIsLoadingModalVisible(true);

            const response = await createRoomOnMediaSFU(payload, credentials?.apiUserName, credentials?.apiKey);

            if (response.success) {
                // Handle successful room creation
                await checkLimitsAndMakeRequest({ apiUserName: response.data.roomName, apiToken: response.data.secret, link: response.data.link, userName: name });
                setError('');
            } else {
                // Handle failed room creation
                updateIsLoadingModalVisible(false);

                if (showAlert) {
                    showAlert({
                        message: `Unable to create room. ${response.data ? response.data.message : ''}`,
                        type: 'danger',
                        duration: 3000,
                    });
                } else {
                    setError(`Unable to create room. ${response.data ? response.data.message : ''}`);
                }
            }

        } catch (error) {

            updateIsLoadingModalVisible(false);

            if (showAlert) {
                showAlert({
                    message: `Unable to connect. ${error.message}`,
                    type: 'danger',
                    duration: 3000,
                });
            } else {
                setError(`Unable to connect.  ${error.message}`);
            }

        }

    };

    const handleJoinRoom = async () => {

        try {

            setError('');

            if (!name || !eventID) {
                setError('Please fill all the fields.');
                return;
            }

            // Call API to join room
            const payload = {
                action: 'join',
                meetingID: eventID,
                userName: name
            };

            updateIsLoadingModalVisible(true);

            const response = await joinRoomOnMediaSFU(payload, credentials?.apiUserName, credentials?.apiKey);;

            if (response.success) {
                // Handle successful room join
                await checkLimitsAndMakeRequest({ apiUserName: response.data.roomName, apiToken: response.data.secret, link: response.data.link, userName: name });
                setError('');
            } else {
                // Handle failed room join
                updateIsLoadingModalVisible(false);

                if (showAlert) {
                    showAlert({
                        message: `Unable to connect to room. ${response.data ? response.data.message : ''}`,
                        type: 'danger',
                        duration: 3000,
                    });
                } else {
                    setError(`Unable to connect to room. ${response.data ? response.data.message : ''}`);
                }
            }

        } catch (error) {
            updateIsLoadingModalVisible(false);

            if (showAlert) {
                showAlert({
                    message: `Unable to connect. ${error.message}`,
                    type: 'danger',
                    duration: 3000,
                });
            } else {
                setError(`Unable to connect.  ${error.message}`);
            }

        }



    };

    useEffect(() => {
        // Lock the orientation to portrait mode when the component mounts
        if (!validated) {
            Orientation.lockToPortrait();
        } else {
            Orientation.unlockAllOrientations();
        }

        // Clean up and unlock the orientation when the component unmounts
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, [validated]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={{ uri: 'https://mediasfu.com/images/logo192.png' }} style={styles.logoImage} />
            </View>
            <View style={styles.inputContainer}>
                {isCreateMode ? (
                    <>
                        <TextInput
                            placeholder="Display Name"
                            value={name}
                            onChangeText={setName}
                            style={styles.inputField}
                        />
                        <TextInput
                            placeholder="Duration (minutes)"
                            value={duration}
                            onChangeText={setDuration}
                            style={styles.inputField}
                            inputMode="numeric"
                        />
                        <TextInput
                            placeholder="Event Type"
                            value={eventType}
                            onChangeText={setEventType}
                            style={styles.inputField}
                        />
                        <TextInput
                            placeholder="Room Capacity"
                            value={capacity}
                            onChangeText={setCapacity}
                            style={styles.inputField}
                            inputMode="numeric"
                        />
                        <Pressable onPress={handleCreateRoom} style={styles.actionButton}>
                            <Text style={{ color: 'white' }}>Create Room</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <TextInput
                            placeholder="Display Name"
                            value={name}
                            onChangeText={setName}
                            style={styles.inputField}
                        />
                        <TextInput
                            placeholder="Event ID"
                            value={eventID}
                            onChangeText={setEventID}
                            style={styles.inputField}
                        />
                        <Pressable onPress={handleJoinRoom} style={styles.actionButton}>
                            <Text style={{ color: 'white' }}>Join Room</Text>
                        </Pressable>
                    </>
                )}
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
            <View style={styles.orContainer}>
                <Text style={styles.orText}>OR</Text>
            </View>
            <View style={styles.toggleContainer}>
                <Pressable onPress={handleToggleMode} style={styles.toggleButton}>
                    <Text style={{ color: 'white' }}>
                        {isCreateMode ? 'Switch to Join Mode' : 'Switch to Create Mode'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#53C6E0',
    },
    inputContainer: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputField: {
        height: 40,
        width: '100%',
        minWidth: 300,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    actionButton: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    toggleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleButton: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    logoContainer: {
        marginTop: 30,
        marginBottom: 10,
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    orContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    orText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
};
export default PreJoinPage;