/**
 * React component representing the display of an Event ID with an input field.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.meetingID - The Event ID to be displayed in the input field.
 * @returns {React.ReactNode} - The rendered MeetingIdComponent.
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const MeetingIdComponent = ({ meetingID="" }) => {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Event ID:</Text>
      <TextInput
        style={styles.disabledInput}
        value={meetingID}
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

export default MeetingIdComponent;
