import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cookies = new Cookies();
const MAX_ATTEMPTS = 6;
const RATE_LIMIT_DURATION = 3000000;
const apiKey = 'yourAPIKEY'
const apiUserName = 'yourAPIUSERNAME'




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

const PreJoinPage = ({ parameters }) => {

    const [isCreateMode, setIsCreateMode] = useState(false);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [eventType, setEventType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [eventID, setEventID] = useState('');
    const [mediasfuURL, setMediasfuURL] = useState('');
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

            // Call API to create room
            const payload = {
                action: 'create',
                duration: parseInt(duration),
                capacity: parseInt(capacity),
                eventType,
                userName: name
            };

            updateIsLoadingModalVisible(true);

            const response = await createRoomOnMediaSFU(payload, apiUserName, apiKey);

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

            const response = await joinRoomOnMediaSFU(payload, apiUserName, apiKey);

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
                        />
                        <TextInput
                            placeholder="Room Capacity"
                            value={capacity}
                            onChangeText={setCapacity}
                            style={styles.inputField}
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
                {error && <Text style={styles.error}>{error}</Text>}
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
        height: 30,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    actionButton: {
        backgroundColor: 'black',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    toggleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleButton: {
        backgroundColor: 'black',
        paddingVertical: 5,
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