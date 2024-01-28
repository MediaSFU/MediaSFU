import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ParticipantListItem from './ParticipantListItem';

/**
 * ParticipantList - A React Native component to display a list of participants.
 * @param {Object} props - The props passed to the ParticipantList.
 * @param {Array} props.participants - An array of participant objects to be displayed.
 * @param {boolean} props.isBroadcast - Flag indicating whether the list is for a broadcast.
 * @param {function} props.onMuteParticipants - Callback function to mute participants.
 * @param {function} props.onMessageParticipants - Callback function to message participants.
 * @param {function} props.onRemoveParticipants - Callback function to remove participants.
 * @param {function} props.formatBroadcastViews - Callback function to format broadcast views.
 * @param {Object} props.parameters - Additional parameters for the participant list.
 * @returns {React.Component} - The ParticipantList.
 */


const ParticipantList = ({
  participants,
  isBroadcast,
  onMuteParticipants,
  onMessageParticipants,
  onRemoveParticipants,
  formatBroadcastViews,
  parameters,
}) => {
  return (
    <ScrollView>
      {participants.map((participant, index) => (
        <React.Fragment key={participant.name}>
          <ParticipantListItem
            participant={participant}
            isBroadcast={isBroadcast}
            onMuteParticipants={onMuteParticipants}
            onMessageParticipants={onMessageParticipants}
            onRemoveParticipants={onRemoveParticipants}
            formatBroadcastViews={formatBroadcastViews}
            parameters={parameters}
          />
          {index < participants.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 1, // Adjust the margin as needed
  },
});

export default ParticipantList;
