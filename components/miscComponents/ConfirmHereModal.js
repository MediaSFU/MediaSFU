/**
 * ConfirmHereModal - A React Native modal component for confirming presence with countdown timer.
 * @param {Object} props - The props passed to the ConfirmHereModal.
 * @param {boolean} props.isConfirmHereModalVisible - Flag indicating whether the modal is visible.
 * @param {function} props.onConfirmHereClose - Callback function to close the modal.
 * @param {Object} props.parameters - Additional parameters for the modal.
 * @param {string} props.position - Position of the modal ('center' by default).
 * @param {string} props.backgroundColor - Background color of the modal content.
 * @param {string} props.displayColor - Color for the display elements.
 * @returns {React.Component} - The ConfirmHereModal.
 */

import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getModalPosition } from '../../methods/utils/getModalPosition';

let countdownInterval;

function startCountdown({ duration, onConfirm, onUpdateCounter,parameters }) {

  let {socket,roomName,member} = parameters;

  let timeRemaining = duration;

  countdownInterval = setInterval(() => {
    timeRemaining--;
    onUpdateCounter(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      socket.emit('disconnectUser', { member: member, roomName: roomName, ban: false });
      onConfirm();
    }
  }, 1000);
}


const ConfirmHereModal = ({ 
  isConfirmHereModalVisible, 
  onConfirmHereClose, 
  parameters, 
  position = 'center', 
  backgroundColor = '#83c0e9' ,
  displayColor = '#000000'
}) => {
  const { countdownDuration, member, roomName, redirectURL } = parameters;
  

  const [counter, setCounter] = useState(countdownDuration);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  useEffect(() => {
    
    if (isConfirmHereModalVisible) {
      startCountdown({
        duration: countdownDuration ? countdownDuration : 60,
        onConfirm: onConfirmHereClose,
        onUpdateCounter: setCounter,
        parameters: parameters,
      });
    }
  }, [isConfirmHereModalVisible]);

  const handleConfirmHere = () => {
    clearInterval(countdownInterval);
    onConfirmHereClose(); // Close the modal after confirming
  };

  return (
    <Modal transparent={true} animationType="slide" visible={isConfirmHereModalVisible} onRequestClose={onConfirmHereClose}>
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalBody}>
            <ActivityIndicator size="large" color={displayColor} style={styles.spinnerContainer} />
            <Text style={styles.modalTitle}>Are you still there?</Text>
            <Text style={styles.modalMessage}>Please confirm if you are still present.</Text>
            <Text style={styles.modalCounter}>Time remaining: <Text style={styles.counterText}>{counter}</Text></Text>
            <Pressable onPress={handleConfirmHere} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Yes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      height: '60%',
      backgroundColor: '#83c0e9',
      borderRadius: 10,
      padding: 20,
      maxWidth: '80%',
      zIndex: 9,
      elevation: 9,
    },
    modalBody: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spinnerContainer: {
      marginBottom: 20,
    },
    spinnerIcon: {
      fontSize: 50,
      color: 'black',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
    },
    modalMessage: {
      fontSize: 16,
      color: 'black',
      marginVertical: 15,
      textAlign: 'center',
    },
    modalCounter: {
      fontSize: 14,
      color: 'black',
      marginBottom: 10,
    },
    counterText: {
      fontWeight: 'bold',
    },
    confirmButton: {
      backgroundColor: '#dc3545',
      padding: 10,
      borderRadius: 5,
    },
    confirmButtonText: {
      color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 20,
    },
  });
  
  export default ConfirmHereModal;
