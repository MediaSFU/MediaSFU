import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

/**
 * MainContainerComponent is a flexible container component with adjustable width
 * and height based on window dimensions and specified fractions. It supports
 * custom margins and background color.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.backgroundColor - Background color of the container.
 * @param {ReactNode} props.children - Child components to be rendered inside the container.
 * @param {number} props.containerWidthFraction - Fraction of window width to be used for width calculation.
 * @param {number} props.containerHeightFraction - Fraction of window height to be used for height calculation.
 * @param {number} props.marginLeft - Left margin of the container.
 * @param {number} props.marginRight - Right margin of the container.
 * @param {number} props.marginTop - Top margin of the container.
 * @param {number} props.marginBottom - Bottom margin of the container.
 *
 * @returns {JSX.Element} - Flexible container component with adjustable width and height.
 */
const MainContainerComponent = ({
  backgroundColor,
  children,
  containerWidthFraction,
  containerHeightFraction,
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
}) => {
  // State to store calculated aspect styles
  const [aspectStyles, setAspectStyles] = useState({
    height: containerHeightFraction
      ? containerHeightFraction * Dimensions.get('window').height
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
        height: containerHeightFraction
          ? containerHeightFraction * windowHeight
          : windowHeight,
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
    }
  }, [containerHeightFraction, containerWidthFraction]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, marginLeft, marginRight, marginTop, marginBottom },
        aspectStyles,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
});

export default MainContainerComponent;
