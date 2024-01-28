import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';

/**
 * MainAspectComponent is a component that displays a scrollable area with specific aspect ratio.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.backgroundColor - Background color of the aspect container.
 * @param {ReactNode} props.children - Content to be displayed inside the scrollable area.
 * @param {boolean} props.showControls - Determines whether controls are shown or not.
 * @param {number} props.containerWidthFraction - Fraction of the window width for the aspect container.
 * @param {number} props.containerHeightFraction - Fraction of the window height for the aspect container.
 * @param {number} props.defaultFraction - Default fraction for height calculation if showControls is true.
 *
 * @returns {JSX.Element} - Main aspect component.
 */
const MainAspectComponent = ({
  backgroundColor,
  children,
  showControls=true,
  containerWidthFraction=1,
  containerHeightFraction=1,
  defaultFraction = 0.94,
  updateIsWideScreen,
  updateIsMediumScreen,
  updateIsSmallScreen,

}) => {
  const [aspectStyles, setAspectStyles] = useState({
    height: showControls
        ? containerHeightFraction * Dimensions.get('window').height * defaultFraction
        : Dimensions.get('window').height * containerHeightFraction,
    width: containerWidthFraction * Dimensions.get('window').width

  });

  useEffect(() => {
    const updateAspectStyles = () => {
      const windowHeight = Dimensions.get('window').height;
      const windowWidth = Dimensions.get('window').width;

      const parentWidth = (Dimensions.get('window').width * containerWidthFraction );

      const isWideScreen = parentWidth > 768;

      const isMediumScreen = parentWidth > 576 && parentWidth <= 768;
    
      const isSmallScreen = parentWidth <= 576;

      updateIsWideScreen(isWideScreen);
      updateIsMediumScreen(isMediumScreen);
      updateIsSmallScreen(isSmallScreen);

     

      setAspectStyles({
        height: showControls
          ? containerHeightFraction * windowHeight * defaultFraction
          : windowHeight * containerHeightFraction,
        width: containerWidthFraction * windowWidth,
      });

    };

    // Initial setup
    updateAspectStyles();

    // Listen for orientation changes
    Dimensions.addEventListener('change', updateAspectStyles);

    // Cleanup listener on component unmount
    return () => {
        if (Dimensions.removeEventListener) {
          Dimensions.removeEventListener('change', updateAspectStyles);
     }
    };
  }, [showControls, containerHeightFraction, containerWidthFraction, defaultFraction]);

  return (
    <View style={[styles.aspectContainer, { backgroundColor }, aspectStyles]}>
      <View style={styles.aspectContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  aspectContainer: {
    flex: 1,
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  },
});

export default MainAspectComponent;
