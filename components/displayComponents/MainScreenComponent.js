import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions,Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * MainScreenComponent - A React Native component for managing the layout of the main screen with resizable main and other components.
 * @param {Object} props - The props passed to the MainScreenComponent.
 * @param {React.Component} props.children - The child components to be rendered inside the main screen.
 * @param {number} props.mainSize - The percentage size of the main component in the main screen.
 * @param {boolean} props.doStack - Flag indicating whether to stack components horizontally (true) or vertically (false).
 * @param {number} props.containerWidthFraction - The fraction of the window width to be used as the container's width (default is 1).
 * @param {number} props.containerHeightFraction - The fraction of the window height to be used as the container's height (default is 1).
 * @param {Function} props.updateComponentSizes - Callback function to update component sizes.
 * @param {number} props.defaultFraction - The default fraction to be used for container height when stacking (default is 0.94).
 * @returns {React.Component} - The MainScreenComponent.
 */
const MainScreenComponent = ({ children, mainSize, doStack, containerWidthFraction = 1, containerHeightFraction = 1, updateComponentSizes, defaultFraction = 0.94, showControls }) => {
  // Calculate parent width and height based on window dimensions and specified fractions
  const marginTop = Platform.OS === 'ios' ? 0 : Constants.statusBarHeight 

  const parentWidth = useWindowDimensions().width * containerWidthFraction;
  const parentHeight = showControls ?  (useWindowDimensions().height * containerHeightFraction * defaultFraction): (useWindowDimensions().height * containerHeightFraction);

  // Check if the screen is wide (width greater than 768)
  const isWideScreen = parentWidth > 768;

  // Update component sizes when parent dimensions, main size, or stacking mode change
  useEffect(() => {
    const { mainHeight, otherHeight, mainWidth, otherWidth } = computeDimensions();
    updateComponentSizes({ mainHeight, otherHeight, mainWidth, otherWidth });
  }, [parentWidth, parentHeight, mainSize, doStack]);

  // Calculate dimensions for main and other components based on stacking mode
  const computeDimensions = () => {
    if (doStack) {
      return isWideScreen
        ? {
            mainHeight: parentHeight,
            otherHeight: parentHeight,
            mainWidth: (mainSize / 100) * parentWidth,
            otherWidth: ((100 - mainSize) / 100) * parentWidth,
          }
        : {
            mainHeight: (mainSize / 100) * parentHeight,
            otherHeight: ((100 - mainSize) / 100) * parentHeight,
            mainWidth: parentWidth,
            otherWidth: parentWidth,
          };
    } else {
      return {
        mainHeight: parentHeight,
        otherHeight: parentHeight,
        mainWidth: parentWidth,
        otherWidth: parentWidth,
      };
    }
  };

  // Get dimensions for the main and other components
  const { mainHeight, otherHeight, mainWidth, otherWidth } = computeDimensions();



  return (
    <View style={[styles.screenContainer, { flex: 1, flexDirection: isWideScreen ? 'row' : 'column', width: parentWidth, height: parentHeight, padding: 0, margin: 0 }]}>
      {/* Render child components with updated dimensions */}
      {React.Children.map(children, (child, index) => {
        const childStyle = doStack
          ? {
              height: index === 0 ? mainHeight : otherHeight,
              width: index === 0 ? mainWidth : otherWidth,
            }
          : {
              height: mainHeight,
              width: mainWidth,
            };

        return React.cloneElement(child, {
          mainSize,
          isWideScreen,
          style: [childStyle, child.props.style],
          key: index,
        });
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
});

export default MainScreenComponent;
