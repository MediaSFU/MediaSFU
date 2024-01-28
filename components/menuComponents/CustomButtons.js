import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

/**
 * CustomButtons component represents a set of customizable buttons.
 *
 * @component
 * @param {Object[]} buttons - An array of button configurations.
 * @returns {JSX.Element} - The rendered component.
 */
const CustomButtons = ({ buttons }) => {

  return (
    <View style={styles.customButtonsContainer}>
      {buttons.map((button, index) => (
        
        <Pressable
          key={index}
          onPress={() => {
            button.action();
          }}
          style={[
            styles.customButton,
            { backgroundColor: button.show ? button.backgroundColor : 'transparent', display: button.show ? 'flex' : 'none' },
          ]}
          disabled={button.disabled}
        >
          <View style={styles.buttonContent}>
          {button.icon ? (
            <>
              <FontAwesome5 name={button.icon} style={[styles.customButtonIcon, button.iconStyle]} />
              {button.text && <Text style={[styles.customButtonText, button.textStyle]}>{button.text}</Text>}
            </>
          ) : button.customComponent ? (
            button.customComponent
          ) : null}
          </View>

        </Pressable>
      ))}
      
    </View>
  );
};

const styles = StyleSheet.create({
  customButtonsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'left',
  },
  customButton: {
    width: '100%', // Adjust the width as needed
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'transparent', // Example background color
    alignItems: 'left',
    justifyContent: 'left',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'left',
    justifyContent: 'left',
  },
  customButtonIcon: {
    fontSize: 20,
    color: '#000000', // Default color for the button icon
    marginRight: 4,
  },
  customButtonText: {
    color: '#000000', // Default color for the button text
  },
});

export default CustomButtons;
