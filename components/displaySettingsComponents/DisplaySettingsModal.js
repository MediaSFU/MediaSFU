/**
 * DisplaySettingsModal - A modal component for managing display settings.
 * @param {Object} props - The properties passed to the DisplaySettingsModal component.
 * @param {boolean} props.isDisplaySettingsModalVisible - A boolean to control the visibility of the display settings modal.
 * @param {Function} props.onDisplaySettingsClose - A function to handle closing the display settings modal.
 * @param {Function} props.onModifyDisplaySettings - A function to modify display settings.
 * @param {Object} props.parameters - Additional parameters for display settings modal functionality.
 * @param {string} props.position - The position of the modal.
 * @param {string} props.backgroundColor - The background color of the modal.
 * @returns {JSX.Element} - The DisplaySettingsModal component JSX element.
 */


import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { modifyDisplaySettings } from '../../methods/displaySettingsMethods/modifyDisplaySettings';
import RNPickerSelect from 'react-native-picker-select';


const DisplaySettingsModal = ({
  isDisplaySettingsModalVisible,
  onDisplaySettingsClose,
  onModifyDisplaySettings = modifyDisplaySettings,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const { meetingDisplayType, autoWave, forceFullDisplay, meetingVideoOptimized, updatemeetingDisplayType } = parameters;

    const [meetingDisplayTypeState, setmeetingDisplayTypeState] = useState(meetingDisplayType);
    const [autoWaveState, setAutoWaveState] = useState(autoWave);
    const [forceFullDisplayState, setForceFullDisplayState] = useState(forceFullDisplay);
    const [meetingVideoOptimizedState, setMeetingVideoOptimizedState] = useState(meetingVideoOptimized);


  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  return (
    <Modal transparent={true} animationType="slide" visible={isDisplaySettingsModalVisible} onRequestClose={onDisplaySettingsClose}>
      <View style={[styles.modalContainer, getModalPosition('topRight')]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Display Settings</Text>
            <Pressable onPress={onDisplaySettingsClose} style={styles.btnCloseSettings}>
              <FontAwesome name="times" style={styles.icon} />
            </Pressable>
          </View>
          <View style={styles.hr} />
          <View style={styles.modalBody}>
          

            {/* RNPickerSelect for meetingDisplayType */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Display Option:</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                value={meetingDisplayTypeState}
                onValueChange={(value) => setmeetingDisplayTypeState(value)}
                items={[
                  { label: 'Video Participants Only', value: 'video' },
                  { label: 'Media Participants Only', value: 'media' },
                  { label: 'Show All Participants', value: 'all' },
                ]}
                placeholder={{}}
              />
            </View>

            <View style={styles.sep} />

            <View style={styles.formCheckGroup}>
              <View style={styles.formCheck}>
                <Text style={styles.label} >Display Audiographs</Text>
                <Pressable onPress={() => setAutoWaveState(!autoWaveState)}>
                  <FontAwesome name="check" size={24} color={autoWaveState ? 'green' : 'black'} />
                </Pressable>
              </View>
              <View style={styles.sep} />
              <View style={styles.formCheck}>
                <Text style={styles.label}  >Force Full Display</Text>
                <Pressable onPress={() => setForceFullDisplayState(!forceFullDisplayState)}>
                  <FontAwesome name="check" size={24} color={forceFullDisplayState ? 'green' : 'black'} />
                </Pressable>
              </View>
              <View style={styles.sep} />
              <View style={styles.formCheck}>
                <Text style={styles.label}>Force Video Participants</Text>
                <Pressable onPress={() => setMeetingVideoOptimizedState(!meetingVideoOptimizedState)}>
                  <FontAwesome name="check" size={24} color={meetingVideoOptimizedState ? 'green' : 'black'} />
                </Pressable>
              </View>
              <View style={styles.sep} />
            </View>
          </View>
          <View style={styles.modalFooter}>
            <Pressable onPress={() => onModifyDisplaySettings({parameters: {...parameters, meetingDisplayType: meetingDisplayTypeState, autoWave: autoWaveState, forceFullDisplay: forceFullDisplayState, meetingVideoOptimized: meetingVideoOptimizedState}})}
            style={styles.btnApplySettings}>
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
  sep: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 2,
  },
  hr: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
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
  },
  icon: {
    fontSize: 24,
    color: 'black',
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

export default DisplaySettingsModal;
