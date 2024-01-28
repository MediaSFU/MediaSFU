import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';

/**
 * AlertComponent - A React Native component for displaying alerts in a modal.
 * @param {Object} props - The props passed to the AlertComponent.
 * @param {boolean} props.visible - Flag indicating whether the alert is visible.
 * @param {string} props.message - The message to be displayed in the alert.
 * @param {string} props.type - The type of alert ('success' or 'error').
 * @param {number} props.duration - The duration (in milliseconds) for which the alert is visible (default is 4000).
 * @param {function} props.onHide - Callback function called when the alert is hidden.
 * @param {string} props.textColor - The text color of the alert message.
 * @returns {React.Component} - The AlertComponent.
 */
const AlertComponent = ({ visible, message, type, duration = 4000, onHide, textColor }) => {
  const [alertType, setAlertType] = useState(type || 'success');

  useEffect(() => {
    if (type) {
      setAlertType(type);
    }
  }, [type]);

  useEffect(() => {
    let timer;

    if (visible) {
      timer = setTimeout(() => {
        onHide && onHide();
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [visible, duration, onHide]);

  const handlePress = () => {
    onHide && onHide();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={() => onHide && onHide()}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: alertType === 'success' ? 'green' : 'red' }]}>
            <Text style={[styles.modalText, { color: textColor }]}>{message}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    borderColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 10,
  },
  modalText: {
    color: 'black',
    fontSize: 16,
  },
});

export default AlertComponent;
