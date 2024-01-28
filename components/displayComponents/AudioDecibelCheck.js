import { useState, useEffect, useMemo } from 'react';

/**
 * AudioDecibelCheck - A React component for checking audio decibels and animating the waveform.
 * @param {Object} props - The props passed to the AudioDecibelCheck component.
 * @param {Function} props.animateWaveform - A function to animate the waveform.
 * @param {Function} props.resetWaveform - A function to reset the waveform.
 * @param {string} props.name - The name of the participant.
 * @param {Object} props.participant - The participant object.
 * @param {Object} props.parameters - The object containing parameters for the AudioDecibelCheck component.
 * @returns {Object} - An object containing the showWaveform property.
 */
const AudioDecibelCheck = ({ animateWaveform, resetWaveform, name, participant, parameters }) => {
    // A flag indicating whether to show the waveform.
    const showWaveform = false;
  
    // Destructure the getUpdatedAllParams function from parameters.
    let { getUpdatedAllParams } = parameters;
  
    // Memoized function to check audio decibels and update the waveform.
    const checkAudioDecibels = useMemo(() => {
      return () => {
        // Get the updated parameters from the getUpdatedAllParams function.
        parameters = getUpdatedAllParams();
  
        // Destructure the required parameters.
        let { audioDecibels, participants } = parameters;
  
        // Find the existing audio entry and participant based on the name.
        const existingEntry = audioDecibels && audioDecibels.find(entry => entry.name === name);
        participant = participants && participants.find(participant => participant.name === name);
  
        // Check conditions and animate/reset the waveform accordingly.
        if (existingEntry && existingEntry.averageLoudness > 127.5 && participant && !participant.muted) {
          animateWaveform();
        } else {
          resetWaveform();
        }
      };
    }, [name, parameters]);
  
    // Effect to set up interval for checking audio decibels.
    useEffect(() => {
      const interval = setInterval(() => {
        checkAudioDecibels();
      }, 1000);
  
      // Cleanup function to clear the interval on component unmount.
      return () => clearInterval(interval);
    }, [checkAudioDecibels]);
  
    // Return an object with the showWaveform property.
    return { showWaveform: true };
  };
  
  export default AudioDecibelCheck;
  