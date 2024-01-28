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
const ControlButtonsAltComponent = ({
    buttons,
    position,
    location,
    direction,
    buttonsContainerStyle,
    alternateIconComponent,
    iconComponent,
    showAspect,
  }) => {
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
                ? button.backgroundColor?.pressed || '#444'
                : button.backgroundColor?.default || 'transparent',
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
                      size={14}
                      color={button.activeColor || '#ffffff'}
                    />
                  )
                ) : (
                  button.iconComponent ? (
                    button.iconComponent
                  ) : (
                    <FontAwesome5
                      name={button.icon}
                      size={14}
                      color={button.inActiveColor || '#ffffff'}
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
                    { color: button.color || '#ffffff' },
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
    marginVertical: 5,
    elevation: 9,
    zIndex: 9,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  verticalButton: {
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default ControlButtonsAltComponent;
