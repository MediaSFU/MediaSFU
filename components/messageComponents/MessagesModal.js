import React, { useEffect, useState,useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import MessagePanel from './MessagePanel';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { FontAwesome } from '@expo/vector-icons';
import { sendMessage } from '../../methods/messageMethods/sendMessage';

/**
 * MessagesModal component for displaying direct and group messages in a modal.
 * @component
 * @param {Object} props - The properties of the MessagesModal component.
 * @param {boolean} props.isMessagesModalVisible - Indicates if the messages modal is visible.
 * @param {Function} props.onMessagesClose - The function to close the messages modal.
 * @param {Function} props.onSendMessagePress - The function to handle sending messages.
 * @param {Object} props.parameters - Additional parameters used in the component.
 * @param {string} props.position - The position of the modal ('topRight', 'topLeft', etc.).
 * @param {string} props.backgroundColor - The background color of the modal.
 * @param {string} props.activeTabBackgroundColor - The background color of the active tab.
 */
const MessagesModal = ({
  isMessagesModalVisible,
  onMessagesClose,
  onSendMessagePress = sendMessage,
  parameters,
  messages,
  position = 'topRight',
  backgroundColor = '#f5f5f5',
  activeTabBackgroundColor = '#2b7ce5',
}) => {



  
  let {
    participantsAll,
    youAreHost,
    eventType,
    chatSetting,
    member,
    islevel,
    coHostResponsibility,
    coHost,
    showAlert,
    startDirectMessage,
    updateStartDirectMessage,
    directMessageDetails,
    updateDirectMessageDetails,
  } = parameters;

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;

  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const [directMessages, setDirectMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const activeTab = useRef(eventType == 'webinar' || eventType == 'conference' ? 'direct' : 'group');
  const [focusedInput, setFocusedInput] = useState(false);
 

  /**
   * Switches the active tab to 'direct'.
   * @function
   */
  const switchToDirectTab = () => {
    
    activeTab.current = 'direct';
  };

  /**
   * Switches the active tab to 'group'.
   * @function
   */
  const switchToGroupTab = () => {
    activeTab.current = 'group';
  };

  useEffect(() => {
    /**
     * Populates direct and group messages based on the current state.
     * @function
     */

    let chatValue = false;

    try {
      // Check co-host responsibility for chat
      chatValue = coHostResponsibility.find((item) => item.name === 'chat').value;
  } catch (error) {}

    const populateMessages = () => {
      let directMsgs = messages ? messages.filter((message) => !message.group) : [];
      //only show ones that you are allowed to see, either islevel == '2' or you are cohost and chatValue is true or you are the sender
      directMsgs = directMsgs.filter((message) => message.sender === member || message.receivers.includes(member) || (islevel === '2' || (coHost == member && chatValue === true)));
      setDirectMessages(directMsgs);


      const groupMsgs = messages ? messages.filter((message) => message.group) : [];
      setGroupMessages(groupMsgs);
    };

    if (isMessagesModalVisible) {
      populateMessages();
    }
  }, [isMessagesModalVisible, messages]);

  useEffect(() => {
    if (startDirectMessage && directMessageDetails) {
       
      if (eventType === 'webinar' || eventType === 'conference') {
        activeTab.current = 'direct';

        // Focus on direct message input
        setFocusedInput(true);
      }
    }else {
      if (eventType === 'broadcast' || eventType === 'chat') {
        activeTab.current = 'group';
      }
    }
  }, [startDirectMessage, directMessageDetails, eventType]);
  
  return (
    <Modal animationType="slide" transparent={true} visible={isMessagesModalVisible} onRequestClose={onMessagesClose}>
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Direct and Group Tabs */}
            {eventType === 'webinar' || eventType === 'conference' ? (
              <>
            <Pressable onPress={switchToDirectTab}>
              <Text style={[styles.tabText, activeTab.current === 'direct' && styles.activeTabText, activeTab.current === 'direct' && { backgroundColor: activeTabBackgroundColor }]}>
                Direct
              </Text>
            </Pressable>
            <Pressable onPress={switchToGroupTab}>
              <Text style={[styles.tabText, activeTab.current === 'group' && styles.activeTabText, activeTab.current === 'group' && { backgroundColor: activeTabBackgroundColor }]}>
                Group
              </Text>
            </Pressable>
            </>
            ) : null}

            {/* Close button */}
            <Pressable onPress={onMessagesClose} style={styles.btnCloseMessages}>
              <FontAwesome name="times" style={styles.icon} />
            </Pressable>
          </View>

          <View style={styles.separator} />

          {/* Tab content */}
          
          <View style={styles.modalBody}>
            {/* Direct Message Panel */}
            
            {activeTab.current === 'direct' && (eventType === 'webinar' || eventType === 'conference') && (
              <MessagePanel
                messages={directMessages}
                messagesLength={messages.length}
                type="direct"
                onSendMessagePress={onSendMessagePress}
                username={member}
                parameters={parameters}
                backgroundColor={backgroundColor}
                focusedInput={focusedInput}
              />
            )}

            {/* Group Chat Panel */}
            {activeTab.current === 'group' && (
              <MessagePanel
                messages={groupMessages}
                messagesLength={messages.length}
                type="group"
                onSendMessagePress={onSendMessagePress}
                username={member}
                parameters={parameters}
                backgroundColor={backgroundColor}
                focusedInput={false}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
  },
  modalContent: {
    height: '65%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 10,
    maxHeight: '65%',
    maxWidth: '80%',
    zIndex: 9,
    elevation: 9,
    marginBottom: 10,
  },
  modalBody: {
    flex: 1,
  },
  tabText: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  activeTabText: {
    color: '#ffffff',
    backgroundColor: '#2b7ce5',
    borderRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 1, // Adjust the margin as needed
  },
  btnCloseMessages: {
    padding: 5,

  },
  icon: {
    fontSize: 24,
    color: 'black',
  },
});

export default MessagesModal;
