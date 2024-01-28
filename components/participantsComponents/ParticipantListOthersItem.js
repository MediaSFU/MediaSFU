import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * ParticipantListOthersItem - A React Native component representing an item in the list of other participants.
 * @param {Object} props - The props passed to the ParticipantListOthersItem.
 * @param {Object} props.participant - The participant object containing details.
 * @param {Object} props.parameters - Additional parameters for the participant item.
 * @returns {React.Component} - The ParticipantListOthersItem.
 */
const ParticipantListOthersItem = ({ participant, parameters }) => {
  const { member, coHost, islevel } = parameters;

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>
          {participant.islevel === '2'
            ? participant.name === member
              ? `${participant.name} (you)`
              : `${participant.name} (host)`
            : participant.name === member
            ? `${participant.name} (you)`
            : coHost === participant.name
            ? `${participant.name} (co-host)`
            : participant.name}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <FontAwesome
          name={participant.muted ? 'dot-circle-o' : 'dot-circle-o'}
          style={{ color: participant.muted ? 'red' : 'green' }}
        />
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameContainer: {
    flex: 8,
  },
  nameText: {
    fontSize: 16,
  },
  iconContainer: {
    flex: 4,
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
});

export default ParticipantListOthersItem;
