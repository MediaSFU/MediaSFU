import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
// import { AudioContext } from 'standardized-audio-context';
import MiniAudio from '../../../components/displayComponents/MiniAudio';

/**
 * MiniAudioPlayer component for displaying and managing audio streams in a video conference.
 *
 * @component
 *
 * @param {Object} props - The properties of the MiniAudioPlayer component.
 * @param {MediaStream} props.stream - The audio stream to be displayed.
 * @param {string} props.remoteProducerId - The ID of the remote producer associated with the audio stream.
 * @param {Object} props.parameters - Object containing various parameters and functions.
 * @param {string} props.RTCView - The component for displaying the audio stream on web platforms.
 * @param {React.Component} props.MiniAudioComponent - Custom component for rendering additional audio controls.
 * @param {Object} props.miniAudioProps - Separate props for the MiniAudioComponent.
 *
 * @returns {React.Component} Returns the MiniAudioPlayer component.
 *
 * @example
 * // Example usage of MiniAudioPlayer component
 * <MiniAudioPlayer
 *   stream={audioStream}
 *   remoteProducerId={remoteProducerId}
 *   parameters={parametersObject}
 *   RTCView={RTCViewComponent}
 *   MiniAudioComponent={CustomMiniAudioComponent}
 *   miniAudioProps={additionalMiniAudioProps}
 * />
 */


