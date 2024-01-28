import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * LoadingModal is a component that displays a loading indicator within a modal.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isVisible - Determines whether the modal is visible or not.
 * @param {string} props.backgroundColor - Background color of the modal container.
 * @param {string} props.displayColor - Color of the loading indicator and text.
 *
 * @returns {JSX.Element} - Loading modal component.
 */
const LoadingModal = ({ isVisible, backgroundColor, displayColor }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={isVisible}>
      <View style={[styles.modalContainer, { backgroundColor }]}>
        <View style={styles.modalContent}>
          <View style={styles.modalBody}>
            <ActivityIndicator size="large" color={displayColor} />
            <Text style={[styles.loadingText, { color: displayColor }]}>
              Loading...
            </Text>
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
    width: '80%', // Adjust the width as needed
    backgroundColor: 'transparent', // Make the content transparent
    borderRadius: 10,
    padding: 20,
  },
  modalBody: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
});

export default LoadingModal;
