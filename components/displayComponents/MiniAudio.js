import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Platform, Modal, PanResponder } from 'react-native';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';

/**
 * MiniAudio Component
 *
 * A customizable React Native component for displaying a mini audio modal with waveform animations.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} [props.visible=true] - Controls the visibility of the mini audio modal.
 * @param {Object} [props.customStyle] - Custom styles for the mini audio modal.
 * @param {string} props.name - The name to be displayed in the mini audio modal.
 * @param {boolean} [props.showWaveform] - If true, displays waveform animations.
 * @param {Object} [props.overlayPosition] - Position of the overlay within the modal.
 * @param {string} [props.barColor='white'] - Color of the waveform bars.
 * @param {string} [props.textColor='white'] - Color of the displayed text.
 * @param {Object} [props.nameTextStyling] - Additional styling for the displayed name text.
 * @param {string} props.imageSource - Source URI for the image displayed in the background.
 * @param {boolean} [props.roundedImage=false] - If true, applies a border-radius to the image for a rounded effect.
 * @param {Object} [props.imageStyle] - Custom styles for the image.
 * @returns {JSX.Element} - The rendered component.
 */

const MiniAudio = ({
  visible = true,
  customStyle,
  name,
  showWaveform,
  overlayPosition,
  barColor = 'white',
  textColor = 'white',
  nameTextStyling,
  imageSource,
  roundedImage = false,
  imageStyle,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Set the initial value to the current state
        pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
        });
        },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        
        pan.flattenOffset();
   
      },
    })
  ).current;

  const [waveformAnimations] = useState(Array.from({ length: 9 }, () => new Animated.Value(0)));

  useEffect(() => {
    if (showWaveform) {
      animateWaveform();
    } else {
      resetWaveform();
    }
  }, [showWaveform]);

  const animateWaveform = () => {
    const animations = waveformAnimations.map((animation, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: getAnimationDuration(index),
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: getAnimationDuration(index),
            useNativeDriver: false,
          }),
        ])
      )
    );

    Animated.parallel(animations).start();
  };

  const resetWaveform = () => {
    waveformAnimations.forEach((animation) => animation.setValue(0));
  };

  const getAnimationDuration = (index) => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };

  return (
       
       <View style={[styles.container, { display: visible ? 'flex' : 'none' }]} >
        <Animated.View
          style={[styles.modalContent, { transform: pan.getTranslateTransform()}, styles.modalContainer]}
          {...panResponder.panHandlers}
        >
          <View style={{ ...styles.card, ...customStyle }}>
            {imageSource && (
              <Image
                source={{ uri: imageSource }}
                style={[
                  styles.backgroundImage,
                  roundedImage && styles.roundedImage,
                  imageStyle,
                ]}
                resizeMode="cover"
              />
            )}
            <View>
                <Text style={{ ...styles.nameText, color: textColor, ...nameTextStyling }}>{name}</Text>
            </View>
            <View style={{ ...getOverlayPosition(overlayPosition), ...(Platform.OS === 'web' ? styles.overlayWeb : styles.overlayMobile) }}>
              <View>
                {/* <Text style={{ ...styles.nameText, color: textColor }}>{name}</Text> */}
              </View>
              <View style={{ ...(Platform.OS === 'web' ? styles.waveformWeb : styles.waveformMobile) }}>
                {waveformAnimations.map((animation, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.bar,
                      {
                        height: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 40],
                        }),
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                ))}
              </View>
              <View></View>
            </View>
          </View>
        </Animated.View>
      </View>

  );
};

const styles = StyleSheet.create({
    container: {
        width: 100, // Specify the desired width
        height: 100, // Specify the desired height
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        margin: 0, // Remove any margin
        padding: 0, // Remove any padding
        elevation:8,
        zIndex: 8,
        position: 'absolute',
        top: 0,
        right: 0,
      },
  card: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#2c678f',
  },
  overlayMobile: {
    position: 'absolute',
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayWeb: {
    position: 'absolute',
    minWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 12fr 1fr',
    gridGap: '3px',
  },
  nameColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginEnd: 2,
    fontSize: 14,
  },
  nameText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    display: 'flex',
    paddingVertical: 3,
    textAlign: 'center',
  },
  waveformWeb: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 0,
    flexDirection: 'row',
  },

  waveformMobile: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    maxHeight:'100%',
    marginLeft: 5,
    maxWidth: '100%',
    marginVertical: '30%'
  },
  bar: {
    flex: 1,
    opacity: 0.35,
    marginHorizontal: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: '40%',
    left: '50%',
    transform: [
      { translateY: -10 }, // Half of the height
      { translateX: -35 }, // Half of the width
    ],
  },
  roundedImage: {
    borderRadius: 20, // Adjust the border radius as needed
  },
  modalContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 45, 33, 0.5)',
    padding:0,
    margin:0,
    width:100,
    height:100,
  },
  modalContent: {
    width: 100, // You should specify the unit, e.g., 100px or 100%
    height: 100, // You should specify the unit, e.g., 100px or 100%
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 0, // Remove any margin
    padding: 0, // Remove any padding
  },
});

export default MiniAudio;
