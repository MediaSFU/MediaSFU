import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, ScrollView, Pressable, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * Represents a modal component for displaying and managing polls.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isPollModalVisible - Determines whether the poll modal is visible.
 * @param {Function} props.onClose - The function to close the poll modal.
 * @param {Object} props.parameters - The parameters for managing polls.
 * @param {string} [props.position='topRight'] - The position of the poll modal.
 * @param {string} [props.backgroundColor='#f5f5f5'] - The background color of the poll modal.
 * @returns {JSX.Element} The rendered poll modal component.
 */
const PollModal = ({
  isPollModalVisible,
  onClose,
  parameters,
  position = 'topRight',
  backgroundColor = '#f5f5f5',
}) => {
  const {
    roomName,
    member,
    islevel,
    polls,
    poll,
    updatePolls,
    updatePoll,
    showAlert,
    
    handleCreatePoll,
    handleEndPoll,
    handleVotePoll,
  } = parameters;

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const [newPoll, setNewPoll] = useState({ question: '', type: '', options: [] });

  useEffect(() => {
    if (isPollModalVisible) {
      renderPolls();
    }
  }, [isPollModalVisible, polls, poll]);

  const renderPolls = () => {
    let activePollCount = 0;
    let inactivePollCount = 0;

    polls.forEach((polled) => {
      if (polled.status === 'active' && poll && polled.id === poll.id) {
        activePollCount++;
      } else {
        inactivePollCount++;
      }
    });

    if (islevel == '2' && activePollCount === 0) {
      if (poll && poll.status === 'active') {
        poll.status = 'inactive';
      }
    }
  };

  const calculatePercentage = (votes, optionIndex) => {
    const totalVotes = votes.reduce((a, b) => a + b, 0);
    return totalVotes > 0 ? ((votes[optionIndex] / totalVotes) * 100).toFixed(2) : 0;
  };

  const handlePollTypeChange = (type) => {
    let options = [];

    switch (type) {
      case 'trueFalse':
        options = ['True', 'False'];
        break;
      case 'yesNo':
        options = ['Yes', 'No'];
        break;
      case 'custom':
        options = [];
        break;
      default:
        options = [];
        break;
    }

    setNewPoll({ ...newPoll, type, options });
  };

  const renderPollOptions = () => {
    switch (newPoll?.type) {
      case 'trueFalse':
      case 'yesNo':
        return (
          <View>
            {newPoll.options.map((option, index) => (
              <View style={styles.formCheck} key={index}>
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonIcon} />
                </View>
                <Text style={styles.formCheckLabel}>{option}</Text>
              </View>
            ))}
          </View>
        );
      case 'custom':
        return (
          <>
            {newPoll.options?.map((option, index) => (
              <View style={styles.formGroup} key={index}>
                <TextInput
                  style={styles.formControl}
                  placeholder={`Option ${index + 1}`}
                  maxLength={50}
                  value={option || ''}
                  onChangeText={(text) => {
                    const newOptions = [...newPoll.options];
                    newOptions[index] = text;
                    setNewPoll({ ...newPoll, options: newOptions });
                  }}
                />
              </View>
            ))}
            {[...Array(5 - (newPoll.options?.length || 0))].map((_, index) => (
              <View style={styles.formGroup} key={(newPoll.options?.length || 0) + index}>
                <TextInput
                  style={styles.formControl}
                  placeholder={`Option ${(newPoll.options?.length || 0) + index + 1}`}
                  maxLength={50}
                  value=""
                  onChangeText={(text) => {
                    const newOptions = [...(newPoll.options || []), text];
                    setNewPoll({ ...newPoll, options: newOptions });
                  }}
                />
              </View>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const renderCurrentPollOptions = () => {
    return poll.options.map((option, i) => (
      <TouchableOpacity
        style={styles.formCheck}
        key={i}
        onPress={() => handleVotePoll({ pollId: poll.id, optionIndex: i, parameters })}
      >
        <View style={[styles.radioButton, poll.voters && poll.voters[member] === i && styles.radioButtonSelected]}>
          <View style={styles.radioButtonIcon} />
        </View>
        <Text style={styles.formCheckLabel}>{option}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Modal visible={isPollModalVisible} transparent={true} animationType="slide">
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Polls</Text>
            <Pressable onPress={onClose}>
              <Icon name="times" size={20} color="black" />
            </Pressable>
          </View>
          <View style={styles.separator} />
          <ScrollView>
            {islevel == '2' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Previous Polls</Text>
                  {polls.length === 0 && <Text>No polls available</Text>}
                  {polls.map((polled, index) => (
                    polled && (!poll || (poll && (poll.status != 'active' || polled.id != poll.id))) && (
                      <View key={index} style={styles.poll}>
                        <Text style={styles.pollLabel}>Question:</Text>
                        <TextInput style={styles.textarea} multiline={true} editable={false} value={polled.question} />
                        <Text style={styles.pollLabel}>Options:</Text>
                        {polled.options.map((option, i) => (
                          <Text key={i}>{`${option}: ${polled.votes[i]} votes (${calculatePercentage(polled.votes, i)}%)`}</Text>
                        ))}
                        {polled.status === 'active' && (
                          <Pressable style={[styles.button, styles.buttonDanger]} onPress={() => handleEndPoll({ pollId: polled.id, parameters })}>
                            <Text style={styles.buttonText}>End Poll</Text>
                          </Pressable>
                        )}
                      </View>
                    )
                  ))}
                </View>
                <View style={styles.separator} />
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Create a New Poll</Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Poll Question</Text>
                    <TextInput
                      style={styles.textarea}
                      multiline={true}
                      maxLength={300}
                      value={newPoll.question || ''}
                      onChangeText={(text) => setNewPoll({ ...newPoll, question: text })}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Select Poll Answer Type</Text>
                    <RNPickerSelect
                      onValueChange={handlePollTypeChange}
                      items={[
                        { label: "Choose...", value: "" },
                        { label: "True/False", value: "trueFalse" },
                        { label: "Yes/No", value: "yesNo" },
                        { label: "Custom", value: "custom" },
                      ]}
                      style={pickerSelectStyles}
                      placeholder={{}}
                      value={newPoll.type || ""}
                    />
                  </View>
                  {renderPollOptions()}
                  <Pressable
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={() => handleCreatePoll({ poll: newPoll, parameters })}
                  >
                    <Text style={styles.buttonText}>Create Poll</Text>
                  </Pressable>
                </View>
                <View style={styles.separator} />
              </>
            )}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Current Poll</Text>
              {poll && poll.status === 'active' ? (
                <View style={styles.formGroup}>
                  <Text style={styles.pollLabel}>Question:</Text>
                  <TextInput style={styles.textarea} multiline={true} editable={false} value={poll.question} />
                  <Text style={styles.pollLabel}>Options:</Text>
                  {renderCurrentPollOptions()}
                  {poll.status === 'active' && islevel == '2' && (
                    <Pressable style={[styles.button, styles.buttonDanger]} onPress={() => handleEndPoll({ pollId: poll.id, parameters })}>
                      <Text style={styles.buttonText}>End Poll</Text>
                    </Pressable>
                  )}
                </View>
              ) : (
                <Text>No active poll</Text>
              )}
            </View>
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    maxHeight: '75%',
    overflowY: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  poll: {
    marginBottom: 10,
  },
  pollLabel: {
    fontWeight: 'bold',
  },
  textarea: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    marginBottom: 5,
  },
  formCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  radioButtonIcon: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  formCheckLabel: {
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: 'black',
  },
  buttonDanger: {
    backgroundColor: 'red',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default PollModal;
