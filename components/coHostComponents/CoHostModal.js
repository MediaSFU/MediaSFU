/**
 * CoHostModal - A modal component for managing co-host settings.
 * @param {Object} props - The properties passed to the CoHostModal component.
 * @param {boolean} props.isCoHostModalVisible - A boolean to control the visibility of the co-host modal.
 * @param {Function} props.onCoHostClose - A function to handle closing the co-host modal.
 * @param {Function} props.onModifyEventSettings - A function to modify co-host settings.
 * @param {string} props.currentCohost - The current co-host.
 * @param {Array} props.participants - The list of participants.
 * @param {Array} props.coHostResponsibility - The co-host responsibilities.
 * @param {Object} props.parameters - Additional parameters for co-host modal functionality.
 * @param {string} props.position - The position of the modal.
 * @param {string} props.backgroundColor - The background color of the modal.
 * @returns {JSX.Element} - The CoHostModal component JSX element.
 */

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions, Switch, TextInput, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { modifyCoHostSettings } from '../../methods/coHostMethods/modifyCoHostSettings';

const CoHostModal = ({
  isCoHostModalVisible,
  onCoHostClose,
  onModifyEventSettings = modifyCoHostSettings,
  currentCohost = 'No coHost',
  participants,
  coHostResponsibility,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const [selectedCohost, setSelectedCohost] = useState(currentCohost);

  const [CoHostResponsibilityCopy, setCoHostResponsibilityCopy] = useState([ ...coHostResponsibility ]);
  const [CoHostResponsibilityCopyAlt, setCoHostResponsibilityCopyAlt] = useState([ ...coHostResponsibility ]);
  const initialResponsibilities = CoHostResponsibilityCopyAlt.reduce((acc, item) => {
    let str = item.name;
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    let keyed = `manage${str2}`;
    acc[keyed] = item.value;
    acc[`dedicateTo${keyed}`] = item.dedicated;
    return acc;
  }, {});


  const [responsibilities, setResponsibilities] = useState(initialResponsibilities);

  const responsibilityItems = [
    { name: 'manageParticipants', label: 'Manage Participants' },
    { name: 'manageMedia', label: 'Manage Media' },
    { name: 'manageWaiting', label: 'Manage Waiting Room' },
    { name: 'manageChat', label: 'Manage Chat' },
  ];


  //filter out the current cohost from the list of participants and any participant with islevel '2'
   const filteredParticipants = participants && participants.filter((participant) => participant.name != currentCohost && participant.islevel != '2');


  const handleToggleSwitch = (responsibility) => {
    setResponsibilities((prevResponsibilities) => ({
      ...prevResponsibilities,
      [responsibility]: !prevResponsibilities[responsibility],

    }));


    //update the coHostResponsibilityCopy
    if (responsibility.startsWith('dedicateTo')) {
      const responsibilityName = responsibility.replace('dedicateTomanage', '').toLowerCase();
      const responsibilityDedicated = CoHostResponsibilityCopy.find((item) => item.name === responsibilityName).dedicated;
      CoHostResponsibilityCopy.find((item) => item.name === responsibilityName).dedicated = !responsibilityDedicated;
      setCoHostResponsibilityCopy([...CoHostResponsibilityCopy]);
    }else if (responsibility.startsWith('manage')) {
      const responsibilityName = responsibility.replace('manage', '').toLowerCase();
      const responsibilityValue = CoHostResponsibilityCopy.find((item) => item.name === responsibilityName).value;
      CoHostResponsibilityCopy.find((item) => item.name === responsibilityName).value = !responsibilityValue;
      setCoHostResponsibilityCopy([...CoHostResponsibilityCopy]);
       
    }

        
  };

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

useEffect(() => {
    const populateResponsibilities = () => {

        setCoHostResponsibilityCopyAlt([...coHostResponsibility]);
        setCoHostResponsibilityCopy([...coHostResponsibility]);
        const responsibilities = CoHostResponsibilityCopyAlt.reduce((acc, item) => {
        let str = item.name;
        const str2 = str.charAt(0).toUpperCase() + str.slice(1);
        let keyed = `manage${str2}`;
        acc[keyed] = item.value;
        acc[`dedicateTo${keyed}`] = item.dedicated;
        return acc;
        }, {});
        setResponsibilities(responsibilities);
        
    };

    if (isCoHostModalVisible) {
        populateResponsibilities();
    }
    }, [isCoHostModalVisible, coHostResponsibility]);

  return (
    <Modal transparent={true} animationType="slide" visible={isCoHostModalVisible} onRequestClose={onCoHostClose}>
      <View style={[styles.modalContainer, getModalPosition('topRight')]}>
        <View style={[styles.modalContent, { width: modalWidth }]}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Co-Host</Text>
              <Pressable onPress={onCoHostClose} style={styles.btnCloseSettings}>
                <FontAwesome name="times" style={styles.icon} />
              </Pressable>
            </View>
            <View style={styles.hr} />
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label,{fontWeight:'bold'}}>Current Co-host:</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={currentCohost}
                  readOnly={true}
                />
              </View>
          
              <View style={styles.sep} />
              <View style={styles.formGroup}>
                <Text style={styles.label,{fontWeight:'bold'}  }>Select New Co-host:</Text>
                <RNPickerSelect
                  style={pickerSelectStyles}
                  value={selectedCohost}
                  onValueChange={(value) => setSelectedCohost(value)}
                  items={filteredParticipants && filteredParticipants.map((participant) => ({name:participant.name, label:participant.name, value:participant.name}))}
                  placeholder={{label:'Select a participant', value:'Select a participant'}}
                />
              </View>
              <View style={styles.sep} />
              <View style={styles.row}>
                <View style={styles.col5}>
                  <Text style={styles.label,{fontWeight:'bold'}}>Responsibility</Text>
                </View>
                <View style={styles.col3}>
                  <Text style={styles.label,{fontWeight:'bold'}}>Select</Text>
                </View>
                <View style={styles.col4}>
                  <Text style={styles.label,{fontWeight:'bold'}}>Dedicated</Text>
                </View>
              </View>
              {responsibilityItems &&
                responsibilityItems.map((item) => (
                  <View style={styles.row} key={item.name}>
                    <View style={styles.col5}>
                      <Text style={styles.label}>{item.label}</Text>
                    </View>
                    <View style={styles.col3}>
                      <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={responsibilities[item.name] ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => handleToggleSwitch(item.name)}
                        value={responsibilities[item.name]}
                      />
                    </View>
                    <View style={styles.col4}>
                      <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={responsibilities[item.name] && responsibilities[`dedicateTo${item.name}`] ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => handleToggleSwitch(`dedicateTo${item.name}`)}
                        value={responsibilities[`dedicateTo${item.name}`] && responsibilities[item.name]}
                        disabled={!responsibilities[item.name]} // Disable if the actual thing is not activated
                      />
                    </View>
                  </View>
                ))}
            </View>
            <View style={styles.modalFooter}>
              <Pressable onPress={() => onModifyEventSettings({ 
                parameters: {
                    ...parameters,
                    selectedParticipant:selectedCohost,
                    coHost:currentCohost,
                    coHostResponsibility:CoHostResponsibilityCopy,
                 responsibilities }}
                 )} // Pass the parameters to the function
              
              style={styles.btnApplySettings}>
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
            </View>
          </ScrollView>
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
        borderRadius: 0,
        padding: 20,
        maxHeight: '65%',
        maxWidth: '70%',
        zIndex: 9,
        elevation: 9,
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
      btnCloseSettings: {
        padding: 5,
      },
      modalBody: {
        flex: 1,
      },
      formCheckGroup: {
        marginBottom: 10,
      },
      formCheck: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      sep: {
        height: 1,
        backgroundColor: '#ffffff',
        marginVertical: 2,
      },
      hr: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 5,
      },

      input: {
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 20,
        backgroundColor: 'white',
      },
      disabledInput: {
        backgroundColor: '#f2f2f2', // Adjust the color as needed
      },

  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  modalFooter: {
    marginTop: 10,
    flexDirection: 'row', // Ensure the items are in a row
    justifyContent: 'flex-end', // Align the items to the right,
  },
  btnApplySettings: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
  },
  icon: {
    fontSize: 24,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  col5: {
    flex: 5,
  },
  col3: {
    flex: 3,
    alignItems: 'center',
  },
  col4: {
    flex: 4,
    alignItems: 'center',
  },
  input: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 20,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#f2f2f2', // Adjust the color as needed
  },

});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

export default CoHostModal;
