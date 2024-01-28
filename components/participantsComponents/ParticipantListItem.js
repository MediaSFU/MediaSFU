import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * ParticipantListItem - A React Native component representing an item in the participant list.
 * @param {Object} props - The props passed to the ParticipantListItem.
 * @param {Object} props.participant - The participant object containing information about the participant.
 * @param {boolean} props.isBroadcast - Flag indicating whether the list is for a broadcast.
 * @param {function} props.onMuteParticipants - Callback function to mute participants.
 * @param {function} props.onMessageParticipants - Callback function to message participants.
 * @param {function} props.onRemoveParticipants - Callback function to remove participants.
 * @param {function} props.formatBroadcastViews - Callback function to format broadcast views.
 * @param {Object} props.parameters - Additional parameters for the participant list.
 * @returns {React.Component} - The ParticipantListItem.
 */
const ParticipantListItem = ({
  participant,
  isBroadcast,
  onMuteParticipants,
  onMessageParticipants,
  onRemoveParticipants,
  formatBroadcastViews,
  parameters,
}) => {
  const {
    coHostResponsibility,
    coHost,
    member,
    islevel,
    showAlert,
    participants,
    roomName,
  } = parameters;

  /**
   * Returns the icon name based on whether the participant is muted or not.
   * @returns {string} - The icon name.
   */
  const getIconName = () => (participant.muted ? 'microphone-slash' : 'microphone');

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>
          {participant.islevel === '2' ? `${participant.name} (host)` : participant.name}
        </Text>
      </View>
      {!isBroadcast && (
        <>
          <View style={styles.iconContainer}>
            <FontAwesome
              name={participant.muted ? 'dot-circle-o' : 'dot-circle-o'}
              style={[styles.icon, { color: participant.muted ? 'red' : 'green' }]}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() =>
                onMuteParticipants({
                  parameters: {
                    ...parameters,
                    participant: participant,
                  },
                })
              }
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed ? '#ebebeb' : '#007bff',
                },
              ]}
            >
              <FontAwesome
                name={getIconName()}
                style={[styles.icon, { color: 'white' }]}
              />
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() =>
                onMessageParticipants({
                  parameters: {
                    ...parameters,
                    participant: participant,
                  },
                })
              }
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed ? '#ebebeb' : '#007bff',
                },
              ]}
            >
              <FontAwesome name="comment" style={[styles.icon, { color: 'white' }]} />
            </Pressable>
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() =>
            onRemoveParticipants({
              parameters: {
                ...parameters,
                participant: participant,
              },
            })
          }
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? '#ebebeb' : '#dc3545',
            },
          ]}
        >
          <FontAwesome name="trash" style={[styles.icon, { color: 'white' }]} />
        </Pressable>
      </View>
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
    flex: 4,
  },
  nameText: {
    fontSize: 16,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  button: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
});

export default ParticipantListItem;
