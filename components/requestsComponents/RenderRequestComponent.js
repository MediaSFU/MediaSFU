import React from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * Renders a component for displaying and handling participant requests.
 *
 * @param {Object} props - The props containing information about the participant request.
 * @param {Object} props.request - The request object containing information about the participant request.
 * @param {Function} props.onRequestItemPress - The function to handle the press event on the request item.
 * @param {Array} props.requestList - The array of participant requests.
 * @param {Function} props.updateRequestList - The function to update the participant request list.
 * @param {string} props.roomName - The name of the room where the request is being responded to.
 * @param {Function} props.socket - The socket object for communication.
 *
 * @returns {React.Element} - The rendered component for displaying participant requests.
 *
 * @example
 * // Example usage of RenderRequestComponent
 * <RenderRequestComponent
 *   request={{ id: '12345', name: 'John Doe', icon: 'fa-microphone' }}
 *   onRequestItemPress={(params) => handleRequestItemPress(params)}
 *   requestList={requestList}
 *   updateRequestList={(newRequestList) => updateRequestList(newRequestList)}
 *   roomName="exampleRoom"
 * />
 */
const RenderRequestComponent = ( request, onRequestItemPress, requestList, updateRequestList, roomName,socket ) => {
  const keyMap = {
    'fa-microphone': 'microphone',
    'fa-desktop': 'desktop',
    'fa-video': 'video-camera',
    'fa-comments': 'comments',
  };


  const handleRequestAction = (action) => {
    onRequestItemPress({
      parameters: {
        request,
        updateRequestList,
        requestList,
        action,
        roomName,
        socket,
      },
    });
  };

  return (
    <View key={request.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 5 }}>
        <Text>{request.name}</Text>
      </View>
      <View style={{ flex: 2, alignItems: 'center' }}>
        {/* Use FontAwesome component for rendering icons */}
        <FontAwesome name={keyMap[request.icon]} size={24} color="black" />
      </View>
      <View style={{ flex: 2, alignItems: 'center' }}>
        {/* Accept button */}
        <Pressable onPress={() => handleRequestAction('accepted')}>
          <FontAwesome name="check" size={24} color="green" />
        </Pressable>
      </View>
      <View style={{ flex: 2, alignItems: 'center' }}>
        {/* Reject button */}
        <Pressable onPress={() => handleRequestAction('rejected')}>
          <FontAwesome name="times" size={24} color="red" />
        </Pressable>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default RenderRequestComponent;
