import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FontAwesome } from '@expo/vector-icons';
import { Linking } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

const WelcomePage = ({ parameters }) => {
    const [name, setName] = useState('');
    const [secret, setSecret] = useState('');
    const [eventID, seteventID] = useState('');
    const [link, setLink] = useState('');
    const [isScannerVisible, setScannerVisible] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);


    let { showAlert, updateIsLoadingModalVisible, onWeb, connectSocket, socket, updateSocket, updateValidated,
        updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember, validated } = parameters;


    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');

        if (status !== 'granted') {
            if (showAlert) {
                showAlert({
                    message: 'Please allow camera access to scan QR code.',
                    type: 'danger',
                    duration: 3000,
                });
            }
        }
    };

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




    useEffect(() => {
        // Handle scanned data
        if (scannedData) {
            // Implement logic to process scanned data
            const data = scannedData.trim();
            // Extracting parts based on semicolon delimiter
            const parts = data.split(';');
            let userName, link_, userSecret, passWord, meetingID;

            if (parts.length === 5) {
                [userName, link_, userSecret, passWord, meetingID] = parts;
    
                // Implement logic to check if the data is valid
                if (userName.length === 0 || link_.length === 0 || userSecret.length === 0 || passWord.length === 0 || meetingID.length === 0) {
                    if (showAlert) {
                        showAlert({
                            message: 'Invalid scanned data.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                }

                if (!validateAlphanumeric(userName) || !validateAlphanumeric(userSecret) || !validateAlphanumeric(passWord) || !validateAlphanumeric(meetingID)) {
                    if (showAlert) {
                        showAlert({
                            message: 'Invalid scanned data.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                }

                if (userSecret.length != 64 || userName.length > 12 || userName.length < 2 || meetingID.length > 32 || meetingID.length < 8 || !link_.includes('mediasfu.com') || eventID.toLowerCase().startsWith('d')) {
                    if (showAlert) {
                        showAlert({
                            message: 'Invalid scanned data.',
                            type: 'danger',
                            duration: 3000,
                        });
                    }
                }

            // Further processing logic if needed
            } else {
                // Handle the case where the scanned data doesn't have the expected format
                if (showAlert) {
                    showAlert({
                        message: 'Invalid scanned data.',
                        type: 'danger',
                        duration: 3000,
                    });
                    setScanned(false);
                }
            }

            setName(userName);


            setScannerVisible(false);
            setScannedData(null); // Reset scanned data after processing

            async function makeRequest() {
                await checkLimitsAndMakeRequest({ apiUserName: meetingID, apiToken: userSecret, link: link_, userName: userName });
            }

            makeRequest();
        }
    }, [scannedData]);

    useEffect(() => {
        // Lock the orientation to portrait mode when the component mounts
        if (!validated) {
            setScanned(false);
            Orientation.lockToPortrait();
        } else {
            Orientation.unlockAllOrientations();
        }

        // Clean up and unlock the orientation when the component unmounts
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, [validated]);

    const handleScannerToggle = () => {
        if (!isScannerVisible && !hasPermission) {
            getBarCodeScannerPermissions();
        }
        setScannerVisible(!isScannerVisible);
    };

    const validateAlphanumeric = (str) => {
        if (str.length === 0) return true; // Allow empty string (for secret
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        return alphanumericRegex.test(str);
    };

    const handleNameChange = (text) => {
        if (text.length <= 12 && validateAlphanumeric(text)) {
            setName(text);
        }
    };

    const handleSecretChange = (text) => {
        if (text.length <= 64 && validateAlphanumeric(text)) {
            setSecret(text);
        }
    };

    const handleeventIDChange = (text) => {
        if (text.length <= 32 && validateAlphanumeric(text)) {
            seteventID(text);
        }
    };

    const handleBarCodeScanned = ({ data }) => {
        setScannedData(data);
        setScanned(true);
    };

    const handleConfirm = async () => {

        updateIsLoadingModalVisible(true);



        if (name.length === 0 || secret.length === 0 || eventID.length === 0 || link.length === 0) {
            if (showAlert) {
                showAlert({
                    message: 'Please fill all the fields.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            updateIsLoadingModalVisible(false);
            return;
        }

        if (!validateAlphanumeric(name) || !validateAlphanumeric(secret) || !validateAlphanumeric(eventID) || !link.includes('mediasfu.com') || eventID.toLowerCase().startsWith('d')) {
            if (showAlert) {
                showAlert({
                    message: 'Please enter valid details.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            updateIsLoadingModalVisible(false);
            return;

        }

        if (secret.length != 64 || name.length > 12 || name.length < 2 || eventID.length > 32 || eventID.length < 8 || link.length < 12) {
            if (showAlert) {
                showAlert({
                    message: 'Please enter valid details.',
                    type: 'danger',
                    duration: 3000,
                });
            }

            updateIsLoadingModalVisible(false);
            return;
        }

        await checkLimitsAndMakeRequest({ apiUserName: eventID, apiToken: secret, link: link, userName: name });
        updateIsLoadingModalVisible(false);


    };


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.container, onWeb && { maxWidth: 500, alignSelf: 'center' }]}>
                {/* Brand Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: 'https://mediasfu.com/images/logo192.png' }}
                        style={styles.logoImage}
                    />
                </View>

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Event Display Name"
                        value={name}
                        onChangeText={handleNameChange}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Event Token (Secret)"
                        value={secret}
                        onChangeText={handleSecretChange}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Event ID"
                        value={eventID}
                        onChangeText={handleeventIDChange}
                    />

                    <TextInput style={styles.inputField} placeholder="Event Link" value={link} onChangeText={setLink} />


                </View>



                <Pressable
                    onPress={() => {
                        // Implement logic to check if the details are valid
                        handleConfirm();

                    }}
                >
                    <Text style={styles.confirmText}>confirm</Text>
                </Pressable>

                {/* Horizontal Line with "OR" */}
                <View style={styles.horizontalLineContainer}>
                    <View style={styles.horizontalLine} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.horizontalLine} />
                </View>

                {/* QR Code Scanner Section */}
                <View style={styles.scannerContainer}>
                    {isScannerVisible && hasPermission ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <BarCodeScanner
                                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                style={{
                                    alignSelf: 'center',
                                    width: 240,
                                    height: 240,
                                    borderRadius: 5,
                                }}
                                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                            />
                        </View>
                    ) : (
                        <Pressable onPress={handleScannerToggle}>
                            <Text style={styles.scanButtonText}>Scan QR Code</Text>
                        </Pressable>
                    )}
                </View>


                {/* Additional Options */}
                <View style={styles.additionalOptionsContainer}>
                    <Text style={styles.additionalOptionsText}>
                        Provide the event details either by typing manually or scanning the QR-code to autofill.
                    </Text>
                    <Text style={styles.additionalOptionsText}>Don't have a secret?</Text>
                    <Pressable
                        onPress={() => {
                            // Implement logic to open the link
                            Linking.openURL('https://meeting.mediasfu.com/meeting/start/');
                        }}
                    >
                        <Text style={styles.getOneLinkText}>Get one from mediasfu.com</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#53C6E0'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '10%',
        justifySelf: 'center',

    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,

    },
    inputField: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    horizontalLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    horizontalLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'black',
    },
    orText: {
        color: 'black',
        marginHorizontal: 10,
    },
    scannerContainer: {
        width: 240,
        height: 240,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        alignSelf: 'center',  // Add this line
        maxWidth: 350,
        maxHeight: 350,
    },

    scanner: {
        width: 240,
        height: 240,
        borderRadius: 5,
    },
    scanButtonText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    additionalOptionsContainer: {
        alignItems: 'center',
    },
    additionalOptionsText: {
        marginBottom: 10,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    getOneLinkText: {
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'black',
        fontWeight: 'bold',
        marginVertical: 10,
        borderRadius: 10,
        color: 'white',
    },
    confirmText: {
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: 'black',
        fontWeight: 'bold',
        marginVertical: 10,
        borderRadius: 10,
        color: 'white',
    },
});

export default WelcomePage;
