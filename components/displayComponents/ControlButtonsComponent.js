// ControlButtonsComponent.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5,MaterialIcons } from '@expo/vector-icons';

/**
 * Custom component for rendering a set of control buttons with icons and text.
 * @param {Object} props - Component properties.
 * @param {Array} props.buttons - An array of button objects, each containing properties like name, icon, onPress, etc.
 * @param {string} [props.buttonColor] - The color for button icons and text.
 * @param {Object} [props.buttonBackgroundColor] - The background color for buttons in default and pressed states.
 * @param {string} [props.alignment='flex-start'] - The alignment of the button container (flex-start, center, flex-end).
 * @param {boolean} [props.vertical=false] - If true, buttons will be arranged vertically.
 * @param {Object} [props.buttonsContainerStyle] - Additional styles for the container of buttons.
 * @param {JSX.Element} [props.alternateIconComponent] - An alternate icon component to render when a button is active.
 * @param {JSX.Element} [props.iconComponent] - An icon component to render when a button is not active.
 * @returns {JSX.Element} - The rendered component.
 */
const ControlButtonsComponent = ({
  buttons,
  buttonColor,
  buttonBackgroundColor,
  alignment,
  vertical,
  buttonsContainerStyle,
  alternateIconComponent,
}) => {
  /**
   * Get the alignment style for the button container.
   * @returns {Object} - The alignment style object.
   */
  const getAlignmentStyle = () => {
    if (alignment === 'center') {
      return { justifyContent: 'center', };
    } else if (alignment === 'flex-end') {
      return { justifyContent: 'flex-end' };
    }else if (alignment === 'space-between') {
        return { justifyContent: 'space-between' };
    }else if (alignment === 'space-around') {
        return { justifyContent: 'space-around' };
    }else if (alignment === 'space-evenly') {
        return { justifyContent: 'space-evenly' };
    }else{
    return { justifyContent: 'flex-start' }; // Default to flex-start
    }
  };

  return (
    <View style={[styles.container, getAlignmentStyle(), buttonsContainerStyle]}>
      {buttons.map((button, index) => (
    
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.buttonContainer,
            {
              backgroundColor: pressed
                ? buttonBackgroundColor?.pressed || '#444'
                : buttonBackgroundColor?.default || 'transparent',
            },
            vertical && styles.verticalButton,
          ]}
          disabled={button.disabled}
          onPress={button.onPress}
        >
          {({ pressed }) => (
            <>
              {button.icon ? (

                button.active ? (
                    button.alternateIconComponent ? (
                        button.alternateIconComponent
                    ) : (
                        <FontAwesome5 name={button.alternateIcon} size={24} color={button.activeColor || '#ffffff'} />
                    )
                    ) : (
                       
                        button.iconComponent ? (
                            button.iconComponent
                        ) : (
                            <FontAwesome5 name={button.icon} size={24} color={button.inActiveColor || '#ffffff'} />
                        )
                       
                    
                    )
              
              ) : (
                button.customComponent
              )}
              {button.name ? (
                <Text style={[styles.buttonText, { color: button.color || '#ffffff' }]}>
                  {button.name}
                </Text>
              ) : null}
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  verticalButton: {
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default ControlButtonsComponent;
