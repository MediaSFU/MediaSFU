/**
 * MediaSettingsModal - A React Native component for displaying a modal to manage media settings.
 * @param {Object} props - The props passed to the MediaSettingsModal.
 * @param {boolean} props.isMediaSettingsModalVisible - Flag indicating whether the modal is visible.
 * @param {Function} props.onMediaSettingsClose - Function to handle closing the modal.
 * @param {Function} props.switchCameraOnPress - Function to handle switching the camera.
 * @param {Function} props.switchVideoOnPress - Function to handle switching video input.
 * @param {Function} props.switchAudioOnPress - Function to handle switching audio input.
 * @param {Object} props.parameters - Object containing media settings and device information.
 * @param {string} props.position - Position of the modal ('topLeft', 'topRight', 'bottomLeft', 'bottomRight').
 * @param {string} props.backgroundColor - Background color of the modal content.
 * @returns {React.Component} - The MediaSettingsModal.
 */

import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { switchAudio } from '../../methods/streamMethods/switchAudio';
import { switchVideo } from '../../methods/streamMethods/switchVideo';
import { switchVideoAlt } from '../../methods/streamMethods/switchVideoAlt';

const MediaSettingsModal = ({
  isMediaSettingsModalVisible,
  onMediaSettingsClose,
  switchCameraOnPress = switchVideoAlt,
  switchVideoOnPress = switchVideo,
  switchAudioOnPress = switchAudio,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  let { islevel, showAlert, coHost, member, userDefaultVideoInputDevice, videoInputs, audioInputs, userDefaultAudioInputDevice } = parameters;

  const [selectedVideoInput, setSelectedVideoInput] = useState(userDefaultVideoInputDevice);
  const [selectedAudioInput, setSelectedAudioInput] = useState(userDefaultAudioInputDevice);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.7 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const handleSwitchCamera = async () => {
    // Handle switching camera logic
    await switchCameraOnPress({ parameters });
  };

  const handleVideoSwitch = async (value) => {
    // Handle switching video input device logic
    if (value !== selectedVideoInput) {
      setSelectedVideoInput(value);
      await switchVideoOnPress({ videoPreference: value, parameters });
    }
  };

  const handleAudioSwitch = async (value) => {
    // Handle switching audio input device logic
    if (value !== selectedAudioInput) {
      setSelectedAudioInput(value);
      await switchAudioOnPress({ audioPreference: value, parameters });
    }
  };

  const handleModalClose = () => {
    // Logic to close the media settings modal
    onClose();
  };

  return (
    <Modal transparent={true} animationType="slide" visible={isMediaSettingsModalVisible} onRequestClose={onMediaSettingsClose}>
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Media Settings</Text>
            <Pressable onPress={onMediaSettingsClose} style={styles.btnCloseMediaSettings}>
              <FontAwesome5 name="times" style={styles.icon} />
            </Pressable>
          </View>
          <View style={styles.hr} />
          <View style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <FontAwesome5 name="camera" size={16} color="black" /> Select Camera:
              </Text>
              <RNPickerSelect
                items={videoInputs.map((input) => ({ label: input.label, value: input.deviceId }))}
                onValueChange={(value) => handleVideoSwitch(value)}
                value={selectedVideoInput || ''}
                style={{
                  inputIOS: styles.picker,
                  inputAndroid: styles.picker,
                }}
                placeholder={{}}
              />
            </View>
            <View style={styles.sep} />
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <FontAwesome5 name="microphone" size={16} color="black" /> Select Microphone:
              </Text>
              <RNPickerSelect
                items={audioInputs.map((input) => ({ label: input.label, value: input.deviceId }))}
                onValueChange={(value) => handleAudioSwitch(value)}
                value={selectedAudioInput || ''}
                style={{
                  inputIOS: styles.picker,
                  inputAndroid: styles.picker,
                }}
                placeholder={{}}
              />
            </View>
            <View style={styles.sep} />
            <View style={styles.formGroup}>
              <Pressable style={styles.switchCameraButton} onPress={handleSwitchCamera}>
                <Text style={styles.switchCameraButtonText}>
                  <FontAwesome5 name="sync-alt" size={16} color="black" /> Switch Camera
                </Text>
              </Pressable>
            </View>
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
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  modalBody: {
    padding: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  switchCameraButton: {
    backgroundColor: '#8cd3ff',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  switchCameraButtonText: {
    color: 'black',
  },
  btnCloseMediaSettings: {
    padding: 5,
  },
  icon: {
    fontSize: 20,
    color: 'black',
    marginRight: 15,
  },
  hr : {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },
  sep : {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 5,
  },
});

export default MediaSettingsModal;
