import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, Pressable, Platform } from 'react-native';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';
import { FontAwesome5 } from '@expo/vector-icons';
import MiniCard from './MiniCard';
import { controlMedia } from '../../consumers/controlMedia';

/**
 * AudioCard - A React Native component for displaying an audio card with customizable controls, information, and waveform animations.
 * @param {Object} props - The props passed to the AudioCard component.
 * @param {Object} props.customStyle - Custom styles for the AudioCard component.
 * @param {string} props.name - The name of the participant.
 * @param {string} props.barColor - The color of the waveform bar.
 * @param {string} props.textColor - The color of the text.
 * @param {string} props.imageSource - The image source for the participant.
 * @param {boolean} props.roundedImage - Flag to determine if the image should be rounded.
 * @param {Object} props.imageStyle - Custom styles for the participant image.
 * @param {boolean} props.showControls - Flag to show or hide controls.
 * @param {boolean} props.showInfo - Flag to show or hide participant information.
 * @param {React.Component} props.videoInfoComponent - Custom component for participant information.
 * @param {React.Component} props.videoControlsComponent - Custom component for video controls.
 * @param {string} props.controlsPosition - The position of controls (topLeft, topRight, bottomLeft, bottomRight).
 * @param {string} props.infoPosition - The position of participant information (topLeft, topRight, bottomLeft, bottomRight).
 * @param {Object} props.participant - The participant object.
 * @param {string} props.backgroundColor - The background color of the AudioCard.
 * @param {Object} props.audioDecibels - The audio decibels object.
 * @param {Object} props.parameters - Additional parameters for the AudioCard.
 * @returns {React.Component} - The AudioCard component.
 */


