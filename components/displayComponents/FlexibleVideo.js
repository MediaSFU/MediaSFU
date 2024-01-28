import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * FlexibleVideo - A React Native component for rendering a flexible grid layout.
 * @param {Object} props - The props passed to the FlexibleVideo.
 * @param {number} props.customWidth - Custom width for each grid item.
 * @param {number} props.customHeight - Custom height for each grid item.
 * @param {number} props.rows - Number of rows in the grid.
 * @param {number} props.columns - Number of columns in the grid.
 * @param {Array} props.componentsToRender - Array of React components to render in the grid.
 * @param {boolean} props.showAspect - Flag indicating whether to show the aspect ratio.
 * @param {string} props.backgroundColor - Background color for each grid item.
 * @returns {React.Component} - The FlexibleVideo component.
 */
const FlexibleVideo = ({ customWidth, customHeight, rows, columns, componentsToRender, showAspect, backgroundColor }) => {
  const [key, setKey] = useState(0);


  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [columns]);

  const renderGrid = () => {
    const grid = [];

    for (let row = 0; row < rows; row++) {
      const rowComponents = [];

      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const component = componentsToRender[index];

        rowComponents.push(
          <View key={col} style={[styles.gridItem, { flex: 1, width: customWidth, height: customHeight, backgroundColor: backgroundColor }]}>
            {component}
          </View>
        );
      }

      grid.push(
        <View key={row} style={styles.rowContainer}>
          {rowComponents}
        </View>
      );
    }

    return grid;
  };

  return <View key={key} style={styles.gridContainer}>{renderGrid()}</View>;
};


const styles = StyleSheet.create({
  gridContainer: {
    padding: 0,
    flex: 1,
    padding: 0,
    margin: 0,
    
  },
  rowContainer: {
    flexDirection: 'row',
  },
  gridItem: {
    flex: 1,
    margin: 1,
    padding: 0,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,

  },
});

export default FlexibleVideo;
