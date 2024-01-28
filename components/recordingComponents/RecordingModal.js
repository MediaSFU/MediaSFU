import React from 'react';
import StandardPanelComponent from './StandardPanelComponent';
import AdvancedPanelComponent from './AdvancedPanelComponent';
import { Modal, View, StyleSheet, ScrollView, Dimensions, Pressable, Text } from 'react-native';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Represents a modal for recording settings.
 * @component
 * @param {Object} props - The properties of the component.
 * @param {boolean} props.isRecordingModalVisible - Indicates whether the recording modal is visible.
 * @param {Function} props.onClose - Function to handle the closing of the recording modal.
 * @param {string} props.recordingBackgroundColor - Background color for the recording modal.
 * @param {string} props.recordingNameTagsColor - Color for name tags in the recording modal.
 * @param {string} props.recordingMediaOptions - Current media options for recording.
 * @param {string} props.prevRecordingMediaOptions - Previous media options for recording.
 * @param {boolean} props.clearedToResume - Indicates whether it is cleared to resume recording.
 * @param {string} props.backgroundColor - Background color for the recording modal content.
 * @param {string} props.position - Position of the recording modal (e.g., 'bottomRight').
 * @param {Function} props.confirmRecording - Function to confirm recording settings.
 * @param {Function} props.startRecording - Function to start recording.
 * @param {Object} props.parameters - Additional parameters to be passed to child components.
 * @returns {JSX.Element}
 */
const RecordingModal = ({
  isRecordingModalVisible,
  onClose,
  recordingBackgroundColor,
  recordingNameTagsColor,
  recordingMediaOptions,
  prevRecordingMediaOptions,
  clearedToResume,
  backgroundColor = '#83c0e9',
  position = 'bottomRight',
  confirmRecording,
  startRecording,
  parameters,
}) => {
  
  let {recordPaused} = parameters;
  
  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.65 * screenWidth;

  if (modalWidth > 400) {
      modalWidth = 400;
  }

  return (
      <Modal transparent={true} animationType="slide" visible={isRecordingModalVisible} onRequestClose={onClose}>
          <View style={[styles.modalContainer, getModalPosition(position)]}>
              <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                          <FontAwesome name="bars" style={styles.icon} /> Recording Settings
                      </Text>
                      <Pressable onPress={onClose} style={styles.closeButton}>
                          <FontAwesome name="times" style={styles.icon} />
                      </Pressable>
                  </View>
                  <View style={styles.hr} />
                  <View style={styles.modalBody}>
                      <ScrollView style={styles.scrollView}>
                          <View style={styles.listGroup}>
                              <StandardPanelComponent parameters={parameters} />
                              <AdvancedPanelComponent parameters={parameters} />
                          </View>
                      </ScrollView>
                  </View>
                  <View style={styles.sep} />
                  <View style={styles.buttonRow}>
                      <Pressable
                          style={[styles.button, { backgroundColor: '#4CAF50' }]}
                          onPress={() => {
                              confirmRecording({ parameters: parameters });
                          }}
                      >
                          <Text style={styles.buttonText}>Confirm</Text>
                      </Pressable>
                      <Pressable
                          style={[styles.button, { backgroundColor: '#f44336', display: recordPaused ? 'none' : 'flex' }]}
                          onPress={() => {
                              startRecording({ parameters: parameters });
                          }}
                      >
                          <Text style={styles.buttonText}>Start <FontAwesome name="play" /></Text>
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
    ...StyleSheet.absoluteFillObject,
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
    maxWidth: '75%',
    zIndex: 9,
    elevation: 9,
    border:'solid 2px black',

  },
  scrollView: {
    flex: 1,
    maxHeight: '100%',
    maxWidth: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    color: 'black',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
  listGroup: {
    margin: 0,
    padding: 0,
  },

  hr: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },
  sep: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
  },
  icon: {
    fontSize: 18,
    color: 'black',
  },
});

export default RecordingModal;
