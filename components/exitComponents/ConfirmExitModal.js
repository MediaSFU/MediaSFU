

/**
 * A React Native modal component for confirming user exit from an event or ending an event.
 *
 * @component
 * @param {Object} props - The properties of the ConfirmExitModal component.
 * @param {boolean} props.isConfirmExitModalVisible - Flag indicating whether the modal is visible.
 * @param {Function} props.onConfirmExitClose - Callback function to close the modal.
 * @param {Object} props.parameters - Additional parameters required for exit confirmation logic.
 * @param {string} [props.position='topRight'] - Position of the modal (default is 'topRight').
 * @param {string} [props.backgroundColor='#83c0e9'] - Background color of the modal (default is '#83c0e9').
 * @param {Function} [props.exitEventOnConfirm=confirmExit] - Callback function for exit confirmation logic (default is confirmExit).
 * @returns {JSX.Element} - JSX element representing the ConfirmExitModal component.
 *
 * @example
 * // Example usage of ConfirmExitModal
 * <ConfirmExitModal
 *   isConfirmExitModalVisible={true}
 *   onConfirmExitClose={() => setConfirmExitModalVisible(false)}
 *   parameters={{ islevel: '2' }}
 *   position="bottomCenter"
 *   backgroundColor="#7e57c2"
 *   exitEventOnConfirm={customExitEventLogic}
 * />
 */

import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { confirmExit } from '../../methods/exitMethods/confirmExit';

const ConfirmExitModal = ({
  isConfirmExitModalVisible,
  onConfirmExitClose,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  exitEventOnConfirm = confirmExit,
}) => {
  const { islevel } = parameters;

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.7 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  /**
   * Handles the logic when the user confirms exit.
   */
  const handleConfirmExit = () => {
    exitEventOnConfirm({ parameters });
    onConfirmExitClose(); // Close the modal after confirming exit
  };

  return (
    <Modal transparent={true} animationType="slide" visible={isConfirmExitModalVisible} onRequestClose={onConfirmExitClose}>
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Exit</Text>
            <Pressable onPress={onConfirmExitClose} style={styles.btnCloseConfirmExit}>
              <FontAwesome5 name="times" style={styles.icon} />
            </Pressable>
          </View>
          <View style={styles.hr} />
          <View style={styles.modalBody}>
            <Text style={styles.confirmExitText}>
              {islevel == '2' ? 'This will end the event for all. Confirm exit.' : 'Are you sure you want to exit?'}
            </Text>
          </View>
          <View style={styles.hr} />
          <View style={styles.modalFooter}>
            <Pressable onPress={onConfirmExitClose} style={[styles.confirmButton, styles.btnCancel]}>
              <Text style={[styles.confirmButtonText, styles.btnCancelText]}>Cancel</Text>
            </Pressable>
            <View style={styles.doubleBorder}></View>
            <Pressable onPress={handleConfirmExit} style={[styles.confirmButton, styles.btnExit]}>
              <Text style={[styles.confirmButtonText, styles.btnExitText]}>{islevel === '2' ? 'End Event' : 'Exit'}</Text>
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
    height: '35%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 20,
    maxHeight: '35%',
    maxWidth: '70%',
    zIndex: 9,
    elevation: 9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  btnCloseConfirmExit: {
    padding: 5,
  },
  icon: {
    fontSize: 20,
    color: 'black',
    marginRight: 15,
  },
  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  modalBody: {
    padding: 4,
  },
  confirmExitText: {
    color: 'black',
    fontSize: 16,
    paddingVertical: 10,
    
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  confirmButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    backgroundColor: '#6c757d',
  },
  btnExit: {
    backgroundColor: '#dc3545',
  },
  doubleBorder: {
    height: 25,
    width: 1,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },
  confirmButtonText: {
    color: 'black',
  },
  btnCancelText: {
    fontSize: 14,
    color: 'white'
  },
  btnExitText: {
    fontSize: 14,
  },
});

export default ConfirmExitModal;
