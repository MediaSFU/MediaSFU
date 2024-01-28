import React, { useState, useEffect,useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Image,Pressable,Platform } from 'react-native';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';
import CardVideoDisplay from './CardVideoDisplay';
import AudioDecibelCheck from './AudioDecibelCheck';
import { FontAwesome5 } from '@expo/vector-icons';
import { controlMedia } from '../../consumers/controlMedia';

/**
 * VideoCard - A React Native component for displaying a video card with customizable controls, information, and waveform animations.
 * @param {Object} props - The props passed to the VideoCard component.
 * @param {Object} props.customStyle - Custom styles for the VideoCard component.
 * @param {string} props.name - The name of the participant.
 * @param {string} props.barColor - The color of the waveform bar.
 * @param {string} props.textColor - The color of the text.
 * @param {string} props.imageSource - The image source for the participant.
 * @param {boolean} props.roundedImage - Flag to determine if the image should be rounded.
 * @param {Object} props.imageStyle - Custom styles for the participant image.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {string} props.eventType - The type of event.
 * @param {boolean} props.forceFullDisplay - Flag to force full display.
 * @param {Object} props.videoStream - The video stream object.
 * @param {boolean} props.showControls - Flag to show or hide controls.
 * @param {boolean} props.showInfo - Flag to show or hide participant information.
 * @param {React.Component} props.videoInfoComponent - Custom component for participant information.
 * @param {React.Component} props.videoControlsComponent - Custom component for video controls.
 * @param {string} props.controlsPosition - The position of controls (topLeft, topRight, bottomLeft, bottomRight).
 * @param {string} props.infoPosition - The position of participant information (topLeft, topRight, bottomLeft, bottomRight).
 * @param {Object} props.participant - The participant object.
 * @param {React.Component} props.RTCView - The RTCView component for Web platform.
 * @param {string} props.backgroundColor - The background color of the VideoCard.
 * @param {Object} props.audioDecibels - The audio decibels object.
 * @param {boolean} props.doMirror - Flag to mirror the video display.
 * @param {Object} props.parameters - Additional parameters for the VideoCard.
 * @returns {React.Component} - The VideoCard component.
 */


const VideoCard = ({
  customStyle,
  name,
  barColor = 'white',
  textColor = 'white',
  imageSource,
  roundedImage = false,
  imageStyle,
  remoteProducerId,
  eventType,
  forceFullDisplay,
  videoStream,
  showControls = true,
  showInfo = true, // Add showInfo with default value
  videoInfoComponent, // Use custom videoInfoComponent
  videoControlsComponent, // Use custom videoControlsComponent
  controlsPosition = 'topLeft',
  infoPosition = 'topRight',
  participant,
  RTCView,
  backgroundColor,
  audioDecibels,
  doMirror,
  parameters,
}) => {

  const [waveformAnimations] = useState(
    Array.from({ length: 9 }, () => new Animated.Value(0))
  );

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

  const { showWaveform } = AudioDecibelCheck({
    animateWaveform,
    resetWaveform,
    name,
    participant,
    parameters,
  });
  
  /**
   * toggleAudio - Toggle audio for the participant.
   */
  const toggleAudio = async() => {
    // Toggle audio logic based on participant's state
    if (participant?.muted) {
     
    } else {
      // Participant is not muted, handle accordingly (mute, hide waveform, etc.)
      let { getUpdatedAllParams } = parameters
      parameters = getUpdatedAllParams()
      await controlMedia({participantId:participant.id, participantName:participant.name, type:'audio', parameters:parameters});
    }
  };
  
   /**
   * toggleVideo - Toggle video for the participant.
   */
  const toggleVideo = async() => {
    // Toggle video logic based on participant's state
    if (participant?.videoOn) {
      // Participant's video is on, handle accordingly (turn off video, etc.)
      let { getUpdatedAllParams } = parameters
      parameters = getUpdatedAllParams()
      await controlMedia({participantId:participant.id, participantName:participant.name, type:'video', parameters:parameters});
    } else {
      // Participant's video is off, handle accordingly (turn on video, etc.)
    //   console.log('Turning on video');
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
    <View style={{ ...styles.card, ...customStyle ,backgroundColor: backgroundColor }}>
       
           <CardVideoDisplay
                remoteProducerId={remoteProducerId}
                eventType={eventType}
                forceFullDisplay={forceFullDisplay}
                videoStream={videoStream}
                backgroundColor={backgroundColor}
                RTCView={RTCView}
                doMirror={doMirror}
          />

      {videoInfoComponent ? (
        videoInfoComponent
        ) : showInfo ? (
     
          <View style={{ ...getOverlayPosition(infoPosition), ...(Platform.OS === 'web' ? showControls ? styles.overlayWeb : styles.overlayWebAlt : styles.overlayMobile) }}>

          <View style={styles.nameColumn}>
            <Text style={{ ...styles.nameText, color: textColor }}>{participant?.name}</Text>
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
  overlayWebAlt: {
    position: 'absolute',
    minWidth: '50%',
    minHeight: '5%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateColumns: '4fr',
    gridGap: '0px',
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
    // resizeMode: 'cover',
    width: '80px',
    height: '80px',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top:  '50%',
    left:  '50%',
    transform: [
      { translateY: -40 }, // Half of the height
      { translateX: -40 }, // Half of the width
    ],
  },
  roundedImage: {
    borderRadius: '20%', // Adjust the border radius as needed
  },
});

export default VideoCard;

