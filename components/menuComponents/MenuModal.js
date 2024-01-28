/**
 * MenuModal component represents a modal that displays a menu with customizable buttons.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [backgroundColor='#83c0e9'] - The background color of the modal.
 * @param {boolean} isVisible - Determines whether the modal is visible.
 * @param {Function} onClose - Function to close the modal.
 * @param {Object[]} [customButtons] - An array of custom buttons to be displayed in the menu.
 * @param {Function} onCopyMeetingId - Function to copy the meeting ID.
 * @param {Function} onCopyMeetingPasscode - Function to copy the meeting passcode.
 * @param {Function} onCopyShareLink - Function to copy the shareable link.
 * @param {boolean} [shareButtons=true] - Determines whether the share buttons should be displayed.
 * @param {string} [position='bottomRight'] - Position of the modal. Possible values: 'center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'.
 * @returns {JSX.Element} - The rendered component.
 */


import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MenuItemComponent from './MenuItemComponent';
import MeetingIdComponent from './MeetingIDComponent';
import MeetingPasscodeComponent from './MeetingPasscodeComponent';
import ShareButtonsComponent from './ShareButtonsComponent';
import CustomButtons from './CustomButtons';
import { launchRecording } from '../../methods/recordingMethods/launchRecording';
import { launchWaiting } from '../../methods/waitingMethods/launchWaiting';
import { launchCoHost } from '../../methods/coHostMethods/launchCoHost';
import { launchMediaSettings } from '../../methods/mediaSettingsMethods/launchMediaSettings';
import { launchDisplaySettings } from '../../methods/displaySettingsMethods/launchDisplaySettings';
import { launchSettings } from '../../methods/settingsMethods/launchSettings';
import { launchRequests } from '../../methods/requestsMethods/launchRequests';
import { getModalPosition } from '../../methods/utils/getModalPosition';


const MenuModal = ({
    backgroundColor = '#83c0e9',
    isVisible,
    onClose,
    customButtons,
    onCopyMeetingId,
    onCopyMeetingPasscode,
    onCopyShareLink,
    shareButtons = true,
    position = 'bottomRight',
    roomName,
    adminPasscode, 
    islevel    

  }) => {

    // Get the screen width
    const screenWidth = Dimensions.get('window').width;

    // Calculate the width based on percentage
    let modalWidth = 0.8 * screenWidth

    if (modalWidth > 450) {
        modalWidth = 450;
    }

   /**
   * Get the style based on the specified modal position.
   * @returns {Object} - Style object for justifyContent and alignItems.
   */




  return (
    <Modal transparent={true} animationType="slide" visible={isVisible} onRequestClose={onClose}>
    <View style={[styles.modalContainer, getModalPosition(position)]}>
      <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            <FontAwesome name="bars" style={styles.icon} /> Menu
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" style={styles.icon} />
          </Pressable>
        </View>
        <View style={styles.hr} />
        <View style={styles.modalBody}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.listGroup}>
              <CustomButtons buttons={customButtons} />
              <View style={styles.separator} />
              {islevel == '2' && <MeetingPasscodeComponent onCopyMeetingPasscode={onCopyMeetingPasscode} meetingPasscode={adminPasscode} />}
              <MeetingIdComponent meetingID={roomName} />
              {shareButtons && <ShareButtonsComponent  meetingID={roomName}  onCopyShareLink={onCopyShareLink} />}
            </View>
          </ScrollView>
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
    
  },
  modalContent: {
    height: '70%', 
    backgroundColor: '#83c0e9',
    borderRadius: 0,
    padding: 10,
    maxHeight: '70%', 
    maxWidth: '75%', 
    

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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  icon: {
    fontSize: 20,
    color: 'black',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
    // alignItems: 'center',
  },
  listGroup: {
    margin: 0,
    padding: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 10,
  },
      formGroup: {
        marginBottom: 10,
      },
      label: {
        color: '#ffffff',
        marginBottom: 5,
      },
      inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 10,
        color: '#ffffff',
      },
      copyButton: {
        padding: 5,
      },
      shareButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      shareButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
      },
      hr:{
        height: 1,
        backgroundColor: 'black',
        marginVertical: 5,
      }
});

export default MenuModal;
