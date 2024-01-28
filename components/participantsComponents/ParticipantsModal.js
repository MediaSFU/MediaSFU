/**
 * ParticipantsModal - A React Native component for displaying a modal with a list of participants.
 * @param {Object} props - The props passed to the ParticipantsModal.
 * @param {boolean} props.isParticipantsModalVisible - Indicates whether the participants modal is visible.
 * @param {Function} props.onParticipantsClose - Callback function to handle closing the participants modal.
 * @param {Function} props.onParticipantsFilterChange - Callback function to handle changes in the participants filter input.
 * @param {number} props.participantsCounter - The counter for the number of participants.
 * @param {Function} props.onMuteParticipants - Custom function for muting participants.
 * @param {Function} props.onMessageParticipants - Custom function for messaging participants.
 * @param {Function} props.onRemoveParticipants - Custom function for removing participants.
 * @param {React.Component} props.RenderParticipantList - Custom component for rendering the participant list.
 * @param {React.Component} props.RenderParticipantListOthers - Custom component for rendering the participant list for other participants.
 * @param {Function} props.formatBroadcastViews - Custom function for formatting the number of broadcast views.
 * @param {Object} props.parameters - Additional parameters for the participants modal.
 * @param {string} props.position - The position of the modal.
 * @param {string} props.backgroundColor - The background color of the modal.
 * @returns {React.Component} - The ParticipantsModal.
 */

import React, { useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, Button, TextInput, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import ParticipantList from './ParticipantList';
import ParticipantListOthers from './ParticipantListOthers';
import { formatNumber } from '../../methods/utils/formatNumber';
import { muteParticipants } from '../../methods/participantsMethods/muteParticipants';
import { messageParticipants } from '../../methods/participantsMethods/messageParticipants';
import { removeParticipants } from '../../methods/participantsMethods/removeParticipants';


const ParticipantsModal = ({
    isParticipantsModalVisible,
    onParticipantsClose,
    onParticipantsFilterChange,
    participantsCounter,
    onMuteParticipants = muteParticipants,
    onMessageParticipants = messageParticipants,
    onRemoveParticipants = removeParticipants,
    RenderParticipantList = ParticipantList,
    RenderParticipantListOthers = ParticipantListOthers,
    formatBroadcastViews = formatNumber,
    parameters,
    position = 'topRight',
    backgroundColor = '#83c0e9',
  }) => {

    const {
        coHostResponsibility,
        coHost,
        member,
        islevel,
        showAlert,
        participants,
        roomName,
        eventType,
    } = parameters;


    const screenWidth = Dimensions.get('window').width;
    let modalWidth = 0.8 * screenWidth;
    if (modalWidth > 400) {
        modalWidth = 400;
    }

    let participantsValue = false;
    try {
        participantsValue = coHostResponsibility.find(item => item.name === 'participants').value;

    } catch (error) {

    }

    return (
        <Modal transparent={true} animationType="slide" visible={isParticipantsModalVisible} onRequestClose={onParticipantsClose}>
            <View style={[styles.modalContainer, getModalPosition('topRight')]}>
                <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Participants <Text style={styles.badge}>{participantsCounter}</Text></Text>
                            <Pressable onPress={onParticipantsClose} style={styles.btnCloseParticipants}>
                                <FontAwesome name="times" style={styles.icon} />
                            </Pressable>
                        </View>
                        <View style={styles.hr} />

                       
                        <View style={styles.modalBody}>
                            {/* Your filter input */}

                            <View style={styles.formGroup}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Search ..."
                                    onChangeText={onParticipantsFilterChange}
                                />
                            </View>

                            {/* Your participant list */}
                            {participants && islevel === '2' || (coHost === member && participantsValue === true) ? (
                                <View id="participant-list">
                                    {/* Participant rows will be dynamically added here */}
                                    <RenderParticipantList

                                        participants={participants}
                                        isBroadcast={eventType === 'broadcast'}
                                        onMuteParticipants={onMuteParticipants}
                                        onMessageParticipants={onMessageParticipants}
                                        onRemoveParticipants={onRemoveParticipants}
                                        formatBroadcastViews={formatBroadcastViews}
                                        parameters={parameters}

                                    />

                                </View>
                            ) : participants ? (
                                <View id="participant-list">

                                    <RenderParticipantListOthers
                                        participants={participants}
                                        parameters={parameters}
                                    />
                                </View>
                            ) : (
                                <View id="participant-list">
                                    <Text>No participants</Text>
                                </View>
                            )}


                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        zIndex: 9,
        elevation: 9,
    },
    modalContent: {
        height: '65%',
        backgroundColor: '#83c0e9',
        borderRadius: 0,
        padding: 20,
        maxHeight: '65%',
        maxWidth: '70%',
        zIndex: 9,
        elevation: 9,
        border: 'solid 2px black',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    btnCloseParticipants: {
        padding: 5,
    },
    modalBody: {
        flex: 1,
    },
    formGroup: {
        marginBottom: 10,
    },
    input: {
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 20,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    col1: {
        flex: 1,
        textAlign: 'center',
    },
    col2: {
        flex: 2,
    },
    col4: {
        flex: 4,
    },
    icon: {
        fontSize: 20,
        color: 'black',
    },
    badge: {
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 12,
        padding: 5,
        marginLeft: 5,
    },
    hr: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 5,
    },
});

export default ParticipantsModal;
