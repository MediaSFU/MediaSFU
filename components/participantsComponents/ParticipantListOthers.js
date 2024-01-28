import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ParticipantListOthersItem from './ParticipantListOthersItem';

/**
 * ParticipantListOthers - A React Native component representing a list of other participants.
 * @param {Object} props - The props passed to the ParticipantListOthers.
 * @param {Array} props.participants - An array of participant objects.
 * @param {Object} props.parameters - Additional parameters for the participant list.
 * @returns {React.Component} - The ParticipantListOthers.
 */
const ParticipantListOthers = ({ participants, parameters }) => {
  return (
    <ScrollView>
      {participants.map((participant, index) => (
        <React.Fragment key={participant.name}>
          <ParticipantListOthersItem
            key={participant.name}
            participant={participant}
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

export default ParticipantListOthers;

