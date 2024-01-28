import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

/**
 * SubAspectComponent is a component that provides a sub-aspect ratio view
 * with adjustable height and width based on window dimensions and fractions.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.backgroundColor - Background color of the sub-aspect component.
 * @param {ReactNode} props.children - Child components to be rendered inside the sub-aspect component.
 * @param {boolean} props.showControls - Flag indicating whether controls are displayed.
 * @param {number} props.containerWidthFraction - Fraction of window width to be used for width calculation.
 * @param {number} props.containerHeightFraction - Fraction of window height to be used for height calculation.
 * @param {number} props.defaultFractionSub - Default fraction to be used if no specific fraction is provided.
 *
 * @returns {JSX.Element} - Sub-aspect component with adjustable height and width.
 */
const SubAspectComponent = ({
  backgroundColor,
  children,
  showControls = true,
  containerWidthFraction,
  containerHeightFraction,
  defaultFractionSub=0.06,
}) => {
  // Default sub-aspect fraction if not provided
  const subAspectFraction =  !showControls ? 0 : defaultFractionSub;

  // State to store calculated aspect styles
  const [aspectStyles, setAspectStyles] = useState({
    height: showControls
      ? containerHeightFraction
        ? containerHeightFraction * Dimensions.get('window').height * subAspectFraction
        : Dimensions.get('window').height * subAspectFraction
      : Dimensions.get('window').height,
    width: containerWidthFraction
      ? containerWidthFraction * Dimensions.get('window').width
      : Dimensions.get('window').width,
  });

  // Effect to update aspect styles on dimension changes
  useEffect(() => {
    const updateAspectStyles = () => {
      const windowHeight = Dimensions.get('window').height;
      const windowWidth = Dimensions.get('window').width;

      setAspectStyles({
        height: showControls
          ? containerHeightFraction
            ? containerHeightFraction * windowHeight * subAspectFraction
            : windowHeight * subAspectFraction
          : 0,
        width: containerWidthFraction ? containerWidthFraction * windowWidth : windowWidth,
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
  }, [showControls, containerHeightFraction, containerWidthFraction, subAspectFraction]);

  return (
    <View style={[styles.subAspectContainer, { backgroundColor }, aspectStyles, {display: showControls ? 'flex' : 'none'}]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  subAspectContainer: {
    position: 'absolute',
    bottom: 0,
    margin: 0,
    backgroundColor: 'blue',
    flex: 1,
    overflow: 'hidden',
  },
});

export default SubAspectComponent;
