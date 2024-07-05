import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, FlatList, Pressable, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ConfigureWhiteboard = ({ isVisible, onConfigureWhiteboardClose, parameters, backgroundColor = '#83c0e9', position = 'topRight' }) => {
  let {
    participants,
    showAlert,
    socket,
    itemPageLimit,
    islevel,
    roomName,
    eventType,
    shareScreenStarted,
    shared,
    breakOutRoomStarted,
    breakOutRoomEnded,
    recordStarted,
    recordResumed,
    recordPaused,
    recordStopped,
    recordingMediaOptions,
    canStartWhiteboard,

    whiteboardStarted,
    whiteboardEnded,
    whiteboardUsers,
    updateWhiteboardStarted,
    updateWhiteboardEnded,
    updateWhiteboardUsers,
    updateCanStartWhiteboard,
    updateIsConfigureWhiteboardModalVisible,

    onScreenChanges,
    captureCanvasStream,
    prepopulateUserMedia,
    rePort,
    hostLabel
  } = parameters;

  const [participantsCopy, setParticipantsCopy] = useState([]);
  const [whiteboardLimit, setWhiteboardLimit] = useState(itemPageLimit);
  const [isEditing, setIsEditing] = useState(false);

  const modalContainerStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.7 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContentStyle = {
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '75%',
  };

  useEffect(() => {
    if (isVisible) {
      const filteredParticipants = participants.filter(participant => participant.islevel != '2');
      setParticipantsCopy(filteredParticipants);
      checkCanStartWhiteboard();
    }
  }, [isVisible]);

  useEffect(() => {
    if (socket) {
      socket.on('whiteboardUpdated', async (data) => {
        if (islevel == '2' && data.members) {
          const filteredParticipants = data.members.filter(participant => !participant.isBanned);
          setParticipantsCopy(filteredParticipants);
        }

        updateWhiteboardUsers(data.whiteboardUsers);

        if (data.status == 'started') {
          whiteboardStarted = true;
          whiteboardEnded = false;
          updateWhiteboardStarted(true);
          updateWhiteboardEnded(false);

          if (islevel != '2') {
            shareScreenStarted = true;
            await onScreenChanges({ changed: true, parameters });
          }
        } else if (data.status == 'ended') {
          whiteboardEnded = true;
          whiteboardStarted = false;
          updateWhiteboardStarted(false);
          updateWhiteboardEnded(true);

          shareScreenStarted = false;
          await onScreenChanges({ changed: true, parameters });
          await prepopulateUserMedia({ name: hostLabel, parameters });
          await rePort({ restart: true, parameters });
        }
      });
    }
  }, [socket, eventType, islevel]);

  const toggleParticipant = (participant, add) => {
    setIsEditing(true);
    const selectedParticipants = participantsCopy.filter(p => p.useBoard);
    if (add && selectedParticipants.length >= (whiteboardLimit - 1)) {
      showAlert({ message: `Participant limit exceeded - you can only add ${whiteboardLimit - 1} other participants`, type: 'danger' });
      return;
    }

    const updatedParticipants = participantsCopy.map(p =>
      p.name == participant.name ? { ...p, useBoard: add } : p
    );

    setParticipantsCopy(updatedParticipants);
  };

  const validateWhiteboard = () => {
    const selectedParticipants = participantsCopy.filter(participant => participant.useBoard);

    if (selectedParticipants.length > whiteboardLimit) {
      showAlert({ message: 'Participant limit exceeded', type: 'danger' });
      return false;
    }

    return true;
  };

  const checkCanStartWhiteboard = () => {
    const isValid = validateWhiteboard();
    canStartWhiteboard = isValid;
    updateCanStartWhiteboard(isValid);
  };

  const handleSaveWhiteboard = () => {
    if (validateWhiteboard()) {
      setIsEditing(false);
      canStartWhiteboard = true;
      updateCanStartWhiteboard(true);
      checkCanStartWhiteboard();
      showAlert({ message: 'Whiteboard saved successfully', type: 'success' });
    } else {
      showAlert({ message: 'Whiteboard validation failed', type: 'danger' });
    }
  };

  const handleStartWhiteboard = async () => {
    if ((shareScreenStarted || shared) && !whiteboardStarted) {
      showAlert({ message: 'You cannot start whiteboard while screen sharing is active', type: 'danger' });
      return;
    }

    if (breakOutRoomStarted && !breakOutRoomEnded) {
      showAlert({ message: 'You cannot start whiteboard while breakout rooms are active', type: 'danger' });
      return;
    }

    if (canStartWhiteboard) {
      const emitName = whiteboardStarted && !whiteboardEnded ? 'updateWhiteboard' : 'startWhiteboard';
      const filteredWhiteboardUsers = participantsCopy.filter(participant => participant.useBoard).map(({ name, useBoard }) => ({ name, useBoard }));
      await socket.emit(emitName, { whiteboardUsers: filteredWhiteboardUsers, roomName }, async (response) => {
        if (response.success) {
          showAlert({ message: 'Whiteboard active', type: 'success' });
          whiteboardStarted = true;
          whiteboardEnded = false;
          updateWhiteboardStarted(true);
          updateWhiteboardEnded(false);
          updateIsConfigureWhiteboardModalVisible(false);

          if (islevel != '2') {
            shareScreenStarted = true;
            await onScreenChanges({ changed: true, parameters });
          }

          if (islevel == '2' && (recordStarted || recordResumed)) {
            if (!(recordPaused || recordStopped) && recordingMediaOptions == 'video') {
              await captureCanvasStream({ parameters });
            }
          }
        } else {
          showAlert({ message: response.reason, type: 'danger' });
        }
      });
    }
  };

  const handleStopWhiteboard = async () => {
    await socket.emit('stopWhiteboard', { roomName }, async (response) => {
      if (response.success) {
        showAlert({ message: 'Whiteboard stopped', type: 'success' });
        whiteboardEnded = true;
        whiteboardStarted = false;
        updateWhiteboardStarted(false);
        updateWhiteboardEnded(true);
        updateIsConfigureWhiteboardModalVisible(false);

        shareScreenStarted = false;
        await onScreenChanges({ changed: true, parameters });
        await prepopulateUserMedia({ name: hostLabel, parameters });
        await rePort({ restart: true, parameters });
      } else {
        showAlert({ message: response.reason, type: 'danger' });
      }
    });
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onConfigureWhiteboardClose}
    >
      <View style={[modalContainerStyle, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configure Whiteboard</Text>
            <Pressable onPress={onConfigureWhiteboardClose}>
              <Icon name="times" size={20} color="#000" />
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Assigned</Text>
              <FlatList
                data={participantsCopy.filter(participant => participant.useBoard)}
                keyExtractor={(item) => item.name}
                renderItem={({ item: participant }) => (
                  <View style={styles.listItem}>
                    <Text>{participant.name}</Text>
                    <Pressable onPress={() => toggleParticipant(participant, false)} style={styles.iconButton}>
                      <Icon name="times" size={20} color="#000" />
                    </Pressable>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <View style={styles.listItem}>
                    <Text>None</Text>
                  </View>
                )}
              />
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Pending</Text>
              <FlatList
                data={participantsCopy.filter(participant => !participant.useBoard)}
                keyExtractor={(item) => item.name}
                renderItem={({ item: participant }) => (
                  <View style={styles.listItem}>
                    <Text>{participant.name}</Text>
                    <Pressable onPress={() => toggleParticipant(participant, true)} style={styles.iconButton}>
                      <Icon name="check" size={20} color="#000" />
                    </Pressable>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <View style={styles.listItem}>
                    <Text>None</Text>
                  </View>
                )}
              />
            </View>
          </View>
          <View style={styles.modalFooter}>
            <Pressable style={styles.button} onPress={handleSaveWhiteboard}>
              <Icon name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            {!isEditing && canStartWhiteboard && (
              <Pressable style={[styles.button, styles.startButton]} onPress={handleStartWhiteboard}>
                <Icon name={whiteboardStarted && !whiteboardEnded ? "sync-alt" : "play"} size={20} color="#fff" />
                <Text style={styles.buttonText}>{whiteboardStarted && !whiteboardEnded ? 'Update' : 'Start'}</Text>
              </Pressable>
            )}
            {whiteboardStarted && !whiteboardEnded && (
              <Pressable style={[styles.button, styles.stopButton]} onPress={handleStopWhiteboard}>
                <Icon name="times" size={20} color="#fff" />
                <Text style={styles.buttonText}>Stop</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getModalPosition = (position) => {
  const positions = {
    topRight: { justifyContent: 'flex-start', alignItems: 'flex-end' },
    topLeft: { justifyContent: 'flex-start', alignItems: 'flex-start' },
    bottomRight: { justifyContent: 'flex-end', alignItems: 'flex-end' },
    bottomLeft: { justifyContent: 'flex-end', alignItems: 'flex-start' },
  };
  return positions[position] || positions.topRight;
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    borderRadius: 10,
    maxHeight: '75%',
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
  modalBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    marginRight: 10,
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
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8D9BAB',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
});

export default ConfigureWhiteboard;
