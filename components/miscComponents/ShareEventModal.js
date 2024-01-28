/**
 * ShareEventModal component represents a modal that displays a shareevent with customizable buttons.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [backgroundColor='#83c0e9'] - The background color of the modal.
 * @param {boolean} isVisible - Determines whether the modal is visible.
 * @param {Function} onClose - Function to close the modal.
 * @param {Object[]} [customButtons] - An array of custom buttons to be displayed in the shareevent.
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
import MeetingIdComponent from '../menuComponents/MeetingIDComponent';
import MeetingPasscodeComponent from '../menuComponents/MeetingPasscodeComponent';
import ShareButtonsComponent from '../menuComponents/ShareButtonsComponent';
import { getModalPosition } from '../../methods/utils/getModalPosition';


const ShareEventModal = ({
    backgroundColor = 'rgba(255, 255, 255, 0.25)',
    isShareEventModalVisible,
    onShareEventClose,
    onCopyMeetingId,
    onCopyMeetingPasscode,
    onCopyShareLink,
    shareButtons = true,
    position = 'topRight',
    roomName,      
    adminPasscode,
    islevel,

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
    <Modal transparent={true} animationType="slide" visible={isShareEventModalVisible} onRequestClose={onShareEventClose}>
    <View style={[styles.modalContainer, getModalPosition(position)]}>
      <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onShareEventClose} style={styles.closeButton}>
            <FontAwesome name="times" style={styles.icon} />
          </Pressable>
        </View>
        <View style={styles.hr} />
        <View style={styles.modalBody}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.listGroup}>
                {islevel == '2' && <MeetingPasscodeComponent meetingPasscode={adminPasscode} />}
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
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        zIndex: 9,
        elevation: 9,
      },
      modalContent: {
        height: '40%',
        backgroundColor: '#83c0e9',
        borderRadius: 10,
        padding: 10,
        maxHeight: '40%',
        maxWidth: '80%',
        zIndex: 9,
        elevation: 9,
        marginBottom: 10,
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

export default ShareEventModal;
