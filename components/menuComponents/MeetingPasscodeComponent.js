/**
 * React component representing the display of an Event Passcode with an input field.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.meetingPasscode - The Event Passcode to be displayed in the input field.
 * @returns {React.ReactNode} - The rendered MeetingPasscodeComponent.
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const MeetingPasscodeComponent = ({ meetingPasscode="" }) => {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Event Passcode (Host):</Text>
      <TextInput
        style={styles.disabledInput}
        value={meetingPasscode}
        readOnly={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    // Add styles for the form group container if needed
  },
  label: {
    // Add styles for the label if needed
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    backgroundColor: '#f0f0f0',
    color: 'black',
  },
});

export default MeetingPasscodeComponent;
