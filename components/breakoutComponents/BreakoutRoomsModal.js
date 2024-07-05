import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, TextInput, Button, FlatList, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';
import { getModalPosition } from '../../methods/utils/getModalPosition';

const RoomList = ({ rooms, handleEditRoom, handleDeleteRoom, handleRemoveParticipant }) => {
  return (
    <FlatList
      data={rooms}
      keyExtractor={(item, index) => `room-${index}`}
      renderItem={({ item, index: roomIndex }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text>Room {roomIndex + 1} <Icon name="users" /></Text>
            <View style={styles.cardHeaderButtons}>
              <Pressable onPress={() => handleEditRoom(roomIndex)} style={styles.iconButton}>
                <Icon name="pen" size={20} color="#000" />
              </Pressable>
              <Pressable onPress={() => handleDeleteRoom(roomIndex)} style={styles.iconButton}>
                <Icon name="times" size={20} color="#000" />
              </Pressable>
            </View>
          </View>
          <View style={styles.cardBody}>
            {item.map((participant, index) => (
              <View key={index} style={styles.listItem}>
                <Text>{participant.name}</Text>
                <Pressable onPress={() => handleRemoveParticipant(roomIndex, participant)} style={styles.iconButton}>
                  <Icon name="times" size={20} color="#000" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
    />
  );
};

const EditRoomModal = ({ editRoomModalVisible, setEditRoomModalVisible, currentRoom, participantsRef, handleAddParticipant, handleRemoveParticipant, currentRoomIndex }) => {
  const renderAssignedParticipant = ({ item, index }) => (
    <View style={styles.listItem} key={index}>
      <Text>{item.name}</Text>
      <Pressable onPress={() => handleRemoveParticipant(currentRoomIndex, item)} style={styles.iconButton}>
        <Icon name="times" size={20} color="#000" />
      </Pressable>
    </View>
  );

  const renderUnassignedParticipant = ({ item, index }) => (
    <View style={styles.listItem} key={index}>
      <Text>{item.name}</Text>
      <Pressable onPress={() => handleAddParticipant(currentRoomIndex, item)} style={styles.iconButton}>
        <Icon name="plus" size={20} color="#000" />
      </Pressable>
    </View>
  );

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={editRoomModalVisible}
      onRequestClose={() => setEditRoomModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Room {currentRoomIndex + 1} <Icon name="pen" /></Text>
            <Pressable onPress={() => setEditRoomModalVisible(false)}>
              <Icon name="times" size={20} color="#000" />
            </Pressable>
          </View>
          <FlatList
            data={currentRoom}
            renderItem={renderAssignedParticipant}
            keyExtractor={(item, index) => `assigned-${index}`}
            ListHeaderComponent={
              <Text style={styles.listTitle}>Assigned Participants <Icon name="users" /></Text>
            }
            ListEmptyComponent={
              <View style={styles.listItem}>
                <Text>None assigned</Text>
              </View>
            }
          />
          <FlatList
            data={participantsRef.current.filter(participant => participant.breakRoom == null)}
            renderItem={renderUnassignedParticipant}
            keyExtractor={(item, index) => `unassigned-${index}`}
            ListHeaderComponent={
              <Text style={styles.listTitle}>Unassigned Participants <Icon name="users" /></Text>
            }
            ListEmptyComponent={
              <View style={styles.listItem}>
                <Text>None pending</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const BreakoutRoomsModal = ({ isVisible, onBreakoutRoomsClose, parameters, position = 'topRight', backgroundColor = '#83c0e9' }) => {
  let {
    participants,
    showAlert,
    socket,
    itemPageLimit,
    meetingDisplayType,
    prevMeetingDisplayType,
    onScreenChanges,
    roomName,
    shareScreenStarted,
    shared,
    eventType,
    islevel,

    breakOutRoomStarted,
    breakOutRoomEnded,
    isBreakoutRoomsModalVisible,
    hostNewRoom,
    currentRoomIndex,
    canStartBreakout,
    limitedBreakRoom,
    breakoutRooms,

    updateBreakOutRoomStarted,
    updateBreakOutRoomEnded,
    updateIsBreakoutRoomsModalVisible,
    updateHostNewRoom,
    updateCurrentRoomIndex,
    updateCanStartBreakout,
    updateLimitedBreakRoom,
    updateBreakoutRooms,
    updateMeetingDisplayType,
  } = parameters;

  const participantsRef = useRef(participants);
  const breakoutRoomsRef = useRef(breakoutRooms && breakoutRooms.length > 0 ? [...breakoutRooms] : []);

  const [numRooms, setNumRooms] = useState('');
  const [newParticipantAction, setNewParticipantAction] = useState('autoAssignNewRoom');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [editRoomModalVisible, setEditRoomModalVisible] = useState(false);

  const [startBreakoutButtonVisible, setStartBreakoutButtonVisible] = useState(false);
  const [stopBreakoutButtonVisible, setStopBreakoutButtonVisible] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.9 * screenWidth;
  if (modalWidth > 600) {
    modalWidth = 600;
  }

  useEffect(() => {
    if (isVisible) {
      const filteredParticipants = participants.filter(participant => participant.islevel != '2');
      participantsRef.current = filteredParticipants;
      breakoutRoomsRef.current = breakoutRooms && breakoutRooms.length > 0 ? [...breakoutRooms] : [];
      checkCanStartBreakout();
    }
  }, [isVisible]);

  const handleRandomAssign = () => {
    const numRoomsInt = parseInt(numRooms);
    if (!numRoomsInt || numRoomsInt <= 0) {
      showAlert({ message: 'Please enter a valid number of rooms', type: 'danger' });
      return;
    }

    const newBreakoutRooms = Array.from({ length: numRoomsInt }, () => []);
    const shuffledParticipants = [...participantsRef.current].sort(() => 0.5 - Math.random());

    shuffledParticipants.forEach((participant, index) => {
      const roomIndex = index % numRoomsInt;
      if (newBreakoutRooms[roomIndex].length < itemPageLimit) {
        newBreakoutRooms[roomIndex].push(participant);
        participant.breakRoom = roomIndex;
      } else {
        for (let i = 0; i < numRoomsInt; i++) {
          if (newBreakoutRooms[i].length < itemPageLimit) {
            newBreakoutRooms[i].push(participant);
            participant.breakRoom = i;
            break;
          }
        }
      }
    });
    breakoutRoomsRef.current = newBreakoutRooms;
    checkCanStartBreakout();
  };

  const handleManualAssign = () => {
    const numRoomsInt = parseInt(numRooms);
    if (!numRoomsInt || numRoomsInt <= 0) {
      showAlert({ message: 'Please enter a valid number of rooms', type: 'danger' });
      return;
    }

    breakoutRoomsRef.current = Array.from({ length: numRoomsInt }, () => []);
    canStartBreakout = false;
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleAddRoom = () => {
    breakoutRoomsRef.current = [...breakoutRoomsRef.current, []];
    canStartBreakout = false;
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleSaveRooms = () => {
    if (validateRooms()) {
      updateBreakoutRooms(breakoutRoomsRef.current);
      canStartBreakout = true;
      updateCanStartBreakout(true);
      checkCanStartBreakout();
      showAlert({ message: 'Rooms saved successfully', type: 'success' });
    } else {
      //showAlert({ message: 'Rooms validation failed', type: 'danger' });
    }
  };

  const validateRooms = () => {
    if (breakoutRoomsRef.current.length == 0) {
      showAlert({ message: 'There must be at least one room', type: 'danger' });
      return false;
    }

    for (let room of breakoutRoomsRef.current) {
      if (room.length == 0) {
        showAlert({ message: 'Rooms must not be empty', type: 'danger' });
        return false;
      }

      const participantNames = room.map(p => p.name);
      const uniqueNames = new Set(participantNames);
      if (participantNames.length != uniqueNames.size) {
        showAlert({ message: 'Duplicate participant names in a room', type: 'danger' });
        return false;
      }

      if (room.length > itemPageLimit) {
        showAlert({ message: 'A room exceeds the participant limit', type: 'danger' });
        return false;
      }
    }

    return true;
  };

  const checkCanStartBreakout = () => {
    if (canStartBreakout) {
      setStartBreakoutButtonVisible(true);
      setStopBreakoutButtonVisible(breakOutRoomStarted && !breakOutRoomEnded);
    } else {
      setStartBreakoutButtonVisible(false);
      setStopBreakoutButtonVisible(false);
    }
  };

  const handleStartBreakout = () => {
    if (shareScreenStarted || shared) {
      showAlert({ message: 'You cannot start breakout rooms while screen sharing is active', type: 'danger' });
      return;
    }

    if (canStartBreakout) {
      const emitName = breakOutRoomStarted && !breakOutRoomEnded ? 'updateBreakout' : 'startBreakout';
      const filteredBreakoutRooms = breakoutRoomsRef.current.map(room => room.map(({ name, breakRoom }) => ({ name, breakRoom })));
      socket.emit(emitName, { breakoutRooms: filteredBreakoutRooms, newParticipantAction, roomName }, (response) => {
        if (response.success) {
          showAlert({ message: 'Breakout rooms active', type: 'success' });
          breakOutRoomStarted = true;
          breakOutRoomEnded = false;
          updateBreakOutRoomStarted(true);
          updateBreakOutRoomEnded(false);

          onBreakoutRoomsClose();
          if (meetingDisplayType != 'all') {
            prevMeetingDisplayType = meetingDisplayType;
            meetingDisplayType = 'all';
            updateMeetingDisplayType('all');
          }

        } else {
          showAlert({ message: response.reason, type: 'danger' });
        }
      });
    }
  };

  const handleStopBreakout = () => {
    socket.emit('stopBreakout', { roomName }, (response) => {
      if (response.success) {
        showAlert({ message: 'Breakout rooms stopped', type: 'success' });
        breakOutRoomStarted = false;
        breakOutRoomEnded = true;
        updateBreakOutRoomStarted(false);
        updateBreakOutRoomEnded(true);

        onBreakoutRoomsClose();
        if (meetingDisplayType != prevMeetingDisplayType) {
          meetingDisplayType = prevMeetingDisplayType;
        }

      } else {
        showAlert({ message: response.reason, type: 'danger' });
      }
    });
  };

  const handleEditRoom = (roomIndex) => {
    currentRoomIndex = roomIndex;
    updateCurrentRoomIndex(roomIndex);
    setCurrentRoom(breakoutRoomsRef.current[roomIndex]);
    setEditRoomModalVisible(true);
    canStartBreakout = false;
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleDeleteRoom = (roomIndex) => {
    if (breakoutRoomsRef.current.length > 0) {
      const room = breakoutRoomsRef.current[roomIndex];
      room.forEach(participant => participant.breakRoom = null);
      const newBreakoutRooms = [...breakoutRoomsRef.current];
      newBreakoutRooms.splice(roomIndex, 1);

      newBreakoutRooms.forEach((room, index) => {
        room.forEach(participant => participant.breakRoom = index);
      });

      breakoutRoomsRef.current = newBreakoutRooms;
      checkCanStartBreakout();
    }
  };

  const handleAddParticipant = (roomIndex, participant) => {
    if (breakoutRoomsRef.current[roomIndex].length < itemPageLimit) {
      const newBreakoutRooms = [...breakoutRoomsRef.current];
      newBreakoutRooms[roomIndex].push(participant);
      breakoutRoomsRef.current = newBreakoutRooms;
      participant.breakRoom = roomIndex;
      if (currentRoomIndex != null) {
        handleEditRoom(currentRoomIndex);
      }
    } else {
      showAlert({ message: 'Room is full', type: 'danger' });
    }
  };

  const handleRemoveParticipant = (roomIndex, participant) => {
    const newBreakoutRooms = [...breakoutRoomsRef.current];
    newBreakoutRooms[roomIndex] = newBreakoutRooms[roomIndex].filter(p => p != participant);
    breakoutRoomsRef.current = newBreakoutRooms;
    participant.breakRoom = null;
    if (currentRoomIndex != null) {
      handleEditRoom(currentRoomIndex);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onBreakoutRoomsClose}
    >
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Breakout Rooms <Icon name="door-open" /></Text>
            <Pressable onPress={onBreakoutRoomsClose}>
              <Icon name="times" size={20} color="#000" />
            </Pressable>
          </View>
          <FlatList
            ListHeaderComponent={
              <View>
                <View style={styles.formGroup}>
                  <Text>Number of Rooms <Icon name="users" /></Text>
                  <TextInput
                    style={styles.input}
                    value={numRooms}
                    onChangeText={setNumRooms}
                    inputMode="numeric"
                  />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.buttonGroup}>
                    <Pressable style={styles.button} onPress={handleRandomAssign}>
                      <Icon name="random" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Random</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleManualAssign}>
                      <Icon name="hand-pointer" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Manual</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleAddRoom}>
                      <Icon name="plus" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Add Room</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleSaveRooms}>
                      <Icon name="save" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Save Rooms</Text>
                    </Pressable>
                  </View>
                </ScrollView>
                <View style={styles.formGroup}>
                  <Text>New Participant Action <Icon name="users" /></Text>
                  <RNPickerSelect
                    style={pickerSelectStyles}
                    value={newParticipantAction}
                    onValueChange={(value) => setNewParticipantAction(value)}
                    items={[
                      { label: 'Add to new room', value: 'autoAssignNewRoom' },
                      { label: 'Add to open room', value: 'autoAssignAvailableRoom' },
                      { label: 'No action', value: 'manualAssign' },
                    ]}
                    placeholder={{}}
                  />
                </View>
              </View>
            }
            data={breakoutRoomsRef.current}
            keyExtractor={(item, index) => `room-${index}`}
            renderItem={({ item, index: roomIndex }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text>Room {roomIndex + 1} <Icon name="users" /></Text>
                  <View style={styles.cardHeaderButtons}>
                    <Pressable onPress={() => handleEditRoom(roomIndex)} style={styles.iconButton}>
                      <Icon name="pen" size={20} color="#000" />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteRoom(roomIndex)} style={styles.iconButton}>
                      <Icon name="times" size={20} color="#000" />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  {item.map((participant, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text>{participant.name}</Text>
                      <Pressable onPress={() => handleRemoveParticipant(roomIndex, participant)} style={styles.iconButton}>
                        <Icon name="times" size={20} color="#000" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}
            ListFooterComponent={
              <View style={styles.buttonGroup}>
                {startBreakoutButtonVisible && (
                  <Pressable style={styles.button} onPress={handleStartBreakout}>
                    <Text style={styles.buttonText}>{breakOutRoomStarted && !breakOutRoomEnded ? 'Update Breakout' : 'Start Breakout'}</Text>
                    <Icon name={breakOutRoomStarted && !breakOutRoomEnded ? 'sync' : 'play'} size={16} color={breakOutRoomStarted && !breakOutRoomEnded ? 'yellow' : 'green'} />
                  </Pressable>
                )}
                {stopBreakoutButtonVisible && (
                  <Pressable style={styles.button} onPress={handleStopBreakout}>
                    <Text style={styles.buttonText}>Stop Breakout</Text>
                    <Icon name="stop" size={16} color="red" />
                  </Pressable>
                )}
              </View>
            }
          />
        </View>
      </View>
      <EditRoomModal
        editRoomModalVisible={editRoomModalVisible}
        setEditRoomModalVisible={setEditRoomModalVisible}
        currentRoom={currentRoom}
        participantsRef={participantsRef}
        handleAddParticipant={handleAddParticipant}
        handleRemoveParticipant={handleRemoveParticipant}
        currentRoomIndex={currentRoomIndex}
      />
    </Modal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
    border: 'solid 2px black',
  },
  modalContent: {
    height: '70%',
    backgroundColor: '#83c0e9',
    borderRadius: 0,
    padding: 20,
    maxHeight: '75%',
    maxWidth: '90%',
    zIndex: 9,
    elevation: 9,
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
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8D9BAB',
    padding: 5,
    margin:5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    marginRight: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderButtons: {
    flexDirection: 'row',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  iconButton: {
    padding: 5,
  },
});

export default BreakoutRoomsModal;
