import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Replace with the appropriate icons library
import { sendMessage } from '../../methods/messageMethods/sendMessage';

/**
 * MessagePanel component for rendering and sending messages.
 * @component
 * @param {Object} props - The properties of the MessagePanel component.
 * @param {Array} props.messages - The array of messages to be displayed.
 * @param {string} props.type - The type of the message panel ('direct' or 'group').
 * @param {string} props.username - The username of the current user.
 * @param {Function} props.onSendMessagePress - The function to handle sending messages.
 * @param {Object} props.parameters - Additional parameters used in the component.
 * @param {string} props.backgroundColor - The background color of the message panel.
 * @param {boolean} props.focusedInput - Indicates if the input is currently focused.
 */
const MessagePanel = ({
  messages,
  messagesLength,
  type,
  username,
  onSendMessagePress = sendMessage,
  parameters,
  backgroundColor = '#f5f5f5',
  focusedInput,
}) => {
  const {
    showAlert,
    participantsAll,
    youAreHost,
    eventType,
    chatSetting,
    member,
    islevel,
    startDirectMessage,
    updateStartDirectMessage,
    directMessageDetails,
    updateDirectMessageDetails,
  } = parameters;

  const inputRef = useRef(null); // Create a ref for the TextInput component

  const [replyInfo, setReplyInfo] = useState(null);
  const [senderId, setSenderId] = useState(null); // The username of the message sender (not host/cohost)

  const [directMessageText, setDirectMessageText] = useState(''); // direct message text
  const [groupMessageText, setGroupMessageText] = useState(''); // group message text

  /**
   * Handles changes in the message input field.
   * @function
   * @param {string} text - The text input value.
   */
  const handleTextInputChange = (text) => {
    if (type === 'direct') {
      setDirectMessageText(text);
    } else {
      setGroupMessageText(text);
    }
  };

  /**
   * Opens the reply input field for a specific sender.
   * @function
   * @param {string} senderId - The username of the message sender (not host/cohost).
   */
  const openReplyInput = (senderId) => {
    const replyInfoContainer = {
      text: "Replying to: ",
      username: senderId,
    };

    setReplyInfo(replyInfoContainer);
    setSenderId(senderId);
  };

  /**
   * Handles the sending of messages.
   * @async
   * @function
   */
  const handleSendButton = async () => {
    let message = type === 'direct' ? directMessageText : groupMessageText;

    if (!message) {
      if (showAlert) {
        showAlert({
          message: 'Please enter a message',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    if (message.length > 350) {
      if (showAlert) {
        showAlert({
          message: 'Message is too long',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    if (message.trim() === '') {
      if (showAlert) {
        showAlert({
          message: 'Message is not valid.',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    if (type === 'direct' && !senderId && islevel == '2') {
      if (showAlert) {
        showAlert({
          message: 'Please select a message to reply to',
          type: 'danger',
          duration: 3000,
        });
      }
      return;
    }

    await onSendMessagePress({
      parameters: {
        ...parameters,
        message,
        receivers: type === 'direct' ? [senderId] : [],
        group: type === 'group' ? true : false,
        type: type,
        messagesLength: messagesLength,
      },
    });

    if (type === 'direct') {
      setDirectMessageText('');
    } else {
      setGroupMessageText('');
    }

    if (inputRef.current) {
      inputRef.current.clear();
    }

    if (replyInfo) {
      setReplyInfo(null);
      setSenderId(null);
    }

    if (focusedInput) {
      updateDirectMessageDetails(null);
      updateStartDirectMessage(false);
    }
  };

  useEffect(() => {
    if (startDirectMessage && directMessageDetails && focusedInput) {
      inputRef.current && inputRef.current.focus();

      const replyInfoContainer = {
        text: "Replying to: ",
        username: directMessageDetails.name,
      };

      setReplyInfo(replyInfoContainer);
      setSenderId(directMessageDetails.name);
    } else {
      setReplyInfo(null);
      if (inputRef.current) {
        inputRef.current.clear();
      }
    }
  }, [focusedInput]);

  return (
    <ScrollView style={[{ maxHeight: '100%' }, { backgroundColor }]}>
      {messages.map((message, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: message.sender === username ? 'flex-end' : 'flex-start',
              marginBottom: 10,
            }}
          >
            <View style={styles.messageInfo}>
              {message.sender === username && !message.group && (
                <Text style={styles.receiver}>To: {message.receivers.join(', ')}</Text>
              )}
              <Text style={styles.sender}>{message.sender === username ? '' : message.sender}</Text>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
              {message.sender !== username && !message.group && (
                <Pressable
                  style={{
                    padding: 1,
                    marginLeft: 5,
                    borderRadius: 2,
                    backgroundColor: 'transparent',
                  }}
                  onPress={() => openReplyInput(message.sender)}
                >
                  <FontAwesome name="reply" size={12} color="black" />
                </Pressable>
              )}
          
            </View>
            <View
              style={{
                backgroundColor: message.sender === member ? styles.self.content.backgroundColor : styles.other.content.backgroundColor,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: 'black' }}>{message.message}</Text>
            </View>
          </View>
        </View>
      ))}

      {replyInfo && (
        <View style={styles.replyInfoContainer}>
          <Text style={styles.replyText}>{replyInfo.text}</Text>
          <Text style={styles.replyUsername}>{replyInfo.username}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          ref={focusedInput && startDirectMessage && directMessageDetails ? inputRef : null}
          style={styles.input}
          placeholder={
            type === 'direct'
              ? focusedInput && startDirectMessage && directMessageDetails
                ? 'Send a direct message to ' + directMessageDetails.name
                : 'Select a message to reply to'
              : eventType == 'chat'? 'Send a message' : 'Send a message to everyone'
          }
          maxLength={350}
          rows={2}
          multiline={true}
          onChangeText={(text) => handleTextInputChange(text)}
          value={type === 'direct' ? directMessageText : groupMessageText}
        />
        <Pressable style={styles.sendButton} onPress={handleSendButton}>
          <FontAwesome name="send" size={16} color="white" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  messageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  receiver: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 8, // Adjust font size as needed
    marginLeft: 6,
  },
  sender: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 8, // Adjust font size as needed
    marginRight: 10,
  },
  timestamp: {
    fontSize: 8, // Adjust font size as needed
    color: '#999999',
  },
  self: {
    content: {
      backgroundColor: '#DCF8C6',
      alignSelf: 'flex-end',
    },
  },
  other: {
    content: {
      backgroundColor: '#1ce5c7',
      alignSelf: 'flex-start',
    },
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop:'auto'
  },
  input: {
    flex: 1,
    height: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  sendButton: {
    backgroundColor: '#83c0e9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  replyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    marginBottom: 1,
  },
  replyText: {
    fontWeight: 'bold',
    marginRight: 2,
    fontSize: 8, // Adjust font size as needed
  },
  replyUsername: {
    color: 'red',
    fontSize: 8, // Adjust font size as needed
  },
});

export default MessagePanel;
