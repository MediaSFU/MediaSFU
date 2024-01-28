import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';


/**
 * MeetingProgressTimer component displays a timer with customizable background color
 * and position on the screen. It can be used to show the elapsed time of a meeting,
 * with different background colors indicating different states (e.g., recording, paused).
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.startTime - The start time of the meeting in seconds.
 * @param {string} [props.initialBackgroundColor='green'] - The initial background color of the timer.
 * @param {string} [props.position='topRight'] - The position on the screen where the timer should be displayed.
 * Possible values are 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'.
 * @param {Object} [props.textStyle] - Additional styles for the timer text.
 * @returns {JSX.Element} - The rendered component.
 */
const MeetingProgressTimer = ({ meetingProgressTime, initialBackgroundColor, position = 'topLeft',textStyle,showTimer=true }) => {
  /**
   * Updates the background color of the timer based on the meeting state.
   * @param {string} state - The state of the meeting (e.g., 'recording', 'pause', 'stop').
   */
  const updateRecordingStateIndicator = (state) => {
    // Remove all color classes
    setBackgroundColor('');

    // Add the appropriate color class based on the state
    if (state === 'recording') {
      setBackgroundColor('red');
    } else if (state === 'pause') {
      setBackgroundColor('yellow');
    } else if (state === 'stop') {
      setBackgroundColor('green');
    }
  };



  return (
    <View style={[styles.badgeContainer, positions[position]]}>
      <View style={[styles.progressTimer, { backgroundColor: initialBackgroundColor,display: showTimer ? 'flex' : 'none' }]}>
      <Text style={[styles.progressTimerText, textStyle]}>{meetingProgressTime}</Text>
      </View>
    </View>
  );
};

const positions = {
  topLeft: { position: 'absolute', top: 0, left: 0 },
  topRight: { position: 'absolute', top: 0, right: 0 },
  bottomLeft: { position: 'absolute', bottom: 0, left: 0 },
  bottomRight: { position: 'absolute', bottom: 0, right: 0 },
};

const styles = StyleSheet.create({
  badgeContainer: {
    padding: 5,
    elevation: 6,
    zIndex: 6,
  },
  progressTimer: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    color: 'white',
  },
  progressTimerText: {
    color: 'black',
  },
});

/**
 * Helper function to calculate elapsed time.
 * @param {number} customStartTime - The custom start time of the meeting in seconds.
 * @returns {number} - The elapsed time in seconds.
 */
const calculateElapsedTime = (customStartTime) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime - customStartTime;
};

/**
 * Helper function to format time (HH:MM:SS).
 * @param {number} timeInSeconds - The time in seconds.
 * @returns {string} - The formatted time string.
 */
const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export default MeetingProgressTimer;