const MiniAudioPlayer = ({
    stream,
    remoteProducerId,
    parameters,
    RTCView,
    MiniAudioComponent,
    miniAudioProps, // Separate props for MiniAudio

}) => {

    let { getUpdatedAllParams } = parameters;
    parameters = getUpdatedAllParams()

    let {
        meetingDisplayType,
        shared,
        shareScreenStarted,
        dispActiveNames,
        adminNameStream,
        participants,
        activeSounds,
        eventType,
        autoWave,

        updateActiveSounds,

        //mediasfu functions
        reUpdateInter,
        updateParticipantAudioDecibels,
        paginatedStreams,
        currentUserPage,

        breakOutRoomStarted,
        breakOutRoomEnded,
        limitedBreakRoom,

    } = parameters;

    // const audioContext = new AudioContext();

    const [showWaveModal, setShowWaveModal] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const autoWaveCheck = useRef(false);

    useEffect(() => {

        if (stream) {
            // const analyser = audioContext.createAnalyser();
            // analyser.fftSize = 32;
            // const bufferLength = analyser.frequencyBinCount;
            // const dataArray = new Uint8Array(bufferLength);

            // const source = audioContext.createMediaStreamSource(stream);
            // source.connect(analyser);

            const intervalId = setInterval(() => {
                // analyser.getByteTimeDomainData(dataArray);
                // const averageLoudness = Array.from(dataArray).reduce((sum, value) => sum + value, 0) / bufferLength;

                let averageLoudness = 127.75
                parameters = getUpdatedAllParams()

                let {
                    meetingDisplayType,
                    shared,
                    shareScreenStarted,
                    dispActiveNames,
                    adminNameStream,
                    participants,
                    activeSounds,
                    eventType,
                    autoWave,
                    updateActiveSounds,
                    paginatedStreams,
                    currentUserPage,
                } = parameters;

                let participant = participants.find(obj => obj.audioID === remoteProducerId);


                let audioActiveInRoom = true;
                if (participant) {
                  if (breakOutRoomStarted && !breakOutRoomEnded) {
                    //participant name must be in limitedBreakRoom
                    if (!limitedBreakRoom.map(obj => obj.name).includes(participant.name)) {
                      audioActiveInRoom = false;
                      averageLoudness = 127;
                    }
                  }
                }

                if (meetingDisplayType != 'video') {
                    autoWaveCheck.current = true;
                }
                if (shared || shareScreenStarted) {
                    autoWaveCheck.current = false;
                }

                if (participant) {

                    if (!participant.muted) {
                        setIsMuted(false)
                    } else {
                        setIsMuted(true)
                    }

                    updateParticipantAudioDecibels({
                        name: participant.name,
                        averageLoudness: averageLoudness,
                        parameters: parameters
                    })

                    //check if participant name is in displayNames array
                    // console.log('dispActiveNames', dispActiveNames)
                    const inPage = paginatedStreams[currentUserPage].findIndex(obj => obj.name == participant.name)

                    if (!dispActiveNames.includes(participant.name) && inPage == -1) {
                        autoWaveCheck.current = false
                        if (!adminNameStream) {
                            //find host name
                            adminNameStream = participants.find(obj => obj.islevel == '2').name
                        }

                        if (participant.name == adminNameStream) {
                            autoWaveCheck.current = true
                        }

                    } else {
                        autoWaveCheck.current = true
                    }

                    if (participant.videoID || autoWaveCheck.current || audioActiveInRoom) {
                        setShowWaveModal(false)

                        // Update waveform visibility based on audio level
                        if (averageLoudness > 127.5) {

                            //add to activeSounds array, the name of the participant, IF it is not already there
                            // add the name and averageLoudness to the array audioDecibels if not there else update it

                            if (!activeSounds.includes(participant.name)) {
                                activeSounds.push(participant.name);
                                //reupdate
                            }

                            if ((shareScreenStarted || shared) && !participant.videoID) {
                            } else {
                                reUpdateInter({
                                    name: participant.name,
                                    add: true,
                                    average: averageLoudness,
                                    parameters: parameters
                                })

                            }

                        } else {

                            //remove from activeSounds array, the name of the participant, IF it is there
                            //remove the name and averageLoudness from the array audioDecibels if there
                            if (activeSounds.includes(participant.name)) {
                                activeSounds.splice(activeSounds.indexOf(participant.name), 1);
                                //reupdate
                            }
                            if ((shareScreenStarted || shared) && !participant.videoID) {
                            } else {
                                reUpdateInter({
                                    name: participant.name,
                                    average: averageLoudness,
                                    parameters: parameters
                                })

                            }
                        }

                    } else {

                        //no video && user does not allow audio only display

                        if (averageLoudness > 127.5) {

                            if (!autoWave) {
                                setShowWaveModal(false)
                            } else {
                                setShowWaveModal(true)
                            }

                            //add to activeSounds array, the name of the participant, IF it is not already there
                            if (!activeSounds.includes(participant.name)) {
                                activeSounds.push(participant.name);
                            }
                            if ((shareScreenStarted || shared) && !participant.videoID) {
                            } else {
                                reUpdateInter({
                                    name: participant.name,
                                    add: true,
                                    average: averageLoudness,
                                    parameters: parameters
                                })

                            }
                        } else {
                            setShowWaveModal(false)
                            //remove from activeSounds array, the name of the participant, IF it is there
                            if (activeSounds.includes(participant.name)) {
                                activeSounds.splice(activeSounds.indexOf(participant.name), 1);
                            }
                            if ((shareScreenStarted || shared) && !participant.videoID) {
                            } else {
                                reUpdateInter({
                                    name: participant.name,
                                    average: averageLoudness,
                                    parameters: parameters
                                })

                            }
                        }

                    }

                    updateActiveSounds(activeSounds)

                } else {


                    setShowWaveModal(false)
                    setIsMuted(true)

                }

            }, 1000);


            return () => {
                clearInterval(intervalId);
            };
        }
    }, [stream]);

    const renderMiniAudioComponent = () => {
        if (MiniAudioComponent) {


            return (
                <MiniAudioComponent
                    showWaveform={showWaveModal}
                    visible={showWaveModal && !isMuted}
                    // Pass other MiniAudioComponent props as needed
                    {...miniAudioProps}
                />
            );
        }

        return null;
    };

    return (
        <View style={styles.container}>
            {/* RTCView for displaying the audio stream */}
            {!isMuted && stream && Platform.OS === 'web' ? (
                <RTCView stream={stream} style={styles.audioPlayer} />
            ) : !isMuted && stream && (
                <RTCView streamURL={stream.toURL()} style={styles.audioPlayer} />
            )}
            {renderMiniAudioComponent()}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 9,
        zIndex: 9,
    },
    audioPlayer: {
        width: 0,
        height: 0,
    },
});

export default MiniAudioPlayer;
