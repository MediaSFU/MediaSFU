import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, Dimensions, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import RenderRequestComponent from './RenderRequestComponent';
import { respondToRequests } from '../../methods/requestsMethods/respondToRequests';

/**
 * Renders a modal for displaying and handling participant requests.
 *
 * @param {Object} props - The props containing information about the requests modal.
 * @param {boolean} props.isRequestsModalVisible - Determines whether the requests modal is visible.
 * @param {Function} props.onRequestClose - The function to handle the close event of the requests modal.
 * @param {number} props.requestCounter - The counter for the number of requests.
 * @param {Function} props.onRequestFilterChange - The function to handle the filter change event for requests.
 * @param {Function} props.onRequestItemPress - The function to handle the press event on a request item.
 * @param {Array} props.requestList - The array of participant requests.
 * @param {Function} props.updateRequestList - The function to update the participant request list.
 * @param {string} props.roomName - The name of the room where the request is being responded to.
 * @param {Function} props.renderRequestComponent - The function to render the individual request component.
 * @param {string} props.backgroundColor - The background color of the requests modal.
 * @param {string} props.position - The position of the requests modal.
 * @param {Object} props.parameters - Additional parameters for handling requests.
 *
 * @returns {React.Element} - The rendered component for displaying and handling participant requests modal.
 *
 * @example
 * // Example usage of RequestsModal
 * <RequestsModal
 *   isRequestsModalVisible={true}
 *   onRequestClose={() => handleCloseRequestsModal()}
 *   requestCounter={3}
 *   onRequestFilterChange={(text) => handleRequestFilterChange(text)}
 *   onRequestItemPress={(params) => handleRequestItemPress(params)}
 *   requestList={requestList}
 *   updateRequestList={(newRequestList) => updateRequestList(newRequestList)}
 *   roomName="exampleRoom"
 *   renderRequestComponent={(request, onRequestItemPress, requestList, updateRequestList, roomName) => (
 *     <RenderRequestComponent
 *       request={request}
 *       onRequestItemPress={onRequestItemPress}
 *       requestList={requestList}
 *       updateRequestList={updateRequestList}
 *       roomName={roomName}
 *     />
 *   )}
 *   backgroundColor="#83c0e9"
 *   position="topRight"
 *   parameters={additionalParameters}
 * />
 */
const RequestsModal = ({
  isRequestsModalVisible,
  onRequestClose,
  requestCounter,
  onRequestFilterChange,
  onRequestItemPress = respondToRequests,
  requestList,
  updateRequestList,
  roomName,
  socket,
  renderRequestComponent = RenderRequestComponent,

  backgroundColor = '#83c0e9',
  position = 'topRight',

  parameters,
}) => {
  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;

  if (modalWidth > 400) {
    modalWidth = 400;
  }

  return (
    <Modal transparent={true} animationType="slide" visible={isRequestsModalVisible} onRequestClose={onRequestClose}>
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor: backgroundColor, width: modalWidth }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Requests <Text style={styles.badge}>{requestCounter}</Text>
            </Text>
            <Pressable onPress={onRequestClose} style={styles.btnCloseRequests}>
              <FontAwesome name="times" style={styles.icon} />
            </Pressable>
          </View>
          <View style={styles.hr} />
          <View style={styles.modalBody}>
            <View style={styles.formGroup}>
              <TextInput style={styles.input} placeholder="Search ..." onChangeText={onRequestFilterChange} />
            </View>
            <ScrollView style={styles.scrollView}>
              <View id="request-list" style={styles.row}>
                {/* Request items will be dynamically added here */}
                {requestList &&
                  requestList.map((requestItem, index) => (
                    <View key={index} style={styles.requestItem}>
                      {renderRequestComponent(requestItem, onRequestItemPress, requestList, updateRequestList, roomName, socket)}
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
  },
  modalContent: {
    height: '65%',
    backgroundColor: '#83c0e9',
    borderRadius: 0,
    padding: 20,
    maxHeight: '65%',
    maxWidth: '70%',
    zIndex: 9,
    elevation: 9,
    border:'solid 2px black',
  },
  scrollView: {
    flex: 1,
    maxHeight: '100%',
    maxWidth: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    color: 'black',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
  listGroup: {
    margin: 0,
    padding: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },

  requestItem: {
    marginVertical: 5,
  },
  icon: {
    fontSize: 20,
    color: 'black',
  },
  badge: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 10,
    padding: 5,
    marginLeft: 5,
  },
  hr: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },
  sep: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 0,
  },
});

export default RequestsModal;
