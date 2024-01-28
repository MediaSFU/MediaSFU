import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * AudioGrid - A React Native component for rendering an audio grid with customizable components.
 * @param {Object} props - The props passed to the AudioGrid component.
 * @param {Array} props.componentsToRender - An array of React components to be rendered in the audio grid.
 * @returns {React.Component} - The AudioGrid component.
 */
const AudioGrid = ({ componentsToRender }) => {
    /**
     * renderGrid - Renders componentsToRender array into a grid.
     * @returns {Array} - An array of React components rendered in the grid.
     */
    const renderGrid = () => {
      const renderedComponents = [];
  
      for (let index = 0; index < componentsToRender.length; index++) {
        const component = componentsToRender[index];
        renderedComponents.push(<View style={{ zIndex: 9 }} key={index}>{component}</View>);
      }
  
      return renderedComponents;
    };
  
    return (
      <View style={{ zIndex: 9 }}>{renderGrid()}</View>
    );
  };
  
  export default AudioGrid;
  