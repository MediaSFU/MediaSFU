import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

/**
 * CardVideoDisplay - A React Native component for displaying video streams in a card layout.
 * @param {Object} props - The props passed to the CardVideoDisplay component.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {string} props.eventType - The type of event.
 * @param {boolean} props.forceFullDisplay - Flag to force full display.
 * @param {Object} props.videoStream - The video stream object.
 * @param {string} props.backgroundColor - The background color of the video container.
 * @param {React.Component} props.RTCView - The RTCView component for Web platform.
 * @param {boolean} props.doMirror - Flag to mirror the video display.
 * @returns {React.Component} - The CardVideoDisplay component.
 */
const CardVideoDisplay = ({
  remoteProducerId,
  eventType,
  forceFullDisplay,
  videoStream,
  backgroundColor = 'transparent',
  RTCView,
  doMirror,
}) => {
  /**
   * getRTCViewStyle - Helper function to get styles for RTCView based on platform.
   * @returns {Object} - Styles for RTCView.
   */
  const getRTCViewStyle = () => {
    // Add styles based on the forceFullDisplay value
    if (Platform.OS === 'web') {
      const baseStyles = {
        width: forceFullDisplay ? '100%' : 'auto',
        height: '100%',
        objectFit: forceFullDisplay ? 'cover' : 'contain',
        backgroundColor: backgroundColor,
      };

      if (doMirror) {
        baseStyles.transform = 'rotateY(180deg)';
      }

      return baseStyles;
    }

    // For non-web platforms, no additional styles needed
    return {};
  };

  return (
    <View style={[styles.videoContainer, { backgroundColor }]}>
      {/* Conditionally render RTCView based on the platform */}
      {Platform.OS === 'web' ? (
        <RTCView stream={videoStream} style={getRTCViewStyle()} />
      ) : (
        <RTCView
          streamURL={videoStream?.toURL()}
          objectFit={forceFullDisplay ? 'cover' : 'contain'}
          mirror={doMirror}
          style={styles.video}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: 'black', // Set a default background color if needed
  },
  video: {
    height: '100%',
  },
});

export default CardVideoDisplay;