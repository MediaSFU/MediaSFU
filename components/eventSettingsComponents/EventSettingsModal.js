/**
 * EventSettingsModal - A React Native component for displaying a modal to modify event settings.
 * @param {Object} props - The props passed to the EventSettingsModal.
 * @param {boolean} props.isEventSettingsModalVisible - Flag indicating whether the modal is visible.
 * @param {Function} props.onEventSettingsClose - Function to handle closing the modal.
 * @param {Function} props.onModifyEventSettings - Function to modify event settings.
 * @param {Object} props.parameters - Object containing audio, video, screenshare, and chat settings.
 * @param {string} props.position - Position of the modal ('topLeft', 'topRight', 'bottomLeft', 'bottomRight').
 * @param {string} props.backgroundColor - Background color of the modal content.
 * @returns {React.Component} - The EventSettingsModal.
 */

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { modifySettings } from '../../methods/settingsMethods/modifySettings';

const EventSettingsModal = ({
  isEventSettingsModalVisible,
  onEventSettingsClose,
  onModifyEventSettings = modifySettings,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const { audioSetting, videoSetting, screenshareSetting, chatSetting } = parameters;

  const [audioState, setAudioState] = useState(audioSetting);
  const [videoState, setVideoState] = useState(videoSetting);
  const [screenshareState, setScreenshareState] = useState(screenshareSetting);
  const [chatState, setChatState] = useState(chatSetting);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  useEffect(() => {
    if (parameters) {
      setAudioState(parameters.audioSetting);
      setVideoState(parameters.videoSetting);
      setScreenshareState(parameters.screenshareSetting);
      setChatState(parameters.chatSetting);
    }
  }, [isEventSettingsModalVisible]);

  return (
    <Modal transparent={true} animationType="slide" visible={isEventSettingsModalVisible} onRequestClose={onEventSettingsClose}>
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Event Settings</Text>
            <Pressable onPress={onEventSettingsClose} style={styles.btnCloseSettings}>
              <FontAwesome name="times" style={styles.icon} />
            </Pressable>
          </View>
          <View style={styles.hr} />
          <View style={styles.modalBody}>
            {/* RNPickerSelect for audio */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>User audio:</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                value={audioState}
                onValueChange={(value) => setAudioState(value)}
                items={[
                  { label: 'Disallow', value: 'disallow' },
                  { label: 'Allow', value: 'allow' },
                  { label: 'Upon approval', value: 'approval' },
                ]}
                placeholder={{}}
              />
            </View>
            <View style={styles.sep} />

            {/* RNPickerSelect for video */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>User video:</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                value={videoState}
                onValueChange={(value) => setVideoState(value)}
                items={[
                  { label: 'Disallow', value: 'disallow' },
                  { label: 'Allow', value: 'allow' },
                  { label: 'Upon approval', value: 'approval' },
                ]}
                placeholder={{}}
              />
            </View>

            <View style={styles.sep} />

            {/* RNPickerSelect for screenshare */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>User screenshare:</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                value={screenshareState}
                onValueChange={(value) => setScreenshareState(value)}
                items={[
                  { label: 'Disallow', value: 'disallow' },
                  { label: 'Allow', value: 'allow' },
                  { label: 'Upon approval', value: 'approval' },
                ]}
                placeholder={{}}
              />
            </View>

            <View style={styles.sep} />

            {/* RNPickerSelect for chat */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>User chat:</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                value={chatState}
                onValueChange={(value) => setChatState(value)}
                items={[
                  { label: 'Disallow', value: 'disallow' },
                  { label: 'Allow', value: 'allow' },
                  // Add more options as needed
                ]}
                placeholder={{}}
              />
            </View>
          </View>
          <View style={styles.modalFooter}>
            <Pressable
              onPress={() =>
                onModifyEventSettings({
                  parameters: {
                    ...parameters,
                    audioSet: audioState,
                    videoSet: videoState,
                    screenshareSet: screenshareState,
                    chatSet: chatState,
                  },
                })
              }
              style={styles.btnApplySettings}
            >
              <Text style={styles.btnText}>Save</Text>
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
    border:'solid 2px black',
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
    fontFamily:'Cochin',
    border:'solid 2px black',
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
  text: {
    color: 'black',
  },
  btnCloseSettings: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
  formCheckGroup: {
    marginBottom: 10,
  },
  formCheck: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  modalFooter: {
    marginTop: 10,
    flexDirection: 'row', // Ensure the items are in a row
    justifyContent: 'flex-end', // Align the items to the right,
  },
  btnApplySettings: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    
  },
  btnText: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'black',
  },
  icon: {
    fontSize: 24,
    color: 'black',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

export default EventSettingsModal;
