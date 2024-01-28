import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5,FontAwesome } from '@expo/vector-icons';

/**
 * Custom component for rendering a set of control buttons with icons and text.
 * @param {Object} props - Component properties.
 * @param {Array} props.buttons - An array of button objects, each containing properties like name, icon, onPress, etc.
 * @param {string} [props.position='left'] - The horizontal alignment of the button container (left, right, middle).
 * @param {string} [props.location='top'] - The vertical alignment of the button container (top, bottom, center).
 * @param {string} [props.direction='horizontal'] - The direction in which buttons are arranged (horizontal, vertical).
 * @param {Object} [props.buttonsContainerStyle] - Additional styles for the container of buttons.
 * @param {JSX.Element} [props.alternateIconComponent] - An alternate icon component to render when a button is active.
 * @param {JSX.Element} [props.iconComponent] - An icon component to render when a button is not active.
 * @param {boolean} [props.showAspect=false] - Whether to the component or not.
 * @returns {JSX.Element} - The rendered component.
 */
const ControlButtonsComponentTouch = ({
  buttons,
  position,
  location,
  direction,
  buttonsContainerStyle,
  alternateIconComponent,
  iconComponent,
  showAspect,
}) => {
  
  // console.log("buttons",showAspect,location,position)

  const getAlignmentStyle = () => {
    let alignmentStyle = {};

    if (position === 'left' || position === 'right' || position === 'middle') {
      alignmentStyle.justifyContent = position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center';
    }

    if (location === 'top' || location === 'bottom' || location === 'center') {
      alignmentStyle.alignItems = location === 'top' ? 'flex-start' : location === 'bottom' ? 'flex-end' : 'center';
    }

    if (direction === 'vertical') {
      alignmentStyle.flexDirection = 'column';
    } else {
      alignmentStyle.flexDirection = 'row';
    }

    return alignmentStyle;
  };

  return (
    <View style={[styles.container, getAlignmentStyle(), buttonsContainerStyle, { display: showAspect ? 'flex' : 'none' }]}>
      {buttons.map((button, index) => (
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.buttonContainer,
            {
              backgroundColor: pressed
                ? button.backgroundColor?.pressed || button.backgroundColor || 'rgba(255, 255, 255, 0.25)'
                : button.backgroundColor?.default || button.backgroundColor || 'rgba(255, 255, 255, 0.25)',
                display: button.show ? 'flex' : 'none'
            },
            direction === 'vertical' && styles.verticalButton,
          ]}
          onPress={button.onPress}
        >
          {({ pressed }) => (
            <>
              {button.icon ? (
                button.active ? (
                  button.alternateIconComponent ? (
                    button.alternateIconComponent
                  ) : (
                    <FontAwesome5
                      name={button.alternateIcon}
                      size={20}
                      color={button.activeColor || 'transparent'}
                    />
                  )
                ) : (
                  button.iconComponent ? (
                    button.iconComponent
                  ) : (
                    <FontAwesome5
                      name={button.icon}
                      size={20}
                      color={button.inActiveColor || 'transparent'}
                    />
                  )
                )
              ) : (
                button.customComponent
              )}
              {button.name ? (
                <Text
                  style={[
                    styles.buttonText,
                    { color: button.color || 'transparent' },
                  ]}
                >
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginVertical: 5,
    elevation: 9,
    zIndex: 9,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  verticalButton: {
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default ControlButtonsComponentTouch;

