import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MeetingProgressTimer from './MeetingProgressTimer';

/**
 * OtherGridComponent - A React Native component for displaying another type of grid with optional timer and meeting progress.
 * @param {Object} props - The props passed to the OtherGridComponent.
 * @param {string} props.backgroundColor - Background color of the grid.
 * @param {React.ReactNode} props.children - The content to be rendered inside the grid.
 * @param {number} props.width - Width of the grid.
 * @param {number} props.height - Height of the grid.
 * @param {boolean} props.showAspect - Flag indicating whether to show the grid.
 * @param {string} props.timeBackgroundColor - Background color for the meeting progress timer.
 * @param {boolean} props.showTimer - Flag indicating whether to show the meeting progress timer.
 * @param {number} props.meetingProgressTime - Meeting progress time for the timer.
 * @returns {React.Component} - The OtherGridComponent.
 */

const OtherGridComponent = ({ backgroundColor, children, width,height, showAspect= true, timeBackgroundColor,showTimer,meetingProgressTime }) => {
  return (
    <View style={[styles.othergridContainer, { backgroundColor ,width,height,display: showAspect ? 'flex' : 'none' }]}>
      <MeetingProgressTimer meetingProgressTime={meetingProgressTime} initialBackgroundColor={timeBackgroundColor} showTimer={showTimer} />
        {children}
    </View>
  );
};

const styles = StyleSheet.create({
  othergridContainer: {
    overflow: 'hidden',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    margin:0,
    padding:0,

  },
});

export default OtherGridComponent;
