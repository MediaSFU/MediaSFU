/**
 * Component for displaying a modal for managing participants in the waiting room.
 *
 * @component
 * @example
 * // Example usage of WaitingRoomModal component
 * <WaitingRoomModal
 *   isWaitingModalVisible={true}
 *   onWaitingRoomClose={() => {}}
 *   waitingRoomCounter={3}
 *   onWaitingRoomFilterChange={() => {}}
 *   waitingRoomList={[
 *     { id: '1', name: 'Alice' },
 *     { id: '2', name: 'Bob' },
 *     { id: '3', name: 'Charlie' },
 *   ]}
 *   updateWaitingList={() => {}}
 *   roomName="Event Room"
 * />
 */


import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, Dimensions, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { respondToWaiting } from '../../methods/waitingMethods/respondToWaiting';


const WaitingRoomModal = ({
  isWaitingModalVisible,
  onWaitingRoomClose,
  waitingRoomCounter,
  onWaitingRoomFilterChange,
  waitingRoomList,
  updateWaitingList,
  roomName,
  onWaitingRoomItemPress = respondToWaiting,
  position = 'topRight',
  backgroundColor = '#83c0e9', 
}) => {
  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;

  if (modalWidth > 400) {
    modalWidth = 400;
  }

  return (
    <Modal transparent={true} animationType="slide" visible={isWaitingModalVisible} onRequestClose={onWaitingRoomClose}>
      <View style={[styles.modalContainer, getModalPosition(position)]}>
      <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Waiting <Text style={styles.badge}>{waitingRoomCounter}</Text></Text>
            <Pressable onPress={onWaitingRoomClose} style={styles.btnCloseWaitings}>
              <FontAwesome name="times" style={styles.icon} />
            </Pressable>
          </View>
          <View style={styles.hr} />
          <View style={styles.modalBody}>
            <View style={styles.formGroup}>
              <TextInput
                style={styles.input}
                placeholder="Search ..."
                onChangeText={onWaitingRoomFilterChange}
              />
            </View>
          
            <ScrollView style={styles.scrollView}>
              <View id="waitingroom-list" style={styles.row}>
                {/* People waiting will be dynamically added here */}
                {waitingRoomList && waitingRoomList.map((participant, index) => (
                  <View key={index} style={styles.waitingItem}>
                    <View style={styles.col7}>
                      <Text>{participant.name}</Text>
                    </View>
                    <View style={styles.col2}>
                      <Pressable onPress={() => 
                        respondToWaiting({parameters:{
                          participantId:participant.id,
                          participantName:participant.name,
                          waiting:participant,
                          updateWaitingList,
                          waitingList:waitingRoomList,
                          roomName,
                          type:true, //accepted
                        }})
                        }
                        >
                        <FontAwesome name="check" size={24} color="green" />
                      </Pressable>
                    </View>
                    <View style={styles.col2}>
                    <Pressable onPress={() => 
                        respondToWaiting({parameters:{
                          participantId:participant.id,
                          participantName:participant.name,
                          waiting:participant,
                          updateWaitingList,
                          waitingList:waitingRoomList,
                          roomName,
                          type:false, //rejected
                        }})
                        }
                        >
                        <FontAwesome name="times" size={24} color="red" />
                      </Pressable>
                    </View>
                    <View style={styles.col1} />
                  </View>
                ))}
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
  text: {
    color: 'black',
  },
  btnCloseWaitings: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  waitingItem: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  col7: {
    flex: 5,
    justifyContent: 'center',
  },
  col2: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  col1: {
    flex: 1,
  },
  badge: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 12,
    padding: 5,
    marginLeft: 5,
  },
  icon: {
    fontSize: 24,
    color: 'black',
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
});

export default WaitingRoomModal;