const AudioCard = ({
  customStyle,
  name,
  barColor = 'white',
  textColor = 'white',
  imageSource,
  roundedImage = false,
  imageStyle,
  showControls = true,
  showInfo = true, // Add showInfo with default value
  videoInfoComponent, // Use custom videoInfoComponent
  videoControlsComponent, // Use custom videoControlsComponent
  controlsPosition = 'topLeft',
  infoPosition = 'bottomLeft',
  participant,
  backgroundColor,
  audioDecibels,
  parameters,
}) => {


  const [waveformAnimations] = useState(
    Array.from({ length: 9 }, () => new Animated.Value(0))
  );

  const [showWaveform, setShowWaveform] = useState(true);
  let { getUpdatedAllParams } = parameters
  parameters = getUpdatedAllParams()




  useEffect(() => {

    //check every 1 second if the name i sin audioDecibels and over 127.5
    const interval = setInterval(() => {

      let {
        audioDecibels,
        participants,
      } = parameters;

      const existingEntry = audioDecibels && audioDecibels.find(entry => entry.name === name);
      participant = participants && participants.find(participant => participant.name === name);

      // Check conditions and animate/reset the waveform accordingly.
      if (existingEntry && existingEntry.averageLoudness > 127.5 && participant && !participant.muted) {
    
        animateWaveform();
      } else {
        resetWaveform();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [audioDecibels]);

  useEffect(() => {
    if (participant?.muted) {
      setShowWaveform(false);
    }
    else {
      setShowWaveform(true);
    }
  }
    , [participant?.muted]);

  /**
   * animateWaveform - Animate the waveform for audio decibel check.
   */

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

  /**
  * resetWaveform - Reset the waveform animation.
  */
  const resetWaveform = () => {
    waveformAnimations.forEach((animation) => animation.setValue(0));
  };

  /**
   * getAnimationDuration - Get the duration for waveform animation.
   * @param {number} index - The index of the waveform animation.
   * @returns {number} - The duration for the waveform animation.
   */
  const getAnimationDuration = (index) => {
    // Define your animation durations here
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };


  /**
   * toggleAudio - Toggle audio for the participant.
   */
  const toggleAudio = async() => {
    // Toggle audio logic based on participant's state
    if (participant?.muted) {

    } else {
      // Participant is not muted, handle accordingly (mute, hide waveform, etc.)
      await controlMedia({ participantId: participant.id, participantName: participant.name, type: 'audio', parameters: parameters});
    }
  };

  /**
   * toggleVideo - Toggle video for the participant.
   */
  const toggleVideo = async() => {
    // Toggle video logic based on participant's state
    if (participant?.videoOn) {
      // Participant's video is on, handle accordingly (turn off video, etc.)
      await controlMedia({ participantId: participant.id, participantName: participant.name, type: 'video', parameters: parameters});
    } else {
      // Participant's video is off, handle accordingly (turn on video, etc.)
    }
  };

  /**
 * renderControls - Render video controls based on conditions.
 * @returns {React.Component} - Rendered video controls.
 */
  const renderControls = () => {
    if (!showControls) {
      return null;
    }

    // Use custom videoControlsComponent if provided, else use default controls
    const ControlsComponent = videoControlsComponent || (
      <View style={styles.overlayControls}>
        <Pressable style={styles.controlButton} onPress={toggleAudio}>
          <FontAwesome5 name={participant?.muted ? "microphone-slash" : "microphone"} size={14} color={participant?.muted ? "red" : "green"} />
        </Pressable>

        <Pressable style={styles.controlButton} onPress={toggleVideo}>
          <FontAwesome5 name={participant?.videoOn ? "video" : "video-slash"} size={14} color={participant?.videoOn ? "green" : "red"} />
        </Pressable>
      </View>
    );


    return ControlsComponent;
  };


  return (
    <View style={{ ...styles.card, ...customStyle }}>

      {imageSource ? (
        <Image
          source={{ uri: imageSource }}
          style={[
            styles.backgroundImage,
            roundedImage && styles.roundedImage,
            imageStyle,
          ]}
          resizeMode="cover"
        />
      ) : (
        <MiniCard
          initials={name}
          fontSize={20}
         
        />
      )}


      {videoInfoComponent ? (
        videoInfoComponent
      ) : showInfo ? (

        <View style={{ ...getOverlayPosition(infoPosition), ...(Platform.OS === 'web' ? showControls ? styles.overlayWeb : styles.overlayWebAlt : styles.overlayMobile) }}>

          <View style={styles.nameColumn}>
            <Text style={{ ...styles.nameText, color: textColor }}>{name}</Text>
          </View>
          <View style={{ ...(Platform.OS === 'web' ? styles.waveformWeb  : styles.waveformMobile) }}>
            {waveformAnimations.map((animation, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.bar,
                  {
                    height: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 14],
                    }),
                    backgroundColor: barColor,
                  },
                ]}
              />

            ))}
          </View>

        </View>
      ) : null}

      {videoControlsComponent ? (
        videoControlsComponent
      ) : showControls ? (
        <View style={{ ...styles.overlayControls, ...getOverlayPosition(controlsPosition) }}>
          {renderControls()}
        </View>
      ) : null}

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#2c678f',
    border: '2px solid black',
  },
  overlayMobile: {
    position: 'absolute',
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayWeb: {
    position: 'absolute',
    minWidth: '50%',
    minHeight: '5%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '4fr 2fr',
    gridGap: '3px',
  },
  overlayWebAlt: {
    position: 'absolute',
    minWidth: '50%',
    minHeight: '5%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '4fr',
    gridGap: '0px',
  },
  overlayControls: {
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 0,
    position: 'absolute',
  },
  controlButton: {
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginEnd: 5,
    fontSize: 12,
  },
  nameColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginEnd: 2,
    fontSize: 12,
  },
  nameText: {
    fontSize: 12,
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 5,
    marginLeft: 5,
    maxWidth: '25%',
  },
  bar: {
    flex: 1,
    opacity: 0.35,
    marginHorizontal: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '80px',
    height: '80px',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    transform: [
      { translateY: -40 }, // Half of the height
      { translateX: -40 }, // Half of the width
    ],
  },
  roundedImage: {
    borderRadius: '20%', // Adjust the border radius as needed
  },
});

export default AudioCard;

